# 01 Observer

## What This Section Teaches

The observer pattern starts with one simple idea: some code wants to be told when something happens. The first version can be a list of callbacks. The useful version has a subscription lifetime, deterministic delivery rules, and a policy for what happens when the list changes during notification.

Related files:

- `koans/01-observer/01-subject.test.ts`
- `koans/01-observer/02-mutation-during-notification.test.ts`
- `src/subscription.ts`
- `src/observer/subject.ts`

## Vocabulary

- **Observer**: a function or object that receives notification.
- **Subject**: a value that owns observers and sends notifications to them.
- **Subscription**: a handle that ends an observer's relationship with a source.
- **Emission**: one delivery pass for one value.
- **Delivery policy**: the rule for which observers receive an emission.

## Mental Model

```text
subject.next(value)
      |
      v
+----------------------+
| current observers    |
| [first, second, ...] |
+----------------------+
      |
      +--> first(value)
      +--> second(value)
      +--> ...
```

At first, notification looks like "loop over callbacks." The pressure arrives when observers can change the callback list while the loop is running.

```text
current emission starts with: [first, second]

first(value)
  |
  +-- subscribes late

Question:
  Should late receive the current value, or only future values?
```

A robust subject must answer that question explicitly. A common policy is: the current emission uses a snapshot of observers that existed when the emission began.

## Build-Break-Refine Sequence

1. Build a subject that stores callbacks and calls them in order.
2. Add unsubscribe so a listener can stop receiving future values.
3. Break the naive loop by subscribing or unsubscribing during delivery.
4. Refine delivery so the current emission is deterministic.

## Failure Modes To Watch

- A listener receives values after unsubscribe.
- A listener added during delivery receives the current emission unexpectedly.
- Removing a listener during delivery skips or duplicates another listener.
- The subject has no policy for repeated unsubscribe calls.

## What To Notice

The subscription is not just a cleanup convenience. It is part of the pattern contract. A source that cannot stop notifying is not yet a reliable observable source.

## Reflection Prompts

- What should happen if an observer unsubscribes itself during notification?
- What should happen if one observer unsubscribes another observer?
- Should a subject preserve subscription order forever, or only within one emission?
- Where does the subject's responsibility end and the observer's responsibility begin?
