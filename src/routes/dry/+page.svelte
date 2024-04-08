<script lang="ts">
    import type { PageData } from './$types';
    import Timer from '$lib/components/Timer.svelte';
	import { minute, second } from '$lib/util';
    
    
    // export let data: PageData;
</script>

<section>
    <Timer 
    duration={minute(25)} 
    next_url={undefined}
    >
    </Timer>

	<div class="mt-12 italic">
        Tip: take a coffee break! 
	</div>
</section>