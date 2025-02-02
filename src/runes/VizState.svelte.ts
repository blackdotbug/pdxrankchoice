import { getContext, setContext } from 'svelte';
import type { LC_Viz } from "./types";
import { scaleLinear, scaleSqrt } from 'd3';

export class VizState {
    vizState = $state<LC_Viz>({
		ssr: false,
		pointerEvents: true,
		position: 'relative',
		percentRange: false,
		width: undefined,
		height: undefined,
		containerWidth: $bindable(100),
		containerHeight: $bindable(100),
		element: $bindable(undefined),
		x: undefined,
		y: undefined,
		z: undefined,
		r: undefined,
		data: [],
		xDomain: undefined,
		yDomain: undefined,
		zDomain: undefined,
		rDomain: undefined,
		xNice: false,
		yNice: false,
		zNice: false,
		rNice: false,
		xPadding: undefined,
		yPadding: undefined,
		zPadding: undefined,
		rPadding: undefined,
		xScale: scaleLinear,
		yScale: scaleLinear,
		zScale: scaleLinear,
		rScale: scaleSqrt,
		xRange: undefined,
		yRange: undefined,
		zRange: undefined,
		rRange: undefined,
		xReverse: false,
		yReverse: undefined,
		zReverse: false,
		rReverse: false,
		xDomainSort: true,
		yDomainSort: true,
		zDomainSort: true,
		rDomainSort: true,
		padding: {},
		extents: {},
		flatData: undefined,
		custom: {},
		debug: false,
		verbose: true,
})

    constructor() {
        console.log("new vizState")
    }
}

const LCVIZ_KEY = Symbol('LCVIZ');

export function setLCVizState() {
    return setContext(LCVIZ_KEY, new VizState());
}

export function getLCVizState() {
    return getContext<ReturnType<typeof setLCVizState>>(LCVIZ_KEY);
}