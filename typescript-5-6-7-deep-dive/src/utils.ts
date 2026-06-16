// ═══════════════════════════════════════════════════════════════════════════
// Type-Level Test Utilities
// ─────────────────────────────────────────────────────────────────────────
// These are the building blocks for every koan in this repo.
//
// HOW TO USE:
//   type _check = Expect<Equal<YourType, ExpectedType>>
//
//   If the types match  → compiles clean  → exercise passes
//   If types differ     → type error      → exercise still needs work
//
// No runtime values are exported. `tsc --noEmit` is the test runner.
// ═══════════════════════════════════════════════════════════════════════════

// Asserts that T is `true`. A compile error means the assertion failed.
export type Expect<T extends true> = T

// True if X and Y are the same type (including handling `any` correctly).
// Uses the "invariant function trick" from type-challenges.
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// True if X and Y are different types.
export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true

// True if T is `any`. Useful for asserting a type is NOT any.
export type IsAny<T> = 0 extends (1 & T) ? true : false

// True if T is NOT `any`.
export type NotAny<T> = IsAny<T> extends true ? false : true

// True if T extends U — use when Equal is too strict.
export type Extends<T, U> = T extends U ? true : false
