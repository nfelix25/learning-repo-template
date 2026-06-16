/**
 * FUNCTOR LAWS
 * ════════════
 *
 * A functor must satisfy two laws:
 *
 *   Identity:    map(fa, x => x)      = fa
 *   Composition: map(map(fa, f), g)   = map(fa, x => g(f(x)))
 *
 * We verify both using Array as the functor and assert() for evidence.
 * The laws are not checked by TypeScript's type system — you must run the file.
 *
 * Run: npx tsx src/04-functors/01-functor-laws.ts
 */

import { todo } from '../utils'
import assert from 'node:assert'

// ─── Identity law ─────────────────────────────────────────────────────────────

// Exercise 1: Verify that map with the identity function changes nothing.
// Fill in the right-hand side of each assertion using arr.map(...)
const arr = [1, 2, 3, 4, 5]

assert.deepEqual(
  arr.map(x => x),
  todo<number[]>('fill in the expected result'),
  'identity law: map(fa, id) = fa'
)

// Exercise 2: The identity law must hold for all array contents, including empty.
assert.deepEqual(
  ([] as number[]).map(x => x),
  todo<number[]>('expected result for empty array'),
  'identity law holds for empty array'
)

// ─── Composition law ──────────────────────────────────────────────────────────

const double  = (n: number) => n * 2
const inc     = (n: number) => n + 1

// Exercise 3: Verify that mapping twice equals mapping the composed function.
// LHS: map twice (two passes over the array)
const lhs = arr.map(double).map(inc)

// Exercise 4: RHS: map once with the composed function (one pass)
// Fill in the composed function:
const rhs = arr.map(todo<(n: number) => number>('compose double then inc'))

assert.deepEqual(lhs, rhs, 'composition law: map(map(fa, f), g) = map(fa, g ∘ f)')

// Exercise 5: Verify the composition law for a longer chain.
const triple  = (n: number) => n * 3
const negate  = (n: number) => -n

const lhs2 = arr.map(double).map(triple).map(negate)
const rhs2 = arr.map(todo<(n: number) => number>('compose all three'))

assert.deepEqual(lhs2, rhs2, 'composition law: three-step chain')

// ─── Laws as types ────────────────────────────────────────────────────────────

// Exercise 6: Encode the identity law as a type-level proposition.
// For any array of A, mapping the identity gives back the same type.
// (Types alone can't verify equality of values, but they can verify shapes.)
type MapIdentityType<A> = (fa: A[]) => A[]
// Observe: map(fa, id): A[] — same type as the input. The law is about values.
// Is there anything the TYPE alone can tell us? (Think about it — no code to write.)
