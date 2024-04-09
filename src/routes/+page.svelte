<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
    
	// first step is always develop, so just go to develop.
	goto("/develop");
</script>

<svelte:head>
	<title>Film Processing Timer</title>
</svelte:head>

<p>redirecting to /develop...</p>