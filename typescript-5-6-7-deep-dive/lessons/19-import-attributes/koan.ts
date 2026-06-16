export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 19 — Import Attributes (`with {}`)                      [TS 5.3]
// ─────────────────────────────────────────────────────────────────────────
// THE EVOLUTION:
//   Stage 1 (import assertions, `assert {}`):
//     import data from "./data.json" assert { type: "json" }
//     // Added to TS 4.5. TC39 later renamed this proposal.
//
//   Stage 3 (import attributes, `with {}`):
//     import data from "./data.json" with { type: "json" }
//     // Added to TS 5.3. The new syntax. assert {} is DEPRECATED.
//
//   TS 6.0: `assert {}` syntax is deprecated (still works with a warning).
//   TS 7.0: `assert {}` syntax is removed entirely.
//
// WHAT ARE IMPORT ATTRIBUTES?
//   Metadata passed to the JavaScript host (browser, Node.js, bundler)
//   to tell it HOW to load the module — not what types it has.
//   The most common use: telling the host a `.json` import is JSON, not JS.
//
//     import config from "./config.json" with { type: "json" }
//     //                                  ^^^^^^^^^^^^^^^^^^^
//     //                                  Tells the host: "treat this as JSON"
//
// WHY "attributes" NOT "assertions"?
//   "Assert" implied the host checks and throws if wrong.
//   "Attributes" clarifies it's a hint that can AFFECT how the module loads,
//   not just a post-hoc check.
//
// SUPPORTED ATTRIBUTE KEYS:
//   `type: "json"`   — import as a JSON module (no code execution)
//   Other keys are host-defined (browsers, Node.js may add more)
//
// DYNAMIC IMPORT WITH ATTRIBUTES:
//   const data = await import("./data.json", { with: { type: "json" } })
//
// INTERACTION WITH verbatimModuleSyntax:
//   Under verbatimModuleSyntax, import attributes must be preserved as-is
//   in output — TypeScript won't transform them.
//
// RE-EXPORTS WITH ATTRIBUTES:
//   export { default } from "./data.json" with { type: "json" }
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — old syntax vs new syntax ────────────────────────────────
// The old `assert {}` syntax is deprecated. The new `with {}` syntax is correct.
// Identify which is which in these examples:

// OLD (deprecated in TS 5.3+, removed in TS 7.0):
// import oldData from "./data.json" assert { type: "json" }

// NEW (correct from TS 5.3+):
// import newData from "./data.json" with { type: "json" }

// Dynamic import — OLD (deprecated):
// const a = await import("./data.json", { assert: { type: "json" } })

// Dynamic import — NEW (correct):
// const b = await import("./data.json", { with: { type: "json" } })

// ── Exercise B — migration exercise ──────────────────────────────────────
// TODO: In the comment below, rewrite each OLD import as a NEW import.
// (We use comments because actual JSON imports need resolveJsonModule: true)

/*
MIGRATION:

OLD: import config from "./config.json" assert { type: "json" }
NEW: ??? (write the correct form)

OLD: export { default as config } from "./config.json" assert { type: "json" }
NEW: ??? (write the correct form)

OLD: const data = await import("./data.json", { assert: { type: "json" } })
NEW: ??? (write the correct form)
*/

// ── Exercise C — type-level: import attributes don't change types ─────────
// Import attributes only affect the MODULE LOADING mechanism.
// They don't change the TypeScript type of the imported value.
// The type of a JSON import is determined by `resolveJsonModule`, not the attribute.

// With resolveJsonModule: true, a JSON import gets the shape of the JSON object.
// The `with { type: "json" }` tells the runtime "this is data, not executable code".
// TypeScript doesn't use the attribute to infer the type.

// Simulating what a JSON module type looks like:
interface JsonConfig {
  host: string
  port: number
}

// If we had: import config from "./config.json" with { type: "json" }
// And the JSON is: { "host": "localhost", "port": 3000 }
// TypeScript would type it as: { host: string; port: number }
// (from resolveJsonModule reading the file)

declare const config: JsonConfig
const _host: string = config.host    // string ✓
const _port: number = config.port    // number ✓

// ── Exercise D — re-export with attribute ────────────────────────────────
// Re-exporting a JSON module uses the same `with {}` syntax.
// No actual file needed here — just verify you know the syntax:

// CORRECT re-export syntax:
// export { default as myData } from "./data.json" with { type: "json" }

// This is also valid (re-export the whole module default):
// export { default } from "./data.json" with { type: "json" }

// Confirm you know which is deprecated (should be OLD):
const _migration_check = "assert {} is OLD, with {} is NEW" as const
type _D1 = typeof _migration_check
