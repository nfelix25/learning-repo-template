/**
 * COMPOSITION
 * ═══════════
 *
 * A category must be closed under composition: given f: A → B and g: B → C,
 * their composite g ∘ f: A → C must exist.
 *
 * The composition laws:
 *   Associativity:  h ∘ (g ∘ f)  =  (h ∘ g) ∘ f
 *   Left identity:  id_B ∘ f  =  f
 *   Right identity: f ∘ id_A  =  f
 *
 * Note: in diagrammatic (left-to-right) order, g ∘ f means "f first, then g."
 * The `compose` function below uses this order: compose(f, g)(x) = g(f(x)).
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// ─── Implementing compose ─────────────────────────────────────────────────────

// Exercise 1: Implement compose.
// f is applied first, g second. The type variables enforce the "output of f = input of g" constraint.
const compose = <A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C => todo()

// Exercise 2: Verify compose against concrete functions.
const add1   = (n: number) => n + 1
const double = (n: number) => n * 2
const show   = (n: number) => `n=${n}`

assert.strictEqual(compose(add1, double)(3),  8,      'add1 then double: (3+1)×2 = 8')
assert.strictEqual(compose(double, add1)(3),  7,      'double then add1: 3×2+1 = 7')
assert.strictEqual(compose(double, show)(5),  'n=10', 'double then show')
assert.strictEqual(compose(add1, show)(4),    'n=5',  'add1 then show')

// ─── Verifying the category laws ─────────────────────────────────────────────

// Exercise 3: Associativity — grouping does not matter.
const add2 = (n: number) => n + 2

assert.strictEqual(
  compose(compose(add1, double), add2)(3),
  compose(add1, compose(double, add2))(3),
  'associativity: (add1 ∘ double) ∘ add2  =  add1 ∘ (double ∘ add2)'
)

// Exercise 4: Identity laws — composing with identity is a no-op.
// We use a monomorphic identity for numbers to avoid generic inference issues.
const id = (n: number): number => n

assert.strictEqual(compose(id, double)(5), double(5), 'left  identity: id ∘ f = f')
assert.strictEqual(compose(double, id)(5), double(5), 'right identity: f ∘ id = f')

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 5: Fill in the full type of `compose`.
// The type variables A, B, C must appear in the right positions.
type ComposeSignature = TODO

type _1 = Expect<Equal<
  ComposeSignature,
  <A, B, C>(f: (a: A) => B, g: (b: B) => C) => (a: A) => C
>>

// Exercise 6: Composition is not commutative — order matters.
// Show that compose(f, g) and compose(g, f) have DIFFERENT types
// when f: number → string and g: string → boolean.
type F = (n: number) => string
type G = (s: string) => boolean

type FthenG = TODO  // the type of compose(f, g) where f: F and g: G
type GthenF = TODO  // the type of compose(g, f) — does this even type-check?

type _2 = Expect<Equal<FthenG, (n: number) => boolean>>
// _3: GthenF cannot be formed — g expects string but f returns string,
//     so compose(g, f) is compose(G, F) = (s: string) => string... wait, that's wrong.
//     Actually compose(g: G, f: F) would require output of g = input of f.
//     g outputs boolean, f inputs number — these don't match! So it's a type error.
// Uncomment to see the error:
// const bad = compose(<the wrong g>, <the wrong f>)
