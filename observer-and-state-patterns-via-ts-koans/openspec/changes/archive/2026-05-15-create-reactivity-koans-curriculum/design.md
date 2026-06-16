## Context

The repository currently contains only an OpenSpec workspace. The change will establish a TypeScript koans project for an experienced JavaScript developer who wants to understand observer, observable, state, and signal/reactivity patterns by implementing the primitives from scratch.

The curriculum is not a library-usage course. External ecosystems can provide conceptual comparison points, but the exercises, source modules, tests, and notes must center on locally implemented TypeScript primitives.

## Goals / Non-Goals

**Goals:**

- Provide a runnable TypeScript koans workflow where failing tests guide the learner through each concept.
- Organize the repo so each section introduces a primitive, exposes a limitation, and refines the implementation.
- Teach the behavioral models behind observer, observable, state, state machine, and signal/reactivity systems.
- Make comparison patterns explicit: push vs pull, event stream vs current value, hot vs cold, sync vs async, eager vs lazy, mutable vs immutable, and invalidation vs recomputation.
- Keep implementation modules intentionally small enough to read in one sitting while still covering the hard correctness problems.

**Non-Goals:**

- Do not teach RxJS, MobX, Redux, XState, Solid, Vue, React, or any other real-world library API.
- Do not use production libraries as implementation dependencies for the patterns being taught.
- Do not optimize for production completeness, browser compatibility, or package publishing.
- Do not create a UI; the primary learning interface is tests, source files, and notes.

## Decisions

### Use TypeScript as the implementation and learning language

TypeScript SHALL be used for all koan implementation files and tests so learners can see how generics, teardown contracts, discriminated unions, and state transition types shape the APIs. Plain JavaScript alternatives were considered, but they would hide important type-level design pressure that experienced JS developers benefit from seeing.

### Use tests as the koan runner

Each koan SHALL be expressed as a focused failing test. This keeps the feedback loop concrete and avoids building a custom runner before the learning content exists. A custom koan runner was considered, but it would add tooling surface area that does not teach the target patterns.

### Prefer minimal tooling and built-in platform primitives

The project SHOULD rely on a small Node/TypeScript toolchain and avoid framework dependencies. Built-in testing and assertion primitives are preferred where they are practical. Additional dev tooling is acceptable only when it supports TypeScript execution or formatting without becoming part of the pattern curriculum.

### Separate source, koans, and notes

The repo SHALL separate implementation modules, koan tests, and learner notes:

- `src/` contains the from-scratch primitives being evolved.
- `koans/` contains ordered tests that describe the desired behavior.
- `notes/` contains short concept explanations that make sense after the corresponding koans fail.

This separation makes it clear which files learners modify, which files describe behavior, and which files explain the pattern.

### Build the curriculum from primitives to graphs

The curriculum SHALL progress from simple notification toward graph propagation:

1. Observer and subject mechanics.
2. Observable lifecycle and operators.
3. Scheduling, hot/cold behavior, multicasting, and replay.
4. State containers, selectors, atoms, and reducers.
5. State machines with transitions, guards, and effects.
6. Signals, computed values, effects, dependency tracking, invalidation, batching, and cleanup.
7. Interop and comparison koans that distinguish the models without teaching external libraries.

This order lets each later concept reuse tension introduced by earlier sections.

### Make failure modes first-class

Each major section SHALL include koans that intentionally expose incomplete behavior before refinement. Examples include leaked subscriptions, double completion, stale derived state, invalid transitions, eager recomputation, diamond dependency glitches, missed cleanup, cycle handling, and repeated effects.

This is the core of the learning experience: the learner should feel why the invariant matters before reading the explanation.

### Keep conceptual comparisons from-scratch

Comparison koans SHALL contrast patterns by implementing small local examples rather than importing real-world libraries. For example, a push stream and a pull signal can be compared through local primitives that model event delivery, current value reads, and invalidation behavior.

This preserves the value of option-style comparison while keeping the repo focused on fundamentals instead of library fluency.

## Risks / Trade-offs

- Broad scope can become too large for a koans repo -> Mitigate by keeping each primitive minimal and each section ordered around one concept per koan.
- From-scratch implementations can accidentally imply production readiness -> Mitigate with notes that identify intentional simplifications and correctness boundaries.
- Comparison content can drift into library lessons -> Mitigate by banning external pattern libraries from koan implementations and keeping library names out of test targets.
- Type-level material can distract from runtime semantics -> Mitigate by using types where they clarify contracts, not as separate type puzzle content.
- Reactive graph correctness can become abstract -> Mitigate with concrete koans for diamond dependencies, batching, cleanup, lazy caching, and cycle detection.

## Migration Plan

This is a new repository baseline, so there is no migration or rollback concern. Implementation can proceed by adding project tooling, then the ordered `src/`, `koans/`, and `notes/` structure.

## Implementation Defaults

- Use Node's built-in test runner with the smallest practical TypeScript execution path. If native TypeScript execution is not sufficient, add a dev-only TypeScript runner.
- Ship starter implementations and failing koan tests as the primary learning contract. Do not add completed solution files in the initial baseline unless they are explicitly requested later.
- Group notes by curriculum section under `notes/`, with each note referencing the related koan files and explaining the invariants they expose.
