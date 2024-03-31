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
    <div>
        <Timer 
            duration={minute(20)} 
            next_url="/dry"
        >
		</Timer>
    </div>
</section>