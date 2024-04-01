<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
    
	// first step is always develop, so just go to develop.
	goto(`${base}/develop`);
</script>

<p>redirecting to /develop...</p>