import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 17 — switch(true) Narrowing + Boolean Comparisons       [TS 5.3]
// ─────────────────────────────────────────────────────────────────────────
// TWO IMPROVEMENTS IN TS 5.3:
//
// 1. SWITCH(TRUE) NARROWING:
//   TypeScript now narrows the type of variables inside `case` clauses of
//   `switch(true)`. This unlocks an ergonomic pattern for dispatching on
//   discriminated unions and complex type guards:
//
//   Before (if/else chain):
//     if (isString(x))      { doStringThing(x) }
//     else if (isNumber(x)) { doNumberThing(x) }
//     else                  { doFallback(x) }
//
//   After (switch(true)):
//     switch (true) {
//       case isString(x):  doStringThing(x); break  // x is string here ✓
//       case isNumber(x):  doNumberThing(x); break  // x is number here ✓
//       default:           doFallback(x)            // x is narrowed here ✓
//     }
//
//   Benefits: exhaustiveness check via default, cleaner when you have 4+
//   cases, plays well with user-defined type guard functions.
//
// 2. BOOLEAN COMPARISON NARROWING:
//   If you call a type predicate function and compare its result to `true`
//   or `false`, TypeScript now narrows correctly:
//
//   Before (TS < 5.3):
//     if (isString(x) === true) { ... }  // x was NOT narrowed to string
//
//   After (TS 5.3+):
//     if (isString(x) === true) { ... }  // x IS narrowed to string ✓
//
//   Also works with:
//     if (isString(x) !== false) { ... }  // narrows to string ✓
//
// WHEN switch(true) BEATS if/else:
//   - 4+ branches that each need different narrowing
//   - When you want exhaustiveness checking via `default`
//   - When the conditions are non-trivial type guards (not simple ===)
//   - Style preference for pattern-matching-like syntax
// ═══════════════════════════════════════════════════════════════════════════

// ── Setup: type guards ────────────────────────────────────────────────────

type Payload = StringPayload | NumberPayload | BooleanPayload | NullPayload
interface StringPayload  { kind: "string";  value: string  }
interface NumberPayload  { kind: "number";  value: number  }
interface BooleanPayload { kind: "boolean"; value: boolean }
interface NullPayload    { kind: "null" }

function isString(x: unknown): x is string   { return typeof x === "string"  }
function isNumber(x: unknown): x is number   { return typeof x === "number"  }
function isBoolean(x: unknown): x is boolean { return typeof x === "boolean" }

// ── Exercise A — switch(true) with discriminated union ────────────────────
// TODO: Rewrite this if/else chain as a switch(true) with narrowing in each case.
// The function should return a description string for each payload type.

function describePayload_ifelse(p: Payload): string {
  if (p.kind === "string")  return `string: ${p.value}`
  if (p.kind === "number")  return `number: ${p.value}`
  if (p.kind === "boolean") return `boolean: ${p.value}`
  return "null"
}

// TODO: Implement describePayload using switch(true).
// Each case should narrow p to the specific payload type.
function describePayload(p: Payload): string {
  switch (true) {
    // TODO: case p.kind === "string": ...
    // TODO: case p.kind === "number": ...
    // TODO: case p.kind === "boolean": ...
    default: return "null"
  }
}

type _A1 = Expect<Equal<ReturnType<typeof describePayload>, string>>

// ── Exercise B — switch(true) with type guard functions ───────────────────
// switch(true) works with arbitrary boolean expressions, including type guards.

function processValue(x: string | number | boolean): string {
  // TODO: Implement using switch(true) + the isString/isNumber/isBoolean guards.
  // TS 5.3+ narrows x in each case clause.
  return String(x)
}

type _B1 = Expect<Equal<ReturnType<typeof processValue>, string>>

// ── Exercise C — boolean comparison narrowing ────────────────────────────
// In TS 5.3+, comparing a type guard result to `true`/`false` narrows correctly.

function handleInput(x: string | number | null): string {
  // TODO: Use `if (isString(x) === true)` — in TS 5.3+ this should narrow x to string.
  if (isString(x)) {
    return x.toUpperCase()
  }
  if (isNumber(x)) {
    return x.toFixed(2)
  }
  return "null"
}

type _C1 = Expect<Equal<ReturnType<typeof handleInput>, string>>

// ── Exercise D — exhaustiveness with switch(true) ────────────────────────
// Unlike plain switch, switch(true) can express exhaustiveness via `default`.
// TypeScript narrows the remaining type in `default`:

type Animal = Dog | Cat | Fish
interface Dog  { species: "dog";  bark(): void   }
interface Cat  { species: "cat";  meow(): void   }
interface Fish { species: "fish"; swim(): void   }

function describeAnimal(a: Animal): string {
  switch (true) {
    case a.species === "dog":  return `dog: ${a.species}`  // a is Dog
    case a.species === "cat":  return `cat: ${a.species}`  // a is Cat
    case a.species === "fish": return `fish: ${a.species}` // a is Fish
    default: {
      // After exhausting all cases, this should be `never`:
      const _exhausted: never = a
      return `unknown: ${String(a)}`
    }
  }
}

type _D1 = Expect<Equal<ReturnType<typeof describeAnimal>, string>>
