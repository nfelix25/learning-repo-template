## ADDED Requirements

### Requirement: Lesson 23 — regex syntax checking
A file at `lessons/23-regex-syntax-checking/koan.ts` SHALL teach the TS 5.5 feature of compile-time regular expression syntax validation. The comment block SHALL cover: that TS 5.5 now parses regex literals and reports invalid syntax as type errors, what categories of errors are caught (invalid quantifiers, unclosed groups, invalid escape sequences, invalid flags, backreference errors), what is NOT caught (semantic issues like catastrophic backtracking), and practical impact (catches typos in regex literals that would only fail at runtime). Exercises SHALL be Shape A — identify and fix intentionally broken regex literals.

#### Scenario: Invalid regex causes compile error
- **WHEN** a regex literal contains a syntax error (e.g., `/(unclosed/`)
- **THEN** tsc emits a diagnostic pointing to the invalid regex

#### Scenario: Valid but complex regex compiles clean
- **WHEN** a correctly formed regex with groups, quantifiers, and flags is used
- **THEN** no error is emitted

### Requirement: Lesson 24 — iterator narrowing strictness
A file at `lessons/24-iterator-narrowing/koan.ts` SHALL teach the TS 5.6 strictness improvement for iterator type checking. The comment block SHALL cover: what changed (TS 5.6 tightened checks on `IteratorResult` — using `.value` directly without checking `.done` first is now more likely to be flagged), the `IteratorYieldResult` vs `IteratorReturnResult` distinction, and the practical implication (consuming iterators manually requires proper `.done` checks). Exercises SHALL be Shape A — fix iterator consumption code that accessed `.value` without checking `.done`.

#### Scenario: Unchecked value access on iterator result is caught
- **WHEN** `result.value` is accessed without first checking `result.done`
- **THEN** the type of value includes `undefined` (return value type), requiring a guard

#### Scenario: Checked access compiles clean
- **WHEN** `if (!result.done) { use(result.value) }` is written
- **THEN** result.value is narrowed to the yield type inside the if block

### Requirement: Lesson 25 — noUncheckedSideEffectImports
A file at `lessons/25-no-unchecked-side-effect-imports/koan.ts` SHALL teach the `--noUncheckedSideEffectImports` flag introduced in TS 5.6 and made the default in TS 6.0. The lesson directory SHALL contain a `tsconfig.json` enabling this flag (if not already in root). The comment block SHALL cover: what a side-effect import is (`import "./polyfill.js"` — imported for effects, not bindings), the old behaviour (TS silently accepted imports to non-existent modules when no bindings were requested), the new behaviour (TS verifies the module resolves even for side-effect-only imports), common patterns this catches (typos in polyfill paths, deleted modules with stale imports). Exercises SHALL be Shape A — identify which side-effect imports would be caught by this flag.

#### Scenario: Typo in side-effect import is caught
- **WHEN** `import "./polyfils.js"` (typo) is written and the file doesn't exist
- **THEN** tsc emits a "cannot find module" error even with no bindings imported

#### Scenario: Valid side-effect import compiles clean
- **WHEN** `import "./polyfills.js"` points to a real file
- **THEN** tsc accepts the import without error

### Requirement: Lesson 26 — checked uninitialized variables
A file at `lessons/26-uninitialized-variables/koan.ts` SHALL teach the TS 5.7 check for variables that are never assigned before use. The comment block SHALL cover: the difference from `strictNullChecks` (this catches variables declared but never assigned in any code path, not just possibly-null ones), the exact rule (a variable that is declared, never assigned, and is read is an error), common false-positive patterns and how to handle them, and the relationship to definite assignment assertion (`!`). Exercises SHALL be Shape A — identify uninitialized variable patterns and fix them with proper initialization or definite assignment.

#### Scenario: Never-assigned variable is flagged
- **WHEN** a variable is declared with `let x: string` and read without assignment
- **THEN** tsc emits an error that x is used before assignment

#### Scenario: Initialized variable compiles clean
- **WHEN** the variable is assigned before use in all code paths
- **THEN** no error is emitted

### Requirement: Lesson 27 — erasableSyntaxOnly
A file at `lessons/27-erasable-syntax-only/koan.ts` SHALL teach the `--erasableSyntaxOnly` flag introduced in TS 5.8. The lesson directory SHALL contain a `tsconfig.json` enabling this flag. The comment block SHALL cover: what "erasable syntax" means (TypeScript syntax that can be removed to produce valid JavaScript by simply stripping type annotations, without code transformation), which syntax is NOT erasable (enums — generate runtime code, namespaces with value members, constructor parameter properties), the motivation (native TypeScript type-stripping in Node.js 22+ and other runtimes), and a migration path from enums to `const` enums or union types. Exercises SHALL be Shape A — identify non-erasable syntax and refactor it to erasable alternatives.

#### Scenario: Enum is flagged under erasableSyntaxOnly
- **WHEN** a regular enum is declared under erasableSyntaxOnly
- **THEN** tsc emits an error because enums generate runtime code

#### Scenario: const enum is allowed
- **WHEN** a `const enum` is used (fully inlined at use sites)
- **THEN** tsc accepts it under erasableSyntaxOnly

#### Scenario: Union type alternative compiles clean
- **WHEN** an enum is replaced with a union of string literals
- **THEN** all use sites still type-check correctly
