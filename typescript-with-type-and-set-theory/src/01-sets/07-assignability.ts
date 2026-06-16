import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 7 of 8: Assignability as the subset relation (extends)
// ═══════════════════════════════════════════════════════════════════════════
//
// TypeScript's keyword `extends` means "is a subtype of", which in set
// terms means "is a subset of":
//
//   A extends B   ⟺   A ⊆ B   ⟺   every value in A is also in B
//
// So:
//   42 extends number     ✓    { 42 } ⊆ { all numbers }
//   "cat" extends string  ✓    { "cat" } ⊆ { all strings }
//   never extends string  ✓    ∅ ⊆ { all strings }  (vacuously true)
//   string extends never  ✗    { all strings } ⊆ ∅  (impossible)
//
// ───────────────────────────────────────────────────────────────────────────
// THE COUNTERINTUITIVE OBJECT CASE
// ───────────────────────────────────────────────────────────────────────────
//
// This surprises almost everyone the first time:
//
//   { name: string; age: number } extends { name: string }  →  TRUE
//
// How? The type with MORE properties is a SUBTYPE (subset) of the one
// with fewer properties?
//
// Yes. Remember: types are SETS OF VALUES, not sets of properties.
//
//   { name: string }         = { all objects that have a name property }
//   { name: string; age: number } = { all objects that have name AND age }
//
// The second set is SMALLER (more restrictive) — it only includes objects
// that meet BOTH requirements. A smaller, more restrictive set is a SUBSET.
//
//   Think of it this way: if I give you an object that has name+age,
//   you can certainly use it wherever { name: string } is expected.
//   The extra `age` property doesn't hurt — it just isn't required.
//
// More fields = more constraints = fewer matching values = smaller set = subtype.
//
//             { name: string }          ← bigger set (less restrictive)
//                    ↑ ⊇
//         { name: string; age: number } ← smaller set (more restrictive)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Literal extends its primitive.
type LiteralExtendsString = Extends<"cat", string>;

type _test1 = Expect<Equal<LiteralExtendsString, true>>;

// 2. Primitive does NOT extend its literal.
type StringExtendsCat = Extends<string, "cat">;

type _test2 = Expect<Equal<StringExtendsCat, false>>;

// 3. More-specific object extends less-specific object.
type NameAndAge = { name: string; age: number };
type NameOnly = { name: string };

type MoreSpecificExtendsLess = Extends<NameAndAge, NameOnly>;

type _test3 = Expect<Equal<MoreSpecificExtendsLess, true>>;

// 4. The reverse does NOT hold.
type LessExtendsMore = Extends<NameOnly, NameAndAge>;

type _test4 = Expect<Equal<LessExtendsMore, false>>;

// 5. STRUCTURAL TYPING: TypeScript cares about SHAPE, not NAMES.
//    Two separately defined types with the same structure are compatible.
type Point2D = { x: number; y: number };
type Vector = { x: number; y: number };

type PointExtendsVector = Extends<Point2D, Vector>;

type _test5 = Expect<Equal<PointExtendsVector, true>>;
//   This is structural (duck) typing. Other languages (Java, C#) use
//   nominal typing — even identical shapes need explicit declarations.

// 6. What type can you assign TO anything? (The universal subtype)
type CanAssignToAnything = never;

type _test6a = Expect<Equal<Extends<CanAssignToAnything, string>, never>>;
type _test6b = Expect<Equal<Extends<CanAssignToAnything, number>, never>>;
type _test6c = Expect<Equal<Extends<CanAssignToAnything, boolean>, never>>;
//   Recall: `never extends X` distributes to `never` in TypeScript's system.
//   This is still the right answer — it's the only type that's a subtype of everything.

// 7. What type can you assign anything FROM? (The universal supertype)
type CanReceiveAnything = unknown;

type _test7a = Expect<Equal<Extends<string, CanReceiveAnything>, true>>;
type _test7b = Expect<Equal<Extends<number, CanReceiveAnything>, true>>;
type _test7c = Expect<Equal<Extends<boolean, CanReceiveAnything>, true>>;

export {};
