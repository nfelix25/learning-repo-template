// Generic memoize — wraps any function, caches by JSON-serialized args
export function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  throw new Error('TODO');
}

// Fibonacci with memoization
export function fibMemo(n: number): number {
  throw new Error('TODO');
}

// How many ways to climb n stairs, taking 1 or 2 steps at a time
export function climbingStairs(n: number): number {
  throw new Error('TODO');
}

// Can s be segmented into words from wordDict? Top-down with memo
export function wordBreak(s: string, wordDict: string[]): boolean {
  throw new Error('TODO');
}
