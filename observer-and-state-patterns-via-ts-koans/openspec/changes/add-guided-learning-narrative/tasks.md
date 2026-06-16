## 1. Top-Level Learning Path

- [x] 1.1 Expand `README.md` with the read-predict-run-inspect-repair-reflect study workflow
- [x] 1.2 Add `LESSON_MAP.md` that maps each section to its notes, koan files, and source files
- [x] 1.3 Document the comment conventions for koan lesson blocks and source repair-site comments
- [x] 1.4 Clarify that intentional koan failures are learning prompts, not setup failures

## 2. Section Notes As Lessons

- [x] 2.1 Expand `notes/01-observer.md` with vocabulary, notification diagrams, mutation failure modes, and reflection prompts
- [x] 2.2 Expand `notes/02-observable.md` with lifecycle diagrams, terminal state, teardown, operators, scheduling, hot/cold, and replay lessons
- [x] 2.3 Expand `notes/03-state.md` with current-value semantics, snapshot diagrams, reducer determinism, selector caching, and atom granularity
- [x] 2.4 Expand `notes/04-state-machine.md` with transition diagrams, guard/effect ordering, invalid event behavior, and store adaptation
- [x] 2.5 Expand `notes/05-signals.md` with pull reads, pushed invalidation, computed caching, effects, cleanup, and disposal
- [x] 2.6 Expand `notes/06-reactive-graph.md` with dependency graph diagrams, dynamic dependencies, batching, diamond propagation, cycles, and reentrancy
- [x] 2.7 Expand `notes/07-comparisons.md` with behavioral-axis comparisons and local interop tradeoffs

## 3. Koan Guided Lesson Blocks

- [x] 3.1 Add concept, prediction, invariant, and source-pointer comments to observer koans
- [x] 3.2 Add guided lifecycle, operator, scheduling, hot/cold, multicast, and replay comments to observable koans
- [x] 3.3 Add guided current-value, mutation, snapshot, reducer, selector, and atom comments to state koans
- [x] 3.4 Add guided transition, guard, effect, and store-adaptation comments to state machine koans
- [x] 3.5 Add guided signal, computed, effect, cleanup, and disposal comments to signal koans
- [x] 3.6 Add guided dynamic dependency, batching, diamond, cycle, and reentrancy comments to reactive graph koans
- [x] 3.7 Add guided push/pull, event/current-value, timing, producer-shape, equality, and interop comments to comparison koans

## 4. Source Teaching Comments

- [x] 4.1 Add teaching comments to subscription and observer source files at lifecycle and delivery-policy boundaries
- [x] 4.2 Add teaching comments to observable source files at producer, observer normalization, terminal-state, teardown, operator, scheduling, share, and replay repair sites
- [x] 4.3 Add teaching comments to state source files at current-value, equality, reducer, selector memoization, atom, and state machine repair sites
- [x] 4.4 Add teaching comments to signal source files at read/write, dependency tracking, computed cache, effect cleanup, batching, cycle, and reentrancy repair sites
- [x] 4.5 Add teaching comments to adapter source files at observable-to-signal, signal-to-observable, and state-machine-to-store tradeoffs

## 5. Narrative Quality Audit

- [x] 5.1 Audit comments to remove low-value syntax narration and keep comments focused on invariants, pressure, and failure modes
- [x] 5.2 Verify every koan file identifies the relevant source files and the invariant or failure mode being explored
- [x] 5.3 Verify every source TODO has nearby comments explaining what is intentionally naive and why it fails
- [x] 5.4 Verify notes and koan comments do not teach real-world library APIs or add external pattern dependencies
- [x] 5.5 Run typecheck to confirm documentation edits did not break TypeScript syntax
- [x] 5.6 Run structure validation to confirm the lesson map, notes, koans, and source files are still discoverable
- [x] 5.7 Run full and section-specific koan commands to confirm failures remain learner-facing rather than setup failures
