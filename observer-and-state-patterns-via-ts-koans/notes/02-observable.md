# 02 Observable

## What This Section Teaches

Observables add a producer lifecycle around observer notification. A subject is already active and waiting for `next`. An observable describes work that starts only when someone subscribes.

Related files:

- `koans/02-observable/01-lifecycle.test.ts`
- `koans/02-observable/02-operators.test.ts`
- `koans/02-observable/03-scheduling.test.ts`
- `koans/02-observable/04-hot-cold-replay.test.ts`
- `src/observable/observable.ts`
- `src/observable/operators.ts`
- `src/observable/scheduler.ts`
- `src/observable/multicast.ts`

## Vocabulary

- **Producer**: the function that creates values for a subscriber.
- **Subscriber**: the observer plus lifecycle state for one subscription.
- **Terminal notification**: `complete` or `error`; after this, the subscriber is closed.
- **Teardown**: cleanup work run when a subscription ends.
- **Operator**: a function that turns one observable into another.
- **Scheduler**: a policy for when notifications are delivered.
- **Hot source**: shared producer.
- **Cold source**: per-subscriber producer.

## Lifecycle Model

```text
new Observable(producer)
        |
        | no work yet
        v
subscribe(observer)
        |
        v
producer(safeObserver)
        |
        +-- next(value)*
        +-- error(reason)  -> closed
        +-- complete()     -> closed
        |
        v
teardown when unsubscribed or closed
```

The producer is untrusted. It might call `next` after `complete`, call `complete` twice, throw, or keep scheduled work alive after unsubscribe. The observable runtime protects the subscriber from those behaviors.

## Operator Model

```text
source observable
      |
      v
operator(source)
      |
      v
derived observable
```

Operators are not array methods. They create new observables with their own subscription lifecycle. A correct operator forwards errors and completion unless its purpose is to change them, and it owns whatever inner subscriptions it creates.

## Scheduling Model

```text
sync:
  subscribe() -> next() before subscribe returns

scheduled:
  subscribe() -> enqueue next()
  unsubscribe()
  flush queue -> cancelled notification is suppressed
```

Scheduling separates "value was produced" from "subscriber was notified." Cancellation must be checked at delivery time, not just when the task is scheduled.

## Hot, Cold, And Replay

```text
cold:
  subscriber A -> producer run A
  subscriber B -> producer run B

hot:
  producer run
      |
      +-> subscriber A
      +-> subscriber B

replay:
  hot source + explicit buffer for late subscribers
```

Replay is not magic memory. It is a storage policy layered on top of delivery.

## Build-Break-Refine Sequence

1. Build lazy subscription.
2. Add terminal state.
3. Add teardown and make it idempotent.
4. Build simple operators.
5. Break cancellation with `take` and `switchMap`.
6. Add scheduling and suppress cancelled work.
7. Distinguish hot, cold, shared, and replayed delivery.

## Failure Modes To Watch

- Producer runs before subscription.
- Values arrive after `complete` or `error`.
- Teardown runs zero times or more than once.
- An operator drops source errors or completion.
- `switchMap` leaves stale inner work alive.
- A scheduled task delivers after unsubscribe.
- A late subscriber receives history even though replay was not requested.

## Reflection Prompts

- What exactly does `subscribe` start?
- Who owns teardown in an operator chain?
- Why is `complete` different from `unsubscribe`?
- Is producer sharing a lifecycle choice, a storage choice, or both?
