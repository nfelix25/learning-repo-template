/**
 * Non-Comparison Sorts — skeleton.
 *
 * All function bodies throw 'TODO'. Implement them in solution.ts.
 *
 * Each function returns a NEW sorted array and does not mutate the input.
 */

/**
 * Counting sort.
 * Sorts non-negative integers in the range [0, maxValue].
 * Stable. O(n + maxValue) time and space.
 *
 * @param arr       Array of non-negative integers.
 * @param maxValue  The maximum possible value in `arr`.
 */
export function countingSort(arr: number[], maxValue: number): number[] {
  throw new Error('TODO');
}

/**
 * Radix sort (LSD, base 10).
 * Sorts non-negative integers using least-significant-digit radix sort.
 * Stable. O(d * (n + 10)) where d is the number of decimal digits in the max value.
 *
 * @param arr  Array of non-negative integers.
 */
export function radixSort(arr: number[]): number[] {
  throw new Error('TODO');
}

/**
 * Bucket sort.
 * Sorts numbers in the range [0, 1) by distributing them into buckets.
 * Stable (if per-bucket insertion sort preserves order). O(n) average.
 *
 * @param arr          Array of numbers in [0, 1).
 * @param bucketCount  Number of buckets to use. Defaults to arr.length.
 */
export function bucketSort(arr: number[], bucketCount?: number): number[] {
  throw new Error('TODO');
}
