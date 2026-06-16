import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 18 — Granular `infer` Narrowing in Conditional Types    [TS 5.8]
// ─────────────────────────────────────────────────────────────────────────
// BACKGROUND — how `infer` works in conditional types:
//   `infer X` inside `extends` captures a piece of a type:
//
//     type ElementType<T> = T extends (infer E)[] ? E : never
//     type R = ElementType<string[]>  // string
//
//   The captured variable `E` is only available in the true branch.
//
// THE OLD PROBLEM (pre-TS 5.8):
//   When you had MULTIPLE `infer` clauses in a complex conditional,
//   TypeScript sometimes couldn't narrow them properly in their respective
//   branches. You'd get overly conservative types or need explicit checks:
//
//     type Split<T> =
//       T extends `${infer A}.${infer B}`
//         ? [A, B]       // Before 5.8, A and B might not be fully narrowed
//         : [T, never]
//
//   More impactfully, `infer X extends SomeConstraint` in the true branch
//   wasn't always treated as narrowed to SomeConstraint:
//
//     type ExtractString<T> =
//       T extends { value: infer V extends string }
//         ? V    // Before 5.8: V might be string | unknown in some scenarios
//         : never
//
// WHAT TS 5.8 FIXED:
//   TypeScript now correctly narrows each `infer`-extracted variable in the
//   branch where it was bound. `infer V extends string` in the true branch
//   means V IS string — no extra check needed.
//
//   Also improved: the false branch can now reference an infer'd variable
//   WITH correct bounds, not just `unknown`.
//
// PRACTICAL IMPACT:
//   - Complex utility types are more precise
//   - Fewer `& string` casts needed in the true branch
//   - Template literal infer patterns narrow correctly
//   - Nested conditional types with multiple infer clauses behave predictably
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — infer with extends constraint ────────────────────────────
// `infer V extends Constraint` narrows V to Constraint in the true branch.

// TODO: This utility should extract the value type if it's a string.
// In TS 5.8, V should be inferred AS string in the true branch (no cast needed).
type ExtractStringValue<T> =
  T extends { value: infer V extends string }
    ? V          // V is already narrowed to string ✓ (TS 5.8)
    : never

type _A1 = Expect<Equal<ExtractStringValue<{ value: "hello" }>, "hello">>
type _A2 = Expect<Equal<ExtractStringValue<{ value: 42 }>, never>>
type _A3 = Expect<Equal<ExtractStringValue<{ value: string }>, string>>

// ── Exercise B — multiple infer clauses ───────────────────────────────────
// Each infer variable is independently narrowed in its branch.

// TODO: Implement FirstAndRest — extract the first element and the rest of a tuple.
type FirstAndRest<T extends unknown[]> =
  T extends [infer First, ...infer Rest]
    ? { first: First; rest: Rest }
    : { first: never; rest: [] }

type _B1 = Expect<Equal<FirstAndRest<[1, 2, 3]>, { first: 1; rest: [2, 3] }>>
type _B2 = Expect<Equal<FirstAndRest<[string]>, { first: string; rest: [] }>>
type _B3 = Expect<Equal<FirstAndRest<[]>, { first: never; rest: [] }>>

// ── Exercise C — template literal infer narrowing ─────────────────────────
// In TS 5.8, infer in template literals stays as the inferred string literal.

// TODO: Implement EventName — strips an "on" prefix from a string.
type EventName<T extends string> =
  T extends `on${infer E}` ? E : never

type _C1 = Expect<Equal<EventName<"onClick">, "Click">>
type _C2 = Expect<Equal<EventName<"onKeyDown">, "KeyDown">>
type _C3 = Expect<Equal<EventName<"click">, never>>

// ── Exercise D — the infer-with-constraint pattern ────────────────────────
// A common pattern: extract a type only if it meets a constraint.

// TODO: Implement ExtractArrayElement — works only if T is an array.
// The element type should be precisely inferred, not widened.
type ExtractArrayElement<T> =
  T extends (infer E)[] ? E : never

type _D1 = Expect<Equal<ExtractArrayElement<string[]>, string>>
type _D2 = Expect<Equal<ExtractArrayElement<[1, 2, 3]>, 1 | 2 | 3>>
type _D3 = Expect<Equal<ExtractArrayElement<string>, never>>

// ── Exercise E — before 5.8 workaround (now unnecessary) ─────────────────
// Before TS 5.8, you sometimes needed `V & string` to ensure string ops.
// After 5.8, the constraint on `infer V extends string` is sufficient.

type OldStyle<T> =
  T extends { name: infer V }
    ? V extends string     // redundant check in TS 5.8+
      ? V
      : never
    : never

// With TS 5.8, the inner `extends string` check is no longer needed:
type NewStyle<T> =
  T extends { name: infer V extends string }
    ? V  // V is already string — no extra check
    : never

type _E1 = Expect<Equal<NewStyle<{ name: "Alice" }>, "Alice">>
type _E2 = Expect<Equal<NewStyle<{ name: string }>, string>>
type _E3 = Expect<Equal<NewStyle<{ name: 42 }>, never>>
