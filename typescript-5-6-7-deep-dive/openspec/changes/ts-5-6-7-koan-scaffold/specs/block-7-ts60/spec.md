## ADDED Requirements

### Requirement: Lesson 28 — TS 6.0 default config changes
A file at `lessons/28-ts60-default-changes/koan.ts` SHALL teach the breaking default changes in TypeScript 6.0. The comment block SHALL cover all changed defaults in a table: `strict: true`, `module: esnext`, `target: es2025`, `noUncheckedSideEffectImports: true`, `libReplacement: false`, `rootDir: "."`, `types: []` (most impactful — no longer auto-loads @types). For each change, explain what breaks and the migration path. Special attention to `types: []` — projects must now explicitly list `"node"`, `"jest"`, etc. Exercises SHALL be Shape A — given a broken TS 6.0 tsconfig, identify and fix each issue.

#### Scenario: Empty types array breaks @types resolution
- **WHEN** a TS 6.0 project has no "types" in tsconfig and uses `process.env`
- **THEN** tsc emits "Cannot find name 'process'" because @types/node is not loaded

#### Scenario: Explicit types array resolves @types
- **WHEN** `"types": ["node"]` is added to tsconfig
- **THEN** process.env resolves correctly

#### Scenario: module: esnext changes import interop
- **WHEN** a project relied on CommonJS default import interop (`import x from "cjs-pkg"`)
- **THEN** the new default may require `esModuleInterop` handling (already always-on in TS 6)

### Requirement: Lesson 29 — this-less function inference
A file at `lessons/29-this-less-inference/koan.ts` SHALL teach the TS 6.0 improvement to type inference for functions that don't use `this`. The comment block SHALL cover: the old behaviour (methods using method syntax were treated as contextually sensitive, hindering generic type argument inference in some object literal patterns), the new behaviour (functions without `this` usage no longer block type inference), and a concrete before/after example with object literals where property order affected inference. Exercises SHALL be Shape A — identify where the new inference changes what type annotation is needed.

#### Scenario: Method without this participates in inference
- **WHEN** an object literal method does not reference `this`
- **THEN** generic type argument inference succeeds regardless of property order in the object literal

#### Scenario: Method with this still blocks inference
- **WHEN** a method references `this` internally
- **THEN** contextual sensitivity still applies and inference behaviour is unchanged

### Requirement: Lesson 30 — Temporal API types
A file at `lessons/30-temporal-api/koan.ts` SHALL teach the built-in Temporal API types added in TS 6.0 (available under `"lib": ["esnext"]`). The comment block SHALL cover: what Temporal is (TC39 stage-4 replacement for the Date API), the key types (`Temporal.Instant`, `Temporal.PlainDate`, `Temporal.ZonedDateTime`, `Temporal.Duration`), the difference from the legacy `Date` object (immutable, timezone-aware by default, no month indexing quirks), that Temporal is in `esnext` lib but requires a polyfill at runtime until engines ship it, and the most common patterns. Exercises SHALL be Shape A — write type annotations for Temporal expressions and fix type errors in Temporal code.

#### Scenario: Temporal types are available under esnext lib
- **WHEN** `Temporal.Now.instant()` is used with `"lib": ["esnext"]`
- **THEN** tsc resolves the type as `Temporal.Instant` without error

#### Scenario: Temporal.Duration arithmetic is type-safe
- **WHEN** `.add()` is called with a plain object instead of a Temporal.Duration
- **THEN** tsc accepts the plain object (it takes DurationLike) or emits an error for wrong shape

### Requirement: Lesson 31 — Map and WeakMap upsert methods
A file at `lessons/31-map-upsert/koan.ts` SHALL teach the `getOrInsert` and `getOrInsertComputed` methods added to `Map` and `WeakMap` in TS 6.0 (available under `"lib": ["esnext"]`). The comment block SHALL cover: the classic pattern they replace (`map.has(k) ? map.get(k)! : (map.set(k, v), v)`), the two method signatures, when to use `getOrInsertComputed` vs `getOrInsert` (expensive initialization), and how these differ from a simple `??=` pattern. Exercises SHALL be Shape A — replace manual has/get/set patterns with the new upsert methods and verify the types.

#### Scenario: getOrInsert returns the existing or new value
- **WHEN** `map.getOrInsert(key, defaultValue)` is called
- **THEN** the return type is the Map's value type (not `V | undefined`)

#### Scenario: getOrInsertComputed defers computation
- **WHEN** `map.getOrInsertComputed(key, () => expensiveCompute())`
- **THEN** the factory is typed as `() => V` and the return type is `V`

### Requirement: Lesson 32 — TS 6.0 legacy cleanup
A file at `lessons/32-ts60-legacy-cleanup/koan.ts` SHALL teach the deprecated and removed options in TS 6.0. The comment block SHALL cover the full removal list in a structured format: removed module targets (amd, umd, systemjs, none), removed moduleResolution values (node/node10, classic), removed flags (downlevelIteration, outFile, esModuleInterop: false, baseUrl), the `module` keyword renamed to `namespace`, and the `asserts` import keyword replaced by `with`. For each removal, explain the migration path. Exercises SHALL be Shape B — update legacy code patterns to their modern equivalents.

#### Scenario: module keyword in namespace declaration is flagged
- **WHEN** `module MyModule { }` is used (old namespace syntax)
- **THEN** tsc emits a deprecation error; the fix is `namespace MyModule { }`

#### Scenario: Legacy moduleResolution triggers migration error
- **WHEN** tsconfig has `"moduleResolution": "node"`
- **THEN** tsc emits an error in TS 6+ and the fix is `"bundler"` or `"nodenext"`
