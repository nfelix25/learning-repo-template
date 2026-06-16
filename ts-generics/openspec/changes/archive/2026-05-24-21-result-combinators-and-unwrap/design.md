## Content manifest

### Outline

**Intro**: `Result` values don't stay in the `Result` world forever. At some point you need to produce a concrete value from them — and the API you provide for this determines whether callers handle errors thoughtfully or reach for the escape hatch too often.

**Mechanic**:
- `fold<E, T, U>(result: Result<E, T>, onErr: (e: E) => U, onOk: (t: T) => U): U`:
  - Exhaustive pattern match — both branches must return the same type `U`.
  - Argument order: error handler first, value handler second (matches the `Result<E, T>` type parameter order).
- `unwrapOr<E, T>(result: Result<E, T>, fallback: T): T`:
  - Returns `value` if `Ok`, `fallback` if `Err`.
  - The fallback must be the same type as the success value.
- `unwrapOrElse<E, T>(result: Result<E, T>, fallback: (e: E) => T): T`:
  - Like `unwrapOr` but the fallback is computed lazily — useful when the default is expensive or needs to inspect the error.
- `getOrThrow<E, T>(result: Result<E, T>): T`:
  - Returns `value` if `Ok`, throws the error if `Err`.
  - Use only at explicit boundary points (e.g., top-level request handlers) — not in library code.
- Narrowing: after `if (result._tag === "Ok")`, TypeScript narrows without a type predicate; `fold` forces exhaustiveness without manual narrowing.

**Worked example**: A `renderPage` function that calls `fetchData()` (returns `Result`) and uses `fold` to render either an error page or a data page. Show `unwrapOr` for a simpler cache fallback scenario. Show `getOrThrow` in a test setup where failure is a programming error.

**Pitfalls**: Using `getOrThrow` in library code couples the caller to your exception type — prefer `fold` or `unwrapOrElse` in shared code. `unwrapOr` requires the fallback to match `T` exactly — if `T` is `string` and you pass `null` as the fallback, TypeScript rejects it.

**Exercise**: Add `fold`, `unwrapOr`, `unwrapOrElse`, and `getOrThrow` to the result module. Write a function that uses `fold` to convert `Result<ApiError, User>` into an HTTP response object.

### Build piece role

Add unwrapping and folding combinators, completing the core `Result` API.
