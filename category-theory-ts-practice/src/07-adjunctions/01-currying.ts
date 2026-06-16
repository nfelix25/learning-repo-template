/**
 * CURRYING AS AN ADJUNCTION
 * ═════════════════════════
 *
 * The curry/uncurry isomorphism:
 *
 *   Hom(A × B, C)  ≅  Hom(A, B → C)
 *
 * curry:   (f: (a: A, b: B) => C) → (a: A) => (b: B) => C
 * uncurry: (f: (a: A) => (b: B) => C) → (a: A, b: B) => C
 *
 * These are mutual inverses (they form an isomorphism), and the isomorphism
 * is *natural* — it commutes with pre- and post-composition of morphisms.
 *
 * Run: npx tsx src/07-adjunctions/01-currying.ts
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// ─── Implementing curry and uncurry ───────────────────────────────────────────

// Exercise 1: Implement curry.
// Takes a function of two arguments; returns a curried function.
const curry = <A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C => todo()

const add = (a: number, b: number): number => a + b
const mul = (a: number, b: number): number => a * b

assert.strictEqual(curry(add)(3)(4),  7,   'curry(add)(3)(4) = 7')
assert.strictEqual(curry(mul)(3)(4),  12,  'curry(mul)(3)(4) = 12')
assert.strictEqual(curry(add)(0)(0),  0)

// Exercise 2: Implement uncurry.
// Takes a curried function; returns a two-argument function.
const uncurry = <A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C => todo()

const curriedAdd = (a: number) => (b: number) => a + b
const curriedMul = (a: number) => (b: number) => a * b

assert.strictEqual(uncurry(curriedAdd)(3, 4),  7,  'uncurry(curriedAdd)(3, 4) = 7')
assert.strictEqual(uncurry(curriedMul)(3, 4),  12, 'uncurry(curriedMul)(3, 4) = 12')

// ─── Verifying the isomorphism (round-trips) ──────────────────────────────────

// Exercise 3: curry ∘ uncurry = id (for curried functions).
// For any curried f, curry(uncurry(f))(a)(b) = f(a)(b).
assert.strictEqual(
  curry(uncurry(curriedAdd))(3)(4),
  curriedAdd(3)(4),
  'curry(uncurry(f)) = f'
)
assert.strictEqual(
  curry(uncurry(curriedMul))(3)(4),
  curriedMul(3)(4),
  'curry(uncurry(f)) = f'
)

// Exercise 4: uncurry ∘ curry = id (for uncurried functions).
// For any uncurried g, uncurry(curry(g))(a, b) = g(a, b).
assert.strictEqual(
  uncurry(curry(add))(3, 4),
  add(3, 4),
  'uncurry(curry(g)) = g'
)
assert.strictEqual(
  uncurry(curry(mul))(3, 4),
  mul(3, 4),
  'uncurry(curry(g)) = g'
)

// ─── Partial application via curry ────────────────────────────────────────────

// Exercise 5: Currying enables partial application.
// `curry(add)(5)` is a partially applied function — what is its type?
const add5 = curry(add)(5)
type Add5Type = TODO  // fill in the type of add5

type _3 = Expect<Equal<Add5Type, (b: number) => number>>

assert.strictEqual(add5(3), 8)
assert.strictEqual(add5(0), 5)

// Exercise 6: Implement flip using curry and uncurry.
// flip(f)(b)(a) = f(a)(b) — swaps the argument order.
const flip = <A, B, C>(f: (a: A) => (b: B) => C): (b: B) => (a: A) => C => todo()

assert.strictEqual(flip(curriedAdd)(4)(3),  7,  'flip(curriedAdd)(4)(3) = 7')
assert.strictEqual(flip(curriedMul)(4)(3),  12, 'flip(curriedMul)(4)(3) = 12')

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 7: Fill in the types of curry and uncurry.
type CurryType   = TODO
type UncurryType = TODO

type _1 = Expect<Equal<CurryType,   <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C>>
type _2 = Expect<Equal<UncurryType, <A, B, C>(f: (a: A) => (b: B) => C) => (a: A, b: B) => C>>
