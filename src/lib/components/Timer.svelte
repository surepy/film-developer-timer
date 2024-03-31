<script lang="ts" context="module">

    import { writable } from 'svelte/store'
    // has the timer started?
    export let started = writable(false);
</script>

<script lang="ts">
    import { createEventDispatcher, onMount, tick } from 'svelte';
	import { timerClearActive, timerGetLastEndTime, timerGetLastRoute, timerSetActive, timerWasActive, wakelocks } from '$lib/util';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

    const dispatch = createEventDispatcher();

    // how long this timer should go (in seconds)
    export let duration:number;
    // sub timer, a 2nd timer that just follows the 1st timer buujht
    export let sub_timer:boolean = false; 
    export let sub_timer_duration:number = duration;

    export let next_url:string | undefined;

    let wake_lock:WakeLockSentinel | null = null;

    // minute component of duration
    $: duration_minutes = Math.trunc(duration / 60).toString().padStart(2, "0");
    // second component of duration
    $: duration_seconds = Math.trunc(duration % 60).toString().padStart(2, "0");

    // timer start time
    let start_time:number = 0;
    // timer end time
    $: end_time = start_time + (duration * 1000);
    // timer remaining time, default "duration"
    let remaining_time:number = duration;
    // make sure remaining_time updates when duration changes from navigating.
    $: { remaining_time = duration }; 
    // elapsed time
    $: elapsed_time = duration - remaining_time;
    // minute component of remaining time
    $: remaining_minutes = Math.trunc(remaining_time / 60).toString().padStart(2, "0") ;
    // second component of remaining time
    $: remaining_seconds = Math.trunc(remaining_time % 60).toString().padStart(2, "0");

    // subtimer
    $: sub_elapsed_time = elapsed_time % sub_timer_duration;
    $: sub_remaining_time = sub_timer_duration - sub_elapsed_time;
    $: sub_remaining_seconds = Math.trunc(sub_remaining_time % 60).toString().padStart(2, "0");

    let timerInterval:NodeJS.Timeout;

    function timerTick() {
        // update components relating to end time
        remaining_time = (end_time - Date.now()) / 1000;

        if (Date.now() > end_time) {
            console.log(`clearing as ${duration} has passed`);
            remaining_time = 0;
            cancelTimer();
        }
    }

    /**
     * start our timer.
     * 
     * IMPORTANT NOTE: you must set start_time / end_time yourself, before calling this function.
     */
    async function startTimer() {
        console.log(`starting timer for start_time=${start_time}, end_time=${end_time}, duration=${duration}`);
        // make sure end_time updates
        await tick();
        timerTick();
        $started = true;

        timerInterval = setInterval(timerTick, 250);

        // prevent device from going to sleep
        if (wakelocks()) {
            wake_lock = await navigator.wakeLock.request("screen");
        }

        // set local storage so timer keeps "ticking" even if device goes to sleep
        // or closes tab, or refreshes
        timerSetActive(end_time, $page.url.pathname);
    }

    /**
     * stops our timer.
     */
    function cancelTimer() {
        // release wake lock
        if (wake_lock) {
            wake_lock.release().then(() => {
                wake_lock = null;    
            });
        }
        
        timerClearActive();
        
        $started = false;
        clearInterval(timerInterval);
    }


    onMount(async () => {
        if (!wakelocks()) {
            console.warn("Wake lock is not available!");
        }

        // we need to recover our previous state.
        if (timerWasActive()) {
            console.log("previous state detected, restoring...")

            // navigate to our previous route, and await for it.
            await goto(timerGetLastRoute());

            // make sure this component updates or whatever
            await tick();
            
            // start restoring our previous state
            let last_end_time = timerGetLastEndTime();

            // why is this null, oh well.
            if (!last_end_time) {
                console.error("timerGetLastEndTime returned null, bailing.");
                return;
            }

            // guess a start_time from end_time
            start_time = last_end_time - (duration * 1000);
            await tick();
            // set end_time and start timer to fully restore our timer.
            end_time = last_end_time;

            await startTimer();
        }
    });

    // TODO: dispatch("timer_complete")?
    // TODO: dispatch("subtimer_complete")?

</script>

<div class="flex flex-col place-content-center items-center">
    <progress class="mt-2" value={!$started ? 0 : (duration - remaining_time) / duration}/>

    <!-- default slot to expose timer data -->
    <slot {elapsed_time} {remaining_time} />

    <p>
        {#if !started}
            {duration_minutes}:{duration_seconds}
        {:else}
            {remaining_minutes}:{remaining_seconds}
        {/if}
    </p>

    <!-- subtimer stuff-->
    {#if sub_timer}
        <progress class="mt-2" value={!started ? 0 : (sub_timer_duration - sub_remaining_time) / sub_timer_duration}/>

        <slot 
            name="subtimer" 
            timer_count={Math.trunc(elapsed_time / sub_timer_duration)} 
            sub_elapsed_time={sub_timer_duration - sub_remaining_time} 
        />

        {#if !$started}
            00:{sub_timer_duration}
        {:else}
            00:{sub_remaining_seconds}
        {/if}
    {/if}

    {#if !$started}
        {#if start_time && remaining_time <= 0}
            {#if next_url}
                <a href={next_url}>next</a>
            {:else}
                <button on:click={() => { start_time = Date.now().valueOf(); startTimer(); }}>start</button>
            {/if}
        {:else}
            <button on:click={() => { start_time = Date.now().valueOf(); startTimer(); }}>start</button>
        {/if}
    {:else}
        <!-- 
            Q: "why is pause/continuing not a feature?" 
            A: because you can't pause the chemicals of a film process. (unless you figured out how to freeze time and space)
               the only reason why you would pause is if you accidently started start on timer and want to reset.
        -->
        <button on:click={cancelTimer}>cancel</button>
    {/if}
</div>
 