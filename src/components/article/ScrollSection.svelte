<script>
    import Sankey from '$components/layercake/lib/charts/Sankey.svelte';
    import ScrollingBar from '$components/layercake/lib/charts/ScrollingBar.svelte';
	import Scrolly from "$components/helpers/Scrolly.svelte";
    import { sankeyJustify } from 'd3-sankey';
    import LayerCake from "$components/layercake/lib/LayerCake.svelte";
    import Svg from "$components/layercake/lib/layouts/Svg.svelte";
    import { cubicInOut as easing } from 'svelte/easing';
	import { interpolateString } from 'd3';

    const { copy, stepHandler, viewportHeight } = $props();
    let value = $state(undefined);
    let step = $state(undefined);
    $effect(() => {
        if ((step === Object.values(copy).length - 1) && value === undefined) {
            step = Object.values(copy).length - 1
        } else if (value !== undefined) {
            step = value
        } else {
            step = 0
        }
    })    
    let newValues = $derived(stepHandler(step));
    let renderedData = $derived(newValues ? newValues.renderedData : undefined);
    let focusHover = $derived(newValues ? newValues.focusHover : undefined);
    let caption = $derived(newValues ? newValues.caption : undefined);
    let chartWidth = $state(undefined);
    let chartHeight = $state(undefined);
    let sankeySize = $derived([chartWidth-140, chartHeight])

</script>

{#if copy}
    <div class="scroll-section matt-scroll">

        <!-- switcher is now a class on sticky--use that to apply styles to this el like the top:20%; -->
        <div class="sticky" style="min-height:{viewportHeight}px;">
            <div id="caption">{caption}</div>
            <div class="chart-container" bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
            {#if chartWidth}
                <LayerCake
                padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
                width={chartWidth}
                >
                    <Svg width={chartWidth} height={chartHeight} translate={{left: 70, top: 20}}>
                        {#if renderedData}
                        {#if step < 5}
                        <Sankey 
                            colorNodes={d => '#333'} 
                            nodeWidth={15}
                            nodePadding={30}
                            linkSort={(a,b) => b.round - a.round}
                            nodeSort={(a,b) => b.round - a.round}
                            nodeAlign={sankeyJustify}
                            iterations={32}
                            data={renderedData}
                            size={sankeySize}
                            step={step}
                            focusHover={focusHover}
                            tweenOptions={{
                                rect: { easing, delay: 1000 },
                                path: { easing, delay: 1000, interpolate: interpolateString },
                            }}
                        />
                        {:else if step >= 5 && step < 11}       
                            <ScrollingBar 
                                data={renderedData} 
                                stepVariables={focusHover}
                                width={chartWidth-100} 
                                height={chartHeight}
                                opacity={step === 5 ? .5 : 1}
                            />     
                        {/if}
                        {/if}
                    </Svg>
                </LayerCake>
            {/if}
            </div>
        </div>

        <div class="steps">
            <section id="scrolly">
                <Scrolly bind:value>
                    {#each Object.values(copy) as p, i}
                        {@const active = value === i}
                        {@const last = i == Object.values(copy).length - 1 ? true : false}
                        {@const first = i == 0 ? true : false}

                        <div class="step" class:active class:last class:first
                            style="
                                height: {viewportHeight}px;
                                margin-top:{first ? -viewportHeight*.5 : 0}px;
                            "
                        >
                            <p class="step-content">{@html p.text}</p>
                        </div>
                    {/each}
                </Scrolly>
            </section>
        </div>
    </div>
{/if}


<style>
    .sticky {
        position: sticky;
        z-index: 1;
        display: flex;
        justify-content: center;
        top: 0;
        flex-direction: column;
        /* display: none; */
    }
    .steps {
        position: relative;
        z-index: 2;
        max-width: 2000px;
		padding: 16px;
		margin: 0 auto;
        pointer-events: none;
    }
    .step {
		height: 60vh;
        margin-left: 20vw;
		opacity: .3;
		transition: opacity 300ms ease;
		display: flex;
		place-items: center;
		justify-content: center;
        max-width: 400px;
	}
    .step-marker {
        position: absolute;
        bottom: 0px;
        left: 10px;
    }
    .first {
        margin-top: -50vh;
    }

	.step-content {
		background-color: rgba(17,17,17,.95);
        color: #fff;
		border-radius: 5px;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        line-height: 1.5;
        letter-spacing: -.2px;
        margin-top: 0;
        margin-bottom: 25px;
        pointer-events: auto;
	}

    .last {
        margin-bottom: 50vh;
    }

	.step p {
        padding: 15px 20px;
	}

	.step.active {
		opacity: 1;
	}

    @media only screen and (max-width: 600px) {
		.step-content {
			/* font-size: 14px !important; */
		}
    }

    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
    .chart-container {
      width: 100vw;
      height: 80vh;
    }
    #caption {
        width: 100%;
        font-weight: 600;
        text-align: center;
        height: 1em;
    }

</style>