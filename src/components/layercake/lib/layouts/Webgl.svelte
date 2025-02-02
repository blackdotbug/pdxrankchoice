<!--
	@component
	WebGL layout component
 -->
<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	/** @typedef {Object} Props 
	 * @property {HTMLCanvasElement|undefined} [element] The `<canvas>` tag. Useful for bindings. 
	* @property {Number|undefined} [zIndex] The layer's z-index. 
	* @property {boolean|undefined} [pointerEvents] Set this to `false` to set `pointer-events: none;` on the entire layer. 
	* @property {Object|undefined} [contextAttributes] The second argument passed to canvas.getContext. See the WebGL docs [for more info](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext). 
	* @property {WebGLRenderingContext|undefined} [context] The `<canvas>`'s WebGL context. Useful for bindings. 
	* @property {String} [fallback] Text to display if the browser won't render a canvas tag. You can also set arbitrary HTML via the "fallback" slot but this is fine if you just need text. If you use the "fallback" slot, this prop is ignored. 
	* @property {String|undefined} [label] A string passed to the `aria-label` property on the `<canvas>` tag. 
	* @property {String|undefined} [labelledBy] A string passed to the `aria-labelledby` property on the `<canvas>` tag. 
	* @property {String|undefined} [describedBy] A string passed to the `aria-describedby` property on the `<canvas>` tag. 
	**/

	/** @type Props */
	let {
		element = undefined,
		zIndex = undefined,
		pointerEvents = undefined,
		contextAttributes = undefined,
		context = undefined,
		fallback = '',
		label = undefined,
		labelledBy = undefined,
		describedBy = undefined;
	} = $props();

	let testGl;

	const { padding } = getContext('LayerCake');

	const cntxt = {
		gl: writable({})
	};

	onMount(() => {
		/* --------------------------------------------
		 * Try to find a working webgl context
		 */
		const contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
		for (let j = 0; j < contexts.length; j++) {
			testGl = element?.getContext(contexts[j], contextAttributes);
			if (testGl) {
				// @ts-ignore
				context = testGl;
				break;
			}
		}
	});

	$effect(()=>cntxt.gl.set(context))
	setContext('gl', cntxt);
</script>

<canvas
	bind:this={element}
	class="layercake-layout-webgl"
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
