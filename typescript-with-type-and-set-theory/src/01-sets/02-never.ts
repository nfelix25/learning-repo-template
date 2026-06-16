import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 2 of 8: The empty set
// ═══════════════════════════════════════════════════════════════════════════
//
// In set theory, ∅ (the empty set) contains no elements.
// No value belongs to it.
//
// In type theory, this is called the BOTTOM TYPE, written ⊥.
// It is the type that has no inhabitants — no value can ever have this type.
//
// TypeScript calls it: never
//
// ───────────────────────────────────────────────────────────────────────────
// WHY IT EXISTS
// ───────────────────────────────────────────────────────────────────────────
//
// `never` appears naturally when TypeScript determines that something
// is impossible:
//
//   function throw_(): never {
//     throw new Error('always throws')
//   }
//
//   type ImpossibleIntersection = string & number  // → never
//   //   "cat" & "dog"                             // → never
//
// In each case TypeScript is saying: no value can satisfy this.
//
// ───────────────────────────────────────────────────────────────────────────
// EX FALSO QUODLIBET
// ───────────────────────────────────────────────────────────────────────────
//
// "From falsehood, anything follows." In logic, if you have a proof of ⊥
// (a contradiction), you can derive anything.
//
// TypeScript reflects this: a function that takes `never` can return
// anything — because it will never actually be called.
//
//   declare function absurd<T>(x: never): T
//
// This function is vacuously correct: since no value of type `never` exists,
// the body never runs. The promise is trivially kept.
//
// ───────────────────────────────────────────────────────────────────────────
// THE IDENTITY LAWS
// ───────────────────────────────────────────────────────────────────────────
//
// As the empty set, `never` obeys:
//
//   A ∪ ∅ = A      →   T | never  = T
//   A ∩ ∅ = ∅      →   T & never  = never
//
// These are the IDENTITY and ANNIHILATION laws for never.
// (never is the identity element for union; it annihilates intersection)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Fill in the TypeScript keyword for the bottom type / empty set.
type EmptySet = never;

type _test1 = Expect<Equal<EmptySet, never>>;

// 2. never is the identity element for union.
//    A ∪ ∅ = A  →  string | never = ?
type UnionWithNever = string | never;

type _test2 = Expect<Equal<UnionWithNever, string>>;

// 3. never annihilates intersection.
//    A ∩ ∅ = ∅  →  string & never = ?
type IntersectWithNever = string & never;

type _test3 = Expect<Equal<IntersectWithNever, never>>;

// 4. never is a subtype of everything.
//    ∅ ⊆ A for all A.
//    This means `never` is assignable to any type.
type NeverExtendsString = Extends<never, string>;
type NeverExtendsNumber = Extends<never, number>;
type NeverExtendsUnknown = Extends<never, unknown>;

type _test4a = Expect<Equal<NeverExtendsString, never>>;
//   ^ Hint: when you check `never extends X`, the result is also `never`,
//     not `true`. This is because TypeScript distributes `never` over the
//     conditional — and the union of zero branches is never.
//     This IS consistent with ∅ ⊆ A: the conditional type just reflects
//     it in a slightly surprising way.

// 5. Nothing (except never itself) is a subtype of never.
//    Only ∅ ⊆ ∅.
type StringExtendsNever = Extends<string, never>;

type _test5 = Expect<Equal<StringExtendsNever, false>>;

export {};
