/**
 * Complexity — reference implementation.
 *
 * Self-contained: no imports from complexity.ts.
 */

/**
 * Wraps `fn` with an invocation counter.
 */
export function countCalls<T extends unknown[], R>(
  fn: (...args: T) => R,
): { fn: (...args: T) => R; count: () => number; reset: () => void } {
  let calls = 0;
  const wrapped = (...args: T): R => {
    calls++;
    return fn(...args);
  };
  return {
    fn: wrapped,
    count: () => calls,
    reset: () => {
      calls = 0;
    },
  };
}

/**
 * Executes `fn` once and returns elapsed wall-clock time in milliseconds.
 */
export function timeMs(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

/**
 * Inverse Ackermann lookup table.
 *
 * Entries: α(1)=0, α(2)=1, α(4)=2, α(16)=3, α(65536)=4, α(2^32-1)=4
 * (α(n) never exceeds 4 for any realistically sized input.)
 */
export const INVERSE_ACKERMANN_TABLE: ReadonlyArray<{
  n: number;
  alpha: number;
}> = [
  { n: 1, alpha: 0 },
  { n: 2, alpha: 1 },
  { n: 4, alpha: 2 },
  { n: 16, alpha: 3 },
  { n: 65536, alpha: 4 },       // 2^16
  { n: 2147483647, alpha: 4 },  // 2^31 - 1
  { n: 4294967295, alpha: 4 },  // 2^32 - 1
] as const;
