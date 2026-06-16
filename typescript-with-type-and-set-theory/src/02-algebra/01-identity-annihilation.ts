import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 1 of 7: Identity and annihilation laws
// ═══════════════════════════════════════════════════════════════════════════
//
// TypeScript's type algebra obeys the same laws as Boolean algebra and
// set theory. These are provable facts, not rules to memorize:
//
//   IDENTITY LAWS
//   ─────────────
//   T | never   = T       ∅ is the identity for ∪ (adding nothing changes nothing)
//   T & unknown = T       𝕌 is the identity for ∩ (intersecting with everything changes nothing)
//
//   ANNIHILATION LAWS
//   ─────────────────
//   T | unknown = unknown  𝕌 absorbs union   (adding everything gives everything)
//   T & never   = never    ∅ absorbs intersection (intersecting with nothing gives nothing)
//
// Together these four laws describe the BOUNDARY BEHAVIOR of the type lattice.
// never and unknown are not just keywords — they're the algebraic ZERO and ONE
// for the two type operators.
//
//   Operator   Identity   Annihilator
//   ────────   ────────   ───────────
//      |        never      unknown
//      &       unknown      never
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS — prove each law by filling in the simplified type
// ───────────────────────────────────────────────────────────────────────────

// IDENTITY LAWS

// 1. T | never = T
type UnionIdentity1 = string | never;
type UnionIdentity2 = number | never;
type UnionIdentity3 = (string | number) | never;

type _test1 = Expect<Equal<UnionIdentity1, string>>;
type _test2 = Expect<Equal<UnionIdentity2, number>>;
type _test3 = Expect<Equal<UnionIdentity3, string | number>>;

// 2. T & unknown = T
type IntersectIdentity1 = string & unknown;
type IntersectIdentity2 = number & unknown;
type IntersectIdentity3 = (string | number) & unknown;

type _test4 = Expect<Equal<IntersectIdentity1, string>>;
type _test5 = Expect<Equal<IntersectIdentity2, number>>;
type _test6 = Expect<Equal<IntersectIdentity3, string | number>>;

// ANNIHILATION LAWS

// 3. T | unknown = unknown
type UnionAnnihilate1 = string | unknown;
type UnionAnnihilate2 = never | unknown;
type UnionAnnihilate3 = (string & number) | unknown;

type _test7 = Expect<Equal<UnionAnnihilate1, unknown>>;
type _test8 = Expect<Equal<UnionAnnihilate2, unknown>>;
type _test9 = Expect<Equal<UnionAnnihilate3, unknown>>;

// 4. T & never = never
type IntersectAnnihilate1 = string & never;
type IntersectAnnihilate2 = unknown & never;
type IntersectAnnihilate3 = (string | number) & never;

type _test10 = Expect<Equal<IntersectAnnihilate1, never>>;
type _test11 = Expect<Equal<IntersectAnnihilate2, never>>;
type _test12 = Expect<Equal<IntersectAnnihilate3, never>>;

export {};
