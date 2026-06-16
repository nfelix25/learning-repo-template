// ═══════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
//
// These are the only tools you need to work through the koans.
//
// HOW KOANS WORK
// ──────────────
// Each koan has one or more blank type aliases:
//
//   type Answer = TODO  // ← replace TODO with your answer
//
// Below each blank are compile-time tests:
//
//   type _test1 = Expect<Equal<Answer, string>>
//
// If your answer is wrong, TypeScript will underline _test1 as an error.
// If your answer is right, the error disappears.
//
// Run `npm run check` (or `tsc --noEmit`) to see all errors at once.
// A clean run means all koans in that file are solved.
//
// ───────────────────────────────────────────────────────────────────────────

// Expect<T extends true>
// ──────────────────────
// Used to assert that a type-level boolean is true.
// If T is `false`, this line becomes a type error.
//
//   type _test = Expect<true>   // ✓ passes
//   type _test = Expect<false>  // ✗ error
export type Expect<T extends true> = T

// Equal<X, Y>
// ───────────
// Returns `true` if X and Y are exactly the same type, `false` otherwise.
//
// This uses a "deferred conditional" trick to handle the `any` edge case.
// The naive version (X extends Y ? Y extends X ? true : false : false)
// returns `true` for Equal<any, string> — which would give false positives
// on unfilled koans. This version correctly returns `false`.
//
//   Equal<string, string>   → true
//   Equal<string, number>   → false
//   Equal<any, string>      → false  (not `true` — any is not string)
//   Equal<never, never>     → true
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// NotEqual<X, Y>
// ──────────────
// The complement of Equal. Returns `true` if X and Y are different types.
export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true

// Extends<A, B>
// ─────────────
// Returns `true` if A is a subtype of B (A ⊆ B in set terms), `false` otherwise.
// Unlike Equal, this is directional: Extends<"cat", string> is true,
// but Extends<string, "cat"> is false.
//
// NOTE: When A is `any`, the result is `boolean` (non-deterministic),
// which is one of `any`'s pathological behaviors — a koan in module 02
// explores this.
export type Extends<A, B> = A extends B ? true : false

// TODO
// ────
// The placeholder for koan blanks. Replace it with your answer.
//
// It is typed as `any` so it is syntactically valid everywhere, but the
// strict Equal<> implementation means Equal<TODO, X> returns false for
// any X — so leaving a blank as TODO will always fail the tests.
//
//   type Answer = TODO        // ← your blank
//   type _test = Expect<Equal<Answer, string>>  // fails until you fill in string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO = any
