<script lang="ts">
    import type { PageData } from './$types';
    import Timer from '$lib/components/Timer.svelte';
	import { minute, second } from '$lib/util';
    
    // export let data: PageData;
</script>


<svelte:head>
	<title>Film Process Timer | Wash</title>
</svelte:head>

<section>
    <Timer 
        duration={minute(20)} 
        next_url="/dry"
    >
    </Timer>

    <div class="mt-12 italic">
        It's recommended you dip the film in photo-flow, before going into drying.
	</div>
</section>