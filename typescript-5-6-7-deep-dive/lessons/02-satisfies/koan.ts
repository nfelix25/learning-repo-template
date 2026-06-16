import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 02 — The `satisfies` Operator                           [TS 4.9]
// ─────────────────────────────────────────────────────────────────────────
// Note: `satisfies` arrived in TS 4.9 but is foundational to 5.x patterns.
// It's included here because it's often missing from devs who learned TS
// before 4.9 and is the right conceptual anchor for const type params.
//
// PROBLEM — the annotation/assertion tradeoff:
//   You want to validate that a value matches a shape AND keep the precise
//   literal type. The three tools before `satisfies`:
//
//   1. Type annotation `: Record<string, string>`
//      → Validates shape ✓   but WIDENS the type ✗ (loses literals)
//
//   2. Type assertion `as Record<string, string>`
//      → Unsafe ✗  and WIDENS the type ✗  (compiler trusts you blindly)
//
//   3. No annotation
//      → Keeps literals ✓  but skips validation ✗ (typos compile fine)
//
// SOLUTION — `satisfies`:
//   Checks that the value is assignable to a type, but the *inferred* type
//   of the value remains what TypeScript would infer — not the checked type.
//
//     const palette = {
//       red:   [255, 0, 0],
//       green: "#00ff00",
//     } satisfies Record<string, string | number[]>
//
//     palette.red   // type: number[]     (not string | number[])
//     palette.green // type: string       (not string | number[])
//
//   The check happened. The literals survived.
//
// HOW IT WORKS:
//   `satisfies T` is a type-level assertion. It triggers a type-check against
//   T at the declaration site, then throws T away — the resulting type is
//   the inferred type, not T. Think of it as "prove this is a T, then forget T."
//
// WHEN TO USE:
//   - Config objects where you want shape validation but keep literal access
//   - Large objects where a partial annotation would widen all values
//   - When you want to catch typos in keys without losing the key literal type
//   - Any time you're reaching for `as Type` but feeling guilty about it
//
// vs TYPE ANNOTATION:
//   Use `: Type` when you actually want the widened type downstream
//   (e.g., a function parameter that accepts different values over time).
//   Use `satisfies` when the value is fixed and you want precise types.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — annotation widens, satisfies doesn't ─────────────────────

// This object uses a type annotation. Notice the widened types below.
const configAnnotated: Record<string, string | number> = {
  host: "localhost",
  port: 3000,
}
// These are widened — not the literal types we'd want:
type _A1 = Expect<Equal<typeof configAnnotated.host, string | number>>

// TODO: Rewrite `configSatisfies` to use `satisfies` instead of `: Record<...>`.
// It should still validate the shape but preserve literal types.
const configSatisfies = {
  host: "localhost",
  port: 3000,
}
// After your fix, accessing keys should give the narrower types:
type _A2 = Expect<Equal<typeof configSatisfies.host, string>>
type _A3 = Expect<Equal<typeof configSatisfies.port, number>>

// ── Exercise B — catching a bad key with satisfies ─────────────────────────

type Routes = Record<"home" | "about" | "contact", string>

// TODO: Add `satisfies Routes` to this object.
// Once you do, adding a bad key like "hom" should be a type error.
const routes = {
  home:    "/",
  about:   "/about",
  contact: "/contact",
}

// After your fix, this should be a type error (bad key):
// @ts-expect-error — "hom" is not a key of Routes
const _badRoutes = { hom: "/", about: "/about", contact: "/contact" } satisfies Routes

// And valid route access still returns string:
type _B1 = Expect<Equal<typeof routes.home, string>>

// ── Exercise C — satisfies vs as (the unsafe alternative) ─────────────────

// `as` would let this compile even though "invalid" is not a valid key.
// `satisfies` won't. Observe the difference:
const _unsafe = { hom: "/" } as unknown as Routes   // No error — double cast bypasses all safety
// @ts-expect-error — satisfies correctly rejects the wrong shape
const _safe = { hom: "/" } satisfies Routes

// ── Exercise D — real-world: typed event map ──────────────────────────────

type EventMap = Record<string, (...args: unknown[]) => void>

// TODO: Add `satisfies EventMap` so the shape is validated.
// Then update the handler types to be specific instead of `unknown[]`.
const handlers = {
  click:   (e: MouseEvent) => console.log(e.clientX),
  keydown: (e: KeyboardEvent) => console.log(e.key),
}

// After your fix: handlers satisfies EventMap AND retains specific types:
type _D1 = Expect<Equal<
  Parameters<typeof handlers.click>[0],
  MouseEvent
>>
type _D2 = Expect<Equal<
  Parameters<typeof handlers.keydown>[0],
  KeyboardEvent
>>
