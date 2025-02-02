<script>
    import BarStacked from './BarStacked.svelte';
    import AxisX from './AxisX.svelte';
    import { scaleBand, scaleOrdinal, scaleLinear, format, max, merge, stack } from 'd3';

    const { data, stepVariables, height, width, opacity } = $props();
    const totalRounds = max(data.barData.map(m => m.round))
    const candidates = [...new Set(data.barData.map(m => m.candidate))].filter(f => f);
    const eliminationOrder = candidates.filter(f => f != "exhausted").map(m => {
        let point = data.barData.find(f => f.candidate === m && f.status == "eliminated")
        return {candidate: m, round: point ? +point.round : totalRounds+1}
    }).sort((a,b)=>a.round - b.round).map(m => m.candidate)
    const formatLabelX = d => format(`~s`)(d);
    const palette = ["#d84f67","#aa4350","#cc5239","#a34c31","#cb8441","#d1972c","#a28c3e","#b0bb43","#6f943b","#75b951","#3f7f3e","#5bc781","#43c8ac","#628ed6","#6a70d7","#573687","#c282d5","#bf52a7","#82295e","#d8739f"];
    const yDomain = $derived(stepVariables.focus !== null ? stepVariables.focus : Array.from({length: totalRounds}, (_,i)=> i+1));
    const xDomain = [0,350000];
    let yScale = $state(undefined);
    let xScale = $state(undefined);
    const zScale = scaleOrdinal().domain(candidates).range(palette)
    $effect(() => {
        yScale = scaleBand().domain(yDomain).range([0,height]).paddingOuter(0.2).paddingInner(0.25);   
        xScale = scaleLinear().domain(xDomain).range([0,width])
    })
    let votes = $state([]);  

    $effect(() => {
        votes = yDomain.map(round => {
            let obj = {round};
            let column = {};
            let transferredCount = (data.barData.find(f => f.round == round && +f.change < 0)?.change) * -1;

            eliminationOrder.forEach(name => {
                let point = data.barData.find(f => f.round == round && f.candidate == name);
                if (point) {
                    if (point.status !== "eliminated" && +point.change > 0) {
                        column[name] = point.change / transferredCount;
                    }
                    obj[name] = point.votes;
                }
            })
            let exhausted = data.barData.find(f => f.candidate == "exhausted" && f.round == round);
            if (exhausted) {
                column.exhausted = exhausted.outcome / transferredCount;
            }
            let stacked = stack().keys(Object.keys(column))([column]);
            obj.column = stacked;
            obj.transfers = column;
            obj.eliminated = data.barData.find(f => f.status == "eliminated" && f.round == round);
            obj.threshold = data.thresholds[round-1]
            return obj;
        });
    })
    let dataStacks = $derived(stack().keys(candidates.filter(f => f !== "exhausted"))(votes));

</script>

{#if yScale}
    <AxisX 
        format={formatLabelX} 
        {width}
        {height}
        {xScale}
        yRange={[0,height]}
    />
    {#if votes}
        <BarStacked 
            {votes}
            data={dataStacks}
            {xScale}
            {yScale}
            {zScale}
            {yDomain}
            column={stepVariables.column}
            {opacity}
        />        
    {/if}
{/if}

<style>
  /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
  .chart-container {
    width: 90%;
    height: 750px;
  }
  div.selector {
    width: 150px;
    margin-left: 80%;
  }
</style>