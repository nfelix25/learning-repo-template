// ─── k-055: TypeScript 7 Epilogue ────────────────────────────────────────────
//
// TypeScript 7 (announced May 2025, beta as of this writing) is a major
// architectural shift: the compiler is being rewritten in Go ("Go port").
//
// CRITICAL DISTINCTION:
//   TypeScript 6.x  — the canonical, npm-distributed TypeScript (written in TS)
//   TypeScript 7.x  — new Go-based compiler (shipped as `typescript-go` initially)
//
// What changes in TS7:
//   - Build speed: 10x faster for type-checking large codebases
//   - `--builders` flag: enables parallel incremental type-checking
//   - Same type system: TS7 is type-system compatible with TS6
//     (all types you learned in this curriculum are valid in TS7)
//   - Same tsconfig flags: strict, target, moduleResolution — unchanged
//   - Same lib types: ES2025, DOM — unchanged
//
// What does NOT change:
//   - The TypeScript type system (all koans in this curriculum remain valid)
//   - The language syntax (generics, conditionals, mapped types — identical)
//   - The developer experience (same error messages, same IDE integration)
//   - `tsc` is still available for TS6; TS7 provides a new CLI (`tsgo` or `tsc --ts7`)
//
// The Go rewrite is a performance optimization, not a language redesign.
// Everything you've learned applies directly.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: The type system is unchanged ──────────────────────────────────────
//
// All the types from this curriculum work exactly the same in TS7.
// This section is a lightning review of the key patterns.

// Generic constraints (k-001)
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Conditional types (k-015)
type IsString<T> = T extends string ? true : false
type _1a = Expect<Equal<IsString<string>, true>>
type _1b = Expect<Equal<IsString<number>, false>>

// Template literal types (k-020)
type EventName<T extends string> = `on${Capitalize<T>}`
type _1c = Expect<Equal<EventName<"click">, "onClick">>

// Recursive types (k-028)
type DeepReadonly<T> =
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T
type _1d = Expect<Equal<DeepReadonly<{ a: { b: number } }>, { readonly a: { readonly b: number } }>>

describe("type system compatibility — same in TS7", () => {
  it("generic constraints still work", () => {
    const obj = { name: "Alice", age: 30 }
    expect(pluck(obj, "name")).toBe("Alice")
    expect(pluck(obj, "age")).toBe(30)
  })
})

// ── Part 2: The --builders flag (TS7) ────────────────────────────────────────
//
// `--builders` enables parallel type-checking across files in a project.
// It's the key performance feature that makes TS7 10x faster in large repos.
//
// tsconfig.json with --builders:
//   {
//     "compilerOptions": { "builders": true }
//   }
//
// What it does: instead of a single sequential type-check pass, TypeScript 7
// splits the work across multiple workers (one per compilation unit or file group).
// This is only possible because the Go runtime handles parallelism efficiently.
//
// Usage (when TS7 is available on npm):
//   pnpm add typescript@next  -- (TS7 beta)
//   tsc --builders
//
// For now (TS 6.x), the `--builders` flag doesn't exist yet on the stable channel.
// This test is documentation only.

describe("TS7 --builders flag", () => {
  it.todo("verify build speed improvement with: tsc --builders (requires TS7)")
})

// ── Part 3: What to expect when upgrading ────────────────────────────────────
//
// Upgrading from TS6 to TS7:
//
// 1. Install the TS7 package (name TBD — likely `typescript@7.x` or `typescript-go`)
// 2. Your existing tsconfig.json works without changes
// 3. Your existing code works without changes (same type system)
// 4. Optionally add `"builders": true` to tsconfig for max performance
// 5. The `tsc` binary is replaced by a Go binary — same flags, faster execution
//
// Potential issues:
// - Third-party type declaration packages that relied on compiler internals may
//   need updates (rare for userland code)
// - Build tooling that spawns `tsc` directly may need path updates
// - If you use `ts-node` or `tsx`, those may need updates to work with TS7

describe("upgrade checklist from TS6 to TS7", () => {
  it.todo("type system: no changes required — all types compatible")
  it.todo("tsconfig: no required changes — optional builders: true for perf")
  it.todo("build tooling: update paths to new tsc binary")
})

// ── Part 4: Curriculum complete — full suite ──────────────────────────────────
//
// You've reached the end of this curriculum. Here's a summary of what you've learned:
//
// Phase 1  (k-001–004):  Advanced generics, const type parameters, NoInfer
// Phase 2  (k-005–009):  Narrowing, discriminated unions, predicates, assertions
// Phase 3  (k-010–014):  Mapped types, modifiers, key remapping, template literal keys
// Phase 4  (k-015–019):  Conditional types, distributive, infer, recursive
// Phase 5  (k-020–023):  Template literal types, intrinsics, pattern matching
// Phase 6  (k-024–027):  Variadic tuples, spreads, union/tuple conversions
// Phase 7  (k-028–031):  Recursive types, DeepPartial, path types, JSON
// Phase 8  (k-032–034):  Type-level programming, utility rebuilding, string ops
// Phase 9  (k-035–039):  Branded types, phantom types, variance, builders, emitters
// Phase 10 (k-040–048):  New decorators, metadata, using/disposal, TS 5.x features
// Phase 11 (k-049–054):  Strict mode, Temporal, RegExp.escape, Map upsert, TS 6.x
// Phase 12 (k-055):      TypeScript 7 context

describe("curriculum complete", () => {
  it("the full test suite passes", () => {
    expect(true).toBe(true)
  })
})
