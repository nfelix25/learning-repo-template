# 07 Pattern Comparisons

## What This Section Teaches

The earlier sections teach individual primitives. This section compares the behavioral axes beneath them. The goal is not to learn a production library. The goal is to recognize what question each pattern answers.

Related files:

- `koans/07-comparisons/01-push-pull.test.ts`
- `koans/07-comparisons/02-stream-vs-current-value.test.ts`
- `koans/07-comparisons/03-timing-and-producer-shape.test.ts`
- `koans/07-comparisons/04-state-and-interop.test.ts`
- `src/comparisons/adapters.ts`
- Local primitives under `src/observer`, `src/observable`, `src/state`, `src/state-machine`, and `src/signals`

## Vocabulary

- **Push**: the producer decides when values flow.
- **Pull**: the consumer asks for a value.
- **Hybrid**: one side pushes invalidation while another pulls the value.
- **Event stream**: a sequence of happenings.
- **Current value**: a readable value that is true now.
- **Adapter**: code that exposes one primitive through another primitive's shape.

## Behavioral Axes

```text
push <------------------------------> pull
events <----------------------> current value
hot/shared <-----------------> cold/per subscriber
eager <----------------------------> lazy
sync <-----------------------------> async
mutable reference <-------------> immutable snapshot
```

These axes are independent. A source can be cold and synchronous, hot and async, lazy and current-value based, or many other combinations.

## Push, Pull, And Hybrid

```text
push:
  source.next(value) -> observer receives value

pull:
  store.get() -> caller receives current value

hybrid:
  signal.set(next) -> computed invalidated
  computed()       -> caller pulls recomputed value
```

Signals are a useful hybrid example: writes push invalidation, reads pull values.

## Event Stream Versus Current Value

```text
event stream asks:
  What happened?

current value asks:
  What is true now?
```

A late subscriber to an event stream does not automatically know the current state. A store or signal can answer current state immediately.

## Interop Tradeoffs

Adapters force hidden policies into the open:

- Observable to signal: what is the initial value, and who owns teardown?
- Signal to observable: should subscription emit the current value immediately?
- State machine to store: do observers see attempted events or committed states?

## Ecosystem Mentions

Known ecosystems use these same axes, but this repo does not teach their APIs. If a note names an ecosystem, treat it as a conceptual landmark only. The executable lessons use local TypeScript primitives.

## Build-Break-Refine Sequence

1. Compare push and pull with local primitives.
2. Compare event streams and current values.
3. Separate producer sharing from timing.
4. Compare mutable references and immutable snapshots.
5. Adapt primitives into each other and name the lost or added policy.

## Failure Modes To Watch

- Treating every reactive primitive as an event stream.
- Assuming hot/cold is the same as sync/async.
- Forgetting that current-value adapters need initial value policy.
- Creating interop that cannot tear down subscriptions.
- Letting ecosystem vocabulary hide the local behavior being tested.

## Reflection Prompts

- Which model answers "what happened" best?
- Which model answers "what is true now" best?
- What policy does each adapter have to invent?
- Which axis are you actually comparing in a given test?
