/**
 * TYPE ISOMORPHISMS
 * ═════════════════
 *
 * Two objects A and B are **isomorphic** (A ≅ B) if there exist morphisms
 * f: A → B and g: B → A such that g ∘ f = id_A and f ∘ g = id_B.
 *
 * Isomorphisms are "the same object, viewed differently" — they let us
 * convert back and forth without losing information.
 *
 * In TypeScript, type isomorphisms are pairs of functions that round-trip:
 *   to:   A → B
 *   from: B → A
 *   from(to(a)) = a  and  to(from(b)) = b
 */

import { Expect, Equal, TODO } from '../utils'
import assert from 'node:assert'

// ─── Product isomorphisms ─────────────────────────────────────────────────────

// Exercise 1: [A, B] ≅ [B, A] — products are commutative up to isomorphism.
const swapTuple = <A, B>(pair: [A, B]): [B, A] => todo() as [B, A]

// Replace `todo()` above, then verify the round-trip:
const pair: [string, number] = ['hello', 42]
assert.deepEqual(swapTuple(swapTuple(pair)), pair, 'swap is its own inverse')
assert.deepEqual(swapTuple(['x', 1]), [1, 'x'])

// Exercise 2: [[A, B], C] ≅ [A, [B, C]] — products are associative up to isomorphism.
const assocRight = <A, B, C>(p: [[A, B], C]): [A, [B, C]] => todo() as [A, [B, C]]
const assocLeft  = <A, B, C>(p: [A, [B, C]]): [[A, B], C] => todo() as [[A, B], C]

const nested: [[string, number], boolean] = [['a', 1], true]
assert.deepEqual(assocLeft(assocRight(nested)), nested, 'assocLeft ∘ assocRight = id')

// Exercise 3: [A, Unit] ≅ A — the terminal object is the product unit.
// Here we use `null` as the unit type (a concrete singleton).
const dropUnit  = <A>(pair: [A, null]): A    => todo() as A
const addUnit   = <A>(a: A): [A, null]        => todo() as [A, null]

assert.strictEqual(dropUnit(addUnit('hello')), 'hello', 'dropUnit ∘ addUnit = id')
assert.deepEqual(addUnit(dropUnit(['world', null])), ['world', null], 'addUnit ∘ dropUnit = id')

// ─── Sum isomorphisms ─────────────────────────────────────────────────────────

// Exercise 4: A | B ≅ B | A — coproducts are commutative up to isomorphism.
// (At the type level, union is already symmetric — this exercise is about
// showing the same holds for tagged coproducts where order is significant.)

type Either<A, B> =
  | { tag: 'left';  value: A }
  | { tag: 'right'; value: B }

const Left  = <A>(value: A): Either<A, never> => ({ tag: 'left',  value })
const Right = <B>(value: B): Either<never, B> => ({ tag: 'right', value })

const swapEither = <A, B>(e: Either<A, B>): Either<B, A> => todo() as Either<B, A>

assert.deepEqual(swapEither(Left('x')),   { tag: 'right', value: 'x' }, 'Left becomes Right')
assert.deepEqual(swapEither(Right(42)),   { tag: 'left',  value: 42  }, 'Right becomes Left')
assert.deepEqual(
  swapEither(swapEither(Left('x') as Either<string, number>)),
  Left('x'),
  'swapEither is its own inverse'
)

// ─── Type-level round-trip ────────────────────────────────────────────────────

// Exercise 5: Verify the Swap type from the previous file is its own inverse.
type Swap<P extends [unknown, unknown]> = [P[1], P[0]]
type SwapSwap<P extends [unknown, unknown]> = TODO  // Swap<Swap<P>> should equal P

type _1 = Expect<Equal<SwapSwap<[string, number]>,  [string, number]>>
type _2 = Expect<Equal<SwapSwap<[boolean, null]>,   [boolean, null]>>

function todo<T>(): T { throw new Error('not implemented') }
