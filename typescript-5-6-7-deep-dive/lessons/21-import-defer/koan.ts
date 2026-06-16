export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 21 — `import defer`                                     [TS 5.9]
// ─────────────────────────────────────────────────────────────────────────
// WHAT IS DEFERRED MODULE EVALUATION?
//   `import defer` is a TC39 proposal (stage 2+) that TypeScript 5.9
//   implements. It separates two phases of module loading:
//
//   1. LINKING: The module is parsed, its exports are known, dependencies
//      are resolved. (Happens at startup)
//
//   2. EVALUATION: The module's top-level code is executed — side effects
//      run, values are initialized. (Deferred until first property access)
//
//   With `import defer`, phase 2 is deferred until you actually access
//   a property on the imported namespace.
//
// SYNTAX (namespace imports only):
//   import defer * as utils from "./utils.js"
//   //     ^^^^^ new keyword
//
//   The module is NOT evaluated until:
//     utils.someFunction()    // ← evaluation happens here, on first access
//
// WHEN IS EVALUATION TRIGGERED?
//   Any property access on the namespace triggers evaluation:
//   - utils.fn()         → triggers
//   - const { fn } = utils → triggers
//   - utils               → does NOT trigger (just the reference)
//
// WHY ONLY NAMESPACE IMPORTS?
//   `import defer { name }` is NOT allowed.
//   Named imports are bound at link time — deferring them would require
//   the runtime to know the binding before evaluation, which is circular.
//   Namespace imports are lazy by nature: you hold a reference to the
//   namespace object, and property accesses do the binding on demand.
//
// SUPPORTED MODULE FORMATS:
//   --module preserve   (recommended for bundled projects)
//   --module esnext     (for direct ESM output)
//
// USE CASES:
//   - Platform-specific code paths (Node.js vs browser)
//   - Optional heavy dependencies (markdown parsers, PDF generators)
//   - CLI tools where most sub-commands are rarely used
//   - Test utilities that are expensive to initialize
//
// DIFFERENCE FROM DYNAMIC IMPORT:
//   dynamic import:     const utils = await import("./utils.js")   // runtime split point
//   import defer:       import defer * as utils from "./utils.js"   // link-time, deferred eval
//   static import:      import * as utils from "./utils.js"         // link + eval at startup
//
//   import defer is synchronous (no await), unlike dynamic import.
//   The module must be present — there's no code-splitting.
//   Think of it as "lazy static import."
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — syntax understanding ────────────────────────────────────
// These are the valid and invalid forms of import defer.
// Review each and mark whether it's correct syntax.

// VALID — namespace import with defer:
// import defer * as heavy from "./heavy-module.js"

// INVALID — named import with defer (syntax error):
// import defer { parse } from "./heavy-module.js"

// INVALID — default import with defer (syntax error):
// import defer markdown from "./markdown.js"

// VALID — combined: defer namespace + regular named:
// import defer * as parser from "./parser.js"
// import { ParserOptions } from "./parser.js"  // type-only still works separately

// ── Exercise B — type is same as non-deferred namespace ──────────────────
// The TYPE of a deferred namespace import is identical to a regular one.
// The difference is purely when evaluation happens (runtime concern).

// Simulate a module's namespace type:
interface UtilsNamespace {
  formatDate(date: Date): string
  parseJson<T>(str: string): T
  VERSION: string
}

// Regular namespace:
declare const utils: UtilsNamespace

// Deferred namespace (same type, different loading behavior):
declare const deferredUtils: UtilsNamespace  // import defer * as deferredUtils from "..."

// Both have identical type-level behavior:
const _date: string = utils.formatDate(new Date())
const _deferredDate: string = deferredUtils.formatDate(new Date())

// ── Exercise C — use case: conditional heavy library loading ──────────────
// This pattern shows the motivation: defer a heavy module that's only
// needed in specific code paths.

// Without import defer (evaluated at startup every time):
// import * as pdfGenerator from "./pdf-generator.js"

// With import defer (evaluated only when generatePdf() is called):
// import defer * as pdfGenerator from "./pdf-generator.js"
//
// function generatePdf(data: unknown): Buffer {
//   return pdfGenerator.generate(data)  // ← module evaluated HERE, on first call
// }
//
// function plainTextExport(data: unknown): string {
//   return JSON.stringify(data)          // pdfGenerator never evaluated in this path
// }

// ── Exercise D — difference from dynamic import ───────────────────────────
// Choose the right tool for each scenario:

type ImportStrategy =
  | "static import"   // always needed, loaded at startup
  | "import defer"    // always needed, but expensive — delay evaluation
  | "dynamic import"  // conditionally needed — split at runtime

// Match each scenario to the right strategy:
// 1. A parsing utility used in every request:        static import
// 2. A PDF generator used by 5% of users:            dynamic import (await import())
// 3. A large validation library, always included     import defer
//    but only some users trigger validation:
// 4. A plugin loaded only in dev mode:               dynamic import (await import())

// Type check: this is a conceptual exercise, verify the type aliases compile:
const _strategy: ImportStrategy = "import defer"
