<script>
    const {content} = $props();
</script>

<div id="lede">
    {#each content as el }
        <svelte:element this={el.type}>
            {@html el.value}
        </svelte:element>
    {/each}
</div>

<style>
    #lede {
        min-height: 50vh;
        max-width: 800px;
        margin: auto;
        padding: 10px;
        line-height: 1.75em;
    }
</style>