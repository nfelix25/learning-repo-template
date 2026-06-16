import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 28 — TypeScript 6.0 Default Config Changes              [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// TS 6.0 is a BREAKING RELEASE. If you upgrade without changing your
// tsconfig.json, things may break. Here's every changed default:
//
// ┌──────────────────────────────────┬───────────────┬────────────────────┐
// │ Option                           │ Old Default   │ New Default (6.0)  │
// ├──────────────────────────────────┼───────────────┼────────────────────┤
// │ strict                           │ false         │ true               │
// │ module                           │ commonjs      │ esnext             │
// │ target                           │ es3/es5       │ es2025             │
// │ noUncheckedSideEffectImports     │ false         │ true               │
// │ libReplacement                   │ true          │ false              │
// │ rootDir                          │ inferred      │ "." (tsconfig dir) │
// │ types                            │ all @types    │ []  (none)         │
// └──────────────────────────────────┴───────────────┴────────────────────┘
//
// THE MOST IMPACTFUL CHANGE — `types: []`:
//   Before TS 6.0, TypeScript automatically loaded ALL @types/* packages
//   found in node_modules/@types/ into every file.
//   After TS 6.0, it loads NONE unless you explicitly list them.
//
//   BEFORE (worked automatically):
//     import express from "express"
//     process.env.NODE_ENV  // ← worked because @types/node was auto-loaded
//
//   AFTER (requires explicit config):
//     // tsconfig.json:
//     { "compilerOptions": { "types": ["node", "express"] } }
//
// DEPRECATED OPTIONS (work with ignoreDeprecations, removed in TS 7.0):
//   - target: es5 (use ES2015+)
//   - moduleResolution: node / node10 (use nodenext or bundler)
//   - module: amd, umd, systemjs, none (use bundler output)
//   - baseUrl (move into paths)
//   - downlevelIteration (no longer needed)
//   - outFile (use a bundler)
//   - esModuleInterop: false (always on now)
//   - alwaysStrict: false (strict is default)
//   - Legacy `module` keyword for namespaces (use `namespace`)
//   - `assert {}` import syntax (use `with {}`)
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — `types: []` impact ──────────────────────────────────────
// With `types: []` (TS 6.0 default), global types from @types/* are not loaded.
// This affects anything that relies on ambient globals.

// In TS 5.x with @types/node auto-loaded:
//   process.env.NODE_ENV  // worked
//   setTimeout(() => {}, 100)  // worked (from DOM or node types)
//   Buffer.from("hello")  // worked

// In TS 6.0 with `types: []`:
//   If you need process, Buffer, etc., add to tsconfig:
//   { "types": ["node"] }
//   If you need DOM types (setTimeout, fetch):
//   { "lib": ["esnext", "dom"] }  ← already in our repo's tsconfig

// Our tsconfig explicitly sets lib: ["esnext", "dom"] so DOM types work:
const _timer = setTimeout(() => {}, 100)  // works — DOM is in lib
type _A1 = Expect<Equal<typeof _timer, ReturnType<typeof setTimeout>>>

// ── Exercise B — strict: true becomes default ─────────────────────────────
// In TS 6.0, strict is on by default. This enables:
//   strictNullChecks, strictFunctionTypes, strictBindCallApply,
//   strictPropertyInitialization, noImplicitAny, noImplicitThis,
//   useUnknownInCatchVariables, alwaysStrict
//
// Code that compiled under TS 5.x with strict: false may now error.

// This would error under strict: true (implicit any):
// function greet(name) { return "Hello " + name }
// Fix: function greet(name: string): string { ... }

function greet(name: string): string {
  return `Hello ${name}`
}

type _B1 = Expect<Equal<ReturnType<typeof greet>, string>>

// ── Exercise C — module: esnext changes import interop ───────────────────
// With module: esnext (TS 6.0 default), CommonJS-style default imports
// may behave differently.

// Old pattern (module: commonjs):
//   import * as express from "express"   // sometimes required
//   const app = express()                // called as a function

// New pattern (module: esnext + esModuleInterop always on):
//   import express from "express"        // default import always works
//   const app = express()

// esModuleInterop is always true in TS 6.0, so default imports are safe.
// `module` is a compiler option, not a runtime value — you can't typeof it.
// To confirm module: esnext is in effect, check: tsc --showConfig | grep '"module"'
// The type-level effect: import/export syntax is not transformed by the compiler.

// ── Exercise D — target: es2025 means newer lib available ────────────────
// With target: es2025, TypeScript includes ES2025 builtins in its type-checking.
// New in ES2025 (available in TS 6.0 under es2025 target):
//   - RegExp.escape()
//   - Promise.try()
//   - Iterator.prototype.map/filter/take/drop (iterator helpers)
//   - Set.prototype.union/intersection/difference
//   - Map.prototype.getOrInsert / getOrInsertComputed (TS 6.0 specific)

// RegExp.escape (ES2025, available in TS 6.0 lib: esnext):
const escaped = RegExp.escape("Hello (World)")
type _D1 = Expect<Equal<typeof escaped, string>>

// ── Exercise E — the migration checklist ────────────────────────────────
// When upgrading from TS 5.x to 6.0:

const migrationSteps = [
  "Add explicit 'types' array to tsconfig.json",
  "Remove deprecated moduleResolution: node (use bundler or nodenext)",
  "Remove deprecated baseUrl (move to paths)",
  "Update 'assert {}' imports to 'with {}'",
  "Remove 'module' keyword from namespace declarations",
  "Handle new strict errors (noImplicitAny, strictNullChecks)",
] as const

type _E1 = Expect<Equal<typeof migrationSteps["length"], 6>>  // exactly 6 migration steps
