/**
 * NATURAL TRANSFORMATIONS
 * ═══════════════════════
 *
 * A natural transformation η: F ⟹ G is a polymorphic function
 *   η: <A>(fa: F<A>) => G<A>
 * that satisfies the **naturality condition**:
 *   η(fmap_F(f)(fa))  =  fmap_G(f)(η(fa))
 *
 * In other words, it doesn't matter whether you apply f inside F first
 * and then transform, or transform first and apply f inside G:
 *
 *      F(A) ──── η_A ────▶ G(A)
 *       │                   │
 *     F(f)               G(f)
 *       │                   │
 *       ▼                   ▼
 *      F(B) ──── η_B ────▶ G(B)
 *
 * By parametricity, every polymorphic function between functors is automatically
 * natural — you get the law for free just by writing a generic function.
 */

import { Expect, Equal, TODO, todo, Option, None, Some, isNone } from '../utils'
import assert from 'node:assert'

// ─── headOption: Array ⟹ Option ──────────────────────────────────────────────

// Exercise 1: Implement `headOption` — the natural transformation from
// Array to Option that returns the first element if it exists.
const headOption = <A>(as: A[]): Option<A> => todo()

assert.deepEqual(headOption([]),          None)
assert.deepEqual(headOption([1, 2, 3]),   Some(1))
assert.deepEqual(headOption(['a', 'b']),  Some('a'))

// Exercise 2: Verify naturality — the square commutes.
// headOption(as.map(f)) = mapOption(headOption(as), f)
// We need a simple mapOption for this check:
const mapOption = <A, B>(opt: Option<A>, f: (a: A) => B): Option<B> =>
  opt._tag === 'None' ? None : Some(f(opt.value))

const double = (n: number) => n * 2
const as = [1, 2, 3]

assert.deepEqual(
  headOption(as.map(double)),
  mapOption(headOption(as), double),
  'naturality: headOption(map(f, as)) = map(f, headOption(as))'
)
assert.deepEqual(
  headOption(([] as number[]).map(double)),
  mapOption(headOption([] as number[]), double),
  'naturality holds for empty array too'
)

// ─── lastOption: another Array ⟹ Option ──────────────────────────────────────

// Exercise 3: Implement `lastOption` — the natural transformation that
// returns the last element.
const lastOption = <A>(as: A[]): Option<A> => todo()

assert.deepEqual(lastOption([]),         None)
assert.deepEqual(lastOption([1, 2, 3]),  Some(3))

// Exercise 4: Verify naturality for lastOption.
assert.deepEqual(
  lastOption(as.map(double)),
  mapOption(lastOption(as), double),
  'naturality of lastOption'
)

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 5: A natural transformation from Option to Array.
// There are two sensible implementations — which one is "canonical"?
const optionToArray = <A>(opt: Option<A>): A[] => todo()

assert.deepEqual(optionToArray(None),      [])
assert.deepEqual(optionToArray(Some(42)),  [42])

// Exercise 6: Fill in the type of a natural transformation from F to G.
// F = Array (i.e., A[]), G = Option
type NatTransArrayToOption = TODO

type _1 = Expect<Equal<NatTransArrayToOption, <A>(as: A[]) => Option<A>>>

// Exercise 7: Is `headOption` the same as `lastOption`? Show a witness that they differ.
// (A value where they produce different results.)
const witness: number[] = todo('fill in an array where headOption and lastOption differ')
// After filling in witness, this should hold:
// assert.notDeepEqual(headOption(witness), lastOption(witness))
