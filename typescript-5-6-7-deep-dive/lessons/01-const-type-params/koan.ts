import type { Expect, Equal, NotEqual } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 01 — const Type Parameters                              [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// PROBLEM — literal type widening:
//   When TypeScript infers a type parameter from a value, it "widens" it to
//   the base type. Array literals become T[], string literals become string:
//
//     function identity<T>(val: T): T { return val }
//     const x = identity("hello")  // T inferred as string, not "hello"
//     const y = identity([1, 2, 3]) // T inferred as number[], not [1, 2, 3]
//
//   Before TS 5.0, the only workaround was `as const` at the call site:
//     const z = identity([1, 2, 3] as const)  // T = readonly [1, 2, 3]
//   ...but that puts the burden on every caller, not the function author.
//
// SOLUTION — `const` modifier on the type parameter:
//   Adding `const` before the type parameter name tells TypeScript to infer
//   the most specific (literal) type instead of widening:
//
//     function identity<const T>(val: T): T { return val }
//     const x = identity("hello")  // T = "hello" ✓
//     const y = identity([1, 2, 3]) // T = readonly [1, 2, 3] ✓
//
// HOW IT WORKS:
//   `const T` is equivalent to applying `as const` inference at the type
//   parameter level. Arrays become readonly tuples, string literals stay
//   literal, object properties stay literal. The caller doesn't need to
//   do anything special.
//
// WHEN TO USE:
//   - Builder APIs where you want the exact literal type (route paths, keys)
//   - Functions that return their input with a precise type (identity, wrap)
//   - Tuple-returning functions where length and element types matter
//   - Any generic where "preserve what was passed in" is the intent
//
// LIMITS / EDGE CASES:
//   - Only works on the type parameter, not on the function parameter itself
//   - `const T` only affects inference — explicit type args bypass it:
//       identity<string>("hello") // T = string, not "hello"
//   - Works with objects too: `{a: 1}` → `{readonly a: 1}`
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A ─────────────────────────────────────────────────────────────
// TODO: Add the `const` modifier to make this function infer literal types.

function identity<T>(val: T): T {
  return val
}

// After your fix, these assertions should compile:
type _A1 = Expect<Equal<ReturnType<typeof identity<"hello">>, "hello">>
type _A2 = Expect<Equal<ReturnType<typeof identity<42>>, 42>>

// ── Exercise B ─────────────────────────────────────────────────────────────
// TODO: Add `const` so `makeRoute` preserves the exact path string.

function makeRoute<T extends string>(path: T): { path: T } {
  return { path }
}

type _B1 = Expect<Equal<ReturnType<typeof makeRoute<"/users/:id">>, { path: "/users/:id" }>>

// ── Exercise C ─────────────────────────────────────────────────────────────
// TODO: Add `const` so this tuple-builder preserves exact element types.

function makePair<const T, const U>(first: T, second: U): [T, U] {
  return [first, second]
}

// After your fix:
const pair = makePair("hello", 42)
type _C1 = Expect<Equal<typeof pair, ["hello", 42]>>
// Without `const`, this would be [string, number] — not what we want.
type _C2 = Expect<NotEqual<typeof pair, [string, number]>>

// ── Exercise D — real-world: config keys ───────────────────────────────────
// TODO: Add `const` so the keys array preserves literal union membership.

function defineConfig<const T extends string>(keys: T[]): { keys: T[] } {
  return { keys }
}

const config = defineConfig(["debug", "verbose", "trace"])
// After your fix, T should be "debug" | "verbose" | "trace", not string.
type _D1 = Expect<Equal<typeof config, { keys: ("debug" | "verbose" | "trace")[] }>>

// ── Bonus: the `as const` alternative (no code change needed) ──────────────
// This is what callers had to write before TS 5.0. Notice the burden shift.
function identityOld<T>(val: T): T { return val }
const withAsConst = identityOld(["a", "b", "c"] as const)
type _E1 = Expect<Equal<typeof withAsConst, readonly ["a", "b", "c"]>>
// With `const T`, callers can just write identityNew(["a", "b", "c"]) directly.
