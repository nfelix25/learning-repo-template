import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 36 — stableTypeOrdering + TS 6→7 Migration             [TS 7.0β]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json with stableTypeOrdering: true
// Run with: tsc -p lessons/36-stable-type-ordering/tsconfig.json --noEmit
//
// WHAT IS stableTypeOrdering?
//   In the JS-based TypeScript compiler (TS ≤ 6.0), the ORDER in which types
//   appeared in unions and intersections was not always deterministic.
//   The order could depend on: the order of inference, the order properties
//   were accessed, and other runtime factors.
//
//   This non-determinism was mostly invisible — TypeScript is structurally
//   typed so `A | B` and `B | A` are equivalent. But it could affect:
//   - Which overload resolves (for overloaded functions)
//   - How types display in error messages (A | B vs B | A)
//   - Which branch of a conditional type is checked first
//
//   In the Go compiler (TS 7.0), types are sorted deterministically.
//   They had to be — parallel workers can't have different type orderings
//   depending on which worker processed each file first.
//
// THE FLAG:
//   `stableTypeOrdering: true` was added in TS 6.0 as an OPT-IN to
//   get TS 7.0's deterministic type ordering while still on TS 6.0.
//   Purpose: run on your TS 6.0 codebase to see if any types change
//   and fix them BEFORE upgrading to TS 7.0.
//
//   In TS 7.0: stableTypeOrdering is ALWAYS on and cannot be disabled.
//
// WHAT MIGHT CHANGE:
//   Most code is unaffected. Changes surface in:
//   1. Code that depends on union member ORDER (rare, usually bugs)
//   2. Complex overload resolution where type order affected which matched
//   3. Conditional type branches that resolved based on inference order
//   4. Error messages that show union members in a specific order
//
// HOW TO USE IT AS A SMOKE TEST:
//   1. Add stableTypeOrdering: true to your tsconfig
//   2. Run tsc --noEmit
//   3. Any new errors reveal type assertions that depended on ordering
//   4. Fix those assertions to be order-independent
//   5. Remove stableTypeOrdering: true (it's on by default in TS 7.0)
//   6. Upgrade to TS 7.0
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — union types are structurally equivalent regardless of order
// A | B is the same type as B | A structurally.
// Code that works correctly should be order-independent.

type AB = string | number
type BA = number | string

// These ARE the same type — Equal should return true:
type _A1 = Expect<Equal<AB, BA>>

// ── Exercise B — where order DID matter (and shouldn't) ───────────────────
// If you wrote type assertions that assumed a specific union member ORDER,
// those assertions might fail under stableTypeOrdering.

// Example of ORDER-DEPENDENT assertion (fragile, should be fixed):
type OrderSensitive<T> =
  T extends string | number
    ? "string-first"   // This branch assumes string comes before number
    : "other"

// An ORDER-INDEPENDENT assertion (robust):
type OrderIndependent<T> =
  T extends string
    ? "is-string"
    : T extends number
    ? "is-number"
    : "other"

// The order-independent version gives consistent results regardless of
// how the union members are ordered internally:
type _B1 = Expect<Equal<OrderIndependent<string>, "is-string">>
type _B2 = Expect<Equal<OrderIndependent<number>, "is-number">>
type _B3 = Expect<Equal<OrderIndependent<boolean>, "other">>

// ── Exercise C — overloads and union ordering ─────────────────────────────
// Overload resolution uses the first matching signature.
// If overloads cover a union, the order determines which fires first.
// Good code makes this deterministic by being specific:

function formatValue(x: string): `"${string}"`
function formatValue(x: number): string
function formatValue(x: string | number): string {
  if (typeof x === "string") return `"${x}"`
  return x.toFixed(2)
}

// These should be deterministic regardless of type ordering.
// Test via actual call sites (overloads don't support type-arg syntax on typeof):
declare const _c1: ReturnType<(x: string) => `"${string}"`>
declare const _c2: ReturnType<(x: number) => string>
const _c1_actual = formatValue("hello")
const _c2_actual = formatValue(42)
type _C1 = Expect<Equal<typeof _c1_actual, `"${string}"`>>
type _C2 = Expect<Equal<typeof _c2_actual, string>>

// ── Exercise D — the migration smoke test pattern ────────────────────────
// This exercise shows how to write assertions that survive stableTypeOrdering.

// FRAGILE — depends on union order:
type FragileCheck<T extends string | number> =
  [T] extends [string | number] ? true : false

// ROBUST — checks membership, not order:
type RobustCheck<T> =
  T extends string | number ? true : false

type _D1 = Expect<Equal<RobustCheck<string>, true>>
type _D2 = Expect<Equal<RobustCheck<number>, true>>
type _D3 = Expect<Equal<RobustCheck<boolean>, false>>

// ── Exercise E — what stableTypeOrdering guarantees ───────────────────────
// With stableTypeOrdering + TS 7.0:
// 1. Union members are sorted in a deterministic order
// 2. The same code produces the same types every time it's checked
// 3. Two TypeScript 7.0 processes checking the same file produce identical output
// 4. Error messages show types in a consistent order

// The type-level effect: usually invisible. The diagnostic effect: consistent.

// Your goal as a developer: write type assertions that test MEMBERSHIP,
// not POSITION. If your assertion breaks under stableTypeOrdering, it was
// testing the wrong thing.

type GoodAssertion<T> = T extends string | number ? true : false   // tests if T is in the set
type BadAssertion<T extends string | number> = T extends [string, number][number] ? true : false  // also fine

type _E1 = Expect<Equal<GoodAssertion<string>, true>>
type _E2 = Expect<Equal<GoodAssertion<number>, true>>
type _E3 = Expect<Equal<GoodAssertion<boolean>, false>>
