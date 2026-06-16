export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 32 — TypeScript 6.0 Legacy Cleanup                     [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// TypeScript 6.0 is the cleanup release before the Go-based TS 7.0.
// It removes a decade of accumulated legacy syntax and options.
// Knowing WHAT was removed and WHY helps you speak to TypeScript's direction.
//
// REMOVED MODULE TARGETS:
//   module: "amd"      → AMD was RequireJS's format, mostly dead
//   module: "umd"      → Universal Module Definition, superseded by ESM
//   module: "systemjs" → SystemJS module format, mostly dead
//   module: "none"     → No module system at all
//
//   Migration: use module: "esnext" or "commonjs" with a bundler.
//
// REMOVED MODULE RESOLUTIONS:
//   moduleResolution: "node" / "node10"  → the old Node.js resolution
//     (doesn't handle package.json exports, ESM, etc.)
//   moduleResolution: "classic"          → never use this, it's legacy TypeScript
//
//   Migration: use moduleResolution: "bundler" (Vite, webpack, etc.)
//             or "nodenext" (native Node.js ESM)
//
// REMOVED/CHANGED FLAGS:
//   downlevelIteration     → only affected ES5 emit, which is now deprecated
//   outFile                → concatenates output, replaced by bundlers
//   esModuleInterop: false → always true now (safe interop)
//   allowSyntheticDefaultImports: false → always true now
//   alwaysStrict: false    → always strict now
//   baseUrl                → deprecated, use paths without baseUrl
//
// REMOVED SYNTAX:
//   `module` keyword in namespace declarations:
//     BEFORE: module MyModule { export const x = 1 }
//     AFTER:  namespace MyModule { export const x = 1 }
//
//   Import assertions (`assert {}`):
//     BEFORE: import x from "y" assert { type: "json" }
//     AFTER:  import x from "y" with { type: "json" }
//
//   `/// <reference no-default-lib="true"/>` directives:
//     BEFORE: used to exclude default lib types
//     AFTER:  use --noLib or --libReplacement instead
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — namespace keyword migration ──────────────────────────────
// The `module` keyword for declaring namespaces is removed in TS 6.0.
// `namespace` is the correct keyword (has been since TS 1.5+).

// BEFORE (deprecated / removed in 6.0):
// module Utils {
//   export function format(s: string): string { return s.trim() }
// }

// AFTER — correct syntax:
namespace Utils {
  export function format(s: string): string { return s.trim() }
  export type Formatter = (s: string) => string
}

const _formatted = Utils.format("  hello  ")

// ── Exercise B — import assertion → import attribute ──────────────────────
// Complete migration reference:

// REMOVED (TS 7.0):
// import data from "./data.json" assert { type: "json" }
// export { default } from "./data.json" assert { type: "json" }
// const d = await import("./data.json", { assert: { type: "json" } })

// CORRECT (TS 5.3+):
// import data from "./data.json" with { type: "json" }
// export { default } from "./data.json" with { type: "json" }
// const d = await import("./data.json", { with: { type: "json" } })

// ── Exercise C — moduleResolution migration ────────────────────────────────
// Reference card for the migration:

type OldResolution = "node" | "node10" | "classic"
type NewResolution = "bundler" | "nodenext" | "node16" | "node20"

// Decision tree for picking resolution:
// - Building with Vite/webpack/esbuild/Rollup? → bundler
// - Running directly in Node.js with ESM?      → nodenext or node20
// - Building a library for npm?                → bundler or nodenext
// - Legacy CommonJS app?                       → bundler (still works for CJS)

const recommendation: NewResolution = "bundler"  // for most projects

// ── Exercise D — baseUrl migration ─────────────────────────────────────────
// baseUrl allowed paths like "import Button from 'components/Button'".
// It's deprecated in TS 6.0. The migration moves aliases to paths entries.

// OLD tsconfig:
// {
//   "baseUrl": "./src",
//   "paths": {
//     "@/*": ["./*"],
//     "components/*": ["components/*"]
//   }
// }

// NEW tsconfig (no baseUrl):
// {
//   "paths": {
//     "@/*": ["./src/*"],        ← include the base path in the mapping
//     "components/*": ["./src/components/*"]
//   }
// }

// Or better yet, use package.json imports (lesson 22):
// {
//   "imports": { "#/*": "./src/*.js" }
// }

// ── Exercise E — what was NOT removed (still valid) ──────────────────────
// Some things people think were removed but weren't:

// const enum:        still valid (but not under erasableSyntaxOnly)
const enum Color { Red = "red", Blue = "blue" }

// declare namespace: still valid (type-only namespaces)
declare namespace API {
  interface Response { status: number }
}

// type-only namespaces: still valid (no value, just types)
namespace Domain {
  export type UserId = string
  export type PostId = string
}

type _E1 = Domain.UserId  // string — still works
