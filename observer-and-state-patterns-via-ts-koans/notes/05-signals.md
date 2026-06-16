# 05 Signals

## What This Section Teaches

Signals are current-value primitives with a reactive twist. Reads pull the current value. Writes push invalidation to dependent computations. Computed values and effects turn that pair into a dependency system.

Related files:

- `koans/05-signals/01-signal.test.ts`
- `koans/05-signals/02-computed.test.ts`
- `koans/05-signals/03-effects.test.ts`
- `src/signals/signal.ts`
- `src/signals/computed.ts`
- `src/signals/effect.ts`

## Vocabulary

- **Signal**: a current value that can notify dependents when it changes.
- **Computed**: a cached derived value.
- **Effect**: reactive side-effect work.
- **Dependency**: a signal or computed read during tracking.
- **Invalidation**: marking derived work stale.
- **Cleanup**: work that runs before an effect reruns or is disposed.

## Pull And Push Model

```text
read:
  count() -> current value

write:
  count.set(next)
      |
      v
  invalidate dependents

computed:
  invalidation is pushed
  recomputation is pulled by next read
```

That hybrid behavior is why signals feel different from event streams. A write does not necessarily recompute every derived value immediately. It can mark work stale and wait for demand.

## Computed Cache Model

```text
computed clean:
  read -> return cached value

dependency changes:
  signal.set(next)
        |
        v
  computed becomes stale

next read:
  recompute -> cache -> return
```

The recomputation count koans make caching visible. If the count changes too often, the runtime is doing work it does not need to do. If the count never changes, the runtime is stale.

## Effect Cleanup Model

```text
effect run 1
  |
  +-- returns cleanup 1

dependency changes
  |
  +-- cleanup 1
  +-- effect run 2
        |
        +-- returns cleanup 2

dispose
  |
  +-- cleanup 2
```

Effects are terminal nodes. They perform work outside pure derivation, so cleanup is part of correctness.

## Build-Break-Refine Sequence

1. Build a signal that reads and writes.
2. Suppress equal writes.
3. Build lazy computed values.
4. Add dependency invalidation.
5. Add effects that track reads.
6. Add cleanup and disposal.

## Failure Modes To Watch

- Equal writes invalidate dependents unnecessarily.
- Computed values cache forever and become stale.
- Effects do not rerun when dependencies change.
- Effects rerun for unrelated changes.
- Cleanup runs too late, too often, or never.

## Reflection Prompts

- Is a signal more like a store or an event source?
- When should computed values recompute?
- Should effects run synchronously, batched, or scheduled?
- What resource would leak if cleanup did not run?
