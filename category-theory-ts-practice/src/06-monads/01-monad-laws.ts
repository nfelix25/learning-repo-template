/**
 * MONAD LAWS
 * ══════════
 *
 * We verify all three monad laws using Option as the monad.
 * `of` and `flatMap` are provided — implement them in 02-option-monad.ts first,
 * or use the reference implementations below.
 *
 * Run: npx tsx src/06-monads/01-monad-laws.ts
 */

import { todo, Option, None, Some } from '../utils'
import assert from 'node:assert'

// Reference implementations (replace todo() with your own from 02-option-monad.ts):
const ofOption = <A>(a: A): Option<A> => todo()
const flatMapOption = <A, B>(opt: Option<A>, f: (a: A) => Option<B>): Option<B> => todo()

// ─── Left identity: of(a) >>= f  =  f(a) ─────────────────────────────────────

// Exercise 1: Verify left identity for a concrete value and function.
const safeDiv = (divisor: number) => (n: number): Option<number> =>
  divisor === 0 ? None : Some(n / divisor)

const a = 10

assert.deepEqual(
  flatMapOption(ofOption(a), safeDiv(2)),
  safeDiv(2)(a),
  'left identity: flatMap(of(a), f) = f(a)'
)

// Exercise 2: Left identity holds even when f returns None.
assert.deepEqual(
  flatMapOption(ofOption(a), safeDiv(0)),
  safeDiv(0)(a),
  'left identity with f returning None'
)

// ─── Right identity: m >>= of  =  m ──────────────────────────────────────────

// Exercise 3: Verify right identity for Some.
const m1: Option<number> = Some(42)

assert.deepEqual(
  flatMapOption(m1, ofOption),
  m1,
  'right identity: flatMap(Some(a), of) = Some(a)'
)

// Exercise 4: Right identity for None.
const m2: Option<number> = None

assert.deepEqual(
  flatMapOption(m2, ofOption),
  m2,
  'right identity: flatMap(None, of) = None'
)

// ─── Associativity: (m >>= f) >>= g  =  m >>= (a => f(a) >>= g) ─────────────

// Exercise 5: Verify associativity for a chain of two fallible computations.
const safeHead = <A>(as: A[]): Option<A> =>
  as.length === 0 ? None : Some(as[0])

const safeSqrt = (n: number): Option<number> =>
  n < 0 ? None : Some(Math.sqrt(n))

const nums: Option<number[]> = Some([4, 9, 16])

// LHS: ((m >>= f) >>= g)
const lhs = flatMapOption(flatMapOption(nums, safeHead), safeSqrt)

// RHS: (m >>= (a => f(a) >>= g))
const rhs = flatMapOption(nums, as => flatMapOption(safeHead(as), safeSqrt))

assert.deepEqual(lhs, rhs, 'associativity: (m >>= f) >>= g = m >>= (a => f(a) >>= g)')

// Exercise 6: Associativity holds when the chain short-circuits on None.
const empty: Option<number[]> = None

assert.deepEqual(
  flatMapOption(flatMapOption(empty, safeHead), safeSqrt),
  flatMapOption(empty, as => flatMapOption(safeHead(as), safeSqrt)),
  'associativity holds for None'
)
