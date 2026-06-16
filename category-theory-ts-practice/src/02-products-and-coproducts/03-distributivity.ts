/**
 * DISTRIBUTIVITY
 * ══════════════
 *
 * In a distributive category, products distribute over coproducts:
 *
 *   A × (B + C)  ≅  (A × B) + (A × C)
 *
 * In TypeScript's type system:
 *
 *   A & (B | C)  =  (A & B) | (A & C)    (intersection over union)
 *   [A, B | C]   ≅  [A, B] | [A, C]      (tuple over union — via conditional types)
 *
 * TypeScript's conditional types distribute automatically over union types
 * when the checked type is a naked type parameter. This is the mechanism
 * behind mapped/filtered union operations.
 */

import { Expect, Equal, TODO } from '../utils'

// ─── Intersection distributes over union ──────────────────────────────────────

// Exercise 1: Verify the distributive law for intersections.
// Fill in the right-hand side of each equation.
type _1 = Expect<Equal<string & (number | boolean),  TODO>>
type _2 = Expect<Equal<object & (string | number[]),  TODO>>

// Exercise 2: Define Distribute explicitly as the RHS of the law.
type Distribute<A, B, C> = TODO  // should equal A & (B | C) for all A, B, C

type _3 = Expect<Equal<Distribute<string, number, boolean>, (string & number) | (string & boolean)>>
type _4 = Expect<Equal<Distribute<object, string, number[]>, (object & string) | (object & number[])>>

// ─── Conditional types distribute over union ──────────────────────────────────

// When T is a naked type parameter in `T extends U ? X : Y`,
// TypeScript evaluates the conditional for each member of the union separately.

// Exercise 3: Observe distribution in action.
type Wrap<T> = T extends unknown ? { value: T } : never

type _5 = Expect<Equal<Wrap<string>,          { value: string }>>
type _6 = Expect<Equal<Wrap<string | number>, TODO>>  // distributes!

// Exercise 4: Exclude members from a union.
// This is how the built-in `Exclude<T, U>` utility type works.
type MyExclude<T, U> = TODO  // keep members of T that do NOT extend U

type _7  = Expect<Equal<MyExclude<string | number | boolean, string>,  number | boolean>>
type _8  = Expect<Equal<MyExclude<string | number | boolean, number>,  string | boolean>>
type _9  = Expect<Equal<MyExclude<string | number,           never>,   string | number>>
type _10 = Expect<Equal<MyExclude<string | number,           unknown>, never>>

// Exercise 5: Extract members (the complement of Exclude).
// This is how the built-in `Extract<T, U>` works.
type MyExtract<T, U> = TODO

type _11 = Expect<Equal<MyExtract<string | number | boolean, string | boolean>, string | boolean>>
type _12 = Expect<Equal<MyExtract<string | number,           never>,            never>>
type _13 = Expect<Equal<MyExtract<string | number,           unknown>,          string | number>>

// ─── Tuple distributivity ─────────────────────────────────────────────────────

// Exercise 6: Distribute a union across the second component of a tuple.
// [A, B | C] should become [A, B] | [A, C]
type DistributeTuple<A, BC> = BC extends unknown ? [A, BC] : never

type _14 = Expect<Equal<DistributeTuple<string, number | boolean>, [string, number] | [string, boolean]>>
type _15 = Expect<Equal<DistributeTuple<string, never>,            never>>
