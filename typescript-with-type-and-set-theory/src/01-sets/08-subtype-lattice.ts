import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 8 of 8: The subtype lattice
// ═══════════════════════════════════════════════════════════════════════════
//
// All TypeScript types form a LATTICE — a hierarchy ordered by the subtype
// relation (⊆ / extends). Here is a partial picture:
//
//
//                        unknown
//                           │
//          ┌────────────────┼────────────────┐
//          │                │                │
//        string           number          boolean        ...
//          │                │                │
//   ┌──────┴──────┐     ┌───┴───┐         ┌──┴──┐
//  "cat"        "dog"   0   1   2 ...   true   false
//          │                │                │
//          └────────────────┼────────────────┘
//                           │
//                         never
//
//
// Rules of the lattice:
//   • If A is below B (A ⊆ B), then A extends B.
//   • never is at the absolute bottom — it extends everything.
//   • unknown is at the absolute top — everything extends it.
//   • Primitives (string, number, boolean) sit between unknown and literals.
//   • Literal types ("cat", 42, true) are above never, below their primitive.
//
// ───────────────────────────────────────────────────────────────────────────
// LEAST UPPER BOUND & GREATEST LOWER BOUND
// ───────────────────────────────────────────────────────────────────────────
//
// In a lattice:
//   • The LEAST UPPER BOUND (join, ∨) of A and B is the smallest type that
//     is a supertype of both.  →  This is A | B.
//
//   • The GREATEST LOWER BOUND (meet, ∧) of A and B is the largest type
//     that is a subtype of both.  →  This is A & B.
//
//   LUB("cat", "dog")  = "cat" | "dog"   (smallest type containing both)
//   GLB(string, number) = string & number = never  (largest type in both — none)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Identify the position of `42` in the lattice.
//    What is the immediate supertype of `42`?
type ImmediateSupertype42 = number;

type _test1 = Expect<Equal<Extends<42, ImmediateSupertype42>, true>>;
type _test2 = Expect<Equal<Extends<ImmediateSupertype42, 42>, false>>;
//   There is one primitive type where both conditions hold.

// 2. What is the least upper bound of "cat" and "dog"?
//    (The smallest type that both literals are subtypes of)
type LUB_CatDog = "cat" | "dog";

type _test3 = Expect<Equal<LUB_CatDog, "cat" | "dog">>;

// 3. What is the greatest lower bound of string and string?
//    (The largest type that is a subtype of both)
type GLB_StringString = string;

type _test4 = Expect<Equal<GLB_StringString, string>>;

// 4. What is the greatest lower bound of string and number?
type GLB_StringNumber = never;

type _test5 = Expect<Equal<GLB_StringNumber, never>>;

// 5. true | false = boolean (the join of the two boolean literals is boolean)
type JoinBooleans = true | false;

type _test6 = Expect<Equal<JoinBooleans, boolean>>;
//   No blank — verify this passes and understand why.

// 6. unknown | T = unknown for any T (unknown is the top of the lattice)
type LatticeTop = unknown | string | number | boolean | null | undefined;

type _test7 = Expect<Equal<LatticeTop, unknown>>;

// 7. never & T = never for any T (never is the bottom of the lattice)
type LatticeBottom = never & string & number & boolean;

type _test8 = Expect<Equal<LatticeBottom, never>>;

// 8. Fill in the type that sits at the BOTTOM of the lattice.
type BottomType = never;

type _test9 = Expect<Equal<Extends<BottomType, string>, never>>;
type _test10 = Expect<Equal<Extends<BottomType, number>, never>>;
type _test11 = Expect<Equal<Extends<BottomType, unknown>, never>>;
//   All three use `never` because of how TypeScript handles `never extends X`.
//   The conceptual answer: there is exactly one bottom type.

export {};
