import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 3 of 8: The universal set
// ═══════════════════════════════════════════════════════════════════════════
//
// In set theory, 𝕌 (the universal set) contains everything.
// Every value belongs to it.
//
// In type theory, this is the TOP TYPE, written ⊤.
// Every value has this type. It is the safest type to receive a value as,
// because you're making no promises about what the value is.
//
// TypeScript calls it: unknown
//
// ───────────────────────────────────────────────────────────────────────────
// unknown vs any
// ───────────────────────────────────────────────────────────────────────────
//
// Both `unknown` and `any` can hold any value. Their difference is about
// what you can DO with the value:
//
//   unknown x:  You cannot use x until you NARROW it.
//               TypeScript forces you to check what it is first.
//
//   any x:      You can do anything with x, no questions asked.
//               TypeScript turns off its checks entirely.
//
// `unknown` is the honest top type. `any` is an escape hatch that
// breaks the type system. We'll explore `any` properly in module 02.
//
//   function processUnknown(x: unknown) {
//     x.toUpperCase()  // ✗ ERROR — must narrow first
//     if (typeof x === 'string') {
//       x.toUpperCase()  // ✓ OK — now TypeScript knows x is string
//     }
//   }
//
// ───────────────────────────────────────────────────────────────────────────
// THE IDENTITY LAWS (dual to never)
// ───────────────────────────────────────────────────────────────────────────
//
// As the universal set, `unknown` obeys:
//
//   A ∪ 𝕌 = 𝕌      →   T | unknown  = unknown   (absorption)
//   A ∩ 𝕌 = A      →   T & unknown  = T         (identity)
//
// These are the DUAL of never's laws:
//   - unknown is the identity element for intersection
//   - unknown absorbs (annihilates) union
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Fill in the TypeScript keyword for the top type / universal set.
type UniversalSet = unknown;

type _test1 = Expect<Equal<UniversalSet, unknown>>;

// 2. unknown absorbs union.
//    A ∪ 𝕌 = 𝕌  →  string | unknown = ?
type UnionWithUnknown = string | unknown;

type _test2 = Expect<Equal<UnionWithUnknown, unknown>>;

// 3. unknown is the identity for intersection.
//    A ∩ 𝕌 = A  →  string & unknown = ?
type IntersectWithUnknown = string & unknown;

type _test3 = Expect<Equal<IntersectWithUnknown, string>>;

// 4. Everything extends unknown.
//    A ⊆ 𝕌 for all A — every type is a subtype of the universal set.
type StringExtendsUnknown = Extends<string, unknown>;
type NeverExtendsUnknown = Extends<never, unknown>;
type NumberExtendsUnknown = Extends<number, unknown>;

type _test4a = Expect<Equal<StringExtendsUnknown, true>>;
type _test4b = Expect<Equal<NeverExtendsUnknown, never>>;
//   ^ Recall from koan 02: `never extends X` distributes to `never`, not `true`.
//     This is TypeScript's quirk, not a violation of the math.
type _test4c = Expect<Equal<NumberExtendsUnknown, true>>;

// 5. unknown does NOT extend arbitrary types.
//    𝕌 ⊆ A only if A = 𝕌.
type UnknownExtendsString = Extends<unknown, string>;
type UnknownExtendsUnknown = Extends<unknown, unknown>;

type _test5a = Expect<Equal<UnknownExtendsString, false>>;
type _test5b = Expect<Equal<UnknownExtendsUnknown, true>>;

// 6. The set picture so far:
//
//            unknown  (𝕌 — everything)
//               │
//         ┌─────┴──────┐
//       string       number    ...all types...
//         │
//       "cat"   "dog"   ...literal types...
//         │
//           never   (∅ — nothing)
//
// Every type lives somewhere in this lattice.
// `never` is at the very bottom; `unknown` at the very top.
// We'll draw the complete lattice in koan 08.

export {};
