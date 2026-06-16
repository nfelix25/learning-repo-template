/**
 * Hybrid Sorts — skeleton.
 *
 * All function bodies throw 'TODO'. Implement them in solution.ts.
 *
 * Every sort returns a NEW sorted array and does not mutate the input.
 * The optional `cmp` comparator follows the convention:
 *   cmp(a, b) < 0  → a comes before b
 *   cmp(a, b) === 0 → a and b are equal
 *   cmp(a, b) > 0  → b comes before a
 * Default (when cmp is omitted): ascending order via < / >.
 */

export type Comparator<T> = (a: T, b: T) => number;

/**
 * Simplified TimSort.
 * - If arr.length <= 64: use insertion sort directly.
 * - Otherwise: split into runs of 32, insertion-sort each run, then merge all runs.
 *
 * Returns a new sorted array (does not mutate input). Stable.
 */
export function timSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}

/**
 * IntroSort.
 * - Uses quicksort as the primary algorithm.
 * - Switches to heapsort when recursion depth exceeds 2 * floor(log2(n)).
 * - Uses insertion sort for subarrays of size <= 16.
 *
 * Returns a new sorted array (does not mutate input). Not stable.
 */
export function introSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}
