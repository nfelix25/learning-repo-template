## Why

Experienced JavaScript and TypeScript developers can often use observer, observable, state, and signal APIs without understanding the invariants that make those systems correct. This change creates a from-scratch koans curriculum that teaches those patterns by requiring learners to build each primitive, expose its failure modes, and refine it into a more correct model.

## What Changes

- Create a TypeScript-first koans repository structure for learning observer, observable, state, and signal/reactivity patterns through failing tests and small implementations.
- Define a progressive curriculum that moves from basic notification through observable streams, state containers, state machines, signals, dependency graphs, batching, and interop.
- Require each section to follow a build-break-refine learning loop: introduce a minimal primitive, reveal a limitation with targeted koans, then evolve the implementation.
- Include comparison-oriented koans that teach conceptual pattern distinctions such as push vs pull, hot vs cold, eager vs lazy, sync vs async, mutable vs immutable, and event stream vs current value.
- Keep all runtime implementations from scratch in JavaScript/TypeScript; external libraries may be referenced only as conceptual context, not as dependencies or teaching targets.
- Establish learner-facing notes that explain the underlying patterns after the koans make the problem observable.

## Capabilities

### New Capabilities

- `koan-learning-framework`: Provides the TypeScript koan structure, test-driven learning workflow, notes format, and build-break-refine progression.
- `observable-pattern-koans`: Covers observer and observable primitives, subscription lifecycle, teardown, events, operators, scheduling, hot/cold behavior, multicasting, and replay.
- `state-pattern-koans`: Covers mutable state, immutable snapshots, reducer stores, selector stores, atom-style state, derived state, state machines, transitions, guards, and side effects.
- `signal-reactivity-koans`: Covers signals, computed values, effects, dependency tracking, invalidation, caching, batching, cleanup, cycles, and glitch-free graph propagation.
- `pattern-comparison-koans`: Provides from-scratch comparison exercises that contrast the core behavioral models behind observable, state, and signal/reactivity patterns without teaching real-world library APIs.

### Modified Capabilities

- None.

## Impact

- Adds the initial educational product scope for a new TypeScript koans repository.
- Introduces new OpenSpec capabilities under `openspec/specs/`.
- Future implementation will add source modules, koan tests, learner notes, package scripts, TypeScript configuration, and test tooling.
- No existing application behavior, APIs, or dependencies are affected because the repository currently contains only the OpenSpec workspace.
