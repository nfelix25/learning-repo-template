## Purpose

Defines requirements for state, reducer, selector, atom, and state-machine koans.

## Requirements

### Requirement: State container fundamentals
The koans SHALL teach state containers as current-value systems with reads, writes, subscriptions, and snapshot semantics.

#### Scenario: Store exposes current state
- **WHEN** a learner creates a store with an initial value
- **THEN** the store MUST expose the current state synchronously

#### Scenario: Store notifies subscribers
- **WHEN** the store state changes
- **THEN** active subscribers MUST receive the new state

#### Scenario: Unsubscribed listener is silent
- **WHEN** a listener unsubscribes from a store
- **THEN** it MUST NOT receive later state changes

### Requirement: Mutable and immutable state tradeoffs
The koans SHALL teach the behavioral consequences of mutable updates, immutable snapshots, and referential equality.

#### Scenario: Mutable update leaks through reference
- **WHEN** a koan demonstrates direct mutation of shared state
- **THEN** the learner MUST observe how external references can see changes without an explicit store notification

#### Scenario: Immutable update creates a snapshot
- **WHEN** state is updated immutably
- **THEN** previous snapshots MUST remain unchanged

#### Scenario: Equal update can be suppressed
- **WHEN** a store receives a state value considered equal to the current value
- **THEN** the store MUST be able to suppress redundant subscriber notifications

### Requirement: Reducer store
The koans SHALL teach reducer-driven state by implementing dispatch, actions, reducers, and deterministic transitions.

#### Scenario: Dispatch applies reducer
- **WHEN** an action is dispatched to a reducer store
- **THEN** the store MUST compute the next state by passing the current state and action to the reducer

#### Scenario: Unknown action preserves state
- **WHEN** a reducer receives an action it does not handle
- **THEN** it MUST return the current state unchanged

#### Scenario: Dispatch order is deterministic
- **WHEN** multiple actions are dispatched in sequence
- **THEN** the final state MUST reflect reducer application in dispatch order

### Requirement: Derived state and selectors
The koans SHALL teach derived state through selectors, memoization, dependency inputs, and stale-cache failure modes.

#### Scenario: Selector derives from store state
- **WHEN** a selector reads store state
- **THEN** it MUST return a value derived from the current state

#### Scenario: Selector avoids unnecessary recomputation
- **WHEN** selector inputs have not changed
- **THEN** the selector MUST be able to return a cached derived value

#### Scenario: Selector recomputes on relevant change
- **WHEN** a selector input changes
- **THEN** the selector MUST recompute before returning the next derived value

### Requirement: Atom-style state
The koans SHALL teach atom-style state as small composable units with independent subscriptions and derived atoms.

#### Scenario: Atom updates independently
- **WHEN** one atom changes
- **THEN** subscribers to unrelated atoms MUST NOT be notified

#### Scenario: Derived atom reflects dependencies
- **WHEN** an atom is derived from one or more source atoms
- **THEN** it MUST reflect the latest values of its dependencies

### Requirement: State machine patterns
The koans SHALL teach finite state machines using explicit states, events, transitions, guards, and effects.

#### Scenario: Valid transition changes state
- **WHEN** a machine receives an event allowed by the current state
- **THEN** it MUST transition to the configured next state

#### Scenario: Invalid transition is rejected
- **WHEN** a machine receives an event not allowed by the current state
- **THEN** it MUST preserve the current state and expose the invalid transition behavior through the koan expectation

#### Scenario: Guard blocks transition
- **WHEN** a transition guard returns false
- **THEN** the machine MUST remain in the current state

#### Scenario: Effect runs after transition
- **WHEN** a transition with an effect succeeds
- **THEN** the effect MUST run after the state transition is committed
