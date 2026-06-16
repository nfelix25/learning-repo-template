## Purpose

Defines requirements for observer and observable koans covering lifecycle, operators, scheduling, hot/cold behavior, multicasting, and replay.

## Requirements

### Requirement: Observer and subject fundamentals
The koans SHALL teach observer pattern fundamentals by implementing local observer, subscription, and subject primitives.

#### Scenario: Subject notifies observers
- **WHEN** multiple observers subscribe to a subject and the subject emits a value
- **THEN** every active observer MUST receive the emitted value in subscription order

#### Scenario: Observer unsubscribes
- **WHEN** an observer unsubscribes before a subject emits a later value
- **THEN** that observer MUST NOT receive the later value

#### Scenario: Mutation during notification
- **WHEN** an observer unsubscribes or subscribes another observer while notification is in progress
- **THEN** the subject MUST preserve deterministic delivery for the current emission

### Requirement: Observable lifecycle
The koans SHALL teach observable lifecycle semantics including lazy execution, next, error, complete, and teardown.

#### Scenario: Observable is lazy
- **WHEN** an observable is created but not subscribed to
- **THEN** its producer MUST NOT run

#### Scenario: Observable completes
- **WHEN** an observable sends `complete`
- **THEN** it MUST stop delivering later `next`, `error`, or `complete` notifications to that subscriber

#### Scenario: Observable tears down resources
- **WHEN** a subscriber unsubscribes from an observable with a teardown function
- **THEN** the teardown function MUST run exactly once

#### Scenario: Observable errors
- **WHEN** an observable sends `error`
- **THEN** it MUST notify the subscriber of the error and stop delivering further notifications

### Requirement: Observable operators
The koans SHALL teach observable transformation and composition by implementing operators from scratch.

#### Scenario: Map transforms values
- **WHEN** a learner applies `map` to an observable
- **THEN** subscribers MUST receive transformed values while preserving completion and error behavior

#### Scenario: Filter suppresses values
- **WHEN** a learner applies `filter` to an observable
- **THEN** subscribers MUST receive only values accepted by the predicate

#### Scenario: Take completes after count
- **WHEN** a learner applies `take` with a finite count
- **THEN** the resulting observable MUST complete after delivering that many values and MUST tear down the source subscription

#### Scenario: Switch map cancels stale inner work
- **WHEN** a source emits a new value while a previous inner observable is active
- **THEN** `switchMap` MUST unsubscribe from the previous inner observable before subscribing to the new one

### Requirement: Scheduling and delivery timing
The koans SHALL teach synchronous delivery, queued delivery, microtask delivery, and macrotask delivery through local scheduling primitives.

#### Scenario: Synchronous delivery is immediate
- **WHEN** an observable emits synchronously during subscription
- **THEN** the subscriber MUST receive the value before the subscribe call returns

#### Scenario: Scheduled delivery is deferred
- **WHEN** an observable uses a scheduler-backed delivery mode
- **THEN** the subscriber MUST receive the value only after the selected scheduler advances

#### Scenario: Unsubscribe before scheduled delivery
- **WHEN** a subscriber unsubscribes before a scheduled notification is delivered
- **THEN** the scheduled notification MUST NOT be delivered to that subscriber

### Requirement: Hot, cold, multicast, and replay behavior
The koans SHALL teach hot and cold producer differences, multicasting, sharing, and replay through from-scratch observable primitives.

#### Scenario: Cold observable starts per subscriber
- **WHEN** two subscribers subscribe to the same cold observable
- **THEN** the observable MUST run its producer independently for each subscriber

#### Scenario: Hot subject shares emissions
- **WHEN** two active subscribers listen to the same hot subject
- **THEN** both subscribers MUST observe the same emissions from the shared producer

#### Scenario: Late subscriber misses non-replayed values
- **WHEN** a subscriber joins a hot observable after values have already been emitted
- **THEN** the subscriber MUST NOT receive past values unless replay behavior is explicitly used

#### Scenario: Replay sends buffered values
- **WHEN** a subscriber joins a replaying observable
- **THEN** the subscriber MUST receive the configured buffered values before receiving future values
