import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 7 of 7: The any anomaly
// ═══════════════════════════════════════════════════════════════════════════
//
// `any` cannot be placed anywhere in the subtype lattice.
// It is simultaneously a subtype AND a supertype of everything.
// This is logically impossible for a set — no set is both ⊆ and ⊇ of
// every other set (except in a degenerate single-element universe).
//
// `any` is not a type in the mathematical sense. It is a DELIBERATE ESCAPE
// HATCH that suspends the type checker entirely.
//
//   string extends any   → true   (any is like the universal set)
//   any extends string   → true   (any is like the empty set, too)
//
// The second one is the anomaly. No honest type can satisfy both.
//
// ───────────────────────────────────────────────────────────────────────────
// WHAT HAPPENS IN CONDITIONALS
// ───────────────────────────────────────────────────────────────────────────
//
// When `any` appears as the type being tested in a conditional:
//
//   type Test<T> = T extends string ? 'yes' : 'no'
//   type R = Test<any>   // → 'yes' | 'no'  (both branches!)
//
// TypeScript evaluates BOTH branches and unions them, because `any` could
// be either a subtype or not a subtype of string.
//
// This is why `Extends<any, string>` returns `boolean` (= true | false),
// not `true` or `false`.
//
// ───────────────────────────────────────────────────────────────────────────
// WHY THE STRICT Equal<> MATTERS
// ───────────────────────────────────────────────────────────────────────────
//
// The naive Equal<A, B> = A extends B ? B extends A ? true : false : false
// would say Equal<any, string> = true.
//
// Why? Because `any extends string` is true (any is weirdly a subtype of
// everything), and `string extends any` is also true.
//
// But `any` is NOT string — it's a type-system escape hatch.
// Our strict Equal (the "deferred conditional" version) correctly returns false.
// That's why unresolved TODO blanks always fail their test.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. `string` extends `any` — any is a "supertype" of everything.
type StringExtendsAny = Extends<string, any>;

type _test1 = Expect<Equal<StringExtendsAny, true>>;

// 2. `any` extends `string` — any is also a "subtype" of everything.
//    Result is boolean because TypeScript gives both answers simultaneously.
type AnyExtendsString = Extends<any, string>;

type _test2 = Expect<Equal<AnyExtendsString, true | false>>;
//   Hint: the result is the union of both conditional branches.

// 3. `any` is equal to itself (trivially).
type AnyEqualsAny = Equal<any, any>;

type _test3 = Expect<Equal<AnyEqualsAny, true>>;

// 4. But `any` is NOT equal to other types under our strict Equal.
type AnyEqualsString = Equal<any, string>;
type AnyEqualsUnknown = Equal<any, unknown>;

type _test4 = Expect<Equal<AnyEqualsString, false>>;
type _test5 = Expect<Equal<AnyEqualsUnknown, false>>;

// 5. The practical danger: `any` silently infects.
//    An `any` in a position poisons the whole expression.
declare const dangerous: any;
// dangerous.nonExistent.deeply.nested  // no error — `any` turns off checks

// 6. `unknown` is the HONEST version of `any`.
//    You can still receive any value (everything extends unknown),
//    but you must narrow before use (unknown doesn't extend arbitrary types).
//
//    Choose unknown over any whenever possible.
//
//    Comparison:
//      any:     bypass type checking entirely
//      unknown: receive anything safely, but force explicit narrowing

type UnknownExtendsString = Extends<unknown, string>;
type StringExtendsUnknown = Extends<string, unknown>;

type _test6 = Expect<Equal<UnknownExtendsString, false>>;
type _test7 = Expect<Equal<StringExtendsUnknown, true>>;

export {};
