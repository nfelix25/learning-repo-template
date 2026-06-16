import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 14 — NoInfer<T>                                         [TS 5.4]
// ─────────────────────────────────────────────────────────────────────────
// PROBLEM — unintentional type widening via fallback parameters:
//   When multiple call-site arguments participate in inferring T, TypeScript
//   takes the union of all their contributions. A "fallback" or "default"
//   parameter is meant to CONFORM to T, not to DEFINE T — but without help,
//   TypeScript can't tell the difference:
//
//     function withDefault<T>(values: T[], fallback: T): T
//     withDefault([1, 2, 3], "oops")
//     //                      ^^^^^^ T infers as number | string — too wide!
//
//   TypeScript looks at both `values` (→ number) and `fallback` (→ string)
//   and takes the union. This lets a type mismatch silently "succeed".
//
// SOLUTION — NoInfer<T>:
//   `NoInfer<T>` is a built-in utility type (TS 5.4) that tells TypeScript:
//   "This position should be checked against T, but should NOT contribute
//    to inferring T."
//
//     function withDefault<T>(values: T[], fallback: NoInfer<T>): T
//     withDefault([1, 2, 3], "oops")  // Error: string not assignable to number ✓
//     withDefault([1, 2, 3], 0)       // OK: 0 is number ✓
//
// HOW IT WORKS:
//   Internally, `NoInfer<T>` is `T & { [some internal brand] }` that
//   the inference engine treats as opaque — the inference algorithm skips
//   positions wrapped in NoInfer<> when collecting type candidates.
//   At the use site, the value is still validated as `T`.
//
// MENTAL MODEL:
//   T has two kinds of positions:
//   - "Source" positions: define what T is (contribute to inference)
//   - "Consumer" positions: must match T but don't define it
//
//   NoInfer<T> marks a parameter as a consumer.
//
// WHEN TO USE:
//   - Fallback/default values: withDefault<T>(arr: T[], fallback: NoInfer<T>)
//   - Event callbacks: on<T>(event: T, handler: (e: NoInfer<T>) => void)
//   - Template slots: render<T>(template: T[], selected: NoInfer<T>)
//   - Any time a parameter "should match T" but "shouldn't widen T"
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — withDefault ──────────────────────────────────────────────
// TODO: Add NoInfer<T> to the fallback parameter so it can't widen T.

function withDefault<T>(values: T[], fallback: T): T {
  return values[0] ?? fallback
}

// After your fix, this should error (fallback widens T to number | string):
// @ts-expect-error — string is not assignable to number
withDefault([1, 2, 3], "oops")

// These should still compile:
const _a1 = withDefault([1, 2, 3], 0)
type _A1 = Expect<Equal<typeof _a1, number>>

const _a2 = withDefault(["x", "y"], "z")
type _A2 = Expect<Equal<typeof _a2, string>>

// ── Exercise B — event handler constraint ────────────────────────────────
// TODO: Add NoInfer to the handler parameter so it can't widen EventType.

type EventMap = { click: MouseEvent; keydown: KeyboardEvent }

function on<K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void
): void {
  // implementation would call addEventListener
}

// After your fix, passing the wrong event type should error.
// This exercise shows a case where NoInfer isn't needed (K is inferred from
// eventName, not handler), but notice how the handler is already constrained:
type _B1 = Expect<Equal<Parameters<typeof on>[0], keyof EventMap>>

// ── Exercise C — selecting from a known set ──────────────────────────────
// TODO: Add NoInfer so `selected` can't influence T's inference.
// T should come from `options` alone.

function createSelect<T>(options: T[], selected: T): { options: T[]; selected: T } {
  return { options, selected }
}

// TODO: change `selected: T` to `selected: NoInfer<T>` above, then this should be a type error:
// createSelect(["a", "b", "c"], "other")   // ← add @ts-expect-error once NoInfer is applied

const _c1 = createSelect(["a", "b", "c"], "a")
type _C1 = Expect<Equal<typeof _c1.options, ("a" | "b" | "c")[]>>
type _C2 = Expect<Equal<typeof _c1.selected, "a" | "b" | "c">>

// ── Exercise D — contrast: when NOT to use NoInfer ───────────────────────
// Sometimes you WANT both parameters to contribute to T.
// This exercise shows the difference.

// This function correctly widens T — the result type is the union:
function merge<T>(a: T, b: T): T[] {
  return [a, b]
}

// Both string and number contribute to T = string | number.
// Explicit type arg needed — TS infers from each arg separately:
const _d1 = merge<string | number>("hello", 42)
type _D1 = Expect<Equal<typeof _d1, (string | number)[]>>
// Here we WANT T to be string | number. NoInfer would be WRONG here.
// The lesson: only use NoInfer on positions that are consumers, not sources.
