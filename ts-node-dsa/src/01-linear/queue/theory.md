# Queue

A **queue** is a FIFO (First-In, First-Out) data structure. The first element enqueued
is the first one dequeued — like a line of people waiting.

## Circular buffer layout

A naive array-backed queue shifts elements on every dequeue (O(n)). A **circular buffer**
avoids this by tracking `head` and `tail` indices and wrapping them modulo capacity:

```
buffer: [10, 20, 30, 40,  0]   capacity=5
index:    0   1   2   3   4
          ↑           ↑
         head=0     tail=3    size=3

Logical contents: [10, 20, 30]  (head..tail-1)
```

After `dequeue()` (removes 10) then `enqueue(50)`:

```
buffer: [10, 20, 30, 40, 50]
index:    0   1   2   3   4
              ↑           ↑
            head=1      tail=4   size=3

Logical contents: [20, 30, 40]  (wrapped: tail is now at 4, about to wrap)
```

### Wrap-around arithmetic

```
enqueue: buffer[tail] = value; tail = (tail + 1) % capacity;
dequeue: value = buffer[head]; head = (head + 1) % capacity;
```

This creates a logical ring. The buffer is full when `size === capacity`; empty when
`size === 0`.

### Why track `_size` separately?

With only `head` and `tail`, full and empty are indistinguishable (both satisfy
`head === tail`). Keeping a separate `_size` counter eliminates this ambiguity cleanly.

## Complexity table

| Operation  | Time | Space |
|------------|------|-------|
| `enqueue`  | O(1) | O(1)  |
| `dequeue`  | O(1) | O(1)  |
| `peek`     | O(1) | O(1)  |
| `isEmpty`  | O(1) | O(1)  |
| `clear`    | O(1) | O(1)  |

Space: O(capacity) pre-allocated.

## TypeScript callout: noUncheckedIndexedAccess

`buffer[this.head]` returns `number | undefined` under strict settings. After verifying
`size > 0` (or `!isEmpty()`), assert:

```typescript
dequeue(): number {
  if (this._size === 0) throw new RangeError('dequeue from empty queue');
  const value = this.buffer[this.head] as number; // safe: size > 0
  this.head = (this.head + 1) % this.capacity;
  this._size--;
  return value;
}
```

## Cross-references

- `src/01-linear/deque/theory.md` — extends the circular-buffer idea to support
  operations on both ends.
- `src/01-linear/stack/theory.md` — simpler fixed-size buffer with a single top pointer.
