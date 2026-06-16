> Verified against TypeScript 4.0+ (variadic tuples) on 2026-05-23.

# Lesson 22 — Result.all and Advanced Inference

## Motivation

You can chain fallible computations one by one with `flatMap`. But what if you have *several independent* computations that all need to succeed? Chaining them forces a sequential dependency that doesn't reflect the actual logic, and error type accumulation becomes unwieldy.

`all` solves this: given a tuple of `Result` values, it returns either `Ok` with a tuple of all success values, or the first `Err` encountered. More importantly, it preserves the *individual types* of each element — `all([ok(1), ok('two')])` knows the result is `[number, string]`, not `(number | string)[]`.

This lesson shows how TypeScript's variadic tuple types (introduced in 4.0) make this precise inference possible.

## Mechanic

### The type helpers

```typescript
export type ResultValues<T extends Result<unknown, unknown>[]> = {
  [K in keyof T]: T[K] extends Result<unknown, infer V> ? V : never
};
```

`ResultValues<T>` is a mapped type over a tuple `T`. For each position `K`, it extracts the value type `V` from the `Result` at that position. Because we map over the tuple's keys (including numeric indices and `length`), the result is a tuple with the same structure — not an array.

```typescript
export type ResultError<T extends Result<unknown, unknown>[]> =
  T[number] extends Result<infer E, unknown> ? E : never;
```

`ResultError<T>` uses distributive conditional types over `T[number]` (the union of all element types). For each element type in the union, it infers `E`, producing the union of all error types that can appear in the tuple.

### The `all` function

```typescript
export function all<T extends Result<unknown, unknown>[]>(
  results: readonly [...T]
): Result<ResultError<T>, ResultValues<T>>
```

Two subtle choices in the signature:

**`readonly [...T]`**: The spread `[...T]` forces TypeScript to infer `T` as a *tuple type* rather than an array type. Without the spread, passing `[ok(1), ok('two')]` would infer `T` as `Result<never, number>[] | Result<never, string>[]` — losing the position information. The spread is the magic that enables per-position inference.

**`readonly`**: Marking the parameter as `readonly` allows passing both mutable and readonly arrays. This is a good practice for functions that only read their input.

### Implementation

```typescript
export function all<T extends Result<unknown, unknown>[]>(
  results: readonly [...T]
): Result<ResultError<T>, ResultValues<T>> {
  const values: unknown[] = [];
  for (const result of results) {
    if (result._tag === 'Err') return result as Result<ResultError<T>, ResultValues<T>>;
    values.push(result.value);
  }
  return ok(values) as Result<ResultError<T>, ResultValues<T>>;
}
```

The casts are necessary because the runtime type of the accumulated array cannot be verified against `ResultValues<T>` at the value level — that's a purely structural type-level construct. The casts are safe by construction: if we reach the `ok(values)` line, every element succeeded and was pushed in order.

## Worked Example

```typescript
import { ok, err, all, isOk, isErr, type Result } from './result.js';

type DbError = 'db-error';
type ApiError = 'api-error';
type CacheError = 'cache-error';

declare function fetchFromDb(): Result<DbError, { id: number }>;
declare function fetchFromApi(): Result<ApiError, { name: string }>;
declare function fetchFromCache(): Result<CacheError, boolean>;

// All three must succeed:
const combined = all([fetchFromDb(), fetchFromApi(), fetchFromCache()]);
// Type: Result<DbError | ApiError | CacheError, [{ id: number }, { name: string }, boolean]>

if (isOk(combined)) {
  const [db, api, cache] = combined.value;
  // db: { id: number }
  // api: { name: string }
  // cache: boolean
  console.log(db.id, api.name, cache);
} else {
  // combined.error: DbError | ApiError | CacheError
  console.error('One of the fetches failed:', combined.error);
}

// Empty case: always succeeds
const empty = all([]);
// Type: Result<never, []>
```

Notice how the success value is a typed tuple `[{ id: number }, { name: string }, boolean]` — not `(object | boolean)[]`. The positional types are preserved.

## Why `[...T]` Is Needed

Without the spread, TypeScript infers the element type as an array (losing tuple structure):

```typescript
// Without spread: T is inferred as an array union, losing position info
function badAll<T extends Result<unknown, unknown>[]>(results: T) { ... }
badAll([ok(1), ok('two')]);
// T = (Ok<number> | Ok<string>)[]
// Result: Result<never, (number | string)[]> — wrong!

// With spread: T is inferred as a tuple, preserving position info
function goodAll<T extends Result<unknown, unknown>[]>(results: readonly [...T]) { ... }
goodAll([ok(1), ok('two')]);
// T = [Ok<number>, Ok<string>]
// Result: Result<never, [number, string]> — correct!
```

This is a TypeScript 4.0 feature (variadic tuple types). The `[...T]` in the parameter position signals to the inference engine that the argument should be treated as a tuple.

## Common Inference Failure Patterns

**Storing results in a variable before passing**:

```typescript
const results = [ok(1), ok('two')]; // inferred as (Ok<number> | Ok<string>)[]
const combined = all(results); // loses tuple info!
```

Fix: use `as const` or pass the array directly:

```typescript
const results = [ok(1), ok('two')] as const;
const combined = all(results); // works!
```

**Mixing typed `Result<E, T>` variables**: If your variables are typed as `Result<E, T>` (the wide union), TypeScript can't infer the specific variant. This is usually fine for runtime behavior but may affect the inferred tuple types. Annotate explicitly when needed.

## Pitfalls

**`all` is fail-fast, not fail-all**: `all` stops at the first error. If you need to collect all errors (not just the first), you'd need a different combinator — often called `allSettled` or `validate`. That's a more advanced pattern beyond this lesson.

**`ResultError<T>` on a homogeneous array**: If all elements have the same error type, `ResultError<[Result<string, number>, Result<string, number>]>` gives `string` (not `string | string`). This is correct — TypeScript simplifies the union.

**Readonly arrays from `as const`**: Using `as const` makes the array `readonly`, which is compatible with the `readonly [...T]` parameter. If you hit type errors, make sure you're not trying to pass a `readonly` result to a mutable parameter elsewhere.

## Exercise

1. Write `allOrFirst<T extends Result<unknown, unknown>[]>(results: readonly [...T]): Result<ResultError<T>, ResultValues<T>>` (same as `all`) from scratch without looking at the implementation.
2. Write a `validate` function that collects *all* errors: `validate<E, T>(results: Result<E, T>[]): Result<E[], T[]>` — return all errors if any fail, or all values if all succeed.
3. Write a type test asserting that `ResultValues<[Result<string, number>, Result<Error, boolean>]>` equals `[number, boolean]`.
4. Write a type test asserting that `ResultError<[Result<'a', number>, Result<'b', string>, Result<'c', boolean>]>` equals `'a' | 'b' | 'c'`.
