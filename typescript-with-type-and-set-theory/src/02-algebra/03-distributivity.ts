import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 3 of 7: Distributivity
// ═══════════════════════════════════════════════════════════════════════════
//
// Boolean algebra's distributive law translates directly to TypeScript types:
//
//   A & (B | C) = (A & B) | (A & C)      ∩ distributes over ∪
//   A | (B & C) = (A | B) & (A | C)      ∪ distributes over ∩
//
// These are genuine equalities — both sides of each law describe
// exactly the same set of values.
//
// ───────────────────────────────────────────────────────────────────────────
// WORKED EXAMPLE
// ───────────────────────────────────────────────────────────────────────────
//
//   Suppose A = string, B = number, C = boolean
//
//   A & (B | C) = string & (number | boolean)
//              = (string & number) | (string & boolean)
//              = never | never
//              = never
//
//   (makes sense — a value can't be BOTH a string AND (a number or boolean))
//
//   Now with object types, where & is more interesting:
//
//   { a: string } & ({ b: number } | { c: boolean })
//   = ({ a: string } & { b: number }) | ({ a: string } & { c: boolean })
//   = { a: string; b: number } | { a: string; c: boolean }
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Distribute & over | (primitive case — simplifies to never)
type Dist1 = string & (number | boolean);
type Dist1Expanded = (string & number) | (string & boolean);

type _test1 = Expect<Equal<Dist1, Dist1Expanded>>; // both sides equal — no blank
type _test2 = Expect<Equal<Dist1, never>>; // what does it simplify to?

// 2. Distribute & over | (object case — more interesting)
type Dist2 = { a: string } & ({ b: number } | { c: boolean });

type _test3 = Expect<
  Equal<
    Dist2,
    ({ a: string } & { b: number }) | ({ a: string } & { c: boolean })
  >
>;
//   Fill in the distributed (expanded) form.
//   Hint: apply A & (B | C) = (A & B) | (A & C)

// 3. Distribute | over & (the dual law)
type Dist3 = "cat" | ("dog" & string);

type _test4 = Expect<Equal<Dist3, ("cat" | "dog") & ("cat" | string)>>;
//   'dog' & string = 'dog', so what's the simplified result?

// 4. Absorption law (follows from distributivity)
//    A | (A & B) = A   (the union absorbs the intersection)
type Absorb1 = string | (string & number);

type _test5 = Expect<Equal<Absorb1, string>>;

// 5. Absorption law (dual)
//    A & (A | B) = A
type Absorb2 = string & (string | number);

type _test6 = Expect<Equal<Absorb2, string>>;

// 6. CHALLENGE: Expand and simplify.
//    ({ x: number } | { y: string }) & { z: boolean }
type Challenge = ({ x: number } | { y: string }) & { z: boolean };

type _test7 = Expect<
  Equal<
    Challenge,
    ({ z: boolean } & { x: number }) | ({ z: boolean } & { y: string })
  >
>;
//   Apply B | C) & A = (B & A) | (C & A), then simplify each branch.

export {};
