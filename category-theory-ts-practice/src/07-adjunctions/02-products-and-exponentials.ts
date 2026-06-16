/**
 * PRODUCTS AND EXPONENTIALS (TYPE-LEVEL)
 * ═══════════════════════════════════════
 *
 * The curry adjunction lives at the type level too.
 * Given types A, B, C:
 *
 *   Curry<(a: A, b: B) => C>   =  (a: A) => (b: B) => C
 *   Uncurry<(a: A) => (b: B) => C>  =  (a: A, b: B) => C
 *
 * These are type-level operators — they transform function types.
 * They witness the adjunction: Hom(A × B, C) ≅ Hom(A, Hom(B, C)).
 *
 * In CT language, the function type B → C is the "exponential" C^B.
 * The isomorphism A × B → C ≅ A → C^B is the defining property of
 * exponential objects in a cartesian closed category.
 */

import { Expect, Equal, TODO } from '../utils'

// ─── Type-level Curry ─────────────────────────────────────────────────────────

// Exercise 1: Implement the type-level Curry operator.
// Curry<(a: A, b: B) => C> should equal (a: A) => (b: B) => C.
// Hint: use conditional type inference (`infer`) to extract A, B, C.
type Curry<F> = TODO

type _1 = Expect<Equal<Curry<(a: string, b: number) => boolean>, (a: string) => (b: number) => boolean>>
type _2 = Expect<Equal<Curry<(a: number, b: number) => number>,  (a: number) => (b: number) => number>>
type _3 = Expect<Equal<Curry<(a: never, b: unknown) => string>,  (a: never) => (b: unknown) => string>>

// ─── Type-level Uncurry ───────────────────────────────────────────────────────

// Exercise 2: Implement the type-level Uncurry operator.
// Uncurry<(a: A) => (b: B) => C> should equal (a: A, b: B) => C.
type Uncurry<F> = TODO

type _4 = Expect<Equal<Uncurry<(a: string) => (b: number) => boolean>, (a: string, b: number) => boolean>>
type _5 = Expect<Equal<Uncurry<(a: number) => (b: number) => number>,  (a: number, b: number) => number>>

// ─── Round-trip at the type level ─────────────────────────────────────────────

// Exercise 3: Verify that Curry and Uncurry are mutual inverses at the type level.
type CurryUncurry<F> = TODO   // Curry<Uncurry<F>> — should equal F
type UncurryCurry<F> = TODO   // Uncurry<Curry<F>> — should equal F

type _6 = Expect<Equal<CurryUncurry<(a: string) => (b: number) => boolean>,  (a: string) => (b: number) => boolean>>
type _7 = Expect<Equal<UncurryCurry<(a: string, b: number) => boolean>,       (a: string, b: number) => boolean>>

// ─── Exponential notation ─────────────────────────────────────────────────────

// Exercise 4: The function type B → C is the "exponential" C^B.
// In TypeScript, this is just `(b: B) => C`.
// Fill in the exponential type for each:
type Exp<B, C> = (b: B) => C

type _8  = Expect<Equal<Exp<string, boolean>,  (b: string) => boolean>>
type _9  = Expect<Equal<Exp<never, string>,    (b: never) => string>>   // C^0 = 1 (always returns)
type _10 = Expect<Equal<Exp<unknown, string>,  (b: unknown) => string>> // C^1 ≅ C

// Exercise 5: The product functor — fixing B, the left adjoint is A ↦ [A, B].
// What is the type of a function that takes any A and produces [A, B] for a fixed B?
type ProductWith<B> = TODO  // <A>(a: A) => [A, B]

type _11 = Expect<Equal<ProductWith<string>, <A>(a: A) => [A, string]>>
type _12 = Expect<Equal<ProductWith<number>, <A>(a: A) => [A, number]>>

// Exercise 6: The isomorphism — given f: [A, B] → C, derive its curried form.
// This is the adjunction unit: the map that sends f to curry(f) at the type level.
type AdjUnit<A, B, C> = TODO   // (f: (a: A, b: B) => C) => (a: A) => (b: B) => C

type _13 = Expect<Equal<
  AdjUnit<string, number, boolean>,
  (f: (a: string, b: number) => boolean) => (a: string) => (b: number) => boolean
>>
