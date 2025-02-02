<script>
	import { setContext } from "svelte";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import mayor_final from "$data/mayor_final.json";
	import mayor_final_byround from "$data/mayor_final_byround.json";
	import version from "$utils/version.js";

	version();

	const thresholds = [154982, 154934, 154883, 154706, 154618, 154535, 154433, 154249, 154138, 153997, 153878, 153462, 153216, 152876, 152520, 152145, 150193, 144924, 129977]
	const { title, description, url, keywords } = copy.meta;
	setContext("copy", copy);
	setContext("data", {sankeydata: mayor_final.results, bardata: mayor_final_byround, thresholds});
</script>

<Meta {title} {description} {url} {keywords} />
<Index />
