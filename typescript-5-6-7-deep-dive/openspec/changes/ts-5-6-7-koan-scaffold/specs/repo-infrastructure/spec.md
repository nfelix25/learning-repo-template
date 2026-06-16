## ADDED Requirements

### Requirement: Package configuration
The repo SHALL have a `package.json` with `typescript@^6` as the only dev dependency and a `"verify": "tsc --noEmit"` script. No test runner. The `type` field SHALL be `"module"`.

#### Scenario: Verify runs tsc
- **WHEN** the learner runs `npm run verify`
- **THEN** `tsc --noEmit` runs on all lesson files and exits 0 when all exercises are complete

#### Scenario: Only dev dependency is TypeScript
- **WHEN** inspecting package.json
- **THEN** no test runner, no bundler, and no runtime dependencies are present

### Requirement: Root tsconfig
The repo SHALL have a `tsconfig.json` at the root with: `strict: true`, `noEmit: true`, `target: "es2022"`, `module: "esnext"`, `moduleResolution: "bundler"`, `lib: ["esnext", "dom"]`, and `allowImportingTsExtensions: true`. All settings SHALL be explicit — no reliance on TS 6 default changes.

#### Scenario: Strict mode enabled
- **WHEN** a lesson file has an implicit any
- **THEN** tsc emits an error

#### Scenario: esnext lib available
- **WHEN** a lesson uses `Symbol.dispose` or `Temporal` types
- **THEN** tsc resolves them without additional lib configuration

### Requirement: Type-level test utilities
A file at `src/utils.ts` SHALL export: `Expect<T extends true>`, `Equal<X, Y>`, `NotEqual<X, Y>`, `IsAny<T>`, and `NotAny<T>`. These SHALL be pure type aliases with no runtime value.

#### Scenario: Equal catches type mismatch
- **WHEN** `Equal<string, number>` is passed to `Expect<>`
- **THEN** tsc emits a type error because `false` does not extend `true`

#### Scenario: Equal passes on identical types
- **WHEN** `Equal<string, string>` is passed to `Expect<>`
- **THEN** tsc compiles clean

#### Scenario: Equal handles any correctly
- **WHEN** `Equal<any, string>` is evaluated
- **THEN** it returns `false` (not `true`), distinguishing `any` from concrete types

### Requirement: LEARNING.md curriculum index
A `LEARNING.md` at the root SHALL list all 36 lessons grouped by block, with version tag, lesson number, title, and one-line description of what the learner will practise.

#### Scenario: Index is navigable
- **WHEN** a learner opens LEARNING.md
- **THEN** they can see all 36 lessons organized by block with version tags visible

### Requirement: Flag-specific tsconfigs
Lessons that require a specific compiler flag (isolatedDeclarations, erasableSyntaxOnly, noUncheckedSideEffectImports) SHALL have a `tsconfig.json` in their lesson directory that extends `../../tsconfig.json` and adds only the relevant flag.

#### Scenario: Flag applies only to its lesson
- **WHEN** isolatedDeclarations is enabled in lesson 20's tsconfig
- **THEN** it does not affect compilation of lesson 19 or 21
