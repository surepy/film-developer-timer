<script lang="ts">
    import type { PageData } from './$types';
    import Timer from '$lib/components/Timer.svelte';
	import { minute, second } from '$lib/util';
	import { Alert } from 'flowbite-svelte';
    
    // export let data: PageData;
</script>


<svelte:head>
	<title>Film Process Timer | Fix</title>
</svelte:head>

<section>
    <Timer 
        duration={minute(8)} 
        sub_timer
        sub_timer_duration={second(30)}
        next_url="/wash"
    >
        <div slot="subtimer" let:timer_count>
            <div class="justify-center w-96 font-bold">
                {#if timer_count % 2 == 0} 
                    <Alert color="red">
                        Agitate your container until this 2nd timer ends.
                    </Alert>
                {:else}
                    <Alert color="blue">
                        Leave your container until this 2nd timer ends.
                    </Alert>
                {/if}
            </div>

        </div>
    </Timer>

	<div class="mt-12 italic">
        Tip: Before washing, do not look at the fixed print before washing.
	</div>
</section>