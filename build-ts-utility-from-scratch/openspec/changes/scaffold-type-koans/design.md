## Context

The repository is empty apart from OpenSpec metadata. The intended audience is a single experienced TypeScript developer who wants to build a deep, practical understanding of TypeScript utility types by recreating them manually.

The learning experience should feel like koans: files contain small type-level exercises, compiler-checked expectations, and teaching comments that explain the mental model needed to solve each exercise. There is no need for runtime tests, application code, UI, publishing configuration, or multi-user documentation.

## Goals / Non-Goals

**Goals:**

- Create a minimal TypeScript project that validates with `tsc --noEmit`.
- Provide a reusable type assertion harness centered on `Expect<Equal<...>>`.
- Organize koans by TypeScript concept progression instead of by arbitrary utility-name lists.
- Include comments that explain professional TypeScript reasoning, common traps, and edge cases.
- Make the initial repo immediately useful as a workbook while leaving room for future koans.

**Non-Goals:**

- Publishing a package to npm.
- Providing runtime JavaScript implementations.
- Building a web UI, docs site, or custom test runner.
- Exhaustively covering every community utility type in the first change.
- Supporting beginners with lengthy TypeScript syntax tutorials.

## Decisions

### Use compiler-only tests

The project will use `tsc --noEmit` as the validation mechanism. Type-level tests will be expressed as aliases like `type cases = [Expect<Equal<Actual, Expected>>]`, plus negative examples where appropriate.

Rationale: the subject is type-level programming, so the TypeScript compiler is the most direct test runner. This avoids runtime dependencies and keeps failures close to the concepts being studied.

Alternative considered: use Vitest or another runtime test framework. That adds noise without improving type assertion coverage.

### Keep assertions in a shared source module

The repo will include a small `src/assertions.ts` module exporting core helpers such as `Expect`, `Equal`, and selected variants for negative checks.

Rationale: every koan should use the same vocabulary, and improving equality semantics later should not require updating every file.

Alternative considered: duplicate helpers in every koan file. That makes each file self-contained but creates distracting repetition.

### Group koans by mental model

Koan files will be ordered by conceptual dependency:

1. foundations
2. object utilities
3. union utilities
4. function utilities
5. tuple utilities
6. string utilities
7. recursive utilities
8. professional patterns

Rationale: professional understanding comes from recognizing mechanisms like mapped types, conditional distribution, `infer`, key remapping, and recursion. Built-in utilities become examples of those mechanisms.

Alternative considered: one file per built-in utility. That is easier to index but weaker as a learning progression.

### Use intentional placeholders for exercises

Exercises will use placeholder implementations such as `never` where the learner is expected to fill in a type. The repo may not fully type-check until those placeholders are solved.

Rationale: koans should create useful compiler failures. The failure is the prompt.

Alternative considered: ship every implementation solved. That would make the repo more like reference material than a workbook.

### Teach through local comments

Each koan file will include concise explanatory comments near the relevant exercise: goal, mental model, common trap, and stretch case.

Rationale: the user wants helpful learning material embedded in the files, not a separate textbook. Comments should support professional recall while leaving the exercise itself active.

Alternative considered: put all explanation in a README. That is useful for overview but weaker when working through compiler errors in a specific file.

## Risks / Trade-offs

- Placeholder implementations make `npm test` fail by design until exercises are solved -> Mitigate by documenting the koan workflow and optionally using targeted `tsc` invocations as files are completed.
- Type equality helpers have edge cases around `any`, `never`, and overloaded functions -> Mitigate by introducing those caveats in later professional-pattern koans.
- Too many comments can turn exercises into passive reading -> Mitigate with concise comments and stretch cases rather than long prose.
- Recursive utilities can hit compiler depth limits -> Mitigate by keeping examples realistic and explaining recursion limits as part of the learning material.
