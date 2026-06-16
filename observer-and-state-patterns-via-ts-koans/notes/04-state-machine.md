# 04 State Machine

## What This Section Teaches

A state machine makes legal movement explicit. Instead of allowing arbitrary writes, it accepts events and checks whether the current state allows that event.

Related files:

- `koans/04-state-machine/01-machine.test.ts`
- `src/state-machine/machine.ts`

## Vocabulary

- **State**: one named mode the machine can be in.
- **Event**: input sent to the machine.
- **Transition**: a legal move from one state to another.
- **Guard**: a condition checked before a transition commits.
- **Effect**: work that runs after a successful transition.
- **Committed state**: the state after a valid transition has been applied.

## Transition Model

```text
current state: closed

event: open
      |
      v
transition exists?
      |
      +-- no  -> stay closed
      |
      +-- yes -> guard passes?
                  |
                  +-- no  -> stay closed
                  |
                  +-- yes -> commit target
                              |
                              v
                            run effect
```

The ordering matters. Guards protect the transition before commit. Effects run after commit so they observe the machine in its new state.

## Store Adaptation

```text
machine.send(event)
      |
      v
valid committed transition
      |
      v
store.set(current state)
```

The store view should expose committed states, not attempted events. Invalid events are still useful information, but they are not current state changes.

## Build-Break-Refine Sequence

1. Build explicit current state.
2. Add event-based transitions.
3. Preserve state for invalid events.
4. Add guards before commit.
5. Add effects after commit.
6. Expose committed state through a store-like adapter.

## Failure Modes To Watch

- Invalid events mutate state.
- Guards run after state has already changed.
- Effects run even when a transition is blocked.
- Store subscribers see attempted transitions instead of committed states.

## Reflection Prompts

- Should invalid events throw, return false, or be recorded?
- What should an effect be allowed to read?
- Can a guard have side effects, or should it be pure?
- What changes if transitions become asynchronous?
