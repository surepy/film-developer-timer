<script lang="ts">
    import type { PageData } from './$types';
    import Timer from '$lib/components/Timer.svelte';
	import { minute, second } from '$lib/util';
    
    // export let data: PageData;
</script>


<svelte:head>
	<title>Film Process Timer | Fix</title>
</svelte:head>

<section>
    <div>
        <Timer 
            duration={minute(8)} 
            sub_timer
			sub_timer_duration={second(30)}
            next_url="/wash"
        >
            <div slot="subtimer" let:timer_count>
                {#if timer_count % 2 == 0} 
                    <p>agitate</p>
                {:else}
                    <p>leave</p>
                {/if}
            </div>
		</Timer>
        
        <div class="text-column">
            asdf
        </div>
    </div>
</section>