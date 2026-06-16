import { describe, it, expect } from 'vitest';
import { memoize, fibMemo, climbingStairs, wordBreak } from './memoization.js';

describe('memoize', () => {
  it('wraps an identity function and returns correct values', () => {
    const identity = memoize((x: number) => x);
    expect(identity(42)).toBe(42);
    expect(identity(0)).toBe(0);
  });

  it('caches calls — underlying function called only once for same args', () => {
    let callCount = 0;
    const expensive = memoize((x: number) => {
      callCount++;
      return x * 2;
    });
    expensive(5);
    expensive(5);
    expensive(5);
    expect(callCount).toBe(1);
    expensive(6);
    expect(callCount).toBe(2);
  });

  it('works with multi-arg functions', () => {
    let callCount = 0;
    const add = memoize((a: number, b: number) => {
      callCount++;
      return a + b;
    });
    expect(add(1, 2)).toBe(3);
    expect(add(1, 2)).toBe(3);
    expect(callCount).toBe(1);
    expect(add(2, 1)).toBe(3);
    expect(callCount).toBe(2); // (2,1) is a different cache key than (1,2)
  });
});

describe('fibMemo', () => {
  it('returns correct base cases', () => {
    expect(fibMemo(0)).toBe(0);
    expect(fibMemo(1)).toBe(1);
  });

  it('returns fib(10) = 55', () => {
    expect(fibMemo(10)).toBe(55);
  });

  it('returns fib(20) = 6765', () => {
    expect(fibMemo(20)).toBe(6765);
  });

  it('handles large n (fib(50)) without stack overflow or timeout', () => {
    expect(fibMemo(50)).toBe(12586269025);
  });
});

describe('climbingStairs', () => {
  it('n=1 → 1 way', () => expect(climbingStairs(1)).toBe(1));
  it('n=2 → 2 ways', () => expect(climbingStairs(2)).toBe(2));
  it('n=3 → 3 ways', () => expect(climbingStairs(3)).toBe(3));
  it('n=4 → 5 ways', () => expect(climbingStairs(4)).toBe(5));
  it('n=5 → 8 ways', () => expect(climbingStairs(5)).toBe(8));
});

describe('wordBreak', () => {
  it('segments "leetcode" with ["leet","code"] → true', () => {
    expect(wordBreak('leetcode', ['leet', 'code'])).toBe(true);
  });

  it('cannot segment "catsandog" → false', () => {
    expect(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])).toBe(false);
  });

  it('empty string → true (vacuously segmented)', () => {
    expect(wordBreak('', ['leet', 'code'])).toBe(true);
  });

  it('word not in dict → false', () => {
    expect(wordBreak('hello', ['world'])).toBe(false);
  });
});
