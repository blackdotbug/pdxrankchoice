<!--
	@component
	HTML layout component
 -->
<script>
	import { getContext } from 'svelte';

	const { padding } = getContext('LayerCake');

	

	

	

	

	

	

	
	/**
	 * @typedef {Object} Props
	 * @property {Element|undefined} [element]
	 * @property {Number|undefined} [zIndex]
	 * @property {boolean|undefined} [pointerEvents]
	 * @property {String|undefined} [role]
	 * @property {String|undefined} [label]
	 * @property {String|undefined} [labelledBy]
	 * @property {String|undefined} [describedBy]
	 * @property {import('svelte').Snippet<[any]>} [children]
	 */

	/** @type {Props} */
	let {
		element = $bindable(undefined),
		zIndex = undefined,
		pointerEvents = undefined,
		role = undefined,
		label = undefined,
		labelledBy = undefined,
		describedBy = undefined,
		children
	} = $props();

	let roleVal = $derived(role || (label || labelledBy || describedBy ? 'figure' : undefined));
</script>

<div
	bind:this={element}
	class="layercake-layout-html"
	style:z-index={zIndex}
	style:pointer-events={pointerEvents === false ? 'none' : null}
	style:top={$padding.top + 'px'}
	style:right={$padding.right + 'px'}
	style:bottom={$padding.bottom + 'px'}
	style:left={$padding.left + 'px'}
	role={roleVal}
	aria-label={label}
	aria-labelledby={labelledBy}
	aria-describedby={describedBy}
>
	{@render children?.({ element, })}
</div>

<style>
	div {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
