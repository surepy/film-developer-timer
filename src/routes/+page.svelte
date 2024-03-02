<script lang="ts">

	import { goto } from '$app/navigation';
    
	// first step is always develop, so just go to develop.
	goto('/develop');

	import Counter from './Counter.svelte';
	import {minute} from "$lib/util"
	import Timer from '$lib/components/Timer.svelte';

	enum DevelopmentSteps {
		Develop,
		Rinse,
		Fix,
		Wash,
		Dry
	};
</script>



