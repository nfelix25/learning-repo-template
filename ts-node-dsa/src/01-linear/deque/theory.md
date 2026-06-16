# Deque (Double-Ended Queue)

A **deque** (pronounced "deck") supports O(1) insertion and removal at **both** ends. It
generalises both stack (LIFO) and queue (FIFO) behaviour.

## Circular buffer with two moving pointers

Like the queue, the deque uses an `Int32Array` circular buffer. Two logical pointers mark
the live region:

```
buffer: [ _, 10, 20, 30, _ ]   capacity=5
index:    0   1   2   3  4
              ↑       ↑
           front=1  back=3   size=3
```

- `pushBack(v)`:  write at `(back + 1) % cap`, advance `back`.
- `pushFront(v)`: move `front` backwards, write at the new `front`.
- `popBack()`:    read `back`, retreat `back`.
- `popFront()`:   read `front`, advance `front`.

### pushFront wrap-around

Moving `front` backwards past index 0 must wrap to `capacity - 1`:

```typescript
this.front = (this.front - 1 + this.capacity) % this.capacity;
```

Adding `this.capacity` before the modulo prevents JavaScript's `%` from returning
a negative remainder (JavaScript's `%` is a remainder operator, not modulo).

### Initial state convention

On construction, `front` and `back` are both set to 0 and `_size` to 0. The first
`pushBack` writes at index 0 and sets `back = 0`; the first `pushFront` decrements
`front` to `capacity - 1`.

An alternative convention is `front = 0, back = capacity - 1` (pointing one slot
before the first element); choose whichever makes the arithmetic clearest and be
consistent.

## Use cases

- **Sliding window maximum/minimum**: maintain a deque of indices for O(n) solutions.
- **Palindrome checking**: push all characters, then pop from both ends simultaneously.
- **BFS with priority**: insert high-priority items at the front.
- **Undo/redo stacks**: two stacks can be unified in a single deque.

## ASCII: pushFront when front is at index 0

```
Before pushFront(5):
buffer: [10, 20, 30,  _,  _ ]   capacity=5
          ↑       ↑
        front=0  back=2   size=3

front = (0 - 1 + 5) % 5 = 4

After pushFront(5):
buffer: [10, 20, 30,  _,  5 ]
                          ↑  ↑
                      back=2  front=4   size=4

Logical contents (front → back): [5, 10, 20, 30]
```

## Complexity table

| Operation    | Time | Space |
|--------------|------|-------|
| `pushFront`  | O(1) | O(1)  |
| `pushBack`   | O(1) | O(1)  |
| `popFront`   | O(1) | O(1)  |
| `popBack`    | O(1) | O(1)  |
| `peekFront`  | O(1) | O(1)  |
| `peekBack`   | O(1) | O(1)  |
| `isEmpty`    | O(1) | O(1)  |
| `clear`      | O(1) | O(1)  |

## Cross-references

- `src/01-linear/queue/theory.md` — single-ended version (FIFO only).
- `src/01-linear/stack/theory.md` — single-ended version (LIFO only).
