<!--
  @component
  Generates an SVG stacked bar chart and sets the color via an ordinal scale in `zScale`.
 -->
 <script lang="ts">
    import { cubicInOut as easing } from 'svelte/easing';
    import { scaleLinear, sum, format } from 'd3';
    import Rect from './Rect.svelte';
    import Label from './Label.svelte';
    import Line from './Line.svelte';

    const { votes, 
      data, 
      zScale, 
      yScale, 
      xScale,
      yDomain,
      column,
      opacity
    } : {
      votes: Array<any>, 
      data: any,
      zScale: Function,
      yScale: Function,
      xScale: Function,
      yDomain: number[],
      column: number|null,
      opacity: number
    } = $props();

    let xValue = $state(d => {
        return xScale(d[0])
    })
    let columnWidth = $state(d => {
      return xScale(d[1]) - xScale(d[0]);
    });
    let changeScale = $derived(
      scaleLinear().range([yScale.bandwidth(), 0]).domain([0,1])
    )
    let changeValue = $derived((d) => changeScale(d))
    let changeHeight = $derived(([a,b]) => changeValue(a) - changeValue(b));
    let convertNameToId = (name) => {
      let id = name.split(" ")[1]
      if (!id) {
        id = name
      } else {
        id = id.replace("'", "").replace("(", "").replace(")", "")
      }
      return id
    }
    const lineData = (value, round) => {
      return [{
        height: yScale(round)-2,
        votes: value 
      }, {
        height: yScale(round) + yScale.bandwidth() + 2,
        votes: value
      }]
    };

  </script>

<g class="bar-group">
    {#each data as series}
      {#each series as d, i}
        {#if !d.some((x) => isNaN(x))}
        <Rect
          data_id={'bar' + convertNameToId(series.key)}
          x={xScale(d[0])}
          y={yScale(yDomain[i])}
          height={yScale.bandwidth()}
          width={columnWidth(d)}
          fill={zScale(series.key)}
          opacity={opacity}
          tweenOptions={{
            x: { easing, delay: 1000 },
            y: { easing, delay: 1000 },
            width: { easing, delay: 1000 },
            height: { easing, delay: 1000 }
          }}
        />
        {/if}
      {/each}
    {/each}
    {#if changeScale}
      {#each votes as v,round}
        <Line 
          customData={lineData(v.threshold, v.round)} 
          stroke={"#000"} 
          strokeWidth={opacity < 1 ? 2 : 4} 
          {xScale}
        />
        <text
          x={xScale(0)}
          y={yScale(v.round)}
          dy={opacity < 1 ? 20 : -4}
          style="font-weight: 700"
        >Round {v.round + 1}</text>

        {#if v.round === column}
          {@const endX = sum(Object.values(v))-v.threshold}
          {@const candidates = Object.keys(v.transfers)}
          <g class="column-group">
            {#if (v.eliminated.candidate !== "Carmen Rubio")}
              <text
                x={xScale(endX)}
                y={yScale(v.round)}
                dy={-4}
                style="text-anchor: end"
                >{v.eliminated.candidate} eliminated, {format(",")(v.eliminated.votes)} votes transferred</text>
            {:else}
              <text
                x={xScale(data.find(f => f.key == "Carmen Rubio")[round][0])}
                y={yScale(v.round) + yScale.bandwidth()}
                dy={-4}
                dx={4}
                style="fill: #fff"
              >Carmen Rubio, {format(",")(data.find(f => f.key == "Carmen Rubio")[round][1]-data.find(f => f.key == "Carmen Rubio")[round][0])} votes</text>
            {/if}
            <text
              x={xScale(0)}
              y={yScale(v.round) + yScale.bandwidth()}
              dy={-4}
              dx={4}
            >Keith Wilson, {format(",")(data.find(f => f.key == "Keith Wilson")[round][1])} votes</text>
            <text
              x={xScale(v.threshold)}
              y={yScale(v.round) + yScale.bandwidth()}
              dy={14}
              dx={-4}
              style="text-anchor: end; font-size:smaller"
            >{(v.threshold - data.find(f => f.key == "Keith Wilson")[round][1]) > 0
              ? format(",")(v.threshold - (data.find(f => f.key == "Keith Wilson")[round][1])) + " from threshold"
              : "elected"}
            </text>
            {#each candidates as d,i}
              {@const point = data.find(f => f.key == d)}
              {@const rectValues = v.column[i][0]}
              {@const dataValues = data.find(f => f.key == v.eliminated?.candidate)}
              <g>
                <Rect
                  data_id={'col' + convertNameToId(d)}
                  x={xValue(dataValues[round])}
                  y={changeValue(rectValues[1]) + yScale(v.round)}
                  height={changeHeight(rectValues)}
                  width={columnWidth(dataValues[round])}
                  fill={point ? zScale(d) : "#000"}
                  tweenOptions={{
                    x: { easing, delay: 1000 },
                    y: { easing, delay: 1000 },
                    width: { easing, delay: 1000 },
                    height: { easing, delay: 1000 }
                  }}
                />
                {#if v.transfers[d] > 0.04}
                  <Label
                    data_id={'label' + convertNameToId(d)}
                    x={xScale(endX)}
                    y={changeValue(rectValues[1]) + yScale(v.round)}
                    tweenOptions={{
                      x: { easing, delay: 1000 },
                      y: { easing, delay: 1000 }
                    }}
                    text={`${d}: ${format('.2%')(v.transfers[d])}`}
                  />
                {/if}
              </g>
            {/each}
          </g>
        {/if}
      {/each}      
    {/if}
</g>