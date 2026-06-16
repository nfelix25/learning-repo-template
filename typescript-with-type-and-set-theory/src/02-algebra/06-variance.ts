import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 6 of 7: Variance — covariance and contravariance
// ═══════════════════════════════════════════════════════════════════════════
//
// VARIANCE describes how subtype relationships propagate through type
// constructors like functions, arrays, and containers.
//
// Given: Dog extends Animal   (Dog ⊆ Animal)
//
//   COVARIANT:     F<Dog> extends F<Animal>     (relationship preserved)
//   CONTRAVARIANT: F<Animal> extends F<Dog>     (relationship reversed)
//   INVARIANT:     neither holds
//
// ───────────────────────────────────────────────────────────────────────────
// FUNCTION RETURN TYPES: COVARIANT
// ───────────────────────────────────────────────────────────────────────────
//
//   If Dog extends Animal, then (() => Dog) extends (() => Animal).
//
//   Intuition: wherever a function returning Animal is expected, a function
//   returning Dog can be used — you'll get back a Dog, which IS an Animal.
//   The subtype relationship is PRESERVED.
//
//   () => Dog   ⊆   () => Animal       (covariant position)
//
// ───────────────────────────────────────────────────────────────────────────
// FUNCTION PARAMETER TYPES: CONTRAVARIANT
// ───────────────────────────────────────────────────────────────────────────
//
//   If Dog extends Animal, then ((x: Animal) => void) extends ((x: Dog) => void).
//
//   This feels backwards! But it's correct:
//
//   Suppose we need a function that handles a Dog.
//   A function that handles ANY Animal certainly handles a Dog.
//   But a function that ONLY handles Dogs cannot handle all Animals.
//
//   (x: Animal) => void   ⊆   (x: Dog) => void     (contravariant position)
//
//   The subtype relationship is REVERSED for parameter types.
//
// ───────────────────────────────────────────────────────────────────────────
//                 Input     Output
//   ──────────────────────────────────────
//   Variance:   contra     co
//   Direction:  reversed   preserved
//   ──────────────────────────────────────
//   (input position "flips" the variance)
// ───────────────────────────────────────────────────────────────────────────

type Animal = { species: string };
type Dog = { species: string; breed: string };
// Dog extends Animal (more fields = subtype)

// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. COVARIANT: return type subtyping preserves direction.
//    (() => Dog) extends (() => Animal) ?
type ReturnCovariance = Extends<() => Dog, () => Animal>;

type _test1 = Expect<Equal<ReturnCovariance, true>>;

// 2. And the reverse: (() => Animal) extends (() => Dog) ?
type ReturnConverseCovariance = Extends<() => Animal, () => Dog>;

type _test2 = Expect<Equal<ReturnConverseCovariance, false>>;

// 3. CONTRAVARIANT: parameter type subtyping reverses direction.
//    ((x: Animal) => void) extends ((x: Dog) => void) ?
type ParamContravariance = Extends<(x: Animal) => void, (x: Dog) => void>;

type _test3 = Expect<Equal<ParamContravariance, true>>;

// 4. And the reverse: ((x: Dog) => void) extends ((x: Animal) => void) ?
type ParamConverseContravariance = Extends<
  (x: Dog) => void,
  (x: Animal) => void
>;

type _test4 = Expect<Equal<ParamConverseContravariance, false>>;

// 5. COMBINING: return covariance + parameter contravariance.
//    ((x: Animal) => Dog) extends ((x: Dog) => Animal) ?
//    Return: Dog extends Animal ✓ (covariant — same direction)
//    Param:  Animal vs Dog — (x: Animal) handles more than (x: Dog) ✓ (contravariant — reversed)
type Combined = Extends<(x: Animal) => Dog, (x: Dog) => Animal>;

type _test5 = Expect<Equal<Combined, true>>;

// 6. ARRAYS are covariant in TypeScript (strictly: they should be invariant).
//    This is a deliberate pragmatic choice — makes arrays easier to use
//    but can cause runtime errors if you actually mutate through the wider type.
type ArrayCovariance = Extends<Dog[], Animal[]>;

type _test6 = Expect<Equal<ArrayCovariance, true>>;

// 7. READONLY arrays are safely covariant (no mutation → no unsoundness).
type ReadonlyArrayCovariance = Extends<readonly Dog[], readonly Animal[]>;

type _test7 = Expect<Equal<ReadonlyArrayCovariance, true>>;

export {};
