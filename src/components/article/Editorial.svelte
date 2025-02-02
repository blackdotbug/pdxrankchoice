<script>
    import Scrolly from "$components/helpers/Scrolly.svelte";

    const { copy, notifications, spacer = null, methods = false, first = false } = $props();

    let step = $state();
    let comments = $state(undefined);
    $effect(() => {
        comments = notifications !== undefined ? notifications : undefined;
    })

    let animationStarted = $state(false);

    $effect(() => {
        step;
        changeAnimationStarted();
    })

    function changeAnimationStarted(){
        if(step == 0) {
            setTimeout(() => {
                animationStarted = true;
            }, 200)
        }
    }

    let noSpacer = $state(false);
    if (spacer === "none") {
      noSpacer = true;
    }
</script>

<section id="scrolly" class="scrolly-editorial">
	<Scrolly bind:value={step} >
        <div class="editorial-wrapper" class:methods id={methods ? 'igsource' : ''}>
            {#if copy[0].subtitle}
                <h3>{copy[0].subtitle}</h3>
            {/if}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div class="editorial" tabindex="0">
                {#each copy as p, i}
                    <p class:animationStarted class:first={first && i === 0} class="editorial-paragraph">{@html p.text}</p>
                {/each}
                <div class="spacer" style="height: {noSpacer ? '0vh' : '3vh'}"/>
            </div>
        </div>
    </Scrolly>
</section>

<style>
    .first {
        font-size: 24px !important;
    }
    .editorial-comments {
        margin: 75px auto;
    }
    .editorial-paragraph {
        font-size: 18px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        line-height: 1.5;
        margin-top: 0;
        margin-bottom: 25px;
        letter-spacing: -.2px;
        opacity: 1;
        font-family: var(--serif);
    }
    .editorial {
        max-width: 40rem;
		padding: 16px;
		margin: 0 auto;
    }
    .scrolly-editorial {
        padding-top: 0px !important;
        margin-top: 0px !important;
    }
    @media only screen and (max-width: 600px) {
		.editorial-paragraph {
            font-size: 16px;
        }
        .first {
        font-size: 20px !important;
        }
    }
</style>