## Content manifest

### Outline

**Intro**: Most TypeScript codebases use exceptions for error handling, which works but loses information — callers can't tell from a function's type signature which errors it might produce. `Result<E, T>` encodes success and failure in the return type, making errors visible and compiler-checked. The design decision: a discriminated union rather than a class hierarchy.

**Mechanic**:
- Core type definition:
  ```
  type Ok<T> = { readonly _tag: "Ok"; readonly value: T }
  type Err<E> = { readonly _tag: "Err"; readonly error: E }
  type Result<E, T> = Ok<T> | Err<E>
  ```
- Constructor functions: `ok<T>(value: T): Ok<T>` and `err<E>(error: E): Err<E>` — return specific subtypes, not the union, so TypeScript preserves narrowing.
- Discriminant narrowing: `if (result._tag === "Ok") { result.value }` — TypeScript narrows automatically.
- API surface decisions:
  - Convention: `Result<E, T>` with error first (matches Rust, functional convention) vs `Result<T, E>` with value first — the lesson uses error-first.
  - Readonly: using `readonly` on all fields prevents accidental mutation.
  - Why not a class: instance methods would require a different calling convention and make the type harder to compose.
- Variance: `Result<E, T>` is covariant in both `E` and `T` (both appear in output/property positions only). `Result<Error, Dog>` is assignable to `Result<Error, Animal>`.
- When to use exceptions instead: for unrecoverable errors (programming bugs, invariant violations), exceptions remain appropriate — `Result` is for expected failure modes.

**Worked example**: Design and implement `Ok<T>`, `Err<E>`, `Result<E, T>`, `ok()` and `err()` factory functions, and a `isOk`/`isErr` type predicate pair. Write a `divide` function that returns `Result<"division-by-zero", number>`.

**Pitfalls**: Returning `Result<E, T>` (the union) from factory functions loses the specific subtype — return `Ok<T>` and `Err<E>` directly from `ok()` and `err()`. The discriminant field name must be consistent — use `_tag` or `kind` throughout, not a mix.

**Exercise**: Implement the full `Result<E, T>` module: types, factories, and type predicates. Write three functions that return Results and compose them in a chain that propagates the error type.

### Build piece role

Design and scaffold the `Result<E, T>` type and its core discriminated union structure. Establish the module interface before implementing any combinators.
