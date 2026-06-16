// ═══════════════════════════════════════════════════════════════════════════
// LESSON 03 — verbatimModuleSyntax                               [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json that enables the flag.
// Run with: tsc -p lessons/03-verbatim-module-syntax/tsconfig.json --noEmit
//
// PROBLEM — type imports that survive emit:
//   When TypeScript compiles to JavaScript, type-only imports must be
//   completely erased. But historically, TypeScript was lenient: you could
//   write `import { SomeType } from "./module"` (a value import), use SomeType
//   only as a type, and TypeScript would silently erase the entire import.
//
//   This broke bundlers and native ESM runtimes that don't run TypeScript's
//   type-checking. They see the import, try to load the module, and either:
//   - Fail because the named export doesn't exist at runtime
//   - Import the whole module unnecessarily (tree-shaking fails)
//   - Error when using Node's native type-stripping mode
//
// SOLUTION — `--verbatimModuleSyntax`:
//   Enforces that every import/export accurately represents what will appear
//   in the emitted JavaScript. The rule:
//     "If an import is type-only at use sites, you MUST use `import type`."
//
//   This makes TypeScript's output predictable for tools that process
//   TypeScript without type-checking it.
//
// THE THREE IMPORT FORMS:
//
//   import { value, Type } from "./mod"          // mixed — allowed if value is used
//   import type { Type } from "./mod"             // type-only — always erased ✓
//   import { type Type, value } from "./mod"      // inline type — erase just Type ✓
//
// WHEN TO USE verbatimModuleSyntax:
//   - Any project using a bundler (Vite, esbuild, Rollup, webpack 5)
//   - Node.js with --experimental-strip-types (TS 7 native mode)
//   - Libraries publishing ESM that can't rely on TS re-emit
//   - Recommended to enable in all new projects as of TS 5.0
//
// INTERACTION WITH TS 6.0:
//   In TS 6.0, `module` defaults to `esnext`. Under this mode, verbatim
//   module syntax semantics are much stricter. It's worth enabling early.
// ═══════════════════════════════════════════════════════════════════════════

// ── Type definitions (in a real project, these come from another file) ─────
// For this koan we define types inline so the lesson is self-contained.

export type User = { id: number; name: string }
export type AdminUser = User & { role: "admin" }
export interface Config { debug: boolean; timeout: number }
export const VERSION = "1.0.0"

// ── Exercise A — identify type-only imports ────────────────────────────────
// The imports below are used ONLY as types. Under verbatimModuleSyntax,
// they must be `import type`. For this self-contained file, imagine they
// come from an external module.
//
// In a real file with verbatimModuleSyntax enabled, this would error:
//   import { User } from "./types"   // ✗ must be `import type`
//
// TODO: The comment below shows a pattern that verbatimModuleSyntax rejects.
// Rewrite it as a correct `import type` import.
//
// WRONG (would error under verbatimModuleSyntax):
//   import { User, VERSION } from "./types"
//   const u: User = { id: 1, name: "Alice" }
//   // VERSION is used as a value, User only as type → must split the import
//
// CORRECT:
//   import type { User } from "./types"        // type-only import
//   import { VERSION } from "./types"           // value import (used at runtime)
//   import { type User, VERSION } from "./types" // inline type modifier (alternative)

// ── Exercise B — the inline `type` modifier ───────────────────────────────
// TS 4.5+ allows per-specifier `type` modifiers inside a regular import.
// This lets you mix type and value imports cleanly in one statement.
//
// Complete the type annotations below using only type information:

type UserName = User["name"]     // This is fine — no import needed
type _B1 = UserName extends string ? true : false  // should be true

// ── Exercise C — re-exports must also be explicit ─────────────────────────
// Under verbatimModuleSyntax, re-exporting a type requires `export type`.
//
// These patterns are equivalent under verbatimModuleSyntax:
//   export type { User }                  // explicit type re-export ✓
//   export { type User }                  // inline type re-export ✓
//   export { User }                       // ✗ error if User is type-only
//
// TODO: Write a type alias that a consuming module could export correctly.
// Given: AdminUser is a type. Annotate the re-export style:

type ReexportPattern =
  // "export { AdminUser }"         — would error under verbatimModuleSyntax
  // "export type { AdminUser }"    — correct
  // "export { type AdminUser }"    — also correct
  "correct ways to re-export a type-only binding"

// Confirm you understand — this is type-safe either way:
type _C1 = AdminUser extends User ? true : false  // should be true

// ── Exercise D — value + type from the same module ────────────────────────
// When a module exports both values and types, split the import or use
// inline type modifiers. Show both forms:

// Form 1: Two separate import statements
// import type { Config }    from "./config"
// import { loadConfig }     from "./config"

// Form 2: One import with inline modifiers
// import { type Config, loadConfig } from "./config"

// The type-level check: can you annotate a Config correctly?
type ValidConfig = { debug: boolean; timeout: number }
type _D1 = Config extends ValidConfig ? true : false   // should be true
