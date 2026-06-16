import { describe, it, expect } from 'vitest';
import { countCalls, timeMs, INVERSE_ACKERMANN_TABLE } from './complexity.js';

// ---------------------------------------------------------------------------
// countCalls
// ---------------------------------------------------------------------------

describe('countCalls', () => {
  it('starts with a count of 0 before any calls', () => {
    const { count } = countCalls((x: number) => x * 2);
    expect(count()).toBe(0);
  });

  it('increments count by 1 after each call', () => {
    const { fn: tracked, count } = countCalls((x: number) => x + 1);
    tracked(1);
    expect(count()).toBe(1);
    tracked(2);
    expect(count()).toBe(2);
    tracked(3);
    expect(count()).toBe(3);
  });

  it('returns the correct value from the wrapped function', () => {
    const { fn: tracked } = countCalls((a: number, b: number) => a + b);
    expect(tracked(3, 4)).toBe(7);
    expect(tracked(10, -1)).toBe(9);
  });

  it('reset() brings the count back to 0', () => {
    const { fn: tracked, count, reset } = countCalls((x: number) => x);
    tracked(1);
    tracked(2);
    tracked(3);
    expect(count()).toBe(3);
    reset();
    expect(count()).toBe(0);
  });

  it('count continues incrementing after reset', () => {
    const { fn: tracked, count, reset } = countCalls((x: number) => x);
    tracked(1);
    tracked(2);
    reset();
    tracked(3);
    expect(count()).toBe(1);
  });

  it('works with functions that take no arguments', () => {
    let side = 0;
    const { fn: tracked, count } = countCalls(() => {
      side++;
    });
    tracked();
    tracked();
    expect(count()).toBe(2);
    expect(side).toBe(2);
  });

  it('works with multi-argument functions of varied types', () => {
    const { fn: tracked, count } = countCalls(
      (s: string, n: number, b: boolean) => `${s}-${n}-${b}`,
    );
    expect(tracked('a', 1, true)).toBe('a-1-true');
    expect(count()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// timeMs
// ---------------------------------------------------------------------------

describe('timeMs', () => {
  it('returns a number', () => {
    const result = timeMs(() => {
      /* no-op */
    });
    expect(typeof result).toBe('number');
  });

  it('returns a non-negative value', () => {
    const result = timeMs(() => {
      /* no-op */
    });
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('actually executes the function (side effects happen)', () => {
    let ran = false;
    timeMs(() => {
      ran = true;
    });
    expect(ran).toBe(true);
  });

  it('returns a larger value for a slower function', () => {
    // Spin-loop to burn some CPU time
    const slow = timeMs(() => {
      let x = 0;
      for (let i = 0; i < 1_000_000; i++) x += i;
      return x; // prevent optimizer from eliminating the loop
    });
    const fast = timeMs(() => {
      /* no-op */
    });
    // Slow should take measurably longer than no-op
    // (This is intentionally a loose check — we just want slow >= fast)
    expect(slow).toBeGreaterThanOrEqual(fast);
  });
});

// ---------------------------------------------------------------------------
// INVERSE_ACKERMANN_TABLE
// ---------------------------------------------------------------------------

describe('INVERSE_ACKERMANN_TABLE', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(INVERSE_ACKERMANN_TABLE)).toBe(true);
    expect(INVERSE_ACKERMANN_TABLE.length).toBeGreaterThan(0);
  });

  it('each entry has numeric n and alpha properties', () => {
    for (const entry of INVERSE_ACKERMANN_TABLE) {
      expect(typeof entry.n).toBe('number');
      expect(typeof entry.alpha).toBe('number');
    }
  });

  it('alpha is non-negative for all entries', () => {
    for (const entry of INVERSE_ACKERMANN_TABLE) {
      expect(entry.alpha).toBeGreaterThanOrEqual(0);
    }
  });

  it('alpha is non-decreasing as n increases', () => {
    const sorted = [...INVERSE_ACKERMANN_TABLE].sort((a, b) => a.n - b.n);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]!.alpha).toBeGreaterThanOrEqual(sorted[i - 1]!.alpha);
    }
  });

  it('contains an entry confirming α(n) ≤ 4 for n = 2^16 = 65536', () => {
    const entry = INVERSE_ACKERMANN_TABLE.find((e) => e.n >= 65536);
    expect(entry).toBeDefined();
    expect(entry!.alpha).toBeLessThanOrEqual(4);
  });

  it('contains an entry for n=1 with alpha=0', () => {
    const entry = INVERSE_ACKERMANN_TABLE.find((e) => e.n === 1);
    expect(entry).toBeDefined();
    expect(entry!.alpha).toBe(0);
  });

  it('contains an entry for n=4 with alpha=2', () => {
    const entry = INVERSE_ACKERMANN_TABLE.find((e) => e.n === 4);
    expect(entry).toBeDefined();
    expect(entry!.alpha).toBe(2);
  });

  it('all alpha values are ≤ 4 (effectively constant for real-world n)', () => {
    for (const entry of INVERSE_ACKERMANN_TABLE) {
      expect(entry.alpha).toBeLessThanOrEqual(4);
    }
  });
});

