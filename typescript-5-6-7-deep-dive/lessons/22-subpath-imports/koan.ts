import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 22 — `#/` Subpath Imports                               [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// BACKGROUND — the path alias problem:
//   In TypeScript projects, you often want short import paths:
//     import { Button } from "@/components/Button"
//     import { api }    from "@/lib/api"
//
//   Historically, you configured this with tsconfig `paths` + `baseUrl`:
//     {
//       "compilerOptions": {
//         "baseUrl": "./src",
//         "paths": { "@/*": ["./*"] }
//       }
//     }
//
//   Problems: paths are TS-specific. The bundler (Vite, webpack) needs its
//   OWN alias config. Node.js doesn't understand them at all.
//
// ENTER PACKAGE.JSON `imports`:
//   Node.js 12+ supports a standard way: the `"imports"` field in package.json.
//   Imports beginning with `#` are resolved using this field:
//
//     package.json:
//     {
//       "imports": {
//         "#/*": "./src/*.js"
//       }
//     }
//
//     Usage: import { Button } from "#/components/Button"
//
// THE `#/` SHORTHAND (TS 6.0):
//   Before TS 6.0, you had to write: `"#app": "./src/app.js"` (no wildcard shorthand).
//   TS 6.0 added support for the `#/` prefix pattern:
//     "#/*": "./src/*.js"
//   This lets you use `import x from "#/utils"` → resolves to `./src/utils.js`.
//
// SUPPORTED RESOLUTIONS:
//   Under `--moduleResolution nodenext` or `--moduleResolution bundler`.
//   NOT under legacy `node10` resolution (another reason to upgrade).
//
// ADVANTAGE OVER tsconfig `paths`:
//   - Standard Node.js feature — no bundler config duplication
//   - Works with `node --input-type=module` without extra setup
//   - Tooling-agnostic: VS Code, ESLint, and bundlers all respect it
//   - No `baseUrl` needed (which is deprecated in TS 6.0 anyway)
//
// MIGRATION FROM paths:
//   tsconfig.json (old):
//     "baseUrl": "./src",
//     "paths": { "@/*": ["./*"] }
//
//   package.json (new):
//     "imports": { "#/*": "./src/*.js" }
//
//   Code change: `@/utils` → `#/utils`
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — configuration syntax ────────────────────────────────────
// Which of these is the correct package.json configuration for #/ imports?

// Option 1 (tsconfig paths style):
const _option1 = {
  compilerOptions: {
    baseUrl: "./src",
    paths: { "@/*": ["./*"] }
  }
} as const

// Option 2 (correct #/ subpath imports):
const _option2 = {
  imports: {
    "#/*": "./src/*.js"
  }
} as const

// Option 2 goes in package.json. Option 1 goes in tsconfig.json.
// Only Option 2 is understood by Node.js natively.

type _A1 = Expect<Equal<typeof _option2.imports["#/*"], "./src/*.js">>

// ── Exercise B — import path rewrite ─────────────────────────────────────
// For each tsconfig `paths` alias, write the equivalent package.json import.
// (This is a conceptual exercise — rewrite in comments below)

/*
MIGRATION TABLE:

tsconfig paths:                          package.json imports:
"@/utils"    → "./src/utils"            "#/utils"    → "./src/utils.js"
"@/api/*"    → ["./src/api/*"]          "#/api/*"    → "./src/api/*.js"
"@lib/core"  → "./node_modules/core"    (not needed — node_modules use package.json "exports")

Key rule: # prefix is REQUIRED in imports field.
"utils" (no #) would not be a valid subpath import specifier.
*/

// ── Exercise C — understand the resolution difference ─────────────────────
// `#/` imports are resolved differently than package `exports`.

// Package EXPORTS (from node_modules/pkg/package.json):
//   "exports": { "./utils": "./dist/utils.js" }
//   Usage: import x from "pkg/utils"  ← uses exports

// Package IMPORTS (from your own package.json):
//   "imports": { "#/utils": "./src/utils.js" }
//   Usage: import x from "#/utils"    ← uses imports, internal to your package

// The `#` prefix MEANS "look in this package's imports field" — not in node_modules.
// You can't use `import x from "#/utils"` to reach into another package's internals.

type ImportResolutionType = "exports" | "imports"
const ownPackageAlias: ImportResolutionType = "imports"  // #/ uses the imports field
const nodeModuleExport: ImportResolutionType = "exports" // pkg/path uses the exports field

type _C1 = Expect<Equal<typeof ownPackageAlias, ImportResolutionType>>

// ── Exercise D — TS 6.0 baseline resolution requirement ──────────────────
// These moduleResolution values SUPPORT #/ subpath imports:
type SupportedResolution = "nodenext" | "bundler"

// These do NOT:
type UnsupportedResolution = "node" | "node10" | "classic"

// This is another reason `--moduleResolution node` was deprecated in TS 6.0.
// If you want #/ imports (which is where Node.js is heading), you need the modern settings.

const recommended: SupportedResolution = "bundler"  // for most projects using a bundler
type _D1 = Expect<Equal<typeof recommended, SupportedResolution>>
