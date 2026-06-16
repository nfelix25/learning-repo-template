## ADDED Requirements

### Requirement: State container narrative
State koans and source files SHALL teach current-value semantics through guided commentary.

#### Scenario: Learner studies store reads and writes
- **WHEN** a learner opens store koans or `src/state/store.ts`
- **THEN** comments MUST explain how stores differ from event streams by exposing a synchronous current value

#### Scenario: Learner studies subscription behavior
- **WHEN** a learner reads store subscription koans
- **THEN** comments MUST explain what subscribers observe and why unsubscription is part of state container correctness

### Requirement: Snapshot and mutation narrative
Mutable and immutable state koans SHALL explain reference leaks, snapshot semantics, and equality-based propagation.

#### Scenario: Learner studies mutation leaks
- **WHEN** a koan mutates shared state outside the store
- **THEN** comments MUST explain how external references can bypass notification

#### Scenario: Learner studies equality suppression
- **WHEN** a koan asserts redundant updates can be suppressed
- **THEN** comments MUST explain how equality policy controls downstream notification

### Requirement: Reducer selector and atom narrative
Reducer, selector, and atom koans SHALL include guided comments that explain their distinct state modeling pressures.

#### Scenario: Learner studies reducers
- **WHEN** a learner opens reducer store koans or source files
- **THEN** comments MUST explain action-driven deterministic transitions and unknown-action preservation

#### Scenario: Learner studies selectors
- **WHEN** a learner opens selector koans or source files
- **THEN** comments MUST explain derived state, memoization, relevant inputs, and stale-cache failure modes

#### Scenario: Learner studies atoms
- **WHEN** a learner opens atom koans or source files
- **THEN** comments MUST explain independent notification granularity and derived atom dependency pressure

### Requirement: State machine narrative
State machine koans and source files SHALL teach explicit states, events, transitions, guards, effects, and store adaptation through comments and notes.

#### Scenario: Learner studies transition validity
- **WHEN** a learner opens state machine koans
- **THEN** comments MUST explain why invalid events preserve state and why valid events commit transitions

#### Scenario: Learner studies guards and effects
- **WHEN** a koan covers guards or effects
- **THEN** comments MUST explain that guards run before commit and effects run after successful commit
