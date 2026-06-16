# Lesson 21 — Result Combinators and Unwrap

## Motivation

`map` and `flatMap` let you transform results while staying in the `Result` world. But eventually, you need to *exit* that world — to get a value, render UI, send a response, or throw if something is truly unexpected.

This lesson introduces four exit-and-fold combinators:

- `fold` — exhaustive matching, choose a branch for each case
- `unwrapOr` — provide a default value for the error case
- `unwrapOrElse` — compute a fallback from the error
- `getOrThrow` — assert success, throw on failure (use sparingly)

These combinators close the loop: you build, transform, and finally collapse a `Result` into a concrete value.

## Mechanic

### `fold` — exhaustive pattern matching

```typescript
function fold<E, T, U>(
  result: Result<E, T>,
  onErr: (e: E) => U,
  onOk: (t: T) => U
): U
```

`fold` is the most principled way to extract a value. You must provide *both* branches — there's no way to forget the error case. The return type `U` is the same for both branches, ensuring you always produce a value regardless of which path you're on.

This mirrors `match` expressions in languages like Rust and Haskell. The type system enforces exhaustiveness automatically.

### `unwrapOr` — static default

```typescript
function unwrapOr<E, T>(result: Result<E, T>, fallback: T): T
```

The simplest combinator: if the result is `Ok`, return its value; otherwise return `fallback`. The fallback must be the same type `T` as the success value. Good for cases where the fallback is a constant.

### `unwrapOrElse` — computed default

```typescript
function unwrapOrElse<E, T>(result: Result<E, T>, fallback: (e: E) => T): T
```

Like `unwrapOr`, but the fallback is a function that receives the error. Use this when the fallback depends on the error, or when computing it is expensive (the function is only called on failure).

### `getOrThrow` — assert success or throw

```typescript
function getOrThrow<E, T>(result: Result<E, T>): T
```

Returns the value if `Ok`, or throws the error directly if `Err`. The error type `E` must be throwable — in TypeScript that means any value (the `throw` statement accepts anything).

Use `getOrThrow` at process boundaries where failure truly is unexpected, or in tests where you want to assert success. Avoid it in library code where callers may not be prepared for exceptions.

## Worked Example

```typescript
import { ok, err, fold, unwrapOr, unwrapOrElse, getOrThrow, type Result } from './result.js';

type FetchError = 'network-error' | 'not-found';

declare function fetchUser(id: number): Result<FetchError, { name: string }>;

const user = fetchUser(42);

// fold — exhaustive: handle both cases explicitly
const displayName = fold(
  user,
  error => `Unknown (error: ${error})`,
  u => u.name
);

// unwrapOr — simple constant fallback
const nameOrDefault = unwrapOr(
  user,
  { name: 'Anonymous' }
);

// unwrapOrElse — computed fallback using the error
const nameOrComputed = unwrapOrElse(
  user,
  error => error === 'not-found' ? 'Guest' : 'Error'
);

// getOrThrow — assert success in tests or at top-level boundaries
try {
  const u = getOrThrow(user);
  console.log(u.name);
} catch (e) {
  console.error('Unexpected failure:', e);
}
```

## When to Use Each

| Combinator      | Use when…                                                     |
|-----------------|---------------------------------------------------------------|
| `fold`          | You need to handle both cases explicitly and produce a value  |
| `unwrapOr`      | You have a simple constant fallback of the same type          |
| `unwrapOrElse`  | The fallback depends on the error, or is expensive to compute |
| `getOrThrow`    | Failure is truly unexpected (tests, startup, trusted sources) |

Prefer `fold` for most application-level code — it's the most explicit and prevents you from accidentally ignoring errors. Reserve `getOrThrow` for boundaries where you've already verified correctness at a higher level.

## Pitfalls

**`getOrThrow` in library code**: Libraries calling `getOrThrow` will surprise callers who expect all errors to be in the type system. Use `fold` or `unwrapOrElse` instead.

**`unwrapOr` with expensive fallbacks**: The fallback is always evaluated, even if the result is `Ok`. If the fallback is expensive to compute, use `unwrapOrElse` with a lazy function.

**`fold` parameter order**: `onErr` comes before `onOk` — the same order as `Result<E, T>`. This is easy to mix up. If your fold returns unexpected values, check whether you've swapped the handlers.

**`unwrapOr` type constraint**: The fallback must be exactly `T`. If your fallback is a different (but compatible) type, TypeScript may fail to infer. Add an explicit type annotation to the fallback or the function call.

## Exercise

Given this Result pipeline:

```typescript
type ParseError = 'not-a-number';
type RangeError = 'out-of-range';

declare function parseAge(s: string): Result<ParseError, number>;
declare function validateAge(n: number): Result<RangeError, number>;
```

1. Combine them with `flatMap`, then use `fold` to produce a user-facing string: either the age as `"Age: N"` or an error message.
2. Use `unwrapOrElse` to provide a default age of `0` when parsing fails.
3. Use `getOrThrow` in a unit test that asserts a valid input succeeds.
4. Write a `toDisplay(result: Result<ParseError | RangeError, number>): string` function using `fold`.
