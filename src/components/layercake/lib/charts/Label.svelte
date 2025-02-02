<script lang="ts">

	import { Tween } from "svelte/motion";
    let { x, y, tweenOptions = undefined, data_id, text } = $props();

    const tweened_x = Tween.of(() => x, tweenOptions?.x)
    const tweened_y = Tween.of(() => y, tweenOptions?.y)
</script>

{#if x >= 0 && !isNaN(y)}
<text
  class='group-text'
  data-id={data_id}
  x={x}
  y={y}
  dx={6}
  dy={8}
>
  {text}
</text>
{/if}
<style>
  text {
    font-size: 10px;
  }
</style>