
<script lang="ts" context="module">

    import { writable } from 'svelte/store'
    // has the timer started?
    export let started = writable(false);
</script>

<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // how long this timer should go (in seconds)
    export let duration:number;
    // sub timer, a 2nd timer that just follows the 1st timer buujht
    export let sub_timer:boolean = false; 
    export let sub_timer_duration:number = duration;

    export let next_url:string | undefined;

    // minute component of duration
    $: duration_minutes = Math.trunc(duration / 60).toString().padStart(2, "0");
    // second component of duration
    $: duration_seconds = Math.trunc(duration % 60).toString().padStart(2, "0");

    // timer start time
    let start_time:number = 0;
    // timer remaining time
    let remaining_time:number = duration;
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
        console.log("tick");
        // update components relating to end time
        remaining_time = ((start_time + (duration * 1000)) - Date.now()) / 1000;

        if (!start_time || Date.now() > start_time + (duration * 1000)) {
            console.log(`clearing ${duration} has passed)`);
            clearInterval(timerInterval);
        }
    }

    function startTimer() {
        console.log(`starting ${duration} timer`);

        start_time = Date.now();
        timerTick();
        $started = true;
        console.log(`start_time=${start_time}`)

        timerInterval = setInterval(timerTick, 250);
    }

    function cancelTimer() {
        $started = false;
        clearInterval(timerInterval);
    }

    // TODO: dispatch("timer_complete")
    // TODO: dispatch("subtimer_complete")

</script>

<div class="flex flex-col place-content-center items-center">
    <progress class="mt-2" value={!$started ? 0 : (duration - remaining_time) / duration}/>

    <!-- default slot to expose timer data -->
    <slot elapsed_time />

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
        {#if start_time && remaining_time < 0}
            {#if next_url}
                <a href={next_url}>next</a>
            {:else}
                <button on:click={startTimer}>start</button>
            {/if}
        {:else}
            <button on:click={startTimer}>start</button>
        {/if}
    {:else}
        <!-- 
            Q: "why is pause/continuing not a feature?" 
            A: because you can't pause the chemicals of a film process.
             the only reason why you would pause is if you accidently started ur timer.
        -->
        <button on:click={cancelTimer}>cancel</button>
    {/if}
</div>
 