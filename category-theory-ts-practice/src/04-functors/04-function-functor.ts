/**
 * THE READER (FUNCTION) FUNCTOR
 * ══════════════════════════════
 *
 * Fix a type R. The functor Reader<R, A> = (r: R) => A maps:
 *   Objects: A  ↦  (R → A)
 *   Morphisms: (f: A → B)  ↦  (ra: R → A)  ↦  (r: R) => f(ra(r))
 *
 * In other words, map for Reader is *post-composition*: applying f after
 * the reader produces its A value.
 *
 *   map(f)(ra) = r => f(ra(r))
 *
 * This is also called the "covariant function functor" — it varies covariantly
 * in the return type A while holding R fixed.
 *
 * Run: npx tsx src/04-functors/04-function-functor.ts
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// The Reader type — a computation that reads from an environment R and produces A.
type Reader<R, A> = (r: R) => A

// ─── Implement map for Reader ─────────────────────────────────────────────────

// Exercise 1: Implement mapReader — post-compose f after the reader.
const mapReader = <R, A, B>(ra: Reader<R, A>, f: (a: A) => B): Reader<R, B> => todo()

// A reader that extracts the length of a string environment:
const strLength: Reader<string, number> = s => s.length
const double = (n: number) => n * 2
const show   = (n: number) => `len=${n}`

const doubleLength = mapReader(strLength, double)
const showLength   = mapReader(strLength, show)

assert.strictEqual(doubleLength('hello'), 10,         'map double over strLength')
assert.strictEqual(doubleLength('hi'),    4,          'map double over strLength')
assert.strictEqual(showLength('abc'),     'len=3',    'map show over strLength')

// ─── Functor laws ─────────────────────────────────────────────────────────────

// Exercise 2: Identity law — map(ra, id) = ra.
// Verify that mapping identity produces a reader with the same behavior.
const env = 'test-string'

assert.strictEqual(
  mapReader(strLength, x => x)(env),
  strLength(env),
  'identity law: mapReader(ra, id)(r) = ra(r)'
)

// Exercise 3: Composition law — map(map(ra, f), g) = map(ra, g ∘ f).
const inc = (n: number) => n + 1

assert.strictEqual(
  mapReader(mapReader(strLength, double), inc)(env),
  mapReader(strLength, n => inc(double(n)))(env),
  'composition law'
)

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 4: Fill in the return type of mapReader.
type MapReaderType = TODO

type _1 = Expect<Equal<
  MapReaderType,
  <R, A, B>(ra: Reader<R, A>, f: (a: A) => B) => Reader<R, B>
>>

// Exercise 5: The curried lift — promote f: A → B to Reader<R, A> → Reader<R, B>.
// This is the functorial action on morphisms.
const liftReader = <R, A, B>(f: (a: A) => B): (ra: Reader<R, A>) => Reader<R, B> => todo()

assert.strictEqual(liftReader<string, number, number>(double)(strLength)('hello'), 10)
assert.strictEqual(liftReader<string, number, string>(show)(strLength)('abc'), 'len=3')

// Exercise 6: What does it mean to "map" over the R parameter instead of A?
// (You can't — that would be a *contravariant* functor, requiring a different
// kind of map. But observe: if you fix A and vary R, you get Reader<R, A>
// as a *contravariant* functor in R. No code to write — just think about it.)
