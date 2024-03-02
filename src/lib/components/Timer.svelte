

<script lang="ts">

    import { createEventDispatcher } from 'svelte';


    const dispatch = createEventDispatcher();

    // how long this timer should go (in seconds)
    export let duration:number;
    // 
    export let sub_timer:boolean = false;
    export let sub_timer_duration:number = 1;
    sub_timer_duration;

    export let next_url:string | undefined;

    let started = false;

    $: duration_minutes = Math.trunc(duration / 60).toString().padStart(2, "0");
    $: duration_seconds = Math.trunc(duration % 60).toString().padStart(2, "0");

    let start_time:number = 0;
    let remaining_time:number = 0;
    $: remaining_minutes = Math.trunc(remaining_time / 60).toString().padStart(2, "0") ;
    $: remaining_seconds = Math.trunc(remaining_time % 60).toString().padStart(2, "0");

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
        started = true;
        console.log(`start_time=${start_time}`)

        timerInterval = setInterval(timerTick, 250);
    }

    function cancelTimer() {
        started = false;
        clearInterval(timerInterval);
    }

    // TODO: dispatch("timer_complete")
    // TODO: dispatch("subtimer_complete")

</script>

<div class="flex flex-col place-content-center items-center">
    <progress class="mt-2" value={!started ? 0 : (duration - remaining_time) / duration}/>

    <p>
        {#if !started}
            {duration_minutes}:{duration_seconds}
        {:else}
            {remaining_minutes}:{remaining_seconds}
        {/if}
    </p>

    {#if sub_timer}
        <!-- subtimer stuff-->
    {/if}

    {#if !started}
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
