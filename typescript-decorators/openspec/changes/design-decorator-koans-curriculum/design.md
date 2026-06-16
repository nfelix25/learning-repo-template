## Context

The repository currently contains only OpenSpec configuration. The intended product is a personal learning repo, not a published library: its primary user is someone working through TypeScript decorators by running small exercises, inspecting failures, fixing code, and recording what they learned.

TypeScript decorators have two important models that learners often conflate:

- Modern standard decorators, supported by TypeScript 5.x without `experimentalDecorators`, using value/context function signatures.
- Legacy experimental decorators, enabled by `experimentalDecorators`, using target/property/descriptor signatures and often paired with `emitDecoratorMetadata` and `reflect-metadata`.

The curriculum should teach the modern model first, then introduce legacy decorators as an ecosystem and historical contrast.

## Goals / Non-Goals

**Goals:**

- Provide a modern-first koan sequence for TypeScript decorators.
- Make every learning unit executable with focused tests.
- Keep examples small enough to reason about runtime order, replacement behavior, and initializer behavior.
- Include a deliberate legacy section so older framework examples are understandable without making legacy decorators the default mental model.
- Keep the repository easy to run locally with standard Node and npm commands.

**Non-Goals:**

- Build a production decorator framework.
- Exhaustively cover every framework that uses decorators.
- Publish a package for external consumption.
- Support multiple test runners or package managers in the first version.
- Use browser tooling or a frontend UI.

## Decisions

### Use Node's Built-In Test Runner

The project will use `node --test` with TypeScript execution support instead of adding a heavier test framework.

Rationale:
- Koans need a fast feedback loop and simple assertions more than advanced testing features.
- The repo is personal and educational, so fewer moving parts makes the runtime behavior easier to inspect.
- Node's built-in runner keeps command output familiar and dependency count low.

Alternatives considered:
- Vitest: excellent developer experience, but introduces more runner-specific concepts than needed.
- Jest: common, but heavier and less aligned with modern ESM TypeScript examples.

### Use `tsx` for TypeScript Execution

Tests will run TypeScript directly through `tsx` or Node's loader/import support rather than requiring a separate build step before every koan.

Rationale:
- The learning loop should be edit, run, observe.
- Decorator emit behavior can still be checked with `tsc --noEmit` and targeted compile examples.
- Avoiding a build directory keeps the repository easier to navigate.

Alternatives considered:
- Compile with `tsc` before tests: more explicit, but slower and noisier for koans.
- Use `ts-node`: workable, but `tsx` is simpler for modern ESM projects.

### Keep Modern and Legacy Decorators in Separate TypeScript Configs

Modern koans and legacy koans will use separate `tsconfig` files:

- `tsconfig.json` for modern decorators and the default project.
- `tsconfig.legacy.json` for legacy experimental decorators and metadata exercises.

Rationale:
- Legacy `experimentalDecorators` changes type-checking and emit behavior.
- `emitDecoratorMetadata` is only meaningful for the legacy path.
- Separate configs prevent the learner from accidentally blending incompatible assumptions.

Alternatives considered:
- One config with all decorator options enabled: simpler setup, but teaches the wrong boundary.
- Separate packages/workspaces: clearer isolation, but too much structure for the first version.

### Standardize Each Koan as a Small Directory

Each koan will live in a numbered directory with a consistent shape:

```text
koans/01-when-decorators-run/
├── README.md
├── exercise.ts
├── exercise.test.ts
├── solution.ts
└── notes.md
```

Rationale:
- Numbering communicates progression.
- The same file names reduce navigation friction.
- `notes.md` makes reflection part of the practice instead of an afterthought.

Alternatives considered:
- One large test file: faster to scaffold, but poor for deep study.
- README-only examples: easier to write, but not koans.

### Treat Solutions as Reference Material, Not the Main Path

Solutions will be present but separated from exercises. Tests should target `exercise.ts`, while `solution.ts` provides a reference implementation or explanation.

Rationale:
- The primary activity is fixing or predicting behavior.
- Keeping a solution nearby supports self-study without requiring a hidden answer key.
- Tests must not accidentally pass because they import the solution.

Alternatives considered:
- Omit solutions: more pure as koans, but worse for a personal learning archive.
- Put solutions inline as comments: convenient, but too easy to read by accident.

## Risks / Trade-offs

- Modern decorator support and metadata behavior can evolve in TypeScript. -> Pin TypeScript with a semver range and document which model the koans target.
- Running TypeScript directly can obscure emitted JavaScript details. -> Include selected koans or scripts that inspect compile output when emit behavior is the lesson.
- Legacy decorators can dominate the curriculum because many ecosystem examples use them. -> Keep legacy content in a later, explicitly named section.
- Too many initial koans can make the first implementation feel unfinished. -> Start with a thin but complete path, then expand topic coverage incrementally.
- Tests that assert console output or decorator order can become brittle. -> Prefer arrays/log collectors returned from examples over raw console assertions.

## Migration Plan

This is a new repository scaffold. Implementation can be added directly without migrating existing code.

Rollback is deleting the generated project files and the change artifacts before archive. No external state is affected.

## Open Questions

- Should the initial implementation include only modern decorators plus a legacy orientation, or a full legacy section immediately?
- Should the repo use `npm` only, or document equivalent commands for other package managers later?
- Should completed koans remain intentionally failing until the learner edits them, or should the repository include both failing exercises and passing solution tests?
