
/**
 * returns time in seconds, from minutes.
 * 
 * @param n time, in minutes
 * @returns time, in seconds
 */
export function minute(n : number) : number {
    return Math.trunc(n * 60) ;
}