/**
 * A GENERIC FUNCTOR INTERFACE
 * ══════════════════════════
 *
 * With the HKT encoding in place, we can write a single Functor<F> interface
 * that abstracts over the choice of functor. Instances — concrete objects
 * satisfying the interface — are provided per-type.
 *
 * This is the typeclass pattern in TypeScript: the interface is the "class,"
 * instances are the "dictionaries."
 */

import { Expect, Equal, TODO, todo, Option, None, Some, isNone } from '../utils'
import { URI, Kind } from './01-encoding-hkt'
import assert from 'node:assert'

// ─── The Functor interface ────────────────────────────────────────────────────

// The Functor interface is pre-defined — this is scaffolding.
// map: given a Kind<F, A> and f: A → B, produce Kind<F, B>.
interface Functor<F extends URI> {
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}

// ─── Array Functor instance ───────────────────────────────────────────────────

// Exercise 1: Implement the Array functor instance.
// TypeScript verifies that arrayFunctor satisfies Functor<'Array'>.
const arrayFunctor: Functor<'Array'> = {
  map: todo('implement map for Array'),
}

assert.deepEqual(arrayFunctor.map([1, 2, 3], n => n * 2), [2, 4, 6])
assert.deepEqual(arrayFunctor.map([], n => n),            [])

// ─── Option Functor instance ──────────────────────────────────────────────────

// Exercise 2: Implement the Option functor instance.
const optionFunctor: Functor<'Option'> = {
  map: todo('implement map for Option'),
}

assert.deepEqual(optionFunctor.map(Some(5) as Option<number>, n => n * 2), Some(10))
assert.deepEqual(optionFunctor.map(None    as Option<number>, n => n * 2), None)

// ─── Using Functor abstractly ─────────────────────────────────────────────────

// Exercise 3: Write a function that works for any Functor instance.
// `mapTwice` applies f twice inside the functor.
const mapTwice = <F extends URI, A>(
  F: Functor<F>,
  fa: Kind<F, A>,
  f: (a: A) => A
): Kind<F, A> => todo('use F.map twice')

assert.deepEqual(mapTwice(arrayFunctor,  [1, 2, 3]  as number[],        (n: number) => n + 1), [2, 3, 4])
assert.deepEqual(mapTwice(optionFunctor, Some(10)   as Option<number>,  (n: number) => n * 2), Some(40))
assert.deepEqual(mapTwice(optionFunctor, None       as Option<number>,  (n: number) => n * 2), None)

// Exercise 4: Write `lift` — given a Functor and a function f: A → B,
// return a function that applies f inside the functor.
const lift = <F extends URI, A, B>(
  F: Functor<F>,
  f: (a: A) => B
): (fa: Kind<F, A>) => Kind<F, B> => todo('return a function that calls F.map')

assert.deepEqual(lift(arrayFunctor, (n: number) => n * 2)([1, 2, 3]),       [2, 4, 6])
assert.deepEqual(lift(optionFunctor,(n: number) => n + 1)(Some(5) as Option<number>), Some(6))

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 5: What is the type of arrayFunctor.map when F = 'Array'?
type ArrayMapType = TODO

type _1 = Expect<Equal<ArrayMapType, <A, B>(fa: A[], f: (a: A) => B) => B[]>>

// Exercise 6: What is the type of optionFunctor.map when F = 'Option'?
type OptionMapType = TODO

type _2 = Expect<Equal<OptionMapType, <A, B>(fa: Option<A>, f: (a: A) => B) => Option<B>>>
