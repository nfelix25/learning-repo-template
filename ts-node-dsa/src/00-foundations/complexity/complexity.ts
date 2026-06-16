/**
 * Complexity — helpers that make Big-O tangible through measurement and counting.
 *
 * These are educational scaffolding. Implement them in solution.ts.
 * All bodies intentionally throw 'TODO' until the learner fills them in.
 */

/**
 * Wraps `fn` with an invocation counter.
 *
 * Returns an object containing:
 * - `fn`: the wrapped function (same signature as input)
 * - `count()`: returns how many times the wrapped function has been called
 * - `reset()`: resets the counter to zero
 *
 * @example
 * const { fn: tracked, count } = countCalls(Math.sqrt);
 * tracked(4); tracked(9);
 * count(); // => 2
 */
export function countCalls<T extends unknown[], R>(
  fn: (...args: T) => R,
): { fn: (...args: T) => R; count: () => number; reset: () => void } {
  throw new Error("TODO");
}

/**
 * Executes `fn` once and returns the elapsed wall-clock time in milliseconds.
 * Uses `performance.now()` for sub-millisecond precision.
 *
 * @param fn - A zero-argument function to time.
 * @returns Elapsed time in milliseconds (may be fractional).
 */
export function timeMs(fn: () => void): number {
  throw new Error("TODO");
}

/**
 * A lookup table documenting α(n) — the inverse Ackermann function — for selected values of n.
 *
 * Each entry `{ n, alpha }` means: for input size n, the inverse Ackermann value is `alpha`.
 * α(n) ≤ 4 for all n representable in the observable universe.
 *
 * Used by Disjoint Set Union to describe its amortized per-operation complexity.
 */
export const INVERSE_ACKERMANN_TABLE: ReadonlyArray<{
  n: number;
  alpha: number;
}> = [];
// Replace the empty array with the actual table in your implementation.
// Hint: include entries for n = 1, 2, 4, 16, 65536 (2^16), and 2^32 - 1.
