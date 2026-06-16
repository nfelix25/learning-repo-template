/**
 * PRODUCT TYPES
 * ═════════════
 *
 * A product A × B comes with projection morphisms π₁: A×B → A and π₂: A×B → B.
 * In TypeScript, tuples [A, B] are products. Indexed access `T[0]` and `T[1]`
 * are the type-level projections.
 *
 * Object types { k₁: A, k₂: B, … } are also products — indexed by string keys.
 * Indexed access `T[K]` where K extends keyof T is the type-level projection.
 */

import { Expect, Equal, TODO } from '../utils'

// ─── Tuple projections ────────────────────────────────────────────────────────

// Exercise 1: The first projection π₁: [A, B] → A.
type Fst<P extends [unknown, unknown]> = TODO

type _1 = Expect<Equal<Fst<[string, number]>,   string>>
type _2 = Expect<Equal<Fst<[boolean, null]>,    boolean>>
type _3 = Expect<Equal<Fst<[never, unknown]>,   never>>
type _4 = Expect<Equal<Fst<[number[], string]>, number[]>>

// Exercise 2: The second projection π₂: [A, B] → B.
type Snd<P extends [unknown, unknown]> = TODO

type _5 = Expect<Equal<Snd<[string, number]>,  number>>
type _6 = Expect<Equal<Snd<[boolean, null]>,   null>>
type _7 = Expect<Equal<Snd<[never, unknown]>,  unknown>>

// Exercise 3: Generalize to n-tuples — the projection at index N.
// Hint: TypeScript's indexed access type T[N] works for numeric literal types.
type At<T extends readonly unknown[], N extends keyof T> = TODO

type _8  = Expect<Equal<At<[string, number, boolean], 0>, string>>
type _9  = Expect<Equal<At<[string, number, boolean], 1>, number>>
type _10 = Expect<Equal<At<[string, number, boolean], 2>, boolean>>

// ─── Object projections ───────────────────────────────────────────────────────

// Exercise 4: Projection for object products — extract a property type.
type Lookup<O, K extends keyof O> = TODO

type _11 = Expect<Equal<Lookup<{ name: string; age: number }, 'name'>, string>>
type _12 = Expect<Equal<Lookup<{ name: string; age: number }, 'age'>,  number>>
type _13 = Expect<Equal<Lookup<{ x: boolean; y: never },     'y'>,    never>>

// ─── Swap: a product isomorphism ─────────────────────────────────────────────

// Exercise 5: A × B ≅ B × A — the product is symmetric up to isomorphism.
// Define the type-level swap and the value-level implementation.
type Swap<P extends [unknown, unknown]> = TODO

type _14 = Expect<Equal<Swap<[string, number]>,  [number, string]>>
type _15 = Expect<Equal<Swap<[boolean, null]>,   [null, boolean]>>
type _16 = Expect<Equal<Swap<[never, unknown]>,  [unknown, never]>>

// The value-level swap:
const swap = <A, B>(pair: [A, B]): [B, A] => [pair[1], pair[0]]

// Exercise 6: Verify swap is its own inverse (swapping twice gives the original).
// Fill in the type of swapInverse to show it round-trips.
type SwapInverse<P extends [unknown, unknown]> = TODO  // Swap<Swap<P>>

type _17 = Expect<Equal<SwapInverse<[string, number]>, [string, number]>>
type _18 = Expect<Equal<SwapInverse<[boolean, null]>,  [boolean, null]>>
