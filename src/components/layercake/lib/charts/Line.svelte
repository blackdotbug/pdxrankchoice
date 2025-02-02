<!--
  @component
  Generates an SVG line shape.
 -->
 <script lang="ts">  
    let { stroke = '#ab00d6', strokeWidth, customData, xScale } : { 
        stroke?: string, 
        strokeWidth: number,
        customData: Array<any>|undefined,
        xScale: Function
    } = $props();
    let xValue = $state(d => {
        return xScale(d);
    })

    let path = $derived(customData 
        ? 'M' + customData
            .map((d) => {
            return xValue(d.votes) + ',' + d.height;
            })
            .join('L')
        : undefined)
  </script>
{#if path}  
  <path class="path-line" d={path} {stroke} stroke-width={strokeWidth}></path>
{/if}
  <style>
    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
  </style>