<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { second } from '$lib/util';
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { base } from '$app/paths';

	// export let data: PageData;
</script>

<svelte:head>
	<title>Film Processing Timer | Rinse</title>
</svelte:head>

<section class="flex flex-col place-items-center">
	<div>
		<Timer duration={second(60)} sub_timer sub_timer_duration={second(10)} next_url="/fix"></Timer>
	</div>

	<div class="mt-2">
		<Button href="{base}/fix" color="blue">Skip</Button>
	</div>

	<div class="mt-12 italic">
		Note: this timer doesn't really matter, just fill up and dump your container three times with
		water, then press Skip.
	</div>
</section>
