# 06 Reactive Graph

## What This Section Teaches

Once signals, computed values, and effects track each other, the runtime becomes a graph manager. The hard part is no longer "store a value"; it is keeping a changing dependency graph correct.

Related files:

- `koans/06-reactive-graph/01-dynamic-dependencies.test.ts`
- `koans/06-reactive-graph/02-batching-glitch-free.test.ts`
- `koans/06-reactive-graph/03-cycles-reentrancy.test.ts`
- `src/signals/signal.ts`
- `src/signals/computed.ts`
- `src/signals/effect.ts`
- `src/signals/runtime.ts`

## Vocabulary

- **Source node**: a writable signal.
- **Derived node**: a computed value.
- **Terminal node**: an effect.
- **Tracking context**: the currently running computation that collects dependencies.
- **Dynamic dependency**: a dependency that can change between runs.
- **Glitch**: an inconsistent derived read caused by partial propagation.
- **Batch**: a group of writes flushed as one logical update.
- **Cycle**: a dependency loop.

## Graph Model

```text
source signal
      |
      v
computed value
      |
      v
effect
```

Each read during tracking creates an edge. Each rerun must replace old edges with the edges from the latest execution.

## Dynamic Dependency Model

```text
selected = useFirst() ? first() : second()

run 1:
  dependencies: useFirst, first

useFirst.set(false)

run 2:
  dependencies: useFirst, second
  stale edge to first must be removed
```

If stale dependencies remain subscribed, unrelated writes will keep invalidating work that no longer depends on them.

## Diamond Model

```text
          count
         /     \
        v       v
    doubled   tripled
         \     /
          v   v
          total
```

When `count` changes, `total` must not observe new `doubled` with stale `tripled`, or the reverse. A glitch-free runtime makes the final read consistent.

## Batching Model

```text
batch start
  first.set(2)
  second.set(20)
batch end
  flush dependents once
```

Batching protects both efficiency and meaning. Multiple writes can represent one logical change.

## Cycle And Reentrancy Model

```text
a -> b -> a

or

effect reads count
effect writes count
```

A learning runtime can reject these cases or schedule them carefully. It must not recurse forever.

## Build-Break-Refine Sequence

1. Track dependencies during reads.
2. Replace dependencies when branches change.
3. Restore parent tracking after nested reads.
4. Batch invalidations.
5. Keep diamond reads consistent.
6. Detect cycles and bound self-updates.

## Failure Modes To Watch

- Conditional computed values keep stale dependencies.
- Nested computed reads steal the parent tracking context.
- Effects rerun once per write inside a batch.
- Diamond graphs produce inconsistent totals.
- Cycles collapse into stack overflows.
- Effects synchronously self-update forever.

## Reflection Prompts

- Is invalidation push-based, pull-based, or both?
- What data structure represents graph edges?
- When should stale edges be removed?
- What safety rule would you choose for writes during computation?
