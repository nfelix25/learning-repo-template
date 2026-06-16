## ADDED Requirements

### Requirement: Lesson 33 — TS 7.0 Go rewrite context
A file at `lessons/33-ts70-go-rewrite/koan.ts` SHALL provide the architectural context for TypeScript 7.0 beta. This lesson is narrative-heavy with a single type-level exercise demonstrating the key insight. The comment block SHALL cover: why the rewrite happened (JS-based tsc was hitting single-threaded performance limits; large codebases took 60–90s for type checking), the Go port strategy (methodical port from existing TS implementation, not a rewrite — type semantics are identical), the `@typescript/native-preview` package and `tsgo` entrypoint, the ~10x speed claim and where it comes from (native code + shared-memory parallelism), the `--checkers` flag (parallel type-check worker count), the `--builders` flag (parallel project reference builds), and the fact that TS 7.0 type semantics are identical to TS 6.0 (no new type-system features). The exercise SHALL demonstrate `--stableTypeOrdering` — a flag introduced in TS 6.0 that aligns type ordering behaviour with TS 7.0 to expose migration issues.

#### Scenario: tsgo is a drop-in for tsc
- **WHEN** the learner understands that tsgo produces the same errors as tsc
- **THEN** the comment makes clear no code changes are required for TS 7 compatibility (only config changes for removed options)

#### Scenario: stableTypeOrdering exposes inference differences
- **WHEN** `--stableTypeOrdering` is added to a tsconfig
- **THEN** type inference in certain union/intersection patterns may produce different (more stable) types

### Requirement: Lesson 34 — isolatedDeclarations at scale
A file at `lessons/34-isolated-declarations-scale/koan.ts` SHALL teach `--isolatedDeclarations` as the key design constraint that enables TS 7.0's parallel architecture. The lesson directory SHALL have a `tsconfig.json` with `"isolatedDeclarations": true`. The comment block SHALL cover: why declaration file emit normally requires whole-program type resolution (the bottleneck), how isolatedDeclarations changes the contract (each file must be annotatable in isolation — no cross-file inference for exports), the parallel speedup this enables (declaration emit can run per-file in parallel), what patterns violate isolatedDeclarations (re-exporting with inferred types, complex mapped/conditional return types without annotation), and how to think about it as a design discipline rather than a burden. Exercises SHALL be Shape A — annotate 5–6 export patterns that violate isolatedDeclarations, choosing the minimal annotation that satisfies the constraint.

#### Scenario: Inferred re-export violates isolatedDeclarations
- **WHEN** `export const result = computeComplexType()` has no annotation
- **THEN** tsc (with isolatedDeclarations) emits an error requiring explicit annotation

#### Scenario: Explicit annotation satisfies the constraint
- **WHEN** the export is annotated with the specific return type
- **THEN** the file satisfies isolatedDeclarations and could be processed in parallel

#### Scenario: Simple primitive inference is allowed
- **WHEN** `export const VERSION = "1.0.0"` has no annotation
- **THEN** tsc accepts it — string literals are trivially inferrable in isolation

### Requirement: Lesson 35 — erasableSyntaxOnly as a future-proof pattern
A file at `lessons/35-erasable-future-proof/koan.ts` SHALL teach `--erasableSyntaxOnly` in the context of native TypeScript stripping in runtimes. The lesson directory SHALL have a `tsconfig.json` with `"erasableSyntaxOnly": true`. The comment block SHALL cover: native TS type-stripping in Node.js 22+ (`--experimental-strip-types`), how stripping works (remove type annotations, not transform code), why non-erasable syntax (enums, namespaces with values, constructor parameter properties) cannot be supported by a simple stripper, how `erasableSyntaxOnly` enforces the constraint at compile time, and the migration paths for each non-erasable pattern (enums → `const` type unions or `const enum`, constructor parameter properties → explicit field + constructor assignment). A type-level exercise SHALL build an `IsErasable<T>` utility that returns true if a type could only come from erasable syntax (no enum member types). Note: this is illustrative — the exercise demonstrates the concept, not a real runtime check.

#### Scenario: Enum type is flagged under erasableSyntaxOnly
- **WHEN** a regular enum is declared with erasableSyntaxOnly enabled
- **THEN** tsc emits an error

#### Scenario: String literal union replaces enum correctly
- **WHEN** `type Direction = "north" | "south" | "east" | "west"` replaces an enum
- **THEN** all use sites compile correctly and no erasableSyntaxOnly errors are emitted

#### Scenario: const enum is allowed under erasableSyntaxOnly
- **WHEN** `const enum Status { Active = "active" }` is declared
- **THEN** tsc accepts it because const enum members are fully inlined

### Requirement: Lesson 36 — stableTypeOrdering and inference migration
A file at `lessons/36-stable-type-ordering/koan.ts` SHALL teach `--stableTypeOrdering`, how to use it to identify TS 6→7 migration issues, and what it reveals about type inference ordering. The lesson directory SHALL have a `tsconfig.json` with `"stableTypeOrdering": true`. The comment block SHALL cover: why type ordering was non-deterministic in TS ≤ 6.0 without the flag (union member order could depend on inference path, not source order), what stableTypeOrdering does (sorts union/intersection members deterministically to match TS 7.0's Go implementation), how this can change which overload resolves or which union branch is displayed in errors, practical impact on distributed union types and mapped types, and how to use the flag as a migration smoke test before upgrading to TS 7.0. Exercises SHALL be Shape A — identify type assertions that break under stableTypeOrdering and fix them to be order-independent.

#### Scenario: Union member order differences surface under stableTypeOrdering
- **WHEN** a type assertion depends on a specific union member order
- **THEN** stableTypeOrdering may reorder members, causing the assertion to fail

#### Scenario: Order-independent assertions pass under both
- **WHEN** assertions use Set-equality semantics (checking membership, not order)
- **THEN** they compile under both stableTypeOrdering and without
