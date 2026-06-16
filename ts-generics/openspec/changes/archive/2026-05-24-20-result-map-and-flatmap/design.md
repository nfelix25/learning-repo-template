## Content manifest

### Outline

**Intro**: Once you have `Result<E, T>`, the temptation is to immediately unwrap it — `if (isOk(r)) { doSomething(r.value) }`. But chains of operations each returning Results produce deeply nested conditionals. `map` and `flatMap` let you compose operations on the happy path without unwrapping.

**Mechanic**:
- `map<U>(result: Result<E, T>, f: (value: T) => U): Result<E, U>`:
  - If `result` is `Ok`, apply `f` to the value and return `ok(f(value))`.
  - If `result` is `Err`, return it unchanged.
  - Key signature constraint: `E` stays the same; only `T` → `U` changes.
- `flatMap<F, U>(result: Result<E, T>, f: (value: T) => Result<F, U>): Result<E | F, U>`:
  - If `result` is `Ok`, apply `f` and return the new `Result`.
  - The error type widens to `E | F` because the new `Result` may fail with a different error type.
  - This is "monadic bind" — flattening a `Result<E, Result<F, U>>` into `Result<E | F, U>`.
- `mapErr<F>(result: Result<E, T>, f: (error: E) => F): Result<F, T>`:
  - If `result` is `Err`, transform the error; otherwise pass through.
  - Transforms the error channel without touching the value.
- Inference ergonomics: callbacks should have their argument types inferred from the `Result`'s `T` or `E`, not require explicit annotation.

**Worked example**: A pipeline: `parseInput(s)` → `Result<ParseError, RawData>`, then `map` to validate → `Result<ParseError, ValidatedData>`, then `flatMap` to save → `Result<ParseError | DbError, SavedRecord>`. Show that the error union accumulates correctly across the chain.

**Pitfalls**: Using `Result<E, T>` (the union) as the parameter type for `f` in `flatMap` causes E to be widened prematurely. The parameter should be `(value: T) => Result<F, U>` with a fresh `F` type variable. Using method style (`result.map(f)`) requires putting `map` on the `Ok` class — which changes the architecture from the functional style used here.

**Exercise**: Add `map`, `flatMap`, and `mapErr` to the result module. Write a multi-step pipeline that uses all three combinators and verify that error types accumulate correctly.

### Build piece role

Implement `map`, `flatMap`, and `mapErr` as standalone functions on the result module from lesson 19.
