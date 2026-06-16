# Fibonacci Heap

## Concept

A **Fibonacci Heap** is a collection (forest) of heap-ordered trees. Unlike a binary heap's rigid shape, Fibonacci Heap trees can have any structure. The payoff: `insert` and `decreaseKey` run in O(1) **amortized** time, making it the theoretical winner for graph algorithms like Dijkstra.

---

## Structure

- **Forest of heap-ordered trees**: each node's key is ≤ its children's keys (min-heap property).
- **Root list**: a doubly-linked **circular** list connecting all tree roots.
- **min pointer**: always points to the root with the smallest key — this is the "face" of the heap.
- **Node fields**:
  - `key`: the priority value
  - `degree`: number of children
  - `marked`: boolean — set when a node loses a child (triggers cascade-cut logic)
  - `parent`: pointer to parent node, or null if in root list
  - `child`: pointer to one child (any child; the children form their own circular list)
  - `left`, `right`: circular doubly-linked list pointers

### ASCII: Root List After Several Inserts (no consolidation yet)

```
min→ [1] ↔ [5] ↔ [3] ↔ [7] ←┐
      └──────────────────────┘   (circular)

Each [n] is a tree of degree 0 (no children yet — lazy insert).
```

### ASCII: After Consolidation (following extractMin)

```
         [1]              [3]
        /   \              |
       [5]  [7]           [9]
        |
       [8]

Root list: [1] ↔ [3] ← (circular, min→[1])
All trees have distinct degrees: degree 2, degree 1.
```

---

## Operations

### insert — O(1) amortized

Allocate a new degree-0 node. Add it to the root list. Update `min` if the new key is smaller. No consolidation. Lazy — we defer cleanup.

### findMin — O(1)

Just dereference `this.min`. The min pointer is always kept up to date.

### extractMin — O(log n) amortized

1. Add all children of the min node to the root list (they become new trees).
2. Remove the min node from the root list.
3. **Consolidate**: repeatedly merge pairs of trees that have the same degree. Link the higher-root tree under the lower-root tree. After consolidation, all roots have distinct degrees.
4. Set `min` to the remaining root with the smallest key.

**Consolidation detail**: maintain a degree table (array indexed by degree). For each root, if the table slot is empty, store it; if occupied, link the pair (smaller key becomes parent, degree increments) and try the next slot.

### decreaseKey — O(1) amortized

1. Decrease the node's key.
2. If the node is a root or its new key ≥ parent's key, the heap property holds — done.
3. Otherwise, **cut** the node: remove it from its parent's child list, add it to the root list, update `min` if needed.
4. **Cascade-cut** the parent: if the parent was already `marked` (it previously lost a child), cut it too and cascade upward. If the parent is a root or was `unmarked`, just mark it and stop.

**Marking**: a non-root node is marked when it loses a child. It is unmarked when added to the root list. Marking limits tree height, preserving the O(log n) amortized bound for extractMin.

### delete — O(log n) amortized

```
decreaseKey(node, -Infinity)
extractMin()
```

---

## Why This Matters: Dijkstra

With a binary heap, Dijkstra runs in **O((V + E) log V)**: every `decreaseKey` (edge relaxation) costs O(log V).

With a Fibonacci Heap, `decreaseKey` is O(1) amortized, dropping Dijkstra to **O(V log V + E)**.

For dense graphs where E >> V log V, this is a significant improvement. In practice, Fibonacci Heap has high constant factors (pointer-chasing, cache misses), so binary heap is usually preferred. See `06-graphs/shortest-path` for the concrete tradeoff.

---

## Amortized Analysis (Potential Method)

Define potential: **Φ = trees + 2 × marked_nodes**

- **insert**: 1 real work + 1 potential unit added (new tree). Amortized = O(1).
- **extractMin**: O(log n) real work (consolidation merges trees, bounded by max degree). Amortized = O(log n).
- **decreaseKey**: O(1) real work + O(1) cascade-cut (each cascade step removes a marked node, reducing potential by 2, paying for the O(1) work). Amortized = O(1).

**Max degree**: at most ⌊log_φ(n)⌋ ≈ 1.44 log₂(n), where φ = (1 + √5)/2. This is the Fibonacci bound — it's why the structure is named "Fibonacci Heap."

---

## Complexity Table

| Operation   | Actual        | Amortized    | Notes                                       |
|-------------|---------------|--------------|---------------------------------------------|
| insert      | O(1)          | O(1)         | Append to root list, update min             |
| findMin     | O(1)          | O(1)         | Dereference min pointer                     |
| extractMin  | O(log n)      | O(log n)     | Consolidation bounded by max degree         |
| decreaseKey | O(log n)      | O(1)         | Cut + cascade-cut; potential absorbs cost   |
| delete      | O(log n)      | O(log n)     | decreaseKey(-∞) + extractMin                |
| merge       | O(1)          | O(1)         | Concatenate root lists (not implemented here)|

---

## TypeScript Implementation Notes

**No TypedArray**: unlike `BinaryHeap`, Fibonacci Heap nodes are objects in a doubly-linked circular list. TypedArray would require parallel arrays for each field (key, degree, marked, left, right, parent, child indices) — fighting the natural structure. Object nodes are the right choice here.

**Circular doubly-linked list invariant**: every node always has both `left` and `right` set (they point to itself when it's alone). Insertion and removal must maintain this invariant carefully.

**`exactOptionalPropertyTypes`**: TypeScript's tsconfig flag means you can't assign `undefined` to a field typed as `T | null`; use `null` explicitly.

---

## Cross-References

- `03-heaps/binary-heap` — simpler implementation; use when E is not much larger than V log V.
- `06-graphs/shortest-path` — Dijkstra implementation, showing why decreaseKey cost matters.
- `06-graphs/mst` — Prim's algorithm: same improvement from O((V+E) log V) to O(V log V + E).
