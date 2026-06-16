export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 25 — noUncheckedSideEffectImports                  [TS 5.6/6.0]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json that enables the flag.
// Run with: tsc -p lessons/25-no-unchecked-side-effect-imports/tsconfig.json --noEmit
//
// WHAT ARE SIDE-EFFECT IMPORTS?
//   An import statement with no bindings — imported purely for its
//   runtime side effects (registering globals, patching prototypes, etc.):
//
//     import "./polyfills.js"           // just run the code
//     import "reflect-metadata"         // registers global Reflect.metadata
//     import "./setup-db.js"            // connects at module load time
//     import "zone.js/testing"          // Angular test zone setup
//
// THE OLD PROBLEM:
//   Before TS 5.6, TypeScript would silently accept side-effect imports
//   even if the module didn't exist — because there's nothing to bind,
//   TypeScript didn't bother checking that the module resolved.
//
//   This allowed typos like:
//     import "./polyfils.js"            // typo — TS said nothing
//     import "reflec-metadata"          // typo — TS said nothing
//
//   These would fail at runtime: `Cannot find module './polyfils.js'`.
//
// THE FIX — noUncheckedSideEffectImports:
//   Added in TS 5.6. Made the DEFAULT in TS 6.0.
//   Forces TypeScript to verify that side-effect-only imports resolve,
//   just as it verifies value/type imports.
//
//     import "./polyfils.js"     // Error: Cannot find module './polyfils.js'
//
// WHAT IT DOES NOT DO:
//   - Does not check the content of the module
//   - Does not verify what side effects occur
//   - Does not make side effects type-safe
//   Only ensures the module EXISTS and is resolvable.
//
// PRACTICAL IMPACT:
//   - Polyfill imports with typos are caught at compile time
//   - Deleted modules with stale imports are caught immediately
//   - CI fails fast instead of failing at runtime in production
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — identify problematic side-effect imports ────────────────
// Under noUncheckedSideEffectImports, which of these would be errors?
// (We can't demonstrate actual missing-module errors in this file,
//  but the tsconfig.json in this directory enables the flag for real testing.)

// VALID — module exists (relative to where tsc looks):
// import "./koan.ts"    ← imports itself, silly but valid

// WOULD ERROR under noUncheckedSideEffectImports:
// import "./polyfils.js"           ← typo, module doesn't exist
// import "reflec-metadata"         ← typo in package name
// import "./setup-tests"           ← missing extension (with strict resolution)

// WOULD STILL WORK:
// import "reflect-metadata"        ← correct package name, exists in node_modules

// ── Exercise B — common patterns and their correct forms ──────────────────
// Match each incorrect import to its correct form:

/*
MIGRATION:

WRONG: import "./polyfils.js"
RIGHT: import "./polyfills.js"

WRONG: import "zone/testing"
RIGHT: import "zone.js/testing"

WRONG: import "./setup"              (missing extension under nodenext)
RIGHT: import "./setup.js"

WRONG: import "reflect-metadat"     (typo)
RIGHT: import "reflect-metadata"
*/

// ── Exercise C — the TS 6.0 connection ───────────────────────────────────
// noUncheckedSideEffectImports became the DEFAULT in TS 6.0.
// This means existing codebases upgrading to TS 6.0 may encounter new errors
// from side-effect imports that were previously silently allowed.

// MIGRATION CHECKLIST for upgrading to TS 6.0:
// 1. Search for `import "..."` (no bindings) in your codebase
// 2. Verify each one resolves to an existing module
// 3. Fix typos or update paths
// 4. Remove stale imports that no longer have corresponding modules

// Type-level check: this lesson is conceptual — verify it loads:
const flagName = "noUncheckedSideEffectImports" as const
type _C1 = typeof flagName

// ── Exercise D — when you intentionally want loose side-effect imports ────
// If you have a valid reason to allow unresolved side-effect imports,
// you can use ignoreDeprecations or a tsconfig override:
//
//   "noUncheckedSideEffectImports": false
//
// But this should be rare — the flag exists to catch real bugs.
// The better fix is always to make the import path correct.

// Real-world scenario: bundler handles paths that TypeScript doesn't know about
// (e.g., CSS modules, query-parameterized imports):
//   import "tailwindcss/base.css"     // might work in Vite but TS doesn't know
//
// Solution: declare the module in a .d.ts file:
//   declare module "*.css" {}
//   declare module "tailwindcss/*" {}

// In a .d.ts file (e.g., src/global.d.ts), add:
//   declare module "*.css" {}       // wildcard CSS module declaration
//   declare module "tailwindcss/*" {}
// This tells TypeScript these imports are known, resolving them under the flag.
