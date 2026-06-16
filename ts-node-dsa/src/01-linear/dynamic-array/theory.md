# Dynamic Array

A **dynamic array** is a random-access, variable-length data structure built on top of a fixed-size buffer. When the buffer fills up, it is replaced with a larger one and all elements are copied over.

## Core idea

Under the hood it is just a typed buffer + a length counter:

```
buffer (capacity=8):
[ 10 | 20 | 30 | 40 | _  | _  | _  | _ ]
  [0]  [1]  [2]  [3]  [4]  [5]  [6]  [7]
  ←───── length = 4 ──────→
```

Indices `[0, length)` hold live values; `[length, capacity)` are unused slots.

## Growth strategies

When `push` is called and `length === capacity`, we must resize. Two common factors:

| Strategy | New capacity | Amortized cost per push |
|----------|-------------|------------------------|
| ×2       | `cap * 2`   | O(1) amortized         |
| ×1.5     | `cap * 1.5` | O(1) amortized         |

Both are O(1) amortized, but ×2 wastes more memory while ×1.5 copies slightly more
often. Java's `ArrayList` uses ×1.5; this module uses **×2** to keep the proof sketch
simple.

### Amortized O(1) proof sketch (×2)

Assign each element a "credit" of 2 operations when it is first pushed:
- 1 credit pays for its initial insertion.
- 1 credit is saved for the future copy.

When a resize happens and `n` elements are copied, those `n` elements each had 1 saved
credit — the copy costs exactly what was pre-paid. No element is ever charged more than
2 units total, so the amortized cost per `push` is **O(1)**.

The total work for `n` pushes is at most `2n`, giving **Θ(n)** total and **O(1)**
amortized per operation.

> For the full amortized analysis (potential method, accounting method), see
> `src/00-foundations/complexity/theory.md`.

## Why Float64Array?

`Float64Array` stores 64-bit IEEE-754 doubles — the same bit-pattern JavaScript uses
for every `number` value. This means:

- Any JS `number` (integer or float) can be stored without silent truncation.
- Reads/writes go directly to the underlying `ArrayBuffer` with no boxing overhead.
- The buffer lives in a contiguous memory region, enabling cache-friendly sequential
  access.

If you only need integers that fit in 32 bits, `Int32Array` halves the memory footprint
(see the `Stack` module).

## Complexity table

| Operation | Time       | Space |
|-----------|-----------|-------|
| `get(i)`  | O(1)      | O(1)  |
| `set(i)`  | O(1)      | O(1)  |
| `push`    | O(1) amortized (O(n) worst-case resize) | O(1) |
| `pop`     | O(1)      | O(1)  |
| iteration | O(n)      | O(1)  |
| resize    | O(n)      | O(n)  |

## TypeScript callouts

### noUncheckedIndexedAccess

With `"noUncheckedIndexedAccess": true`, reading `this.buffer[i]` yields
`number | undefined`. After a bounds check you must assert:

```typescript
get(index: number): number {
  if (index < 0 || index >= this._length) throw new RangeError('...');
  return this.buffer[index] as number; // safe after the check above
}
```

Alternatively use the non-null assertion `this.buffer[index]!` — both are equivalent
after a bounds guard.

### Float64Array copy

`Float64Array` inherits `TypedArray.prototype.set`, which bulk-copies from another
typed array efficiently:

```typescript
const next = new Float64Array(this._capacity * 2);
next.set(this.buffer); // copies all elements in one call
this.buffer = next;
```

## Cross-references

- `src/00-foundations/complexity/theory.md` — full amortized analysis (potential and
  accounting methods).
- `src/01-linear/stack/theory.md` — Int32Array buffer with a top pointer (simpler
  fixed-capacity variant).
