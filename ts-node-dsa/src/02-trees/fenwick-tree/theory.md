# Fenwick Tree (Binary Indexed Tree)

## Purpose

A Fenwick Tree (also called Binary Indexed Tree, BIT) answers **prefix-sum queries** in **O(log n)** and supports **point updates** in **O(log n)**. It is simpler and faster in practice than a Segment Tree for this specific use case.

---

## The Bit Trick: `i & -i`

The entire data structure is powered by one operation: extracting the **lowest set bit** of an integer.

```
i  (decimal) → i  (binary)  → i & -i (binary) → i & -i (decimal)
─────────────────────────────────────────────────────────────────
1             → 0001         → 0001             → 1
2             → 0010         → 0010             → 2
3             → 0011         → 0001             → 1
4             → 0100         → 0100             → 4
5             → 0101         → 0001             → 1
6             → 0110         → 0010             → 2
7             → 0111         → 0001             → 1
8             → 1000         → 1000             → 8
12 = 0b1100  →  i & -i = 0b0100 = 4
```

Each index `i` in the BIT is responsible for a **range of length `i & -i`** ending at `i`.

---

## Which Ranges Each Index Covers

```
Index:  1  2  3  4  5  6  7  8
Length: 1  2  1  4  1  2  1  8   (length = i & -i)

bit[1] = arr[1]
bit[2] = arr[1] + arr[2]
bit[3] = arr[3]
bit[4] = arr[1] + arr[2] + arr[3] + arr[4]
bit[5] = arr[5]
bit[6] = arr[5] + arr[6]
bit[7] = arr[7]
bit[8] = arr[1] + arr[2] + ... + arr[8]
```

---

## Navigation

### Prefix Sum Query (move towards root — subtract lowbit)

```
sum(i):
  result = 0
  while i > 0:
    result += tree[i]
    i -= i & -i      // remove lowest set bit → jump to parent
  return result
```

### Point Update (move towards leaves — add lowbit)

```
update(i, delta):
  while i <= n:
    tree[i] += delta
    i += i & -i      // add lowest set bit → propagate to responsible ancestors
```

---

## 1-Indexed Internally

External (caller) indices are **0-based**. Internally we shift: `internal = external + 1`.

---

## Comparison with Segment Tree

| Feature                  | Fenwick Tree       | Segment Tree       |
|--------------------------|--------------------|--------------------|
| Code complexity          | Very simple        | Moderate           |
| Constants                | ~2x faster         | Slower             |
| Prefix sum/xor           | Yes                | Yes                |
| Range min/max            | **No**             | Yes                |
| Range update (lazy)      | With extra trick   | Yes (lazy prop.)   |
| Space                    | O(n)               | O(n)               |

---

## Complexity

| Operation    | Time     | Space |
|--------------|----------|-------|
| Build        | O(n log n) | O(n) |
| Prefix query | O(log n) | O(1)  |
| Point update | O(log n) | O(1)  |
| Range query  | O(log n) | O(1)  |

---

## TypeScript Callout

> **Int32Array is perfect here** — prefix sums of integers fit naturally. For large datasets where the sum might overflow Int32 (total exceeds ~2.1 billion), use `Float64Array` or `BigInt64Array`.

> **The `-i` trick works because** JavaScript bitwise operators convert to signed 32-bit integers before operating. So `-i` is the two's complement negation, and `i & -i` correctly extracts the lowest set bit for all valid 32-bit integers.

---

## Cross-References

- **02-trees/segment-tree** — more general range-query approach (min, max, lazy range updates)
- **00-foundations/bit-manipulation** — two's complement, bitwise operations fundamentals
