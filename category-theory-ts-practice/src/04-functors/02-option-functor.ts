/**
 * THE OPTION FUNCTOR
 * ══════════════════
 *
 * Option<A> represents a value that may be absent. It is the canonical
 * functor for "computation that might fail" — map applies a function
 * inside the Some case and passes None through unchanged.
 *
 * Option<A> is defined in utils.ts. Its constructors:
 *   None  — absence of a value
 *   Some(a) — presence of a value a: A
 *
 * Run: npx tsx src/04-functors/02-option-functor.ts
 */

import { Expect, Equal, TODO, todo, Option, None, Some, isNone } from '../utils'
import assert from 'node:assert'

// ─── Implement map for Option ─────────────────────────────────────────────────

// Exercise 1: Implement mapOption.
// None maps to None; Some(a) maps to Some(f(a)).
const mapOption = <A, B>(opt: Option<A>, f: (a: A) => B): Option<B> => todo()

const double = (n: number) => n * 2
const upper  = (s: string) => s.toUpperCase()

assert.deepEqual(mapOption(None,      double), None,        'None maps to None')
assert.deepEqual(mapOption(Some(5),   double), Some(10),    'Some(5) maps to Some(10)')
assert.deepEqual(mapOption(Some('a'), upper),  Some('A'),   'Some("a") maps to Some("A")')
assert.deepEqual(mapOption(None,      upper),  None,        'None is still None')

// ─── Verify functor laws ──────────────────────────────────────────────────────

// Exercise 2: Identity law — mapOption(fa, id) = fa
const someVal = Some(42)

assert.deepEqual(mapOption(someVal, x => x), someVal, 'identity law: Some case')
assert.deepEqual(mapOption(None,    x => x), None,    'identity law: None case')

// Exercise 3: Composition law — mapOption(mapOption(fa, f), g) = mapOption(fa, g ∘ f)
const inc = (n: number) => n + 1

assert.deepEqual(
  mapOption(mapOption(Some(5), double), inc),
  mapOption(Some(5), n => inc(double(n))),
  'composition law: Some case'
)
assert.deepEqual(
  mapOption(mapOption(None as Option<number>, double), inc),
  mapOption(None as Option<number>, n => inc(double(n))),
  'composition law: None case'
)

// ─── Type-level ───────────────────────────────────────────────────────────────

// Exercise 4: Fill in the return type of mapOption.
type MapOptionType = TODO

type _1 = Expect<Equal<MapOptionType, <A, B>(opt: Option<A>, f: (a: A) => B) => Option<B>>>

// Exercise 5: What does map do to the type parameter?
// If opt: Option<string> and f: (s: string) => number, what is the result type?
type _2 = Expect<Equal<ReturnType<typeof mapOption<string, number>>, TODO>>

// Exercise 6: A functor must "lift" any morphism A → B to F(A) → F(B).
// What is the type of the "lifted" function?
type LiftOption<A, B> = TODO  // (f: (a: A) => B) => (opt: Option<A>) => Option<B>

type _3 = Expect<Equal<LiftOption<string, number>, (f: (a: string) => number) => (opt: Option<string>) => Option<number>>>
