// Memoization — full working implementation

// Generic memoize — wraps any function, caches by JSON-serialized args
export function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci with memoization — O(n) time, O(n) space
export function fibMemo(n: number): number {
  const memo = new Map<number, number>();

  function fib(k: number): number {
    if (k <= 0) return 0;
    if (k === 1) return 1;
    if (memo.has(k)) return memo.get(k)!;
    const result = fib(k - 1) + fib(k - 2);
    memo.set(k, result);
    return result;
  }

  return fib(n);
}

// How many ways to climb n stairs, taking 1 or 2 steps at a time
// This is identical to Fibonacci shifted by one: ways(n) = fib(n+1)
export function climbingStairs(n: number): number {
  const memo = new Map<number, number>();

  function ways(k: number): number {
    if (k <= 0) return 0;
    if (k === 1) return 1;
    if (k === 2) return 2;
    if (memo.has(k)) return memo.get(k)!;
    const result = ways(k - 1) + ways(k - 2);
    memo.set(k, result);
    return result;
  }

  return ways(n);
}

// Can s be segmented into words from wordDict? Top-down with memo
export function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const memo = new Map<number, boolean>();

  function canBreak(start: number): boolean {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start)!;

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);
      if (wordSet.has(word) && canBreak(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  }

  return canBreak(0);
}
