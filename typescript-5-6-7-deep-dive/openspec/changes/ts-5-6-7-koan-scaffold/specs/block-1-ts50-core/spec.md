## ADDED Requirements

### Requirement: Lesson 01 — const type parameters
A file at `lessons/01-const-type-params/koan.ts` SHALL teach the `const` modifier on type parameters introduced in TS 5.0. The comment block SHALL explain: literal widening without `const`, how `const` prevents widening, the difference from `as const` at call sites, and real-world use cases (builder APIs, route definitions). Exercises SHALL use Shape A — adding `const` to function signatures to make inference literal.

#### Scenario: Exercise demonstrates literal inference
- **WHEN** the learner adds `const` to a type parameter
- **THEN** the `Expect<Equal<...>>` assertions for literal types compile clean

#### Scenario: Without const, widened type causes error
- **WHEN** the `const` modifier is absent
- **THEN** a `// @ts-expect-error` line confirms the widened type does not satisfy the literal assertion

### Requirement: Lesson 02 — satisfies operator
A file at `lessons/02-satisfies/koan.ts` SHALL teach the `satisfies` operator from TS 4.9 (contextualised as foundational to 5.x patterns). The comment block SHALL explain: the difference between type annotation (loses literal type), `as` assertion (unsafe), and `satisfies` (validates shape while preserving literal type). Exercises SHALL compare all three patterns so the learner understands when each is appropriate.

#### Scenario: satisfies preserves literal type
- **WHEN** a value is declared with `satisfies Record<string, string>`
- **THEN** accessing a known key returns the literal string type, not `string`

#### Scenario: Type annotation widens
- **WHEN** the same value is annotated with `: Record<string, string>`
- **THEN** accessing the same key returns `string`, demonstrating the trade-off

### Requirement: Lesson 03 — verbatimModuleSyntax
A file at `lessons/03-verbatim-module-syntax/koan.ts` SHALL teach the `--verbatimModuleSyntax` flag introduced in TS 5.0. The comment block SHALL explain: why the flag exists (bundlers and native ESM stripping need to know what is a type import vs a value import), `import type` discipline, `export type`, and the errors the flag catches. The lesson SHALL include a per-directory `tsconfig.json` enabling the flag.

#### Scenario: Missing import type causes error
- **WHEN** verbatimModuleSyntax is enabled and a type-only import lacks the `type` keyword
- **THEN** tsc emits an error on the import line

#### Scenario: Correct import type compiles clean
- **WHEN** type-only imports use `import type { Foo }`
- **THEN** the file compiles without errors under verbatimModuleSyntax
