## ADDED Requirements

### Requirement: Comparison narrative
Comparison koans SHALL teach behavioral axes explicitly through comments and notes.

#### Scenario: Learner compares push and pull
- **WHEN** a learner opens push/pull comparison koans
- **THEN** comments MUST explain producer-driven delivery, consumer-driven reads, and hybrid invalidation-plus-read behavior

#### Scenario: Learner compares event streams and current values
- **WHEN** a learner opens stream/current-value comparison koans
- **THEN** comments MUST explain what question each model answers: "what happened?" versus "what is true now?"

#### Scenario: Learner compares producer shape and timing
- **WHEN** a learner opens hot/cold, eager/lazy, sync/async, or cancellation comparison koans
- **THEN** comments MUST explain each axis independently rather than collapsing them into one broad "reactive" concept

### Requirement: Interop narrative
Interop koans and source files SHALL teach adaptation tradeoffs between local primitives.

#### Scenario: Learner studies observable-to-signal adaptation
- **WHEN** a learner opens observable-to-signal adapter code or koans
- **THEN** comments MUST explain initial value policy, current-value storage, and teardown ownership

#### Scenario: Learner studies signal-to-observable adaptation
- **WHEN** a learner opens signal-to-observable adapter code or koans
- **THEN** comments MUST explain change emission and dependency cleanup

#### Scenario: Learner studies state-machine-to-store adaptation
- **WHEN** a learner opens state-machine-to-store adapter code or koans
- **THEN** comments MUST explain that only committed machine states become current store values

### Requirement: Ecosystem mentions stay conceptual
Comparison lessons SHALL keep known ecosystem names as optional conceptual landmarks, not executable teaching targets.

#### Scenario: Note mentions a known ecosystem
- **WHEN** notes mention RxJS, Redux, XState, MobX, Solid, Vue, React, or similar ecosystems
- **THEN** the text MUST clarify the underlying pattern distinction and MUST NOT require installing, importing, or learning that library API

#### Scenario: Koan executable behavior is authored
- **WHEN** comparison koans are updated with guided comments
- **THEN** the executable imports and assertions MUST continue to target local primitives only
