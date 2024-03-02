<script lang="ts">
    import type { PageData } from './$types';
    
    // export let data: PageData;

	import {minute} from "$lib/util"
	import Timer from '$lib/components/Timer.svelte';

	$: development_time = minute(2);

</script>

<svelte:head>
	<title>Film Process Timer | Develop</title>
</svelte:head>

<section>
    <div>

        <Timer 
            duration={development_time} 
            sub_timer
            next_url="/rinse"
        />
        
        <div class="text-column">
            asdf
        </div>
    </div>


	<!--<Counter />-->
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
