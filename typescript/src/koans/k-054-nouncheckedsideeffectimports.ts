// ─── k-054: noUncheckedSideEffectImports (TypeScript 6.0) ────────────────────
//
// TypeScript 6.0 introduced `--noUncheckedSideEffectImports`, which is now
// the DEFAULT behavior (unlike most other strict flags).
//
// What it does: side-effect imports (imports with no bindings) are now verified
// to resolve to an actual module. Previously, TypeScript silently ignored
// unresolvable side-effect imports:
//
//   import "./does-not-exist"  // was: silently ignored; now: ERROR
//   import "some-pkg/styles"   // was: ignored if not in types; now: ERROR
//
// Why the change: these silent ignores hid real bugs — typos in import paths,
// deleted files, packages without type declarations.
//
// Common patterns this affects:
// - CSS imports in bundled projects: `import "./styles.css"`
// - Polyfill imports: `import "reflect-metadata"`
// - Side-effect-only packages: `import "some-setup-module"`
//
// Workarounds when you legitimately need side-effect imports that don't type-check:
// 1. Add a `.d.ts` declaration file for the module
// 2. Use `// @ts-ignore` on the specific import
// 3. Configure `paths` or `typeRoots` in tsconfig
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Understanding side-effect imports ─────────────────────────────────
//
// A "side-effect import" imports a module purely for its side effects — it
// registers something, runs setup code, etc. No bindings are imported.

// This is a valid side-effect import (it resolves to a real module):
import "./k-054-side-effect-module.js"  // our local helper

describe("side-effect imports", () => {
  it("side-effect module ran and registered its effect", () => {
    // The module we imported pushed to a global array as its side effect
    expect((globalThis as any).__sideEffects).toContain("k-054-module-loaded")
  })
})

// ── Part 2: Importing bindings from the same side-effect module ───────────────
//
// The module also exports named bindings — accessible via regular named imports.

import { MARKER } from "./k-054-side-effect-module.js"

describe("importing bindings from side-effect module", () => {
  it("exports are accessible via named import", () => {
    expect(MARKER).toBe("k-054")
  })
})

// ── Part 3: Module declarations for unresolvable imports ─────────────────────
//
// When you need to import something TypeScript can't resolve (e.g., CSS files
// in a Vite project), you declare the module shape in a `.d.ts` file.
//
// Example: to make `import "./styles.css"` compile, add to a declarations.d.ts:
//   declare module "*.css" {}
//
// The `noUncheckedSideEffectImports` flag (on by default in TS 6.0) means that
// even this declaration must be present — you can no longer silently ignore
// unresolved side-effect imports.
//
// The following would be an ERROR in TS 6.0 without a declaration:
//   import "./styles.css"   // ERROR: no type declaration for this module
//
// To verify this behavior: add `import "./definitely-does-not-exist"` anywhere
// in this file and run `pnpm typecheck` — it will report an error.

describe("noUncheckedSideEffectImports behavior", () => {
  it("valid side-effect imports compile and run", () => {
    expect((globalThis as any).__sideEffects).toBeDefined()
  })
  it("TS 6.0 enforces resolvability of side-effect imports by default", () => {
    // This documents the behavior — see comments above for details
    // Run `pnpm typecheck` with an unresolved side-effect import to see the error
    expect(true).toBe(true)
  })
})

// ── Part 4: What noUncheckedSideEffectImports catches ─────────────────────────
//
// In practice, this flag catches:
// 1. Typos: `import "./utilts"` instead of `"./utils"`
// 2. Deleted files that weren't updated in imports
// 3. Package side effects that were never installed (or lack type declarations)
//
// The compile-time checks happen during `pnpm typecheck`, not during `pnpm test`.
// Runtime (Vitest) imports must actually resolve; TS's module declarations don't
// help at runtime — they're type-only.

describe("side-effect import summary", () => {
  it("runtime side effects persist across module scope", () => {
    const effects = (globalThis as any).__sideEffects as string[]
    expect(Array.isArray(effects)).toBe(true)
    expect(effects.length).toBeGreaterThan(0)
  })
})
