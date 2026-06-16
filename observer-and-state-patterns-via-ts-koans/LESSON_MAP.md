# Lesson Map

This map ties the learning layers together. Start with the note for a section, then run the koans in order, then inspect the named source files when a koan fails.

```text
README.md
  |
  v
LESSON_MAP.md
  |
  +-- notes/01-observer.md
  |     -> koans/01-observer/*.test.ts
  |     -> src/subscription.ts, src/observer/subject.ts
  |
  +-- notes/02-observable.md
  |     -> koans/02-observable/*.test.ts
  |     -> src/observable/*.ts
  |
  +-- notes/03-state.md
  |     -> koans/03-state/*.test.ts
  |     -> src/state/*.ts
  |
  +-- notes/04-state-machine.md
  |     -> koans/04-state-machine/*.test.ts
  |     -> src/state-machine/machine.ts
  |
  +-- notes/05-signals.md
  |     -> koans/05-signals/*.test.ts
  |     -> src/signals/signal.ts, computed.ts, effect.ts
  |
  +-- notes/06-reactive-graph.md
  |     -> koans/06-reactive-graph/*.test.ts
  |     -> src/signals/*.ts
  |
  +-- notes/07-comparisons.md
        -> koans/07-comparisons/*.test.ts
        -> src/comparisons/adapters.ts and local primitives
```

## How To Read A Section

1. Read the section note for vocabulary and diagrams.
2. Open the first koan file and read the lesson block at the top.
3. Read the comments near the first test and predict the outcome.
4. Run the section command, for example:

```sh
npm run koans:section -- 01-observer
```

5. When a koan fails, inspect the source files listed by the lesson block.
6. Repair the smallest missing invariant.
7. Rerun the section before continuing.

## Learning Layers

### Notes

Notes explain the mental model. They are where diagrams, vocabulary, and broader pattern comparisons belong.

### Koans

Koans ask focused questions. A good koan comment tells you what to predict and what invariant the assertion is protecting.

### Source

Source files expose the mechanism. Comments near TODOs explain what is intentionally naive, why it fails, and what kind of invariant the next repair should enforce.

## Section Path

| Section | Primary question | Main pressure |
| --- | --- | --- |
| `01-observer` | Who is notified, and for how long? | Subscription lifetime and delivery mutation |
| `02-observable` | When does work start and stop? | Producer lifecycle, terminal state, teardown |
| `03-state` | What is true now? | Current value, snapshots, equality, derivation |
| `04-state-machine` | Which transitions are legal? | Explicit state, guards, effects |
| `05-signals` | Who pulls values and who pushes invalidation? | Lazy cached derivation and cleanup |
| `06-reactive-graph` | How does change move through a graph? | Dynamic dependencies, batching, cycles |
| `07-comparisons` | Which model answers which question? | Behavioral axes and local interop |
