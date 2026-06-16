/**
 * PARAMETRIC POLYMORPHISM
 * ═══════════════════════
 *
 * A parametric function `<A>(a: A) => B` must produce a B using only
 * the structure of A — not its content. Since A is completely opaque,
 * the only operations available are: return an existing A, pass it to
 * another function, or combine it with things that don't depend on A.
 *
 * This drastically limits what a function can do, and that limitation
 * is a feature: the type tells you almost everything about the behavior.
 */

import { Expect, Equal, TODO, todo } from '../utils'
import assert from 'node:assert'

// ─── How constrained is <A>(a: A) => A? ──────────────────────────────────────

// Exercise 1: The identity function is the only total parametric implementation
// of `<A>(a: A) => A`. Fill in the body.
const identity = <A>(a: A): A => todo()

assert.strictEqual(identity(42),     42)
assert.strictEqual(identity('hi'),   'hi')
assert.deepEqual(identity([1,2,3]),  [1,2,3])

// Exercise 2: A "constant" function ignores its first argument.
// `<A, B>(a: A, b: B) => B` has exactly one parametric implementation.
const constant = <A, B>(_a: A, b: B): B => todo()

assert.strictEqual(constant(42, 'hello'), 'hello')
assert.strictEqual(constant('x', true),  true)

// Exercise 3: `<A>(as: A[]) => number` can count elements but cannot inspect them.
// How many implementations exist? (Many! length, fixed constant, …)
// Implement `length` — it works on A[] for any A.
const length = <A>(as: A[]): number => todo()

assert.strictEqual(length([]),          0)
assert.strictEqual(length([1, 2, 3]),   3)
assert.strictEqual(length(['x', 'y']),  2)

// ─── What can `<A>(as: A[]) => A[]` be? ──────────────────────────────────────

// Exercise 4: A function `<A>(as: A[]) => A[]` can rearrange, drop, or duplicate
// elements, but cannot create new A values. Implement `reverse`.
const reverse = <A>(as: A[]): A[] => todo()

assert.deepEqual(reverse([]),          [])
assert.deepEqual(reverse([1, 2, 3]),   [3, 2, 1])
assert.deepEqual(reverse(['a', 'b']),  ['b', 'a'])

// Exercise 5: Implement `tail` — drops the first element.
const tail = <A>(as: A[]): A[] => todo()

assert.deepEqual(tail([]),          [])
assert.deepEqual(tail([1, 2, 3]),   [2, 3])

// Exercise 6: Free theorem intuition — for any `h: <A>(as: A[]) => A[]`,
// applying a function f before or after should commute.
// Verify this for `reverse`:
const double = (n: number) => n * 2
const arr = [1, 2, 3]

assert.deepEqual(
  reverse(arr).map(double),
  reverse(arr.map(double)),
  'naturality of reverse: reverse(map(f, as)) = map(f, reverse(as))'
)

// Exercise 7: Type-level. What is the most general type that subsumes
// both `identity` and `constant`? (The type of flip, essentially.)
type FlipType = TODO  // <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A) => C

type _1 = Expect<Equal<FlipType, <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A) => C>>
