# Binary Heap

## Concept

A **binary heap** is a complete binary tree stored compactly in an array. "Complete" means every level is fully filled except possibly the last, which is filled left-to-right. That shape guarantee lets us ditch pointers entirely: the parent-child relationships are encoded purely by index arithmetic.

Two flavors:
- **Min-heap**: every parent is ≤ its children. The root is always the minimum.
- **Max-heap**: every parent is ≥ its children. The root is always the maximum.
- A **comparator** function generalizes both into one implementation.

---

## THE CORE LESSON: Index Arithmetic

This is why heaps are efficient. Given a node at index `i` in a 0-based array:

```
parent:      Math.floor((i - 1) / 2)
left child:  2 * i + 1
right child: 2 * i + 2
```

### ASCII Buffer Diagram

```
Array: [1, 3, 2, 7, 8, 4, 5]
index:  0  1  2  3  4  5  6

As a tree:
         1        (idx 0)
        / \
       3   2      (idx 1, 2)
      / \ / \
     7  8 4  5    (idx 3, 4, 5, 6)

Verifying the formulas:
  parent(3)     = floor((3-1)/2) = 1  ✓  (value 3)
  parent(4)     = floor((4-1)/2) = 1  ✓  (value 3)
  parent(5)     = floor((5-1)/2) = 2  ✓  (value 2)
  parent(6)     = floor((6-1)/2) = 2  ✓  (value 2)
  left(1)       = 2*1+1 = 3           ✓  (value 7)
  right(1)      = 2*1+2 = 4           ✓  (value 8)
  left(2)       = 2*2+1 = 5           ✓  (value 4)
  right(2)      = 2*2+2 = 6           ✓  (value 5)
```

The root has no parent. Convention: `parentIndex(0)` returns `-1` (sentinel for "no parent").

---

## Core Operations

### sift-up (used after `insert`)

After appending a new element at index `size - 1`, it may violate the heap property with its parent. Repeatedly swap it upward until the property is satisfied or the root is reached.

```
insert(4) into min-heap [1, 3, 2, 7, 8, 9, 5]:

Append:  [1, 3, 2, 7, 8, 9, 5, 4]   idx=7, parent=idx(3)=3 → value 7
4 < 7 → swap:  [1, 3, 2, 4, 8, 9, 5, 7]   now at idx=3, parent=idx(1)=1 → value 3
4 > 3 → stop. Heap property restored.
```

### sift-down (used after `extract`)

After removing the root, move the last element to index 0 and shrink size. It may violate the heap property with its children. Repeatedly swap it downward with the "better" child (smaller for min-heap) until the property is satisfied or no children exist.

```
extractMin from [1, 3, 2, 7, 8, 4, 5]:

Remove root 1, move last element 5 to root:
  [5, 3, 2, 7, 8, 4]   size=6

sift-down 5 at idx=0:
  children: left=idx1(3), right=idx2(2) → better child is 2 at idx 2
  5 > 2 → swap: [2, 3, 5, 7, 8, 4]   now at idx=2
  children: left=idx5(4), right=idx6(out of bounds)
  5 > 4 → swap: [2, 3, 4, 7, 8, 5]   now at idx=5
  no children → stop.
```

### heapify (build-heap) — O(n)

Given an arbitrary array, build a valid heap in O(n) by sifting down every non-leaf node from the last one (index `floor(n/2) - 1`) down to the root. This is faster than n individual inserts (which would be O(n log n)).

**Why O(n)?** Most nodes are near the leaves and do very little work. The sum `Σ h * n/2^h` converges to O(n).

```
Start: [5, 3, 8, 1, 4, 2, 7]   n=7, last non-leaf = floor(7/2)-1 = 2

sift-down idx=2 (value 8): children 2(idx5), 7(idx6) → 2 < 8 → swap
  → [5, 3, 2, 1, 4, 8, 7]
sift-down idx=1 (value 3): children 1(idx3), 4(idx4) → 1 < 3 → swap
  → [5, 1, 2, 3, 4, 8, 7]
sift-down idx=0 (value 5): children 1(idx1), 2(idx2) → 1 < 5 → swap
  → [1, 5, 2, 3, 4, 8, 7]
  then sift-down 5 at idx=1: children 3(idx3), 4(idx4) → 3 < 5 → swap
  → [1, 3, 2, 5, 4, 8, 7]  ✓ valid min-heap
```

---

## heapSort — O(n log n)

1. Heapify the array as a **max-heap** (O(n)).
2. Repeatedly extract the max to the end of the array (each extract is O(log n), n times = O(n log n)).
3. Result: sorted ascending in place.

---

## Complexity Table

| Operation     | Time       | Space  | Notes                              |
|---------------|------------|--------|------------------------------------|
| insert        | O(log n)   | O(1)   | sift-up at most O(log n) swaps     |
| extract       | O(log n)   | O(1)   | sift-down at most O(log n) swaps   |
| peek          | O(1)       | O(1)   | just read index 0                  |
| heapify       | O(n)       | O(1)   | bottom-up construction             |
| heapSort      | O(n log n) | O(1)   | in-place; heapify + n extracts     |

---

## TypeScript / TypedArray Callouts

**Int32Array for integer priorities.** The `BinaryHeap` implementation uses `Int32Array` as its backing buffer. This gives cache-friendly, compact storage with no per-element object overhead. Index arithmetic on a flat array is the whole point of the data structure.

**Float64Array callout.** When using a heap as a priority queue for floating-point priorities (Dijkstra edge weights, A* g+h scores), use `Float64Array` instead of `Int32Array`. The precision matters — see `06-graphs/heuristic-search` for this in practice.

**`noUncheckedIndexedAccess`.** With this tsconfig flag, `buffer[i]` returns `number | undefined`. After a bounds check (`i < this._size`), use `buffer[i]!` or `buffer[i] as number` to tell TypeScript the value is present.

---

## Cross-References

- `02-trees/huffman-tree` — Huffman coding uses a min-heap for greedy tree construction (always merge the two lowest-frequency nodes).
- `06-graphs/mst` — Prim's algorithm uses a min-heap to greedily pick the cheapest crossing edge.
- `06-graphs/shortest-path` — Dijkstra's algorithm uses a min-heap (or priority queue) to process vertices in order of tentative distance.
- `06-graphs/heuristic-search` — A* uses a min-heap ordered by f = g + h; this is where `Float64Array` becomes relevant.
- `03-heaps/fibonacci-heap` — Fibonacci Heap improves `decreaseKey` to O(1) amortized, which drops Dijkstra from O((V+E) log V) to O(V log V + E).
