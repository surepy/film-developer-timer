<script lang="ts">
    import type { PageData } from './$types';
    
    // export let data: PageData;

	import {minute, seconds} from "$lib/util"
	import Timer from '$lib/components/Timer.svelte';


	/**
	 * returns approximate film development
	 * 
	 * @param temperature
	 */
	function kentmere_100_kodak_hc110_dev_time(temperature: number) {
		// this is kind of an appoximation, but it's good enough.
		// see provided guide and 
		// https://www.ilfordphoto.com/amfile/file/download/file/1958/product/2131/ - page 3.
		return -0.25 * temperature + 22;
	}

	let manual_timer_input = false;

	// TODO: make this configurable for different types of film,
	// for now it's kentmere 100 and kodak hc-110 (Dilution B) based.
	let dev_minutes = 5;
	let dev_seconds = 0;
	$: development_time = minute(dev_minutes) + dev_seconds;
</script>

<svelte:head>
	<title>Film Process Timer | Develop</title>
</svelte:head>

<section>
    <div>
		{#if manual_timer_input} 
			<input min="0" max="60" type="number" on:change={event => { console.log(event)}}>
			<input min="0" max="60" type="number" on:change={event => {}}>
		{:else}
			<!-- realistically min should be not 0 cuz why are you processing film at 0 degrees f -->
			<input 
				min="0" 
				max="88" 
				placeholder="developer tempreture" 
				type="number" 
				value=68
				on:input={event => { dev_minutes = kentmere_100_kodak_hc110_dev_time(event.target?.value); }}
			> 'F
		{/if}

        <Timer 
            duration={development_time} 
            sub_timer
			sub_timer_duration={seconds(30)}
            next_url="/rinse"
        >
			<div slot="subtimer" let:timer_count>
				{timer_count}
				{#if timer_count < 1} 
					<p><b>REMINDER: TAP THE BOTTOM OF THE SINK</b></p>
				{/if}
			</div>

		</Timer>
        
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
