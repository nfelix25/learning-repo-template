## Why

The current koans provide a useful executable skeleton, but the repository is not yet self-contained as a learning experience. This change turns the repo into "guided text embedded in executable lessons" so learners can understand the patterns, invariants, and intended repairs from the included material alone.

## What Changes

- Add a narrative learning layer that ties together README guidance, section notes, koan tests, and starter source files.
- Expand the learning workflow from "run failing tests" to "read lesson thread, predict behavior, inspect implementation pressure, repair invariant, reflect."
- Require every koan file to include instructional comments that explain the concept, prediction prompt, invariant, source files to inspect, and failure mode.
- Require source files to include teaching comments at primitive boundaries and TODO repair sites explaining what is intentionally naive and what correctness pressure the learner should notice.
- Expand notes from short summaries into thorough section lessons with diagrams, vocabulary, progression, and reflection prompts.
- Add a lesson map that connects each section's notes, koan files, and source files into a coherent path.
- Preserve the from-scratch scope: no external library APIs become teaching targets.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `koan-learning-framework`: Strengthen the learning framework so documentation, koan comments, and source comments form a self-contained guided lesson path.
- `observable-pattern-koans`: Add guided narrative requirements for observer and observable koans, including lifecycle, operator, scheduling, hot/cold, multicast, and replay lessons.
- `state-pattern-koans`: Add guided narrative requirements for state, reducer, selector, atom, and state machine koans.
- `signal-reactivity-koans`: Add guided narrative requirements for signal, computed, effect, dependency graph, batching, cleanup, cycle, and reentrancy koans.
- `pattern-comparison-koans`: Add guided narrative requirements for comparison and interop koans without teaching real-world library APIs.

## Impact

- Affects `README.md`, new or expanded lesson map documentation, `notes/**/*.md`, `koans/**/*.test.ts`, and `src/**/*.ts`.
- Does not change package runtime dependencies or introduce production pattern libraries.
- May change comments and documentation heavily while keeping starter implementations intentionally incomplete.
- May adjust koan wording for clarity, but executable behavior should remain focused on the same learning invariants unless a spec-level gap is discovered during implementation.
