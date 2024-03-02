<script lang="ts">
	import '../app.pcss';
	import './styles.css';
	import {minute} from "$lib/util"
	import { page } from '$app/stores';  
	import { beforeNavigate } from '$app/navigation';
	import { started as timer_started } from '$lib/components/Timer.svelte';
 
	enum DevelopmentSteps {
		Develop,
		Rinse,
		Fix,
		Wash,
		Dry
	};

	function getStep(step : string) {
		let idx = step.indexOf('/', 1);
		if (idx == -1) {
			idx = step.length;
		}
		switch (step.substring(1, idx)) {
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
			console.log("there is an ongoing timer, cancelling nav");
			nav.cancel();
		}
	});

	$: development_time = minute(2);
	$: estimated_end_time = calcEstTime(development_time, getStep($page.url.pathname));
	
</script>

<svelte:head>
	<meta name="description" content="A simple timer for film processing." />
</svelte:head>

<div class="app">

	<main>
		<h1>
			Film Processing Timer
		</h1>

		<p>
			Your Estimated Film Processing End Time: <b>{estimated_end_time.toLocaleTimeString()}</b>
		</p>

		<div>
			<a href="/develop">develop</a>
			<a href="/rinse">rinse</a>
			<a href="/fix">fix</a>
			<a href="/wash">wash</a>
			<a href="/dry">dry</a>

		</div>
	


		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
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
