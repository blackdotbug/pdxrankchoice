<!--
  @component
  Generates an SVG Sankey chart using [d3-sankey](https://github.com/d3/d3-sankey).
 -->
 <script lang="ts">
  import * as SankeyD3 from 'd3-sankey';
  import { scaleOrdinal } from 'd3';
  import { Tween } from 'svelte/motion';

  const { 
    colorNodes = () => '#333',
    colorText = () => '#263238',
    nodeWidth = 5,
    nodePadding = 10,
    iterations = 6,
    linkSort = null,
    nodeSort = null,
    nodeId = d => d.id,
    nodeAlign = SankeyD3.sankeyLeft,
    data,
    size,
    step,
    focusHover,
    tweenOptions = undefined  
  } : { 
    colorNodes: Function,
    colorText: Function,
    nodeWidth: Number,
    nodePadding: Number,
    iterations: Number,
    linkSort: Function|null,
    nodeSort: Function|null,
    nodeId: Function,
    nodeAlign: Function,
    data: any,
    size: number[],
    step: number,
    focusHover: any,
    tweenOptions: Object|null
  } = $props();

  const palette = ["#aa4350", "#d1972c", "#6f943b", "#628ed6", "#573687", "#c83e7b"];
  const candidateSubset = ["Keith Wilson", "Carmen Rubio", "Rene Gonzalez", "Mingus Mapps", "Liv (Viva) Osthus", "exhausted"];
  let candidates = $state(undefined);
  // need a mechanism to choose focus palette and candidates using step focushover info
  let focuscandidates = $derived.by(() => {
      if (step <= 5) {
          if (step === 0) {
              return Object.keys(data[0].tally);
          } else if (step === 1) {
              return candidateSubset;
          } else {
              return [focusHover];
          }
      } else {
          return undefined;
      }
  });
  let focuspalette = $derived.by(() => {
      if (step <= 5) {
          if (step >= 2) {
              let colorcode = palette[candidateSubset.indexOf(focusHover)]
              return [colorcode];
          } else {
              return palette;
          }
      } else {
          return undefined;
      }
  });
  let color = $derived( focuspalette && focuscandidates ? scaleOrdinal(focuspalette).domain(focuscandidates).unknown("#888") : undefined)
  const colorPicker = (d) => {
      if (color) {
        if (focuscandidates.length === 1) {
          if (focusHover === d.source.id || focusHover === d.target.id.split(" |")[0]) {
            return color(focusHover);
          } else {
            return "#888";
          }
        } else if (focuscandidates.length > palette.length) {
          let colorcode = palette[candidateSubset.indexOf(d.target.id.split(" |")[0])]
          return colorcode ? colorcode : "#888";
        } else {
          return color(d.target.id.split(" |")[0]);
        }
      } else {
          return "#888";
      }
  }
  function processStepData(dataset,step) {
      if (step <= 5) {
          let allCandidates = Object.keys(dataset[0].tally);
          if (step < 1) {
            candidates = allCandidates;
          } else {
            candidates = candidateSubset;
          }
          let eliminated = dataset[0].tallyResults[0].eliminated;
          const rounds = dataset.length;
          let links = [];
          let nodes = [{id:"exhausted", round:0, tally:0}];
          allCandidates.forEach(name => {
              let startingTally = dataset[0].tally;
              if (startingTally[name] > 2700) {
              nodes.push({id: `${name} |starting tally`, round: 0, tally: startingTally[name]})
              links.push({source: `${name} |starting tally`, 
                target: name, 
                value: startingTally[name], 
                round: 0, 
                sourceTally: startingTally[name],
                targetTally: startingTally[name]
              })
              }
          })
          // need a mechanism for changing the start index based on the step focushover data
          let startIndex = 1;
          // if (step > 0) startIndex = rounds - 4;
          for (let index = startIndex; index < rounds; index++) {
              const round = dataset[index];
              eliminated = round.tallyResults[0].eliminated;
              let candidates = Object.entries(round.tally);
              if (!eliminated) {
                  let elected = round.tallyResults[0].elected;
                  if (elected) {
                    candidates.forEach(c => {
                        if (c[0] != elected) {
                        nodes.push({id:c[0], round:index+1, tally:c[1]});
                        } else {
                        nodes.push({id:c[0], round:index+2, tally:c[1]});
                        }
                    })
                  }
              } else {
                  nodes.push({id:eliminated, round:index+1, tally: candidates.find(([c, t]) => c === eliminated)[1]});
              }
              const transfers = Object.entries(round.tallyResults[0].transfers);
              if (transfers.length > 0) {
                  transfers.forEach(([target, value]) => {
                      links.push({
                        source: eliminated, 
                        target, 
                        value, 
                        round: index+1, 
                        sourceTally: candidates.find(([c,t])=> c === eliminated)[1],
                        targetTally: candidates.find(([c,t])=> c === target)?.[1]
                      })
                  })
              }
          }
          
          return {nodes, links};
      }
  }

  const link = SankeyD3.sankeyLinkHorizontal();

  const sankey = $derived(SankeyD3.sankey()
    .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .iterations(10)
    .nodeId(nodeId)
    .size(size)
    .linkSort((a,b)=>b.sourceTally - a.sourceTally)
    .nodeSort((a,b)=>b.tally - a.tally));

  let sankeyData = $state(undefined);
  $effect(() => {
    let processedData = processStepData(data, step);
    let sankeyInitial = sankey(processedData);
    sankeyInitial.nodes.forEach(d => {
      d.tweened = {
        x0: Tween.of(() => d.x0, tweenOptions.rect),
        y0: Tween.of(() => d.y0, tweenOptions.rect),
        x1: Tween.of(() => d.x1, tweenOptions.rect),
        y1: Tween.of(() => d.y1, tweenOptions.rect)
      }
    })
    sankeyInitial.links.forEach(d => {
      let path = link(d);
      let sourceID = d.source.id.split(" ")[1];
      let targetID = d.target.id.split(" ")[1];
      if (!targetID) {
        targetID = "exhausted"
      }
      let data_id = sourceID + "-" + targetID;
      data_id = data_id.replace("'", "").replace("(", "").replace(")", "").replace("undefined", "exhausted")
      d.data_id = data_id;
      d.path = Tween.of(() => path, tweenOptions.path)
    })
    sankeyData = sankeyInitial;
  })
  const fontSize = $derived(size[0] <= 320 ? 8 : 12);
</script>

<g class="sankey-layer">
  {#if sankeyData && fontSize}
  <g class="link-group">
    {#each sankeyData.links as d}
      <path
        data-id={d.data_id}
        d={d.path.current}
        fill="none"
        stroke={colorPicker(d)}
        stroke-opacity={candidates.includes(d.source.id) || d.source.id.includes("|") 
          ? focuscandidates.length === 1 && (d.source.id === focuscandidates[0] || d.target.id === focuscandidates[0])
            ? 0.85
            : 0.5 
          : 0.1}
        stroke-width={d.width}
      />
    {/each}
  </g>
  <g class="rect-group">
    {#each sankeyData.nodes as d (d.id)}
      <rect
        data-id={d.id}
        x={d.tweened.x0.current} 
        y={d.tweened.y0.current} 
        height={d.tweened.y1.current - d.tweened.y0.current} 
        width={d.tweened.x1.current - d.tweened.x0.current} 
        fill={colorNodes(d)} 
        opacity={candidates.includes(d.id) || d.id.includes("|") || d.id === "exhausted" ? 1 : 0.1}
      />
    {/each}
    {#each sankeyData.nodes as d (d.id)}
    <g >
      <text
        data-id={d.id + "name"}
        class="nodeText"
        x={d.tweened.x0.current < size[0] / 4 ? d.tweened.x1.current + 6 : d.tweened.x0.current - 6}
        y={(d.tweened.y1.current + d.tweened.y0.current) / 2}
        dy={fontSize / 2 - 2}
        style:fill={colorText(d)}
        style:font-size={fontSize + "px"}
        style:text-anchor={d.tweened.x0.current < (size[0] / 4) ? 'start' : 'end'}
        opacity={candidates.includes(d.id) || d.id.includes("|") || d.id === "exhausted" ? 1 : 0.1}
      >
        {d.id}
      </text>
      {#if d.round === 0 || d.round > 16}
      <text 
        data-id={d.id + "value"}
        x=0
        y=0
        class="counts"
        dy={fontSize / 2 - 2}
        style:font-size={fontSize-2 + "px"}
        style:transform={`translate(${d.tweened.x0.current + fontSize - 4}px,${d.tweened.y0.current + 4}px)rotate(270deg)`}
      >
        {d.value}
      </text>
      {/if}
    </g>
    {/each}
  </g>
  {/if}
</g>

<style>
  text {
    pointer-events: none;
  }
  text.nodeText {
    font-weight: 700;
    text-shadow:
                1px 1px 2px #fff,
                -1px 1px 2px #fff,
                -1px -1px 2px #fff,
                1px -1px 2px #fff;

  }
  text.counts {
    fill: #fff;
    font-weight: 700;
    text-anchor: end;
  }
</style>