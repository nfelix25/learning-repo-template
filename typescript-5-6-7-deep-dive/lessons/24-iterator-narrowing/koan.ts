import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 24 — Iterator Narrowing Strictness                      [TS 5.6]
// ─────────────────────────────────────────────────════════════════════════
// BACKGROUND — the IteratorResult type:
//   When you call `.next()` on an iterator, you get an `IteratorResult<T, R>`:
//
//     type IteratorResult<T, TReturn = any> =
//       | IteratorYieldResult<T>   // { done: false, value: T }
//       | IteratorReturnResult<TReturn>  // { done: true, value: TReturn }
//
//   The distinction matters: when `done` is false, `value` is the yield type T.
//   When `done` is true, `value` is the return type (often void or undefined).
//
// THE OLD PROBLEM (pre-TS 5.6):
//   TypeScript was lenient about accessing `.value` without checking `.done`.
//   This led to bugs where you accessed the return value (often undefined)
//   thinking it was a yield value.
//
// WHAT TS 5.6 TIGHTENED:
//   When you access `result.value` without checking `result.done` first,
//   TypeScript now includes the return type in the value type.
//
//   Concretely, on an `IteratorResult<number, void>`:
//   - Without done check: value is `number | void`  (includes return type)
//   - With `!result.done` check: value is `number`   (only yield type)
//
// THE FIX — always check done before accessing value:
//   for (const item of iterable) { ... }  ← handles done automatically ✓
//
//   for manual iteration:
//   const result = iter.next()
//   if (!result.done) {
//     use(result.value)    // value is narrowed to T, not T | TReturn
//   }
//
// WHEN THIS MATTERS:
//   Any code that manually calls `.next()` on an iterator, generator, or
//   any object implementing the Iterator protocol.
//   for..of and destructuring handle this automatically.
// ═══════════════════════════════════════════════════════════════════════════

// ── Setup: a simple generator ────────────────────────────────────────────

function* range(start: number, end: number): Generator<number, "done", unknown> {
  for (let i = start; i < end; i++) {
    yield i
  }
  return "done"
}

// ── Exercise A — accessing value without checking done ────────────────────
// Without checking done, value includes the return type (string "done").

const iter = range(0, 3)
const firstResult = iter.next()

// Without done check: value is number | "done"
type _A1 = Expect<Equal<typeof firstResult.value, number | "done">>

// ── Exercise B — correct: check done before accessing value ───────────────
// TODO: Use a proper done check to narrow the value to number.

function collectValues(gen: Generator<number, "done", unknown>): number[] {
  const values: number[] = []
  // TODO: use while loop with done check to collect only yield values
  // Incorrect (would include return value in type):
  //   let result = gen.next()
  //   while (!result.done) {
  //     values.push(result.value)   ← needs done check to narrow to number
  //     result = gen.next()
  //   }
  return values
}

type _B1 = Expect<Equal<ReturnType<typeof collectValues>, number[]>>

// ── Exercise C — narrowing after done check ───────────────────────────────
// After checking result.done, TypeScript narrows the type:

const iter2 = range(0, 5)
const r = iter2.next()

if (!r.done) {
  // Inside here: r is IteratorYieldResult<number>
  // r.value is narrowed to number (not number | "done")
  type _C1 = Expect<Equal<typeof r.value, number>>
}

// In the done=true case:
const finalIter = range(0, 0)  // empty range
const finalResult = finalIter.next()
if (finalResult.done) {
  // r is IteratorReturnResult<"done">
  // value is "done" (the return type)
  type _C2 = Expect<Equal<typeof finalResult.value, "done">>
}

// ── Exercise D — for..of handles this automatically ──────────────────────
// The safest way to iterate: for..of never gives you the return value.

function sumRange(start: number, end: number): number {
  let total = 0
  for (const n of range(start, end)) {
    total += n     // n is always number — for..of only yields the T type
    type _D_check = Expect<Equal<typeof n, number>>
  }
  return total
}

type _D1 = Expect<Equal<ReturnType<typeof sumRange>, number>>

// ── Exercise E — IteratorYieldResult vs IteratorReturnResult ─────────────
// Understanding the two halves of IteratorResult:

type YieldResult = IteratorYieldResult<number>    // { done: false, value: number }
type ReturnResult = IteratorReturnResult<"done">  // { done: true,  value: "done" }

// TS narrows based on `done`:
declare const result: IteratorResult<number, "done">

if (result.done === false) {
  type _E1 = Expect<Equal<typeof result.value, number>>  // yield type only
}
if (result.done === true) {
  type _E2 = Expect<Equal<typeof result.value, "done">>  // return type only
}
