# Memoization (Top-Down Dynamic Programming)

## What is Memoization?

Memoization is the top-down approach to dynamic programming. You write a recursive solution naturally, then add a cache so that if the same subproblem is ever called again, you return the stored result immediately instead of recomputing it.

The term comes from "memo" — you are writing a note to yourself so you do not repeat work.

## The Overlapping Subproblems Property

DP applies when a problem has **overlapping subproblems**: the same sub-computation appears many times in the naive recursive call tree.

Example — naive Fibonacci:
```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2) ← computed again below
│   │   └── fib(1)
│   └── fib(2) ← duplicate
└── fib(3) ← duplicate
```

`fib(3)` is computed twice, `fib(2)` three times, and so on. For `fib(50)` this explodes to ~2^50 calls.

With memoization, each unique argument is computed exactly once, reducing the call count from O(2^n) to O(n).

## Map vs Object as a Cache

```typescript
// Object cache: keys are coerced to strings automatically
const cache: Record<string, number> = {};
cache[n] = result;          // n is coerced: cache["5"] = ...

// Map cache: handles any key type, explicit and type-safe
const cache = new Map<string, number>();
cache.set(String(n), result);
const hit = cache.get(String(n));
```

Prefer `Map` when:
- Keys are non-string types (numbers, objects, tuples)
- You need `.size`, `.has()`, or iteration in insertion order
- You want to avoid prototype pollution

Use an object literal when keys are always strings and you want slightly lighter syntax.

## Key Serialization for Multi-Parameter Functions

When a function takes multiple arguments, the cache key must encode all of them:

```typescript
// Naive: collision risk if args contain commas
key = args.join(',');

// Safe: JSON serialization
key = JSON.stringify(args);

// Fast custom: for (number, number) pairs
key = `${row},${col}`;
```

## TypeScript Callouts

### Typed cache map
```typescript
const memo = new Map<string, number>();
```

### Generic memoize helper
```typescript
function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

The `!` non-null assertion after `cache.get(key)` is safe because we just confirmed `cache.has(key)` is true.

### Closure-based memo (for recursive functions)
```typescript
function fibMemo(n: number): number {
  const memo = new Map<number, number>();

  function fib(n: number): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = fib(n - 1) + fib(n - 2);
    memo.set(n, result);
    return result;
  }

  return fib(n);
}
```

## Examples

### Fibonacci (top-down)
```
fib(0) = 0, fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)

With memo: O(n) time, O(n) space
Naive:     O(2^n) time, O(n) stack space
```

### Coin Change (top-down)
```
minCoins(amount) = 1 + min(minCoins(amount - coin) for coin in coins)
Base case: minCoins(0) = 0

Subproblems: minCoins(0), minCoins(1), ..., minCoins(amount)
Each computed once → O(amount * numCoins) total
```

## Complexity Summary

| Approach | Time     | Space    | Notes                            |
|----------|----------|----------|----------------------------------|
| Naive recursion | O(2^n) | O(n) stack | Recomputes subproblems |
| Memoization | O(unique subproblems) | O(unique subproblems) | Adds cache overhead |
| Tabulation | O(unique subproblems) | O(table size) | Often faster in practice |

For Fibonacci: O(n) time and O(n) space with memoization vs O(2^n) naive.

## When to Choose Memoization over Tabulation

- The recurrence is easier to express recursively
- Not all subproblems need to be solved (sparse access pattern)
- You want to add caching to an existing recursive solution with minimal refactoring
- The "natural" order of solving subproblems is hard to determine
