<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { second } from '$lib/util';
    import type { PageData } from './$types';
    
    // export let data: PageData;
</script>

<svelte:head>
	<title>Film Process Timer | Rinse</title>
</svelte:head>

<section>
    <div>
        <Timer 
            duration={second(30)} 
            sub_timer
			sub_timer_duration={second(10)}
            next_url="/fix"
        >
		</Timer>
        
        <div class="text-column">
            asdf
        </div>
    </div>
</section>