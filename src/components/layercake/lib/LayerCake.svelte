<!--
	@component
	Layer Cake component
 -->
<script>
	import { onMount, setContext, getContext } from 'svelte';
	import makeAccessor from './utils/makeAccessor.js';
	import filterObject from './utils/filterObject.js';
	import debounce from './utils/debounce.js';

	import calcScaleExtents from './helpers/calcScaleExtents.js';
	import calcDomain from './helpers/calcDomain.js';
	import createScale from './helpers/createScale.js';
	import createGetter from './helpers/createGetter.js';
	import getRange from './helpers/getRange.js';
	import printDebug from './helpers/printDebug.js';

	import defaultScales from './settings/defaultScales.js';

	const printDebug_debounced = debounce(printDebug, 200);
	
	/* --------------------------------------------
	 * Parameters
	 * Values that computed properties are based on and that
	 * can be easily extended from config values
	 *
	 */
	
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [ssr]
	 * @property {boolean} [pointerEvents]
	 * @property {String} [position]
	 * @property {boolean} [percentRange]
	 * @property {Number} [width]
	 * @property {Number} [height]
	 * @property {Number} [containerWidth]
	 * @property {Number} [containerHeight]
	 * @property {Element|undefined} [element]
	 * @property {String|Function|Number|Array<String|Function|Number>|undefined} [x]
	 * @property {String|Function|Number|Array<String|Function|Number>|undefined} [y]
	 * @property {String|Function|Number|Array<String|Function|Number>|undefined} [z]
	 * @property {String|Function|Number|Array<String|Function|Number>|undefined} [r]
	 * @property {Array<Object>|Object} [data]
	 * @property {[min: Number|null, max: Number|null]|Array<String|Number>|Function|undefined} [xDomain]
	 * @property {[min: Number|null, max: Number|null]|Array<String|Number>|Function|undefined} [yDomain]
	 * @property {[min: Number|null, max: Number|null]|Array<String|Number>|Function|undefined} [zDomain]
	 * @property {[min: Number|null, max: Number|null]|Array<String|Number>|Function|undefined} [rDomain]
	 * @property {boolean|Number} [xNice]
	 * @property {boolean|Number} [yNice]
	 * @property {boolean|Number} [zNice]
	 * @property {boolean} [rNice]
	 * @property {[leftPixels: Number, rightPixels: Number]|undefined} [xPadding]
	 * @property {[leftPixels: Number, rightPixels: Number]|undefined} [yPadding]
	 * @property {[leftPixels: Number, rightPixels: Number]|undefined} [zPadding]
	 * @property {[leftPixels: Number, rightPixels: Number]|undefined} [rPadding]
	 * @property {Function} [xScale]
	 * @property {Function} [yScale]
	 * @property {Function} [zScale]
	 * @property {Function} [rScale]
	 * @property {[min: Number, max: Number]|Function|Array<String|Number>|undefined} [xRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height} [xRange]
	 * @property {[min: Number, max: Number]|Function|Array<String|Number>|undefined} [xRange] Override the default y range of `[0, height]` by setting an array or function with argument `({ width, height} [yRange]
	 * @property {[min: Number, max: Number]|Function|Array<String|Number>|undefined} [zRange] Override the default z range of `[0, width]` by setting an array or function with argument `({ width, height} [zRange]
	 * @property {[min: Number, max: Number]|Function|Array<String|Number>|undefined} [rRange] Override the default r range of `[1, 25]` by setting an array or function with argument `({ width, height} [rRange]
	 * @property {boolean} [xReverse]
	 * @property {boolean|undefined} [yReverse]
	 * @property {boolean} [zReverse]
	 * @property {boolean} [rReverse]
	 * @property {boolean} [xDomainSort]
	 * @property {boolean} [yDomainSort]
	 * @property {boolean} [zDomainSort]
	 * @property {boolean} [rDomainSort]
	 * @property {{top?: Number, right?: Number, bottom?: Number, left?: Number}} [padding={} [padding]
	 * @property {{ x?: [min: Number, max: Number], y?: [min: Number, max: Number], r?: [min: Number, max: Number], z?: [min: Number, max: Number] }} [extents]
	 * @property {Array<Object|Array<any>>|undefined} [flatData]
	 * @property {Object} [custom]
	 * @property {boolean} [debug]
	 * @property {boolean} [verbose]
	 * @property {import('svelte').Snippet<[any]>} [children]
	 */

	/** @type {Props} */
	let {
		ssr = false,
		pointerEvents = true,
		position = 'relative',
		percentRange = false,
		width = undefined,
		height = undefined,
		containerWidth = $bindable(width || 100),
		containerHeight = $bindable(height || 100),
		element = $bindable(undefined),
		x = undefined,
		y = undefined,
		z = undefined,
		r = undefined,
		data = [],
		xDomain = undefined,
		yDomain = undefined,
		zDomain = undefined,
		rDomain = undefined,
		xNice = false,
		yNice = false,
		zNice = false,
		rNice = false,
		xPadding = undefined,
		yPadding = undefined,
		zPadding = undefined,
		rPadding = undefined,
		xScale = defaultScales.x,
		yScale = defaultScales.y,
		zScale = defaultScales.z,
		rScale = defaultScales.r,
		xRange = undefined,
		yRange = undefined,
		zRange = undefined,
		rRange = undefined,
		xReverse = false,
		yReverse = undefined,
		zReverse = false,
		rReverse = false,
		xDomainSort = true,
		yDomainSort = true,
		zDomainSort = true,
		rDomainSort = true,
		padding = {},
		extents = {},
		flatData = undefined,
		custom = {},
		debug = false,
		verbose = true,
		children
	} = $props();

	/**
	 * Make this reactive
	 */
	let yReverseValue =
		$derived(typeof yReverse === 'undefined'
			? typeof yScale.bandwidth === 'function'
				? false
				: true
			: yReverse);

	/* --------------------------------------------
	 * Keep track of whether the component has mounted
	 * This is used to emit warnings once we have measured
	 * the container object and it doesn't have proper dimensions
	 */
	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	/* --------------------------------------------
	 * Preserve a copy of our passed in settings before we modify them
	 * Return this to the user's context so they can reference things if need be
	 * Add the active keys since those aren't on our settings object.
	 * This is mostly an escape-hatch
	 */
	const config = $state({});
	$effect.pre(() => {
		if (x) config.x = x;
		if (y) config.y = y;
		if (z) config.z = z;
		if (r) config.r = r;
		if (xDomain) config.xDomain = xDomain;
		if (yDomain) config.yDomain = yDomain;
		if (zDomain) config.zDomain = zDomain;
		if (rDomain) config.rDomain = rDomain;
		if (xRange) config.xRange = xRange;
		if (yRange) config.yRange = yRange;
		if (zRange) config.zRange = zRange;
		if (rRange) config.rRange = rRange;
	});

	/* --------------------------------------------
	 * Create derived_ values
	 * Suffix these with `_d`
	 */
	const activeGetters_d = $derived({
		x: x ? makeAccessor(x) : undefined,
		y: y ? makeAccessor(y) : undefined,
		z: z ? makeAccessor(z) : undefined,
		r: r ? makeAccessor(r) : undefined,
	})

	const padding_d = $derived.by(() => {
		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
		return Object.assign(defaultPadding, padding);
	});

	const box_d = $derived.by(
		() => {
			const b = {};
			b.top = padding_d?.top || padding?.top || 0;
			b.right = containerWidth - (padding_d?.right || padding?.right || 0);
			b.bottom = containerHeight - (padding_d?.bottom || padding?.bottom || 0);
			b.left = padding_d?.left || padding?.left || 0;
			b.width = b.right - b.left;
			b.height = b.bottom - b.top;
			if (verbose === true) {
				if (b.width <= 0 && isMounted === true) {
					console.warn(
						'[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?'
					);
				}
				if (b.height <= 0 && isMounted === true) {
					console.warn(
						'[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?'
					);
				}
			}
			return b;
		}
	);

	const width_d = $derived(box_d.width);

	const height_d = $derived(box_d.height);

	/* --------------------------------------------
	 * Calculate extents by taking the extent of the data
	 * and filling that in with anything set by the user
	 * Note that this is different from an "extent" passed
	 * in as a domain, which can be a partial domain
	 */
	const extents_d = $derived.by(
		() => {
			const scaleLookup = {
				x: { scale: xScale, sort: xDomainSort },
				y: { scale: yScale, sort: yDomainSort },
				r: { scale: rScale, sort: rDomainSort },
				z: { scale: zScale, sort: zDomainSort }
			};
			const getters = filterObject(activeGetters_d, extents);
			const activeScales = Object.fromEntries(Object.keys(getters).map(k => [k, scaleLookup[k]]));

			if (Object.keys(getters).length > 0) {
				const calculatedExtents = calcScaleExtents(flatData, getters, activeScales);
				return { ...calculatedExtents, ...extents };
			} else {
				return {};
			}
		}
	);

	const xDomain_d = $derived(calcDomain('x')(extents_d, xDomain));
	const yDomain_d = $derived(calcDomain('y')(extents_d, yDomain));
	const zDomain_d = $derived(calcDomain('z')(extents_d, zDomain));
	const rDomain_d = $derived(calcDomain('r')(extents_d, rDomain));

	const xScale_d = $derived(
		createScale('x')(xScale, extents_d, xDomain_d, xPadding, xNice, xReverse, width, height, xRange, percentRange)
	);
	const xGet_d = $derived(activeGetters_d.x ? createGetter(activeGetters_d.x, xScale_d) : null);

	const yScale_d = $derived(
		createScale('y')(yScale, extents_d, yDomain_d, yPadding, yNice, yReverseValue, width, height, yRange, percentRange)
	);
	const yGet_d = $derived(activeGetters_d.y ? createGetter(activeGetters_d.y, yScale_d) : null);

	const zScale_d = $derived(
		createScale('z')(zScale, extents_d, zDomain_d, zPadding, zNice, zReverse, width, height, zRange, percentRange)
	);
	const zGet_d = $derived(activeGetters_d.z ? createGetter(activeGetters_d.z, zScale_d) : null);

	const rScale_d = $derived(
		createScale('r')(rScale, extents_d, rDomain_d, rPadding, rNice, rReverse, width, height, rRange, percentRange)
	);
	const rGet_d = $derived(activeGetters_d.r ? createGetter(activeGetters_d.r, rScale_d) : null);

	// Create new _Domains in case we ran `.nice()` over our domain on scale initialization
	const xDomain_d_possibly_nice = $derived(xScale_d.domain());
	const yDomain_d_possibly_nice = $derived(yScale_d.domain());
	const zDomain_d_possibly_nice = $derived(zScale_d.domain());
	const rDomain_d_possibly_nice = $derived(rScale_d.domain());

	const xRange_d = $derived(getRange(xScale_d));
	const yRange_d = $derived(getRange(yScale_d));
	const zRange_d = $derived(getRange(zScale_d));
	const rRange_d = $derived(getRange(rScale_d));

	const aspectRatio_d = $derived(width_d / height_d);

	let context = $derived({
		activeGetters: activeGetters_d,
		width: width_d,
		height: height_d,
		percentRange: percentRange,
		aspectRatio: aspectRatio_d,
		containerWidth: containerWidth,
		containerHeight: containerHeight,
		x: x,
		y: y,
		z: z,
		r: r,
		custom: custom,
		data: data,
		xNice: xNice,
		yNice: yNice,
		zNice: zNice,
		rNice: rNice,
		xDomainSort: xDomainSort,
		yDomainSort: yDomainSort,
		zDomainSort: zDomainSort,
		rDomainSort: rDomainSort,
		xReverse: xReverse,
		yReverse: yReverseValue,
		zReverse: zReverse,
		rReverse: rReverse,
		xPadding: xPadding,
		yPadding: yPadding,
		zPadding: zPadding,
		rPadding: rPadding,
		padding: padding_d,
		flatData: flatData || data,
		extents: extents_d,
		xDomain: xDomain_d_possibly_nice,
		yDomain: yDomain_d_possibly_nice,
		zDomain: zDomain_d_possibly_nice,
		rDomain: rDomain_d_possibly_nice,
		xRange: xRange_d,
		yRange: yRange_d,
		zRange: zRange_d,
		rRange: rRange_d,
		config: config,
		xScale: xScale_d,
		xGet: xGet_d,
		yScale: yScale_d,
		yGet: yGet_d,
		zScale: zScale_d,
		zGet: zGet_d,
		rScale: rScale_d,
		rGet: rGet_d
	});

	$effect(() => {
		setContext('LayerCake', context);
	});

	$effect(() => {
		if (box_d && debug === true && (ssr === true || typeof window !== 'undefined')) {
			// Call this as a debounce so that it doesn't get called multiple times as these vars get filled in
			printDebug_debounced({
				data: data,
				flatData: typeof flatData !== 'undefined' ? flatData : null,
				boundingBox: box_d,
				activeGetters: activeGetters_d,
				x: config.x,
				y: config.y,
				z: config.z,
				r: config.r,
				xScale: xScale_d,
				yScale: yScale_d,
				zScale: zScale_d,
				rScale: rScale_d
			});
		}
	});
	$effect(() => console.log(context, getContext('LayerCake')));
</script>

{#if ssr === true || typeof window !== 'undefined'}
	<div
		bind:this={element}
		class="layercake-container"
		style:position
		style:top={position === 'absolute' ? '0' : null}
		style:right={position === 'absolute' ? '0' : null}
		style:bottom={position === 'absolute' ? '0' : null}
		style:left={position === 'absolute' ? '0' : null}
		style:pointer-events={pointerEvents === false ? 'none' : null}
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	>
		{@render children?.({ element, width: width_d, height: height_d, aspectRatio: aspectRatio_d, containerWidth: containerWidth, containerHeight: containerHeight, activeGetters: activeGetters_d, percentRange: percentRange, x: x, y: y, z: z, r: r, custom: custom, data: data, xNice: xNice, yNice: yNice, zNice: zNice, rNice: rNice, xDomainSort: xDomainSort, yDomainSort: yDomainSort, zDomainSort: zDomainSort, rDomainSort: rDomainSort, xReverse: xReverse, yReverse: yReverse, zReverse: zReverse, rReverse: rReverse, xPadding: xPadding, yPadding: yPadding, zPadding: zPadding, rPadding: rPadding, padding: padding_d, flatData: flatData, extents: extents_d, xDomain: xDomain_d, yDomain: yDomain_d, zDomain: zDomain_d, rDomain: rDomain_d, xRange: xRange_d, yRange: yRange_d, zRange: zRange_d, rRange: rRange_d, config: config, xScale: xScale_d, xGet: xGet_d, yScale: yScale_d, yGet: yGet_d, zScale: zScale_d, zGet: zGet_d, rScale: rScale_d, rGet: rGet_d, })}
	</div>
{/if}

<style>
	.layercake-container,
	.layercake-container :global(*) {
		box-sizing: border-box;
	}
	.layercake-container {
		width: 100%;
		height: 100%;
	}
</style>
