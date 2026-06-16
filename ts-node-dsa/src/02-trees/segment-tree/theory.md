# Segment Tree

## Purpose

A Segment Tree answers **range queries** (sum, min, max) in **O(log n)** and supports **point updates** in **O(log n)**. It is one of the most versatile range-query data structures.

---

## Buffer Layout (1-indexed)

Store the tree in an `Int32Array` of size `4 * n`. The root lives at index 1.

```
For node at index i:
  left child  → 2 * i
  right child → 2 * i + 1
  parent      → Math.floor(i / 2)
```

### Build example for `[1, 3, 2, 5, 7]`

```
Input array (0-indexed): [1, 3, 2, 5, 7]

Internal tree buffer (1-indexed, sum tree):

Index:  1    2    3    4    5    6    7    8    9   10
Value: [18,  4,  14,   4,   0,  12,   5,   1,   3,   2]

Node map:
  1  → root, sum(0..4)=18
  2  → left subtree, sum(0..2)=4  (wait, see note below)
  3  → right subtree, sum(3..4)=14 (5+7=12? no, 5+7=12... recalc below)

Correct build:
  Leaves (for n=5, padded):
    4 → arr[0]=1
    5 → arr[1]=3
    6 → arr[2]=2
    7 → arr[3]=5
    Later indices store arr[4]=7 and beyond

  Internal nodes (sums):
    2 = arr[0]+arr[1]+arr[2] = 1+3+2 = 6  ← covers [0..2]
    3 = arr[3]+arr[4]        = 5+7   = 12 ← covers [3..4]
    1 = 6 + 12               = 18    ← covers [0..4]

  Within subtree rooted at 2:
    4 → arr[0]+arr[1] = 4   covers [0..1]
    5 → arr[2]        = 2   covers [2..2]
  Within subtree rooted at 3:
    6 → arr[3]        = 5   covers [3..3]
    7 → arr[4]        = 7   covers [4..4]

Final 1-indexed buffer (sum tree):
  Index:  1    2    3    4    5    6    7
  Value: [18,  6,  12,   4,   2,   5,   7]

  Node 4 splits further if needed; n=5 uses indices up to 9 in worst case.
```

The actual indices depend on the recursive split point (midpoint of range). With the recursive approach the tree is compact and typically fits within `4 * n` cells.

---

## Complexity

| Operation           | Time       | Space  |
|---------------------|------------|--------|
| Build               | O(n)       | O(n)   |
| Range query         | O(log n)   | O(1)   |
| Point update        | O(log n)   | O(1)   |
| Range update (lazy) | O(log n)   | O(n)   |

---

## Algorithm Sketches

### Build (recursive)

```
build(node, start, end, arr):
  if start == end:
    tree[node] = arr[start]
  else:
    mid = floor((start + end) / 2)
    build(2*node, start, mid, arr)
    build(2*node+1, mid+1, end, arr)
    tree[node] = combine(tree[2*node], tree[2*node+1])
```

### Range Query

```
query(node, start, end, l, r):
  if r < start or end < l: return identity
  if l <= start and end <= r: return tree[node]
  mid = floor((start + end) / 2)
  return combine(
    query(2*node, start, mid, l, r),
    query(2*node+1, mid+1, end, l, r)
  )
```

### Point Update

```
update(node, start, end, idx, val):
  if start == end:
    tree[node] = val
  else:
    mid = floor((start + end) / 2)
    if idx <= mid: update(2*node, start, mid, idx, val)
    else:          update(2*node+1, mid+1, end, idx, val)
    tree[node] = combine(tree[2*node], tree[2*node+1])
```

### Lazy Propagation (range updates)

Keep a parallel `lazy` buffer. Before visiting children, push pending updates down:

```
pushDown(node):
  if lazy[node] != 0:
    apply lazy[node] to both children
    lazy[node] = 0
```

This allows range updates (add delta to [l..r]) in O(log n).

---

## TypeScript Callout

> **Int32Array vs Float64Array**: The buffer is `Int32Array` — correct for integer sums/min/max. For floating-point values (e.g., sum of floats) you would use `Float64Array`. The choice matters when values overflow `Int32` (> 2^31 − 1 ≈ 2.1 billion). For competitive programming with large sums, switch to `Float64Array` or use BigInt.

> **noUncheckedIndexedAccess**: When the tsconfig has `noUncheckedIndexedAccess: true`, `buffer[i]` returns `number | undefined`. After a bounds check (or when you know the index is valid), use the non-null assertion `buffer[i]!` or cast to `number`.

---

## Cross-References

- **02-trees/fenwick-tree** — simpler O(log n) prefix-sum structure; less flexible but faster constants
- **03-heaps/binary-heap** — also stores a complete binary tree in an array; similar index arithmetic
- **08-dynamic-programming/tabulation** — range DP uses similar interval decomposition ideas
