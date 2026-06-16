/**
 * THE OPTION MONAD
 * ════════════════
 *
 * Option<A> models computations that may fail. The monadic operations:
 *   of(a)          = Some(a)   — succeed with a value
 *   flatMap(None, f) = None    — failure propagates
 *   flatMap(Some(a), f) = f(a) — continue the chain on success
 *
 * This is the "short-circuit" pattern: the first failure stops the chain.
 *
 * Run: npx tsx src/06-monads/02-option-monad.ts
 */

import { Expect, Equal, TODO, todo, Option, None, Some, isNone, isSome } from '../utils'
import assert from 'node:assert'

// ─── Implement of and flatMap ─────────────────────────────────────────────────

// Exercise 1: Implement `of` — inject a pure value into Option.
const ofOption = <A>(a: A): Option<A> => todo()

assert.deepEqual(ofOption(42),     Some(42))
assert.deepEqual(ofOption('hi'),   Some('hi'))
assert.deepEqual(ofOption(null),   Some(null))

// Exercise 2: Implement `flatMap` for Option.
// None short-circuits; Some continues.
const flatMapOption = <A, B>(opt: Option<A>, f: (a: A) => Option<B>): Option<B> => todo()

const double = (n: number): Option<number> => Some(n * 2)
const safeDiv = (d: number) => (n: number): Option<number> =>
  d === 0 ? None : Some(n / d)

assert.deepEqual(flatMapOption(Some(5),               double),       Some(10))
assert.deepEqual(flatMapOption(None as Option<number>, double),      None)
assert.deepEqual(flatMapOption(Some(10),              safeDiv(2)),   Some(5))
assert.deepEqual(flatMapOption(Some(10),              safeDiv(0)),   None)

// ─── Chaining computations ────────────────────────────────────────────────────

// Exercise 3: Chain two fallible operations.
// Parse a string to int, then take its square root.
const parseIntOption = (s: string): Option<number> => {
  const n = parseInt(s, 10)
  return isNaN(n) ? None : Some(n)
}
const safeSqrt = (n: number): Option<number> =>
  n < 0 ? None : Some(Math.sqrt(n))

// Fill in: chain parseIntOption → safeSqrt
const parseThenSqrt = (s: string): Option<number> =>
  flatMapOption(todo<Option<number>>('parse s'), todo<(n: number) => Option<number>>('then safeSqrt'))

assert.deepEqual(parseThenSqrt('16'),   Some(4))
assert.deepEqual(parseThenSqrt('9'),    Some(3))
assert.deepEqual(parseThenSqrt('-1'),   None)
assert.deepEqual(parseThenSqrt('abc'),  None)

// Exercise 4: A three-step chain.
// Given a Record<string, string[]>, look up a key, then get the head, then parse.
const safeHead = <A>(as: A[]): Option<A> =>
  as.length === 0 ? None : Some(as[0])

const safeGet = <V>(record: Record<string, V>, key: string): Option<V> =>
  key in record ? Some(record[key]) : None

const data: Record<string, string[]> = {
  scores: ['42', '100', '7'],
  names:  ['alice', 'bob'],
}

// Fill in: get 'scores' → head → parse as int
const firstScore = (d: Record<string, string[]>): Option<number> =>
  flatMapOption(
    flatMapOption(todo<Option<string[]>>('get scores from d'), safeHead),
    parseIntOption
  )

assert.deepEqual(firstScore(data),  Some(42))
assert.deepEqual(firstScore({}),    None)

// ─── map via flatMap + of ─────────────────────────────────────────────────────

// Exercise 5: Implement mapOption using only flatMapOption and ofOption.
// (Every monad is a functor — map is derivable.)
const mapOption = <A, B>(opt: Option<A>, f: (a: A) => B): Option<B> => todo()

assert.deepEqual(mapOption(Some(5), n => n * 2), Some(10))
assert.deepEqual(mapOption(None as Option<number>, n => n * 2), None)

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 6: Fill in the types.
type OfOptionType       = TODO
type FlatMapOptionType  = TODO

type _1 = Expect<Equal<OfOptionType,      <A>(a: A) => Option<A>>>
type _2 = Expect<Equal<FlatMapOptionType, <A, B>(opt: Option<A>, f: (a: A) => Option<B>) => Option<B>>>
