## ADDED Requirements

### Requirement: Observer narrative
Observer koans and source files SHALL teach notification, subscription lifetime, and mutation during delivery through inline guided commentary.

#### Scenario: Learner studies subject notification
- **WHEN** a learner opens observer koans or `src/observer` files
- **THEN** comments MUST explain the path from a callback list to a subscription-managed notification primitive

#### Scenario: Learner studies mutation during delivery
- **WHEN** a koan exposes subscription or unsubscription during notification
- **THEN** comments MUST explain why naive iteration is unstable and why deterministic delivery requires an explicit policy

### Requirement: Observable lifecycle narrative
Observable lifecycle koans and source files SHALL teach laziness, terminal state, teardown, and untrusted producers through guided comments.

#### Scenario: Learner studies subscribe
- **WHEN** a learner inspects observable subscription code
- **THEN** comments MUST explain that subscription starts the producer and that lifecycle guarantees must be enforced around producer notifications

#### Scenario: Learner studies terminal notifications
- **WHEN** a koan asserts behavior after `complete` or `error`
- **THEN** comments MUST explain that terminal state closes the subscriber to later notifications

#### Scenario: Learner studies teardown
- **WHEN** a koan asserts teardown behavior
- **THEN** comments MUST explain teardown ownership and idempotence

### Requirement: Operator narrative
Observable operator koans and source files SHALL teach operator composition as lifecycle-preserving observable transformation.

#### Scenario: Learner studies simple operators
- **WHEN** a learner opens `map` or `filter` koans or implementations
- **THEN** comments MUST explain how transformed observables preserve source errors, completion, and teardown

#### Scenario: Learner studies cancellation operators
- **WHEN** a learner opens `take` or `switchMap` koans or implementations
- **THEN** comments MUST explain why cancellation timing and inner subscription ownership are the key invariants

### Requirement: Scheduling and producer-shape narrative
Scheduling, hot/cold, multicast, and replay koans SHALL include comments that explain timing and producer sharing as distinct axes of behavior.

#### Scenario: Learner studies scheduling
- **WHEN** a learner opens scheduler koans or source files
- **THEN** comments MUST explain the difference between synchronous delivery, deferred delivery, and cancellation before delivery

#### Scenario: Learner studies hot and cold behavior
- **WHEN** a learner opens hot/cold, share, or replay koans
- **THEN** comments MUST explain per-subscriber producers, shared producers, late subscribers, and explicit replay storage
