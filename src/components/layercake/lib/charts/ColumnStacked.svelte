<!--
  @component
  Generates an SVG column chart. It uses the z-scale for color assignments and aassumes both `xScale` and `zScale` are ordinal scales.  It assumes your data is in a [D3 stack format](https://github.com/d3/d3-shape#stack
 -->
 <script lang="ts">
    const { data, yScale, gY, gX, zScale } : {
        data: Array<any>, 
        yScale: Function, 
        gY: number, 
        gX: number,
        zScale: Function} = $props();
  </script>
  {@debug data}
  <g class="column-group" transform='translate({gX},{gY})'>
    {#each data as series, i}
      {#each series as d}
        {@const columnHeight = yScale(d[0]) - yScale(d[1])}
        <rect
          class="group-rect"
          data-id={i}
          x={0}
          y={yScale(d[1])}
          width={10}
          height={columnHeight}
          fill={zScale(series.key)}
        ></rect>
      {/each}
    {/each}
  </g>