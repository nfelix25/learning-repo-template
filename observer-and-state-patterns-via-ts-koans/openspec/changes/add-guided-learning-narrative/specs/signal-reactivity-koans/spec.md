## ADDED Requirements

### Requirement: Signal primitive narrative
Signal koans and source files SHALL teach pull-based current values and pushed invalidation through guided commentary.

#### Scenario: Learner studies signal reads and writes
- **WHEN** a learner opens signal koans or `src/signals/signal.ts`
- **THEN** comments MUST explain reads as current-value pulls and writes as invalidation pressure

#### Scenario: Learner studies equality suppression
- **WHEN** a signal koan covers equal writes
- **THEN** comments MUST explain how equality prevents unnecessary invalidation

### Requirement: Computed and effect narrative
Computed and effect koans SHALL explain dependency tracking, laziness, caching, reruns, cleanup, and disposal.

#### Scenario: Learner studies computed caching
- **WHEN** a learner opens computed koans or source files
- **THEN** comments MUST explain lazy derivation, clean caches, stale invalidation, and recomputation counts

#### Scenario: Learner studies effects
- **WHEN** a learner opens effect koans or source files
- **THEN** comments MUST explain effects as terminal reactive work with dependency tracking and cleanup responsibility

### Requirement: Reactive graph narrative
Reactive graph koans SHALL include diagrams or comments explaining dependency graphs, dynamic dependencies, nested tracking, batching, glitch freedom, cycles, and reentrancy.

#### Scenario: Learner studies dynamic dependencies
- **WHEN** a learner opens dynamic dependency koans
- **THEN** comments MUST explain stale dependency removal and active tracking context restoration

#### Scenario: Learner studies diamond dependencies
- **WHEN** a learner opens batching or diamond graph koans
- **THEN** comments MUST include a visual or explicit textual model of how one source invalidates multiple derived paths

#### Scenario: Learner studies cycle safety
- **WHEN** a learner opens cycle or reentrancy koans
- **THEN** comments MUST explain why the runtime needs deterministic safety boundaries instead of unbounded recursion
