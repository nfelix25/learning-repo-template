/**
 * ENCODING HIGHER-KINDED TYPES
 * ════════════════════════════
 *
 * TypeScript lacks native HKT support — type parameters are always kind *.
 * This file establishes the encoding that works around the limitation.
 *
 * The pattern: a global registry interface (URItoKind) maps string literals
 * to type constructors. Declaration merging lets any module extend the registry.
 * Kind<F, A> is then just a lookup into that registry.
 */

import { Expect, Equal, TODO, Option } from '../utils'

// ─── The HKT registry ─────────────────────────────────────────────────────────

// The registry maps URI strings to concrete types parameterized by A.
// These two entries are pre-registered as scaffolding.
export interface URItoKind<A> {
  Array:  A[]
  Option: Option<A>
}

// The set of all registered URIs.
export type URI = keyof URItoKind<unknown>

// Kind<F, A> performs the lookup: given a URI F and a type argument A,
// return the concrete type that F represents applied to A.
export type Kind<F extends URI, A> = URItoKind<A>[F]

// ─── Using Kind to look up types ─────────────────────────────────────────────

// Exercise 1: Kind<'Array', A> looks up the Array entry. Fill in the RHS.
type _1 = Expect<Equal<Kind<'Array', string>,  TODO>>
type _2 = Expect<Equal<Kind<'Array', number>,  TODO>>
type _3 = Expect<Equal<Kind<'Array', boolean>, TODO>>

// Exercise 2: Kind<'Option', A> looks up the Option entry. Fill in the RHS.
type _4 = Expect<Equal<Kind<'Option', string>,  TODO>>
type _5 = Expect<Equal<Kind<'Option', number>,  TODO>>
type _6 = Expect<Equal<Kind<'Option', boolean>, TODO>>

// ─── What is URI? ─────────────────────────────────────────────────────────────

// Exercise 3: URI is the union of all registered keys.
// Fill in what URI equals.
type _7 = Expect<Equal<URI, TODO>>

// ─── Nested and complex kinds ─────────────────────────────────────────────────

// Exercise 4: Kind can be used with complex type arguments.
type _8 = Expect<Equal<Kind<'Array',  string[]>,        TODO>>  // array of arrays
type _9 = Expect<Equal<Kind<'Option', string | number>, TODO>>  // option of union

// Exercise 5: Kind<F, Kind<G, A>> — composition of type constructors.
// What is an Array of Options of string?
type _10 = Expect<Equal<Kind<'Array', Kind<'Option', string>>, TODO>>

// What is an Option of an Array of number?
type _11 = Expect<Equal<Kind<'Option', Kind<'Array', number>>, TODO>>

// ─── Adding a new type constructor ────────────────────────────────────────────

// Exercise 6: Register a new type constructor via declaration merging.
// Add 'Pair' to the registry where Pair<A> = [A, A] (a pair of the same type).
declare module './01-encoding-hkt' {
  interface URItoKind<A> {
    Pair: TODO  // fill in: [A, A]
  }
}

type _12 = Expect<Equal<Kind<'Pair', string>,  [string, string]>>
type _13 = Expect<Equal<Kind<'Pair', number>,  [number, number]>>
