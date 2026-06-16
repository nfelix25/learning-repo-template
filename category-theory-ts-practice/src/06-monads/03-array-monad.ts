/**
 * THE ARRAY (LIST) MONAD
 * ══════════════════════
 *
 * The array monad models *nondeterminism* — computations with multiple
 * possible results. Where Option branches on "success or failure," Array
 * branches on "which possible value."
 *
 *   of(a)        = [a]                  — one deterministic result
 *   flatMap(as, f) = concat(as.map(f))  — for each a, try all of f(a)
 *
 * flatMap here is also called `concatMap` or `bind`. It applies f to every
 * element and flattens the resulting arrays — one level of flattening.
 *
 * Run: npx tsx src/06-monads/03-array-monad.ts
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// ─── Implement of and flatMap for Array ───────────────────────────────────────

// Exercise 1: Implement `of` for Array — wrap a single value.
const ofArray = <A>(a: A): A[] => todo()

assert.deepEqual(ofArray(42),    [42])
assert.deepEqual(ofArray('hi'),  ['hi'])

// Exercise 2: Implement `flatMapArray` without using built-in flatMap.
// Apply f to each element, then concatenate all the results.
const flatMapArray = <A, B>(as: A[], f: (a: A) => B[]): B[] => todo()

assert.deepEqual(flatMapArray([1, 2, 3], n => [n, n * 10]),  [1, 10, 2, 20, 3, 30])
assert.deepEqual(flatMapArray([], (n: number) => [n, n]),    [])
assert.deepEqual(flatMapArray([1, 2], _ => [] as number[]),  [])

// ─── Nondeterminism: Cartesian product ────────────────────────────────────────

// Exercise 3: Use flatMapArray + ofArray to compute the Cartesian product
// of two arrays. This is the canonical demonstration of list nondeterminism.
const cartesian = <A, B>(as: A[], bs: B[]): [A, B][] =>
  flatMapArray(as, a => flatMapArray(bs, b => ofArray([a, b] as [A, B])))

assert.deepEqual(
  cartesian([1, 2], ['a', 'b']),
  [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
)
assert.deepEqual(cartesian([], ['a', 'b']), [])
assert.deepEqual(cartesian([1, 2], []),     [])

// Exercise 4: Use flatMapArray to compute all pairs where a < b from two ranges.
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

const orderedPairs = (n: number): [number, number][] =>
  flatMapArray(range(n), a =>
    flatMapArray(range(n), b =>
      a < b ? ofArray([a, b] as [number, number]) : []
    )
  )

assert.deepEqual(orderedPairs(3), [[1, 2], [1, 3], [2, 3]])

// ─── Monad laws for Array ─────────────────────────────────────────────────────

// Exercise 5: Verify left identity — flatMap(of(a), f) = f(a).
const duplicate = (n: number): number[] => [n, n]
const a = 5

assert.deepEqual(
  flatMapArray(ofArray(a), duplicate),
  duplicate(a),
  'left identity'
)

// Exercise 6: Verify right identity — flatMap(as, of) = as.
const as = [1, 2, 3]

assert.deepEqual(
  flatMapArray(as, ofArray),
  as,
  'right identity'
)

// Exercise 7: Verify associativity.
const double = (n: number): number[] => [n * 2]
const show   = (n: number): string[] => [`${n}`]

assert.deepEqual(
  flatMapArray(flatMapArray(as, duplicate), double),
  flatMapArray(as, n => flatMapArray(duplicate(n), double)),
  'associativity'
)

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 8: Fill in the types.
type OfArrayType      = TODO
type FlatMapArrayType = TODO

type _1 = Expect<Equal<OfArrayType,      <A>(a: A) => A[]>>
type _2 = Expect<Equal<FlatMapArrayType, <A, B>(as: A[], f: (a: A) => B[]) => B[]>>
