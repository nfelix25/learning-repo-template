# B-Tree

## Concept

A **B-Tree of order k** is a self-balancing search tree designed for storage systems where reading a large block of data (a "page") at once is cheaper than reading many small blocks. Each node stores multiple keys and has multiple children — all in a single page read.

### Properties of a B-Tree of Order k

1. Every non-root node has between ⌈k/2⌉ and k children.
2. The root has between 2 and k children (unless it is a leaf).
3. All leaves are at the same depth (perfectly height-balanced).
4. A node with `c` children has exactly `c - 1` keys.
5. Keys within each node are stored in sorted order.
6. For any key `keys[i]` in a non-leaf node: all keys in `children[i]` are less than `keys[i]`, and all keys in `children[i+1]` are greater than `keys[i]`.

### Example: Order-3 B-Tree (2-3 Tree)

Each node has 1 or 2 keys and 2 or 3 children (for non-leaf nodes).

```
        [17, 35]
       /    |    \
 [5,10]  [20,27]  [40,48]
```

- Searching for 27: compare with 17 (go right), compare with 35 (go left), find 27 in middle child.
- Every leaf is at depth 1.

---

## Why B-Trees?

A BST of 1 billion nodes has depth ~30. Each level = one disk read = ~10ms → total: 300ms.

A B-Tree of order 1000 with 1 billion nodes has depth ~3. Each level = one disk read → total: ~30ms.

```
Depth comparison:
  BST (branching factor 2): log₂(1,000,000,000) ≈ 30 levels
  B-Tree order 1000:        log₁₀₀₀(1,000,000,000) = 3 levels
```

This is why databases use B-Trees (or their variant, B+ Trees) for indexes: minimizing disk I/O is the dominant cost.

---

## Insert Algorithm (Split-on-the-Way-Down)

The proactive splitting strategy avoids a second upward pass:

1. If the root is full (has `k-1` keys), split it first: create a new root, split the old root into two children, promote the median.
2. As you descend to find the insert position, split any full node you encounter before descending into it.
3. Insert the key into the appropriate leaf (guaranteed to have space).

### Split Operation

When a node has `k-1` keys (full) and needs to absorb a new key:

```
Full node with t = ⌊k/2⌋:
  [k1, k2, ..., k_{t-1}, k_t, k_{t+1}, ..., k_{k-1}]
                                ↑ median
Left sibling: [k1 ... k_{t-1}]
Right sibling: [k_{t+1} ... k_{k-1}]
Median k_t is promoted to the parent.
```

### Root Split ASCII

Before (order=3, root full with 2 keys):
```
[10, 20]
```
After inserting 15 (triggers root split):
```
    [15]           ← new root with median
   /    \
[10]    [20]       ← two new children
```

---

## Delete Algorithm

**Case 1: Key in a leaf with excess keys** — simply remove it.

**Case 2: Key in an internal node**
- If the left child has excess keys: replace the key with its predecessor (max of left child), then delete the predecessor from the left child.
- If the right child has excess keys: replace the key with its successor (min of right child), then delete the successor from the right child.
- If both children are at minimum: merge the key and both children into one node, then delete from the merged node.

**Case 3: Key in a leaf at minimum keys (underflow after delete)**
- **Borrow from sibling**: if a sibling has excess keys, rotate a key through the parent.
- **Merge**: if no sibling has excess keys, merge with a sibling and pull down a parent key. This may propagate underflow upward.

---

## Complexity

| Operation | Time             | Notes |
|-----------|------------------|-------|
| Search    | O(k × log_k(n))  | Each node scan is O(k) with binary search |
| Insert    | O(k × log_k(n))  | At most O(log_k(n)) splits |
| Delete    | O(k × log_k(n))  | At most O(log_k(n)) merges/borrows |
| Space     | O(n)             | |

For large k (disk page size), log_k(n) is extremely small. The O(k) per-node scan is done in fast RAM.

---

## TypeScript Callouts

- `BTreeNode.children` is `BTreeNode[]`, not a fixed array — push/splice as needed.
- `noUncheckedIndexedAccess: true` means `keys[i]` returns `number | undefined`. Use non-null assertion (`!`) only when you have validated bounds.
- `isLeaf` must be set correctly and maintained through splits and merges.
- The `order` property on `BTree` sets the maximum number of children (= maximum number of keys + 1).

---

## Cross-References

- **Red-Black Tree** (`../red-black-tree/`): a 2-3-4 B-Tree (order 4) is isomorphic to a Red-Black Tree. Each black node with its red children maps to one B-tree node.
- **BST** (`../bst/`): a B-Tree of order 2 is equivalent to a BST, but with the balanced-leaf guarantee.
- **Segment Tree** (`../segment-tree/`): also uses tree nodes with multiple children, but for range query aggregation rather than ordered search.
- Real-world: PostgreSQL, MySQL, and SQLite all use B+ Tree variants (leaves form a linked list) for their table indexes.
