import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 20 — isolatedDeclarations                               [TS 5.5]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig that enables the flag.
// Run with: tsc -p lessons/20-isolated-declarations/tsconfig.json --noEmit
//
// WHY isolatedDeclarations EXISTS:
//   TypeScript's declaration file emit (`.d.ts`) normally requires
//   whole-program type resolution. To compute the type of an export, the
//   compiler may need to follow imports across many files.
//
//   This is a bottleneck. Declaration emit for a large codebase is sequential
//   because each file might depend on the types of other files.
//
//   TypeScript 7.0 solves this with PARALLEL declaration emit — but it only
//   works if each file can produce its .d.ts WITHOUT seeing other files.
//
// THE CONTRACT:
//   `--isolatedDeclarations` enforces that every exported declaration
//   can be annotated without cross-file inference. Concretely:
//   "If TypeScript can determine the type of an export by looking at ONLY
//   that file, the annotation is optional. Otherwise, you MUST annotate."
//
// WHAT REQUIRES EXPLICIT ANNOTATION:
//   ✗ export function getUser() { return fetchUser() }
//     (return type requires knowing fetchUser's type from another file)
//   ✓ export function getUser(): Promise<User> { return fetchUser() }
//
//   ✗ export const data = complexUtilityType<SomeImport>()
//     (requires following the imported type)
//   ✓ export const data: ReturnType<typeof complexUtilityType<SomeImport>> = ...
//     or: export const data: SpecificType = ...
//
// WHAT IS TRIVIALLY INFERRABLE (no annotation needed):
//   - String literals: export const VERSION = "1.0.0"   // string literal, obvious
//   - Number literals: export const PORT = 3000
//   - `as const` values: export const config = { ... } as const
//
// THE TS 7.0 CONNECTION:
//   When `isolatedDeclarations` is satisfied, each file's .d.ts can be
//   emitted in parallel. TypeScript 7.0 (Go compiler) uses this to spin up
//   multiple declaration-emit workers simultaneously.
//   Enabling isolatedDeclarations in your codebase NOW is the migration path
//   to getting full TS 7.0 parallelism benefits.
//
// THINK OF IT AS DESIGN DISCIPLINE:
//   Rather than a burden, isolatedDeclarations nudges you toward APIs with
//   explicit, readable types — which also benefits human readers.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — functions need explicit return types ─────────────────────
// Under isolatedDeclarations, exported functions with non-trivial return
// types must have explicit annotations.

// Without isolatedDeclarations, this would compile:
//   export function add(a: number, b: number) { return a + b }
// With isolatedDeclarations, TS errors: "Return type must be annotated"

// TODO: Add return type annotations to these exported functions.

export function add(a: number, b: number) {
  return a + b
}

export function formatName(first: string, last: string) {
  return `${first} ${last}`
}

export function parseItems(input: string) {
  return input.split(",").map(s => s.trim())
}

// After your fix:
type _A1 = Expect<Equal<ReturnType<typeof add>, number>>
type _A2 = Expect<Equal<ReturnType<typeof formatName>, string>>
type _A3 = Expect<Equal<ReturnType<typeof parseItems>, string[]>>

// ── Exercise B — re-exports need explicit types ───────────────────────────
// When re-exporting something whose type comes from another file, you need
// an explicit intermediate annotation.

// Simulated imported value (in a real file this would come from an import):
declare function _fetchUser(): Promise<{ id: number; name: string }>

// Under isolatedDeclarations, this pattern would error:
//   export const getUser = _fetchUser  // return type unknown without following _fetchUser

// TODO: Add explicit type annotation to make this isolatedDeclarations-safe.
export const getUser: () => Promise<{ id: number; name: string }> = _fetchUser

type _B1 = Expect<Equal<ReturnType<typeof getUser>, Promise<{ id: number; name: string }>>>

// ── Exercise C — trivially inferrable exports (no annotation needed) ───────
// These are fine under isolatedDeclarations — no annotation required:

export const VERSION = "1.0.0"       // string literal — trivially inferrable
export const PORT = 3000              // number literal — trivially inferrable
export const DEBUG = false            // boolean literal — trivially inferrable

type _C1 = Expect<Equal<typeof VERSION, "1.0.0">>
type _C2 = Expect<Equal<typeof PORT, 3000>>

// ── Exercise D — design implication: explicit APIs are clearer ────────────
// isolatedDeclarations forces you to write the type the caller will see.
// This is good documentation and makes the API surface explicit.

// Without isolatedDeclarations, this "works" but the return type is opaque:
//   export function buildQuery(table: string) {
//     return { table, where: null, limit: 10 }
//   }

// With isolatedDeclarations (and good API design), you'd write:
interface Query { table: string; where: string | null; limit: number }

export function buildQuery(table: string): Query {
  return { table, where: null, limit: 10 }
}

type _D1 = Expect<Equal<ReturnType<typeof buildQuery>, Query>>
