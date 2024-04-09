<script lang="ts">
	import '../app.pcss';
	import './styles.css';
	import {minute} from "$lib/util"
	import { base } from '$app/paths';
	import { page } from '$app/stores';  
	import { beforeNavigate } from '$app/navigation';
	import { started as timer_started } from '$lib/components/Timer.svelte';
	import { onMount } from 'svelte';
 
	enum DevelopmentSteps {
		Develop,
		Rinse,
		Fix,
		Wash,
		Dry
	};

	function getStep(step : string) {
		let idx = step.lastIndexOf('/');
		if (idx == -1) {
			idx = step.length;
		}
		switch (step.substring(idx + 1)) {
		case "rinse":
			return DevelopmentSteps.Rinse;
		case "fix":
			return DevelopmentSteps.Fix;
		case "wash":
			return DevelopmentSteps.Wash;
		case "dry":	
			return DevelopmentSteps.Dry;
		case "develop":
		default:
			return DevelopmentSteps.Develop;
		}

	}

	function calcEstTime(dev_time : number, sequence: DevelopmentSteps) {
		let est_time = new Date();
		switch (sequence) {
		case DevelopmentSteps.Develop:
			est_time.setSeconds(est_time.getSeconds() + dev_time);
		case DevelopmentSteps.Rinse:
			// "Rinse with water 30 seconds, 3 times." + magic number of guessed "emptying" time
			est_time.setSeconds(est_time.getSeconds() + (30 * 3) + 10);
		case DevelopmentSteps.Fix:
			// "Fix for 8 minutes (agitating every 30 seconds)"
			est_time.setMinutes(est_time.getMinutes() + 8);
		case DevelopmentSteps.Wash:
			// 10 minutes of film washing.
			est_time.setMinutes(est_time.getMinutes() + 10);
		case DevelopmentSteps.Dry:
			// 20~30 minutes of film drying.
			est_time.setMinutes(est_time.getMinutes() + 25);
		}
		return est_time;
	}

	beforeNavigate(nav => {
		if ($timer_started) {
			console.log(`there is an ongoing timer, cancelling nav (${nav.from?.url} => ${nav.to?.url})`);
			nav.cancel();
			return;
		}
	});

	onMount(() => {});

	$: development_time = minute(5);
	$: estimated_end_time = calcEstTime(development_time, getStep($page.url.pathname));

	function getColor(pathname : string, step: DevelopmentSteps) {
		if (getStep(pathname) == step) {
			return "purple";
		}
		return "alternative";
	}

	import { ButtonGroup, Button } from 'flowbite-svelte';
</script>

<svelte:head>
	<meta name="description" content="A simple timer for film processing." />
</svelte:head>

<div class="app">
	<main>
		<h1>
			Film Processing Timer
		</h1>

		<div class="flex flex-row place-items-center text-center">
			<p class="font-normal">
				Your Estimated Film Processing End Time: 
				<b class="text-lg">{estimated_end_time.toLocaleTimeString()}</b>
			</p>
		</div>

		<div class="mt-5 mb-8 justify-center">
			<ButtonGroup>
				<Button href="{base}/develop" color={getColor($page.url.pathname, DevelopmentSteps.Develop)} disabled={$timer_started} >Develop</Button>
				<Button href="{base}/rinse" color={getColor($page.url.pathname, DevelopmentSteps.Rinse)} disabled={$timer_started }>Rinse</Button>
				<Button href="{base}/fix" color={getColor($page.url.pathname, DevelopmentSteps.Fix)} disabled={$timer_started}>Fix</Button>
				<Button href="{base}/wash" color={getColor($page.url.pathname, DevelopmentSteps.Wash)} disabled={$timer_started}>Wash</Button>
				<Button href="{base}/dry" color={getColor($page.url.pathname, DevelopmentSteps.Dry)} disabled={$timer_started}>Dry</Button>
			  </ButtonGroup>
		</div>

		<slot />
	</main>

	<footer>
		<p>Made with <a href="https://kit.svelte.dev">Sveltekit</a> | <a href="https://github.com/surepy/film-developer-timer">Source Code</a></p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		align-items: center;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
