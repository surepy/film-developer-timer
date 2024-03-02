
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
export function seconds(n : number) : number {
    return n;
}