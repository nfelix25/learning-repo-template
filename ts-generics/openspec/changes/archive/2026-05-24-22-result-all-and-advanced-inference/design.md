## Content manifest

### Outline

**Intro**: `Promise.all` takes a tuple of Promises and returns a single Promise of a tuple. `Result.all` should do the same for Results — but implementing it exposes TypeScript's inference limits in ways that are deeply instructive. This lesson is where the theory from Phase 1 collides with real implementation constraints.

**Mechanic**:
- Target signature:
  ```
  function all<T extends Result<unknown, unknown>[]>(
    results: [...T]
  ): Result<ResultError<T[number]>, ResultValues<T>>
  ```
- `ResultValues<T>`: extracts the tuple of success types from a tuple of Results — `[Result<E1,T1>, Result<E2,T2>]` → `[T1, T2]`.
- `ResultError<T>`: extracts the union of error types — `[Result<E1,T1>, Result<E2,T2>]` → `E1 | E2`.
- Both require mapped tuple types: `{ [K in keyof T]: T[K] extends Result<infer _E, infer V> ? V : never }`.
- The variadic spread in the parameter `[...T]` forces TypeScript to infer `T` as a tuple (not `Result<unknown, unknown>[]`), preserving position information.
- Inference failure: without `[...T]`, TypeScript infers `T = Result<unknown, unknown>[]` and loses tuple structure. This is the inference failure to diagnose and fix in the exercise.
- Variance trap: `T extends Result<unknown, unknown>[]` — `Result<string, number>` is assignable to `Result<unknown, unknown>` because `string` extends `unknown` and `number` extends `unknown`. This is covariance working correctly.

**Worked example**: Implement `all` step by step — first with the naive signature that loses tuple structure, then diagnose the inference failure, then fix with `[...T]`. Show `ResultValues` and `ResultError` as helper types.

**Pitfalls**: TypeScript cannot always infer deeply nested mapped tuple types — if the mapped type is too complex, TypeScript gives up and returns `never` or the constraint. Adding intermediate named types (`ResultValues`, `ResultError`) helps the compiler's instantiation depth. Using `T[number]` to extract the union of element types is idiomatic.

**Exercise**: Implement `Result.all` with correct variadic tuple inference. Write tests verifying that `all([ok(1), ok("two"), ok(true)])` produces `Result<never, [number, string, boolean]>` and that `all([ok(1), err("boom"), ok(3)])` produces `Result<string, [number, string, number]>` with the correct error.

### Build piece role

Implement `Result.all` with variadic tuple inference, surfacing variance and inference edge cases in a real implementation context.

### Framing note

This lesson is where Phase 1 theory meets practice. The inference failure with `T[]` vs `[...T]` is a real debugging scenario — diagnose it using the mental models from lessons 10 and 11.
