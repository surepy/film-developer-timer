import type { NumberInputProps } from "flowbite-svelte/NumberInput.svelte";

/**
 * returns time in seconds, from minutes.
 * 
 * @param n time, in minutes
 * @returns time, in seconds
 */
export function minute(n : number) : number {
    return Math.trunc(n * 60) ;
}

/**
 * this only exists so it's more readable
 * 
 * @param n time, in seconds
 * @returns time, in seconds
 */
export function second(n : number) : number {
    return n;
}

/**
 * this only exists so it's more readable
 * 
 * @param n any number
 * @returns truncated number
 */
export function integer(n : number) : number {
    return Math.trunc(n);
}

/**
 * do we have wake locking?
 * https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 * 
 * @returns wake lock is supported
 */
export function wakelocks(): boolean {
    return "wakeLock" in navigator;
}

/**
 * was timer active, before user maybe refreshed?
 * 
 * @returns true if timer was set
 */
export function timerWasActive(): boolean {
    return localStorage.getItem("timer_active") != null;
}

/**
 * set timer to "active" state
 * 
 * NOTE: the "true" value for timer_active doesn't matter at all, it only checks
 * if it exists.
 */
export function timerSetActive(end_time:number, pathname:string): void {
    localStorage.setItem("timer_active", "true");
    localStorage.setItem("end_time", end_time.toString());
	localStorage.setItem("timer_route", pathname);
}

/**
 * get end_time, if applicable.
 * 
 * @returns timer's last known end_time from localstorage
 */
export function timerGetLastEndTime(): number | null {
    let value = localStorage.getItem("end_time");
    if (!value) { return null; }
    return parseInt(value);
}


/**
 * get end_time, if applicable.
 * 
 * @returns timer's last known end_time from localstorage
 */
export function timerGetLastRoute(): string {
    let value = localStorage.getItem("timer_route");
    // assume develop if fail
    if (!value) { return "/develop"; }
    return value;
}



/**
 * clear timer
 */
export function timerClearActive(): void {
    localStorage.removeItem("timer_active");
}