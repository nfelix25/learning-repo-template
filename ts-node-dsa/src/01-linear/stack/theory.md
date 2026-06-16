# Stack

A **stack** is a LIFO (Last-In, First-Out) data structure. The last element pushed is
the first one popped — like a stack of plates.

## Buffer + top-pointer layout

This implementation uses a fixed-capacity `Int32Array` and a `top` index that starts
at `-1` (empty) and grows toward the end of the buffer:

```
buffer: [42, 17, 99,  0,  0]   capacity=5
index:    0   1   2   3   4
                  ↑
                 top=2   size=3
```

- `push(v)`: increment `top`, write `buffer[top] = v`.
- `pop()`: read `buffer[top]`, decrement `top`.
- `peek()`: read `buffer[top]` without decrementing.
- `size`: `top + 1`.
- Empty when `top === -1`.

### Iteration (LIFO order)

```
[Symbol.iterator] yields: buffer[top], buffer[top-1], ..., buffer[0]
```

```
buffer: [42, 17, 99]   top=2
yields:  99 → 17 → 42
```

## Complexity table

| Operation | Time | Space |
|-----------|------|-------|
| `push`    | O(1) | O(1)  |
| `pop`     | O(1) | O(1)  |
| `peek`    | O(1) | O(1)  |
| `isEmpty` | O(1) | O(1)  |
| `clear`   | O(1) | O(1)  |
| iteration | O(n) | O(1)  |

Space for the structure itself: O(capacity) = O(n) pre-allocated.

## TypeScript callout: noUncheckedIndexedAccess

With `"noUncheckedIndexedAccess": true`, reading `buffer[top]` returns `number | undefined`.
Even though we know `top` is a valid index after an `isEmpty()` check, TypeScript cannot
prove that statically. You must use a non-null assertion or a cast:

```typescript
peek(): number {
  if (this.isEmpty()) throw new RangeError('peek on empty stack');
  // TypeScript sees buffer[this.top] as number | undefined
  return this.buffer[this.top] as number; // safe: we just checked isEmpty()
}
```

Using the `!` suffix works too: `this.buffer[this.top]!`. Both are equivalent after
the guard; pick one and be consistent.

## Why Int32Array?

`Int32Array` stores 32-bit signed integers (-2 147 483 648 to 2 147 483 647), which is
sufficient for most stack-of-integers use cases (e.g. call-stack simulation, expression
evaluation). It uses **4 bytes per element** vs 8 for `Float64Array`, halving memory.
Values outside [-2^31, 2^31-1] are silently truncated — use `Float64Array` or a
generic class-based stack for arbitrary numbers.

## Cross-references

- `src/01-linear/dynamic-array/theory.md` — Float64Array with a growth strategy.
- `src/05-advanced-functional/arena/theory.md` — reimplements linked-list nodes inside
  a flat `Int32Array` using index-based pointers (a generalization of the top-pointer
  pattern here).
