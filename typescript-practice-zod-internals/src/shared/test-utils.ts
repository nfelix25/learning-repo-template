/**
 * Type-Level Test Utilities
 *
 * These two types are the standard way to write type-level assertions in
 * TypeScript. Zod's own test suite uses this exact pattern — so does
 * type-fest, tsd, and most type-level testing libraries.
 *
 * ── How they work ────────────────────────────────────────────────────────────
 *
 * Expect<T extends true>
 * A type that only accepts `true` as its argument. If T resolves to `false`,
 * TypeScript reports: "Type 'false' does not satisfy the constraint 'true'."
 * That error IS the failed assertion — it appears inline at the type alias.
 *
 * Equal<X, Y>
 * Resolves to `true` if X and Y are the same type, `false` otherwise.
 *
 * Why not just `X extends Y & Y extends X`?
 * Bidirectional assignability fails on several cases that matter for our koans:
 *   - `any extends string` is true (any is assignable to everything)
 *     so Equal<any, string> would incorrectly return true
 *   - Some mapped type forms produce types that are assignable to each other
 *     but not actually the same type
 *
 * The function form used here:
 *
 *   (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
 *
 * works because TypeScript uses a special "isIdenticalTo" check (not the usual
 * "isAssignableTo") when comparing two *deferred* conditional types. A conditional
 * type is "deferred" when its checking type is a free type variable — here T is
 * free inside the function type. TypeScript only considers the two deferred forms
 * equal when X and Y are structurally identical, catching cases that plain
 * assignability misses.
 *
 * This correctly handles:
 *   Equal<any, string>              → false  (any ≠ string)
 *   Equal<never, string>            → false  (never ≠ string)
 *   Equal<string | number, number | string>  → true  (same union, order irrelevant)
 *   Equal<{ a: string }, { a: string }>      → true
 *
 * ── Self-verification ────────────────────────────────────────────────────────
 * These verify the utilities themselves at compile time. If any produce an
 * error, the test utilities are broken — fix them before working on koans.
 */

export type Expect<T extends true> = T
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// These must compile without error:
type _pass_01 = Expect<Equal<string, string>>
type _pass_02 = Expect<Equal<number, number>>
type _pass_03 = Expect<Equal<string | number, number | string>>
type _pass_04 = Expect<Equal<never, never>>
type _pass_05 = Expect<Equal<{ a: string; b: number }, { a: string; b: number }>>
