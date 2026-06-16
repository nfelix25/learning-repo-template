import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 4 of 8: Literal types as singleton sets
// ═══════════════════════════════════════════════════════════════════════════
//
// A LITERAL TYPE is a type whose set has exactly one member.
//
//   type Cat  = "cat"   // the set { "cat" }
//   type Life = 42      // the set { 42 }
//   type Yes  = true    // the set { true }
//
// Because they are single-member sets, literal types are subtypes of
// their corresponding primitive types:
//
//   "cat" ⊆ string    →    "cat" extends string
//   42    ⊆ number    →    42 extends number
//   true  ⊆ boolean   →    true extends boolean
//
// ───────────────────────────────────────────────────────────────────────────
// TYPE WIDENING
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript widens literal types to their primitives in certain contexts,
// because a `let` variable could be reassigned to any value of that type:
//
//   const a = "cat"    // type: "cat"   (can't be reassigned)
//   let   b = "cat"    // type: string  (could become "dog" later)
//
// `as const` suppresses widening:
//
//   let c = "cat" as const   // type: "cat"
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. What is the type of this const declaration?
//    (TypeScript infers it from the value — no widening for const)
const species = "cat";
type SpeciesType = typeof species;

type _test1 = Expect<Equal<SpeciesType, "cat">>;
//   Replace TODO with the inferred literal type.

// 2. A literal type IS a subtype of its primitive.
//    Fill in true or false:
type CatExtendsString = Extends<"cat", string>;

type _test2 = Expect<Equal<CatExtendsString, true>>;

// 3. But a primitive is NOT a subtype of a specific literal.
//    (The set of all strings is NOT a subset of the set {"cat"})
type StringExtendsCat = Extends<string, "cat">;

type _test3 = Expect<Equal<StringExtendsCat, false>>;

// 4. boolean is exactly the union of its two literal types.
//    Fill in the union that equals boolean:
type BooleanAsUnion = true | false;

type _test4 = Expect<Equal<BooleanAsUnion, boolean>>;

// 5. Template literal types create computed literal types.
//    What is the result of this?
type Greeting = `hello ${"world" | "TypeScript"}`;

type _test5 = Expect<Equal<Greeting, "hello world" | "hello TypeScript">>;
//   Hint: TypeScript distributes over the union inside the template.

// 6. `as const` on an object creates a fully literal type.
const point = { x: 3, y: 4 } as const;
type PointType = typeof point;

type _test6 = Expect<Equal<PointType, { readonly x: 3; readonly y: 4 }>>;
//   Hint: Every property becomes readonly and its value becomes a literal type.

export {};
