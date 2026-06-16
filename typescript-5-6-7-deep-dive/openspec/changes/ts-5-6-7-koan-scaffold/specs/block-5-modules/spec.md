## ADDED Requirements

### Requirement: Lesson 19 — import attributes
A file at `lessons/19-import-attributes/koan.ts` SHALL teach import attributes (TS 5.3, `with { type: "json" }` syntax). The comment block SHALL cover: the evolution from `import assertions` (`assert {}`, deprecated in TS 5.3+) to `import attributes` (`with {}`), what attributes are (metadata passed to the host about how to load the module), the primary use case (JSON module type hints), how the `asserts` keyword is deprecated in TS 6.0 and removed in TS 7.0, and how `verbatimModuleSyntax` interacts with import attributes. Exercises SHALL be Shape B — update code using the old `assert` syntax to use `with`.

#### Scenario: with syntax compiles correctly
- **WHEN** `import data from "./data.json" with { type: "json" }` is written
- **THEN** tsc accepts the syntax under TS 5.3+

#### Scenario: assert syntax is flagged as deprecated
- **WHEN** code uses `import data from "./data.json" assert { type: "json" }`
- **THEN** tsc emits a deprecation diagnostic under TS 5.3+

### Requirement: Lesson 20 — isolatedDeclarations
A file at `lessons/20-isolated-declarations/koan.ts` SHALL teach the `--isolatedDeclarations` flag introduced in TS 5.5. The lesson directory SHALL contain a `tsconfig.json` extending the root that adds `"isolatedDeclarations": true`. The comment block SHALL cover: what the flag does (requires every exported declaration to have an explicit type annotation that is inferrable without cross-file type resolution), why it matters (enables parallel declaration file emission — the foundation for TS 7.0's Go-based parallelism), which patterns require annotation (exported functions without return types, exported variables using complex inferred types), and the connection to TypeScript 7.0's `--builders` flag. Exercises SHALL be Shape A — add the minimum required explicit annotations to make exports satisfy isolatedDeclarations.

#### Scenario: Missing return type on export causes error
- **WHEN** an exported function has a complex inferred return type under isolatedDeclarations
- **THEN** tsc emits an error requiring an explicit annotation

#### Scenario: Explicit annotation satisfies isolatedDeclarations
- **WHEN** the return type is explicitly annotated
- **THEN** the error is resolved

### Requirement: Lesson 21 — import defer
A file at `lessons/21-import-defer/koan.ts` SHALL teach the `import defer` syntax introduced in TS 5.9. The comment block SHALL cover: what deferred evaluation means (the module is parsed and linked but not executed until first property access), the restricted syntax (namespace imports only: `import defer * as ns from "./module.js"`), supported module formats (`--module preserve` and `--module esnext`), the performance motivation (avoids startup cost of expensive or platform-specific modules), and the difference from lazy `import()` dynamic imports. Exercises SHALL be Shape B — convert an eager namespace import to a deferred import and verify the type remains the same.

#### Scenario: Deferred import has the same type as eager
- **WHEN** `import defer * as utils from "./utils.js"` is used
- **THEN** the type of `utils` is identical to a non-deferred namespace import

#### Scenario: Named import syntax is rejected with defer
- **WHEN** `import defer { name } from "./module.js"` is attempted
- **THEN** tsc emits a syntax error — only namespace imports are allowed

### Requirement: Lesson 22 — #/ subpath imports
A file at `lessons/22-subpath-imports/koan.ts` SHALL teach the `#/` subpath import syntax added in TS 6.0. The comment block SHALL cover: Node.js subpath imports (the `"imports"` field in package.json), the difference between the old pattern (`"#app": "./src/app.js"`) and the new `#/` shorthand (`"#/*": "./dist/*"`), when this is available (Node.js 20+, `moduleResolution: nodenext` or `bundler`), and how it replaces path aliases configured via `baseUrl` + `paths`. Exercises SHALL be Shape B — update a `tsconfig.json` `paths` alias to use package.json imports with `#/`.

#### Scenario: #/ prefix resolves under bundler resolution
- **WHEN** `"#/*": "./src/*"` is in package.json imports and moduleResolution is bundler
- **THEN** `import x from "#/utils"` resolves to `./src/utils`

#### Scenario: baseUrl alias and #/ alias are equivalent in effect
- **WHEN** both patterns are shown side-by-side in comments
- **THEN** the learner can see the migration path from paths to subpath imports
