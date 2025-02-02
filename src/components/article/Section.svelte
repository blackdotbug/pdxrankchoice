<script>
    import ScrollSection from './ScrollSection.svelte';

    const { copy, stepHandler, switcher, viewportHeight } = $props();

    // let data = getContext("data").sankeydata;
    // let dataMap = data.map(d => Object.assign({}, d));

</script>

<svelte:boundary onerror={(e) => console.error(e)}>
    <div id="section">
        <ScrollSection {viewportHeight} {switcher} {stepHandler} {copy} />
    </div>
</svelte:boundary>
