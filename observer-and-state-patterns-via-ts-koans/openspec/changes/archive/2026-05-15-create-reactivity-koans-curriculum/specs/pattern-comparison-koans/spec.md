## ADDED Requirements

### Requirement: Push and pull comparison
The koans SHALL compare push-based and pull-based models using local primitives only.

#### Scenario: Push primitive delivers events
- **WHEN** a source emits values to subscribed observers
- **THEN** observers MUST receive values because the producer pushed them

#### Scenario: Pull primitive exposes current value
- **WHEN** a learner reads a signal or store value
- **THEN** the learner MUST receive the current value because the consumer pulled it

#### Scenario: Hybrid primitive pushes invalidation and pulls value
- **WHEN** a computed value depends on signals
- **THEN** dependency changes MUST invalidate the computed value while the next read pulls the recomputed value

### Requirement: Event stream and current value comparison
The koans SHALL contrast event streams with current-value containers.

#### Scenario: Event stream does not imply current value
- **WHEN** an observable emits values over time
- **THEN** the koan MUST demonstrate that a late subscriber cannot read a current value unless the primitive explicitly stores or replays one

#### Scenario: Current-value container can be read without event
- **WHEN** a store or signal has a current state
- **THEN** a learner MUST be able to read that state without waiting for a new event emission

### Requirement: Hot and cold comparison
The koans SHALL compare shared producers and per-subscriber producers through from-scratch examples.

#### Scenario: Cold producer is per subscription
- **WHEN** two subscribers observe a cold source
- **THEN** the koan MUST show that each subscription receives values from its own producer execution

#### Scenario: Hot producer is shared
- **WHEN** two subscribers observe a hot source
- **THEN** the koan MUST show that both subscribers observe values from one shared producer

### Requirement: Eager and lazy comparison
The koans SHALL compare eager work, lazy work, cached derivations, and explicit invalidation.

#### Scenario: Eager work happens before demand
- **WHEN** a primitive computes eagerly
- **THEN** the koan MUST show work occurring before the value is requested

#### Scenario: Lazy work waits for demand
- **WHEN** a primitive computes lazily
- **THEN** the koan MUST show work deferred until the value is requested

#### Scenario: Cached lazy work avoids repeated computation
- **WHEN** a lazy derived value is read repeatedly without invalidation
- **THEN** the koan MUST show that cached work is reused

### Requirement: Sync and async comparison
The koans SHALL compare synchronous delivery, asynchronous scheduling, and cancellation timing.

#### Scenario: Sync delivery happens in the current call stack
- **WHEN** a synchronous source emits a value
- **THEN** the koan MUST show the subscriber observing the value before control returns to the caller

#### Scenario: Async delivery happens after scheduling
- **WHEN** an asynchronous source schedules a value
- **THEN** the koan MUST show the subscriber observing the value only after the scheduler advances

#### Scenario: Cancellation timing matters
- **WHEN** a subscription is cancelled before asynchronous delivery
- **THEN** the koan MUST show the scheduled work being suppressed

### Requirement: Mutation and snapshot comparison
The koans SHALL compare mutable shared state, immutable snapshots, and equality-based change detection.

#### Scenario: Mutable reference can bypass notification
- **WHEN** shared state is mutated through an existing reference
- **THEN** the koan MUST show that observers can miss the change if the container is not notified

#### Scenario: Immutable snapshot preserves history
- **WHEN** state changes by creating a new value
- **THEN** the koan MUST show that previous snapshots remain unchanged

#### Scenario: Equality affects propagation
- **WHEN** a state or signal primitive receives a value equal to its current value
- **THEN** the koan MUST show how equality policy controls downstream notification or invalidation

### Requirement: Local interop comparison
The koans SHALL teach observable, state, and signal interop by adapting local primitives to one another without importing external libraries.

#### Scenario: Observable adapts to signal
- **WHEN** an observable is adapted into a signal-like current-value primitive
- **THEN** the adapter MUST define initial value behavior, subscription teardown, and update propagation

#### Scenario: Signal adapts to observable
- **WHEN** a signal is adapted into an observable-like event primitive
- **THEN** the adapter MUST emit changes to subscribers and stop tracking when unsubscribed

#### Scenario: State machine adapts to store
- **WHEN** a state machine is exposed as a store-like primitive
- **THEN** the adapter MUST expose the current state and notify subscribers after valid transitions

### Requirement: No real-world library teaching target
The comparison koans SHALL teach pattern distinctions without requiring or targeting real-world library APIs.

#### Scenario: External library API appears in koan expectation
- **WHEN** a comparison koan is authored
- **THEN** its executable behavior MUST target local primitives rather than APIs from RxJS, MobX, Redux, XState, Solid, Vue, React, or similar libraries

#### Scenario: Ecosystem name appears in notes
- **WHEN** learner notes mention a known ecosystem
- **THEN** the note MUST use it only as conceptual context and MUST NOT require installing, importing, or learning that library API
