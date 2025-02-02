<!--
  @component
  Generates an SVG rect.
 -->
 <script lang="ts">

	  import { Tween } from "svelte/motion";
    let { x, y, width, height, tweenOptions = undefined, fill, data_id, opacity } = $props();

    const tweened_x = Tween.of(() => x, tweenOptions?.x)
    const tweened_y = Tween.of(() => y, tweenOptions?.y)
    const tweened_width = Tween.of(() => width, tweenOptions?.width)
    const tweened_height = Tween.of(() => height, tweenOptions?.height)

</script>
{#if x >= 0 && y}
<rect
  class='group-rect'
  data-id={data_id}
  x={x}
  y={y}
  width={width}
  height={height}
  fill={fill}
  opacity={opacity}
/>
{/if}