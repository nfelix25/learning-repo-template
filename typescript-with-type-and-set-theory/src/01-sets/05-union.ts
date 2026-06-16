import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 5 of 8: Union types (set union ∪)
// ═══════════════════════════════════════════════════════════════════════════
//
// The union of two sets A and B is the set of all values that belong
// to A, or to B, or to both:
//
//   A ∪ B = { x | x ∈ A  or  x ∈ B }
//
// TypeScript spells this A | B.
//
//   type Pets = "cat" | "dog"
//   // = { "cat" } ∪ { "dog" } = { "cat", "dog" }
//
//   type NumberOrString = number | string
//   // = (all numbers) ∪ (all strings)
//
// A VALUE of union type belongs to at least one of the member types.
//
// ───────────────────────────────────────────────────────────────────────────
// PROPERTIES OF UNION
// ───────────────────────────────────────────────────────────────────────────
//
//   IDEMPOTENT:    A ∪ A = A         ("cat" | "cat" = "cat")
//   COMMUTATIVE:   A ∪ B = B ∪ A
//   ASSOCIATIVE:   (A ∪ B) ∪ C = A ∪ (B ∪ C)
//   IDENTITY:      A ∪ ∅ = A         (T | never = T)
//   ABSORPTION:    A ∪ 𝕌 = 𝕌         (T | unknown = unknown)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. The union of {"cat"} and {"dog"} is {"cat", "dog"}.
type Pets = "cat" | "dog";
type WildAnimals = "fox" | "wolf";
type AllAnimals = Pets | WildAnimals;

type _test1 = Expect<Equal<AllAnimals, "cat" | "dog" | "fox" | "wolf">>;
//   Fill in the full union type.

// 2. Union is idempotent — duplicates are collapsed.
type Deduplicated = "a" | "b" | "a" | "c" | "b";

type _test2 = Expect<Equal<Deduplicated, "a" | "b" | "c">>;

// 3. Order doesn't matter (commutative).
type OrderA = "x" | "y" | "z";
type OrderB = "z" | "x" | "y";

type _test3 = Expect<Equal<OrderA, OrderB>>;
//   This test has no TODO — it's already correct. Verify it passes
//   and understand why TypeScript considers these equal.

// 4. Union with never gives back the original type (identity law).
type WithNever = string | never;

type _test4 = Expect<Equal<WithNever, string>>;

// 5. DISCRIMINATED UNIONS
//    When union members share a common literal property ("discriminant"),
//    TypeScript can narrow precisely to the right branch.
//
//    This is the idiomatic TypeScript pattern for algebraic data types.
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // Here TypeScript knows shape is { kind: 'circle'; radius: number }
      return Math.PI * shape.radius ** 2;
    case "rect":
      // Here TypeScript knows shape is { kind: 'rect'; width: number; height: number }
      return shape.width * shape.height;
  }
}

// 6. What is the type of `shape.kind` before any narrowing?
type ShapeKind = Shape["kind"];

type _test6 = Expect<Equal<ShapeKind, "circle" | "rect">>;
//   Hint: It's the union of all the discriminant values.

export { area };
