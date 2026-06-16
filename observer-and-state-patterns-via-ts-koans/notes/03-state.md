# 03 State

## What This Section Teaches

State containers answer a different question than event streams. An event stream says "something happened." A store says "this is true now." That current-value contract creates its own pressure around snapshots, equality, derivation, and update discipline.

Related files:

- `koans/03-state/01-store.test.ts`
- `koans/03-state/02-mutation-snapshots.test.ts`
- `koans/03-state/03-reducer-selector-atom.test.ts`
- `src/state/store.ts`
- `src/state/reducer-store.ts`
- `src/state/selector.ts`
- `src/state/atom.ts`

## Vocabulary

- **Store**: a current-value container with reads, writes, and subscriptions.
- **Snapshot**: a value that represents state at one point in time.
- **Mutation**: changing an existing object.
- **Immutable update**: creating a new object that represents the next state.
- **Reducer**: a pure function from `(state, action)` to next state.
- **Selector**: a derived read from state.
- **Atom**: a small independent unit of state.

## Current-Value Model

```text
store.set(next)
      |
      v
+------------------+
| current = next   |
+------------------+
      |
      +-> notify subscribers

store.get()
      |
      v
returns current immediately
```

A store can be read without waiting for a future event. That makes it useful for state, but it also means mutation through shared references can create invisible changes.

## Mutation And Snapshot Model

```text
mutable:
  outside reference ----+
                       v
  store.current ----> same object

immutable:
  old snapshot ----> object A
  new snapshot ----> object B
```

Mutation can bypass the store's notification mechanism. Immutable updates preserve old snapshots and make change detection easier.

## Reducer Model

```text
dispatch(action)
      |
      v
reducer(current, action)
      |
      v
next state
```

Reducers make updates deterministic. Unknown actions returning the current state is not a fallback accident; it preserves the reducer's total contract.

## Selector And Atom Pressure

Selectors introduce caching questions:

- What inputs matter?
- When is a cached result still valid?
- What happens when unrelated state changes?

Atoms introduce granularity questions:

- Who should be notified when one small value changes?
- How do derived atoms know which atoms they depend on?

## Build-Break-Refine Sequence

1. Build a readable and writable store.
2. Add subscription lifetime.
3. Observe mutation leaks.
4. Introduce immutable snapshots and equality policy.
5. Add reducer dispatch.
6. Add selector caching.
7. Add atom granularity and derived atom pressure.

## Failure Modes To Watch

- Subscribers observe changes after unsubscribe.
- External mutation changes state without notification.
- Equal writes notify unnecessarily.
- Selectors recompute when inputs are unchanged.
- Derived atoms become stale because dependencies are not tracked.

## Reflection Prompts

- When is mutation acceptable, and what must own it?
- Should equality use identity, structural comparison, or caller-provided policy?
- Is a selector a cached computation, a subscription, or both?
- When does an atom become a signal?
