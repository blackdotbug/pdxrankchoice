<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!--
	@component
	Canvas layout component
 -->
<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import scaleCanvas from '../lib/scaleCanvas.js';

	const { width, height, padding } = getContext('LayerCake');

	/** @typedef {Object} Props
	* @property {HTMLCanvasElement|undefined} [element] The `<canvas>` tag. Useful for bindings. 
	* @property {CanvasRenderingContext2D|undefined} [context] The `<canvas>`'s 2d context. Useful for bindings. 
	* @property {Number|undefined} [zIndex] The layer's z-index. 
	* @property {boolean|undefined} [pointerEvents] Set this to `false` to set `pointer-events: none;` on the entire layer. 
	* @property {String} [fallback] Text to display if the browser won't render a canvas tag. You can also set arbitrary HTML via the "fallback" slot but this is fine if you just need text. If you use the "fallback" slot, this prop is ignored. 
	* @property {String|undefined} [label] A string passed to the `aria-label` on the `<canvas>` tag. 
	* @property {String|undefined} [labelledBy] A string passed to the `aria-labelledby` on the `<canvas>` tag. 
	* @property {String|undefined} [describedBy] A string passed to `aria-describedby` property on the `<canvas>` tag. 
	**/

	/** @type {Props} */
	let {
		element = undefined,	
		context = undefined,
		zIndex = undefined,
		pointerEvents = undefined,
		fallback = '',
		label = undefined,	
		labelledBy = undefined,
		describedBy = undefined
	} = $props();

	const cntxt = {
		ctx: writable({})
	};

	onMount(() => {
		context = element?.getContext('2d');
		scaleCanvas(context, $width, $height);
	});

	$effect(()=>cntxt.ctx.set(context)) 
	setContext('canvas', cntxt);
</script>

<canvas
	bind:this={element}
	class="layercake-layout-canvas"
	style:z-index={zIndex}
	style:pointer-events={pointerEvents === false ? 'none' : null}
	style:top={$padding.top + 'px'}
	style:right={$padding.right + 'px'}
	style:bottom={$padding.bottom + 'px'}
	style:left={$padding.left + 'px'}
	style="width:100%;height:100%;position:absolute;"
	aria-label={label}
	aria-labelledby={labelledBy}
	aria-describedby={describedBy}
	>{#if fallback}{@render fallback()}{/if}</canvas
>
{@render element(context)}
