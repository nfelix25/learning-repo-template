import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 6 of 8: Intersection types (set intersection ∩)
// ═══════════════════════════════════════════════════════════════════════════
//
// The intersection of two sets A and B is the set of all values that
// belong to BOTH A and B simultaneously:
//
//   A ∩ B = { x | x ∈ A  and  x ∈ B }
//
// TypeScript spells this A & B.
//
// ───────────────────────────────────────────────────────────────────────────
// PRIMITIVE INTERSECTIONS
// ───────────────────────────────────────────────────────────────────────────
//
// For primitives, intersection usually produces `never` — there are very
// few values that are BOTH a string AND a number:
//
//   string & number  = never     (no value is both)
//   string & string  = string    (trivially — same set)
//   "cat" & string   = "cat"     ("cat" ⊆ string, so "cat" ∩ string = "cat")
//
// ───────────────────────────────────────────────────────────────────────────
// OBJECT INTERSECTIONS  ← THE IMPORTANT CASE
// ───────────────────────────────────────────────────────────────────────────
//
// For object types, & combines the constraints — a value must satisfy BOTH:
//
//   type HasName = { name: string }
//   type HasAge  = { age: number }
//
//   type Person = HasName & HasAge
//   // = { name: string; age: number }
//
// Wait — isn't intersection supposed to produce a SMALLER set?
// It does! But we're intersecting the CONSTRAINTS, not the properties.
//
// Think of it this way:
//   - HasName = { all objects with a name property }   (huge set of values)
//   - HasAge  = { all objects with an age property }   (huge set of values)
//   - HasName & HasAge = { objects with BOTH }         (smaller set of values)
//
// The resulting set has MORE required properties but FEWER matching values.
// This is the same principle as narrowing via &&:
//   if (isUser && isAdmin) — the intersection of two conditions restricts further.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Incompatible primitives intersect to never.
type StringAndNumber = string & number;

type _test1 = Expect<Equal<StringAndNumber, never>>;

// 2. A literal intersected with its primitive gives back the literal.
//    "cat" ∩ string = "cat"  (the singleton is the smaller set)
type CatAndString = "cat" & string;

type _test2 = Expect<Equal<CatAndString, "cat">>;

// 3. Object intersection combines constraints.
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;

const x: Person = { name: "noel", age: 42 };

type _test3 = Expect<Equal<Person, typeof x>>;
//   Fill in the merged object type.

// 4. Intersection with unknown gives back the original type.
//    A ∩ 𝕌 = A
type StringAndUnknown = string & unknown;

type _test4 = Expect<Equal<StringAndUnknown, string>>;

// 5. Intersection with never gives never.
//    A ∩ ∅ = ∅
type StringAndNever = string & never;

type _test5 = Expect<Equal<StringAndNever, never>>;

// 6. INTERFACE MERGING vs INTERSECTION
//    These two look similar but behave differently when properties conflict:
//
//    With &, conflicting property types intersect (often → never):
type Conflicting = { id: string } & { id: number };
type IdType = Conflicting["id"];

type _test6 = Expect<Equal<IdType, never>>;
//   What happens to `id` when its type is string & number?

export {};
