<script lang="ts">
	import type { PageData } from './$types';

	// export let data: PageData;

	import { minute, second, integer } from '$lib/util';
	import Timer from '$lib/components/Timer.svelte';

	import { Checkbox, NumberInput, Label, Alert } from 'flowbite-svelte';

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

<section class="flex flex-col place-items-center">
	<div class="mb-2">
		<Checkbox bind:checked={manual_timer_input}>Manual Mode</Checkbox>
	</div>

	<div class="mb-4">
		{#if manual_timer_input}
			<div class="flex flex-row place-items-center">
				Minutes:
				<NumberInput
					min="0"
					max="60"
					type="number"
					inputmode="numeric"
					pattern="[0-9]*"
					bind:value={dev_minutes}
				/>
				Seconds:

				<NumberInput
					min="0"
					max="60"
					type="number"
					inputmode="numeric"
					pattern="[0-9]*"
					bind:value={dev_seconds}
				/>
			</div>
		{:else}
			<!-- realistically min should be not 0 cuz why are you processing film at 0 degrees f -->
			<!-- TODO: celsius? -->
			<p class="flex-grow">Kentmere 100:</p>

			<div class="flex flex-row place-items-center">
				<NumberInput
					min="0"
					max="88"
					placeholder="developer tempreture"
					type="number"
					value="68"
					on:input={(event) => {
						dev_seconds = 0;
						dev_minutes = kentmere_100_kodak_hc110_dev_time(event.target?.value);
					}}
				/>
				<p class="ml-2 text-lg font-semibold">°F</p>
			</div>
		{/if}
	</div>

	<div class="mb-4">
		<Timer
			duration={development_time}
			sub_timer
			sub_timer_duration={second(30)}
			next_url="/rinse"
			let:remaining_time
		>
			<p class="font-bold mb-2 w-80">
				
				{#if remaining_time < 10}
					<Alert color="red">
						START POURING NOW
					</Alert>
				{:else if remaining_time < 30}
				<Alert color="orange">
					Start pouring in {integer(remaining_time - 10)} seconds to prevent overdevelopent!
				</Alert>
				{/if}
				
			</p>

			<div slot="subtimer" let:timer_count let:sub_remaining_seconds>
   <div class="w-80">
   {#if remaining_time > 30}
   {#if timer_count < 1}
					<Alert color="red">
					 Start agitating until this timer ends.
				  	</Alert>
				{:else if sub_remaining_seconds > 5}
					<Alert color="blue">
						Start agitating in <span class="font-medium">{Math.trunc(sub_remaining_seconds - 5)}s</span>...
				  	</Alert>
				{:else}
					<Alert color="red">
						Start agitating for <span class="font-medium">{Math.trunc(sub_remaining_seconds - 5)}s</span>!
				  	</Alert>
				{/if}
    {/if}

				{#if timer_count < 1}
					<Alert color="yellow">
						Tap the bottom of the sink after this 30 seconds!
				  	</Alert>
				{/if}
			</div>
   </div>
		</Timer>
	</div>

	<div class="mt-12 italic">Check out "Manual Mode" if using a different film!</div>

	<!--<Counter />-->
</section>
