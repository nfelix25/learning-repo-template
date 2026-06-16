/**
 * THE ARRAY FUNCTOR (from scratch)
 * ════════════════════════════════
 *
 * JavaScript's built-in Array.map satisfies the functor laws. Here we
 * re-implement map manually — first with recursion, then iteratively —
 * to make the structure explicit.
 *
 * Run: npx tsx src/04-functors/03-array-functor.ts
 */

import { todo } from '../utils'
import assert from 'node:assert'

// ─── Recursive implementation ─────────────────────────────────────────────────

// Exercise 1: Implement mapArray recursively.
// Do not call Array.prototype.map or any other built-in map.
// Hint: pattern-match on empty vs non-empty.
const mapArrayRec = <A, B>(as: A[], f: (a: A) => B): B[] => todo()

const double = (n: number) => n * 2
const show   = (n: number) => `${n}`

assert.deepEqual(mapArrayRec([], double),         [])
assert.deepEqual(mapArrayRec([1, 2, 3], double),  [2, 4, 6])
assert.deepEqual(mapArrayRec([4, 5], show),       ['4', '5'])

// ─── Iterative implementation ─────────────────────────────────────────────────

// Exercise 2: Implement mapArray iteratively (using a for loop or reduce).
const mapArrayIter = <A, B>(as: A[], f: (a: A) => B): B[] => todo()

assert.deepEqual(mapArrayIter([], double),         [])
assert.deepEqual(mapArrayIter([1, 2, 3], double),  [2, 4, 6])
assert.deepEqual(mapArrayIter([4, 5], show),       ['4', '5'])

// ─── Verify they agree ────────────────────────────────────────────────────────

// Exercise 3: Verify both implementations agree with the built-in.
const arr = [1, 2, 3, 4, 5]

assert.deepEqual(mapArrayRec(arr,  double), arr.map(double), 'recursive = built-in')
assert.deepEqual(mapArrayIter(arr, double), arr.map(double), 'iterative = built-in')

// ─── Functor laws ─────────────────────────────────────────────────────────────

// Exercise 4: Verify identity law for your implementation.
assert.deepEqual(mapArrayRec(arr,  x => x), arr, 'identity law (recursive)')
assert.deepEqual(mapArrayIter(arr, x => x), arr, 'identity law (iterative)')

// Exercise 5: Verify composition law for your implementation.
const inc = (n: number) => n + 1

assert.deepEqual(
  mapArrayRec(mapArrayRec(arr, double), inc),
  mapArrayRec(arr, n => inc(double(n))),
  'composition law (recursive)'
)

// ─── map as a higher-order function ──────────────────────────────────────────

// Exercise 6: Rewrite mapArray in "curried lifting" form.
// Instead of taking the array and function together, take just the function
// and return a new function that works on arrays.
// This is the "lift" operation: (A → B) → (A[] → B[])
const lift = <A, B>(f: (a: A) => B): (as: A[]) => B[] => todo()

assert.deepEqual(lift(double)([1, 2, 3]),  [2, 4, 6])
assert.deepEqual(lift(show)([4, 5]),       ['4', '5'])
assert.deepEqual(lift(double)([]),         [])