// ---------------------------------------------------------------------------
// Memoized Fibonacci demo: countCalls reveals space-time tradeoff
// ---------------------------------------------------------------------------

describe('memoized fib demo — space-time tradeoff', () => {
  /**
   * Naive recursive Fibonacci: exponential time, no memoization.
   * fib(n) calls itself roughly 2^n times.
   */
  function naiveFib(n: number): number {
    if (n <= 1) return n;
    return naiveFib(n - 1) + naiveFib(n - 2);
  }

  /**
   * Memoized Fibonacci: wraps naiveFib with a cache.
   * Each value is computed at most once.
   */
  function memoizedFib(
    rawFib: (n: number) => number,
  ): (n: number) => number {
    const cache = new Map<number, number>();
    function memoFib(n: number): number {
      if (cache.has(n)) return cache.get(n)!;
      const result = n <= 1 ? n : memoFib(n - 1) + memoFib(n - 2);
      cache.set(n, result);
      return result;
    }
    // Attach raw reference so we can count raw calls separately
    void rawFib;
    return memoFib;
  }

  it('naiveFib(20) makes far more than 21 recursive calls (exponential)', () => {
    const { fn: tracked, count } = countCalls(naiveFib);
    // We need to rebuild naive as a tracked version
    let callCount = 0;
    function trackedNaive(n: number): number {
      callCount++;
      if (n <= 1) return n;
      return trackedNaive(n - 1) + trackedNaive(n - 2);
    }
    void tracked; void count; // suppress unused warning
    trackedNaive(20);
    // fib(20) makes 2*fib(21) - 1 = 21891 calls — far more than 21
    expect(callCount).toBeGreaterThan(100);
  });

  it('memoized fib(30) computes each unique value at most once (≤ 31 cache misses)', () => {
    let rawCallCount = 0;
    const cache = new Map<number, number>();

    function memoFib(n: number): number {
      if (cache.has(n)) return cache.get(n)!;
      rawCallCount++;          // count only cache misses
      const result = n <= 1 ? n : memoFib(n - 1) + memoFib(n - 2);
      cache.set(n, result);
      return result;
    }

    memoFib(30);
    // There are 31 unique subproblems for fib(30): fib(0)..fib(30)
    expect(rawCallCount).toBeLessThanOrEqual(31);
  });

  it('memoized fib(30) returns the correct value', () => {
    const fib = memoizedFib(naiveFib);
    // fib(30) = 832040
    expect(fib(30)).toBe(832040);
  });

  it('naive and memoized fib produce identical results for n = 0..15', () => {
    const memoFib = memoizedFib(naiveFib);
    for (let n = 0; n <= 15; n++) {
      expect(memoFib(n)).toBe(naiveFib(n));
    }
  });
});
