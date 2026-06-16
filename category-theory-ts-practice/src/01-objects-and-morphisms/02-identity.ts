/**
 * THE IDENTITY MORPHISM
 * ══════════════════════
 *
 * Every category requires, for each object A, an identity morphism id_A: A → A.
 * This morphism satisfies:
 *   id_B ∘ f  =  f   (left identity)
 *   f ∘ id_A  =  f   (right identity)
 *
 * In TypeScript, `<A>(a: A) => a` is id_A for every type A simultaneously —
 * one definition covers all objects.
 *
 * Parametricity: a function polymorphic in A must work uniformly for EVERY
 * possible type A. This means it cannot inspect or create values of type A —
 * the only thing it can do with an A is return it. So `<A>(a: A) => A` has
 * exactly one total implementation.
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// ─── Implementing identity ────────────────────────────────────────────────────

// Exercise 1: Implement the identity morphism.
// There is exactly one thing to return — what is it?
const identity = <A>(a: A): A => todo()

// Exercise 2: Verify the identity laws at the value level.
const double = (n: number) => n * 2

assert.strictEqual(double(identity(5)),    double(5),    'left  identity: f ∘ id = f')
assert.strictEqual(identity(double(5)),    double(5),    'right identity: id ∘ f = f')
assert.strictEqual(identity('hello'),      'hello',      'identity on string')
assert.deepEqual(identity([1, 2, 3]),     [1, 2, 3],    'identity on array')

// ─── What else could <A>(a: A) => A be? ──────────────────────────────────────

// Exercise 3: Consider this attempt — returning a constant instead of `a`.
// Uncomment the line below and observe the type error. Then re-comment it.
// const badIdentity = <A>(_a: A): A => (42 as unknown as A)
//
// TypeScript allows the cast, but it's a lie — it breaks parametricity.
// A truly parametric implementation has no `any` or casts available.

// Exercise 4: Projections — the type `<A>(a: A, b: A) => A` has exactly two
// total parametric implementations: "return first" and "return second."
const first  = <A>(a: A, _b: A): A => todo()
const second = <A>(_a: A, b: A): A => todo()

assert.strictEqual(first(1, 2),     1,   'first: returns first arg')
assert.strictEqual(second(1, 2),    2,   'second: returns second arg')
assert.strictEqual(first('x', 'y'), 'x')
assert.strictEqual(second('x', 'y'),'y')

// Exercise 5: The type `<A, B>(a: A, b: B) => A` has exactly one parametric
// implementation. Fill in the type alias that describes it.
type ConstType = TODO  // the type of: <A, B>(a: A, b: B) => a

type _1 = Expect<Equal<ConstType, <A, B>(a: A, b: B) => A>>

// Exercise 6: How many parametric implementations does `<A>(as: A[]) => A[]` have?
// (Hint: more than you might think — every permutation, filter, or duplication
// that preserves the element type qualifies.)
// No code to write — just think about it.
