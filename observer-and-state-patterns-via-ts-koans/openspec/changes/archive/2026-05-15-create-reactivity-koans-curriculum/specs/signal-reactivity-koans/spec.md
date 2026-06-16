## ADDED Requirements

### Requirement: Signal primitive
The koans SHALL teach signals as pull-based current-value primitives with explicit writes and subscriber invalidation.

#### Scenario: Signal reads current value
- **WHEN** a signal is created with an initial value
- **THEN** calling or reading the signal MUST return the current value synchronously

#### Scenario: Signal write updates value
- **WHEN** a signal is set to a new value
- **THEN** later reads MUST return the new value

#### Scenario: Equal write can be suppressed
- **WHEN** a signal is set to a value considered equal to the current value
- **THEN** dependent computations MUST NOT be invalidated unnecessarily

### Requirement: Computed values
The koans SHALL teach computed values as cached derivations that track signal dependencies.

#### Scenario: Computed derives value
- **WHEN** a computed value reads one or more signals
- **THEN** it MUST return the value produced by its derivation function

#### Scenario: Computed is lazy
- **WHEN** a computed value is created but not read
- **THEN** its derivation function MUST NOT run

#### Scenario: Computed caches clean value
- **WHEN** a computed value is read repeatedly without dependency changes
- **THEN** its derivation function MUST run only once for that clean value

#### Scenario: Computed invalidates on dependency change
- **WHEN** a dependency signal changes
- **THEN** the computed value MUST be marked stale and recompute before returning the next value

### Requirement: Effects and cleanup
The koans SHALL teach effects as reactive side-effect functions with dependency tracking, reruns, and cleanup.

#### Scenario: Effect runs initially
- **WHEN** an effect is created
- **THEN** it MUST run its function and track any signals read during execution

#### Scenario: Effect reruns on dependency change
- **WHEN** a signal read by an effect changes
- **THEN** the effect MUST rerun

#### Scenario: Effect ignores unrelated changes
- **WHEN** a signal not read by an effect changes
- **THEN** the effect MUST NOT rerun

#### Scenario: Effect cleanup runs before rerun
- **WHEN** an effect with a cleanup function reruns
- **THEN** the previous cleanup function MUST run before the next effect execution

#### Scenario: Effect dispose stops future work
- **WHEN** an effect is disposed
- **THEN** it MUST run pending cleanup and MUST NOT rerun for later dependency changes

### Requirement: Dependency tracking graph
The koans SHALL teach dynamic dependency tracking, dependency replacement, and graph invalidation.

#### Scenario: Dependency is collected during read
- **WHEN** a computed value or effect reads a signal during tracking
- **THEN** the runtime MUST register that signal as a dependency of the active computation

#### Scenario: Dynamic dependency is replaced
- **WHEN** a computed value conditionally reads different signals across executions
- **THEN** the runtime MUST remove stale dependencies and subscribe only to dependencies read by the latest execution

#### Scenario: Nested tracking restores parent
- **WHEN** a computed value is read while another computation is tracking dependencies
- **THEN** the runtime MUST restore the parent tracking context after the nested computation finishes

### Requirement: Batching and glitch-free propagation
The koans SHALL teach batched updates and glitch-free propagation through concrete dependency graph scenarios.

#### Scenario: Batch coalesces effect reruns
- **WHEN** multiple dependency signals change inside a batch
- **THEN** dependent effects MUST rerun at most once after the batch completes

#### Scenario: Diamond dependency is consistent
- **WHEN** one signal feeds two computed values that both feed a third computed value
- **THEN** the third computed value MUST observe a consistent set of updated dependency values

#### Scenario: Derived computation avoids duplicate work
- **WHEN** multiple invalidation paths reach the same computed value during one propagation cycle
- **THEN** the computed value MUST recompute no more than necessary for the final read or effect flush

### Requirement: Cycle and reentrancy safety
The koans SHALL teach reactive runtime safety boundaries for cycles, self-updates, and reentrant writes.

#### Scenario: Computed cycle is detected
- **WHEN** computed values form a dependency cycle
- **THEN** the runtime MUST surface a deterministic error instead of recursing indefinitely

#### Scenario: Effect self-update is bounded
- **WHEN** an effect writes to a signal it also reads
- **THEN** the runtime MUST prevent unbounded synchronous recursion

#### Scenario: Write during computation is controlled
- **WHEN** a signal write occurs during computed evaluation
- **THEN** the runtime MUST either reject it deterministically or define a safe scheduling behavior through the koan expectation
