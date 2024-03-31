<script lang="ts">
    import type { PageData } from './$types';
    
    // export let data: PageData;

	import {minute, second, integer} from "$lib/util"
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

	// TODO: grab some data off https://www.digitaltruth.com/ ?

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
		<input type="checkbox" bind:checked={manual_timer_input}> <label for="vehicle2">Manual Mode</label>
		<br>

		{#if manual_timer_input} 
			Minutes:
			<input min="0" max="60" type="number" inputmode="numeric" pattern="[0-9]*" bind:value={dev_minutes} >
			Seconds:
			<input min="0" max="60" type="number" inputmode="numeric" pattern="[0-9]*" bind:value={dev_seconds} >
		{:else}
			<!-- realistically min should be not 0 cuz why are you processing film at 0 degrees f -->
			<!-- TODO: celsius? -->
			<p>Kentmere 100:</p>
			<input 
				min="0" 
				max="88" 
				placeholder="developer tempreture" 
				type="number" 
				value=68
				on:input={
					event => { 
						dev_seconds = 0; 
						dev_minutes = kentmere_100_kodak_hc110_dev_time(event.target?.value); 
					}
				}
			> 'F
		{/if}
		<br>
		<br>

        <Timer 
            duration={development_time} 
            sub_timer
			sub_timer_duration={second(30)}
            next_url="/rinse"
			let:remaining_time
        >
			<div >
				{#if remaining_time < 10}
					<p><b>START POURING NOW</b></p>
				{:else if remaining_time < 30} 
					<p><b>Start pouring in {integer(remaining_time - 10)} seconds to prevent overdevelopent!</b></p>
				{/if}
			</div>

			<div slot="subtimer" let:timer_count>
				{#if timer_count < 1} 
					<p><b>REMINDER: TAP THE BOTTOM OF THE SINK WHEN THIS SUB-TIMER ENDS</b></p>
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
