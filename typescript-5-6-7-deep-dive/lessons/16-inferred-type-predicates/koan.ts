import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 16 — Inferred Type Predicates                           [TS 5.5]
// ─────────────────────────────────────────────────────────────────────────
// THE CLASSIC FOOTGUN — .filter() doesn't narrow:
//   Every TypeScript developer has hit this. You have an array with nulls,
//   you filter them out, and the type is still T | null:
//
//     const items: (string | null)[] = ["a", null, "b", null, "c"]
//     const filtered = items.filter(x => x !== null)
//     // Type: (string | null)[]  ← WHY!?
//
//   Because before TS 5.5, TypeScript could not infer that
//   `x => x !== null` is a type predicate (x is string).
//   You had to write it explicitly:
//     items.filter((x): x is string => x !== null)
//
// SOLUTION (TS 5.5) — automatic type predicate inference:
//   TypeScript now automatically infers `x is T` from simple predicate
//   expressions. The filter footgun is fixed:
//
//     const filtered = items.filter(x => x !== null)
//     // Type: string[]  ✓  (TS 5.5+ infers the predicate)
//
// CONDITIONS FOR INFERENCE:
//   TypeScript infers a predicate when the function:
//   1. Has a single expression body (no curly braces, no multiple statements)
//   2. The expression is a type guard (typeof, instanceof, !== null, in, etc.)
//   3. There's a clear narrowed type that can be expressed as `x is T`
//
// WHEN IT STILL DOESN'T WORK:
//   - Multi-statement function body:
//       .filter(x => { const y = x; return y !== null })  // no inference
//   - Complex non-narrowing conditions:
//       .filter(x => x.length > 0)  // infers boolean, not x is string
//   - When the predicate is too complex to represent as `x is T`
//
// WHAT GETS INFERRED:
//   x !== null    → x is NonNullable<typeof x>
//   typeof x === "string"  → x is string
//   x instanceof Date      → x is Date
//   "name" in x            → x is { name: ... }
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — the filter footgun is fixed ──────────────────────────────
// In TS 5.5+, this should now return string[] without an explicit predicate.

const mixedItems: (string | null | undefined)[] = ["a", null, "b", undefined, "c"]

// TODO: Filter out null and undefined. In TS 5.5+, the result should be string[].
const strings = mixedItems.filter(x => x !== null && x !== undefined)
type _A1 = Expect<Equal<typeof strings, string[]>>

// ── Exercise B — instanceof narrows correctly ────────────────────────────
type Shape = Circle | Square
class Circle { kind = "circle" as const; constructor(public radius: number) {} }
class Square { kind = "square" as const; constructor(public side: number) {} }

const shapes: Shape[] = [new Circle(5), new Square(3), new Circle(2)]

// TODO: Filter only circles. TS 5.5 should infer this as Circle[].
const circles = shapes.filter(s => s instanceof Circle)
type _B1 = Expect<Equal<typeof circles, Circle[]>>

// ── Exercise C — typeof narrows in filter ────────────────────────────────
const mixed: (string | number | boolean)[] = ["a", 1, true, "b", 2, false]

// TODO: Filter only strings. Should be string[].
const onlyStrings = mixed.filter(x => typeof x === "string")
type _C1 = Expect<Equal<typeof onlyStrings, string[]>>

// TODO: Filter only numbers. Should be number[].
const onlyNumbers = mixed.filter(x => typeof x === "number")
type _C2 = Expect<Equal<typeof onlyNumbers, number[]>>

// ── Exercise D — explicit predicate still needed for complex cases ─────────
// Not everything is inferrable. When the condition is complex, write it explicitly.

interface User { id: number; name: string; email?: string }

// This is NOT inferrable (the result type can't be expressed as a simple x is T):
const usersWithEmail = ([] as User[]).filter((u): u is User & { email: string } =>
  u.email !== undefined && u.email.length > 0
)
type _D1 = Expect<Equal<typeof usersWithEmail, (User & { email: string })[]>>

// ── Exercise E — multi-statement body loses inference ─────────────────────
// Even though the logic is equivalent, this does NOT get predicate inference:
const noInference = (["a", null] as (string | null)[]).filter(x => {
  const result = x !== null  // multi-statement body: no inference
  return result
})
// Type is (string | null)[] — TS cannot infer the predicate from a block body:
type _E1 = Expect<Equal<typeof noInference, (string | null)[]>>
