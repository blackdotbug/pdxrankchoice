<!--
	@component
	SVG layout component
 -->
<script>

	/**
	 * @typedef {Object} Props
	 * @property {Element|undefined} [element] The layer's `<svg>` tag. Useful for bindings. 
	 * @property {Element|undefined} [innerElement] The layer's `<g>` tag. Useful for bindings. 
	 * @property {Number|undefined} [zIndex] The layer's z-index. 
	 * @property {boolean|undefined} [pointerEvents] Set this to `false` to set `pointer-events: none;` on the entire layer. 
	 * @property {String|undefined} [viewBox] A string passed to the `viewBox` property on the `<svg>` tag. 
	 * @property {String|undefined} [label] A string passed to the `aria-label` property on the `<svg>` tag. 
	 * @property {String|undefined} [labelledBy] A string passed to the `aria-labelledby property` on the `<svg>` tag. 
	 * @property {String|undefined} [describedBy] A string passed to the `aria-describedby` property on the `<svg>` tag. 
	 * @property {String|undefined} [title] Shorthand to set the contents of `<title></title>` for accessibility.  
	 * @property {Element|undefined} [defs] 
	 * @property {Number} [width]
	 * @property {Number} [height]
	 * @property {Object} [translate]
	 * @property {import('svelte').Snippet<[any]>} [children]
	**/

	/** @type {Props} */
	let {
		element = undefined,
		innerElement = undefined,
		zIndex = undefined,
		pointerEvents = undefined,
		viewBox = undefined,
		label = undefined,
		labelledBy = undefined,
		describedBy = undefined,
		title = undefined,
		defs = undefined,
		width,
		height,
		translate,
		children
	} = $props();

</script>

<svg
	bind:this={element}
	class="layercake-layout-svg"
	{viewBox}
	width={width}
	height={height}
	style:z-index={zIndex}
	style:pointer-events={pointerEvents === false ? 'none' : null}
	aria-label={label}
	aria-labelledby={labelledBy}
	aria-describedby={describedBy}
>
	{#if title}
	<title>
		{@render title()}
	</title>
	{/if}

	{#if defs}
	<defs>
		{@render defs()}
	</defs>
	{/if}
	<g
		bind:this={innerElement}
		class="layercake-layout-svg_g"
		transform="translate({translate.left}, {translate.top})"
	>
		{@render children?.()}
	</g>
</svg>

<style>
	svg {
		position: absolute;
		top: 0;
		left: 0;
		overflow: visible;
	}
</style>
