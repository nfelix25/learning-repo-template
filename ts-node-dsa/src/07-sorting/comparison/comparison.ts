/**
 * Comparison Sorts — skeleton.
 *
 * All function bodies throw 'TODO'. Implement them in solution.ts.
 *
 * Every sort returns a NEW sorted array and does not mutate the input.
 * The optional `cmp` comparator follows the convention:
 *   cmp(a, b) < 0  → a comes before b
 *   cmp(a, b) === 0 → a and b are equal
 *   cmp(a, b) > 0  → b comes before a
 * Default (when cmp is omitted): ascending numeric / lexicographic order
 * via `(a, b) => (a < b ? -1 : a > b ? 1 : 0)`.
 */

export type Comparator<T> = (a: T, b: T) => number;

/**
 * Insertion sort.
 * Returns a new sorted array (does not mutate input).
 * Stable. O(n²) average/worst, O(n) best (already sorted).
 */
export function insertionSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}

/**
 * Merge sort.
 * Returns a new sorted array (does not mutate input).
 * Stable. O(n log n) all cases. O(n) auxiliary space.
 */
export function mergeSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}

/**
 * Quicksort.
 * Returns a new sorted array (does not mutate input).
 * Not stable. O(n log n) average, O(n²) worst case.
 */
export function quickSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}

/**
 * Heapsort.
 * Returns a new sorted array (does not mutate input).
 * Not stable. O(n log n) all cases. O(1) auxiliary space (in-place semantics).
 */
export function heapSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  throw new Error('TODO');
}

/**
 * Utility: returns true if `arr` is sorted (non-decreasing) according to `cmp`.
 */
export function isSorted<T>(arr: T[], cmp?: Comparator<T>): boolean {
  throw new Error('TODO');
}
