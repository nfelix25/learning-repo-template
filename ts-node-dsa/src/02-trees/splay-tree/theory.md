# Splay Tree

## Concept

A **splay tree** is a self-adjusting binary search tree. After every access (insert, search,
or delete), the accessed node is moved ("splayed") to the root via a sequence of rotations.
No extra balance information (height, color) is stored — balance emerges purely from access
patterns.

Because recently-accessed nodes cluster near the root, repeated access to the same small set
of keys is very fast. This is the tree's killer feature: **temporal locality**.

## Splay Cases

Given node `x` being splayed, let `p = parent(x)` and `g = parent(p)` (grandparent).

### Zig — single rotation (parent `p` is the root)

```
    p             x
   / \           / \
  x   C   →    A   p
 / \               / \
A   B             B   C
```

`x` is the left child of `p` (the root). One right rotation on `p` completes the splay.
The symmetric case (x is right child) uses a left rotation.

### Zig-Zig — same-side double rotation

`x` and `p` are both left children (or both right children). Rotate `p` first, then `x`.

```
      g               x
     / \             / \
    p   D     →    A   p
   / \                 / \
  x   C               B   g
 / \                     / \
A   B                   C   D
```

**Key insight**: rotating `p` before `x` (not `x` before `p` as in an AVL double rotation)
is what gives splay trees their O(log n) amortized guarantee. Rotating `x` twice (zig-zag
style) applied to the zig-zig case would give O(n) amortized cost.

### Zig-Zag — opposite-side double rotation

`x` is a right child and `p` is a left child (or vice versa). Rotate `x` twice.

```
    g             x
   / \           / \
  p   D   →    p   g
 / \          / \ / \
A   x        A  B C  D
   / \
  B   C
```

## Complexity

| Operation | Amortized | Worst Case |
|-----------|-----------|------------|
| insert    | O(log n)  | O(n)       |
| search    | O(log n)  | O(n)       |
| delete    | O(log n)  | O(n)       |
| inorder   | O(n)      | O(n)       |
| height    | O(n)      | O(n)       |

**Amortized analysis via potential function** — define:

```
rank(v) = floor(log2(size of subtree rooted at v))
Φ(T) = Σ rank(v)  for all nodes v in tree T
```

**Access Lemma**: splaying node `x` in a tree of `n` nodes costs at most
`3(rank(root) − rank(x)) + 1` amortized rotations. Since `rank(root) = floor(log2(n))`,
every splay is **O(log n)** amortized.

## Delete Algorithm

1. Splay the target key to the root. If not found, return false.
2. Split into `left` (everything < key, i.e. `root.left`) and `right` (everything > key,
   i.e. `root.right`). Disconnect them.
3. If `left` is null, the new tree is `right`. Done.
4. Splay the **maximum** of `left` to the top of `left`. That max node has no right child
   (it was the maximum).
5. Attach `right` as the right child of that max node.

## Cache Locality and Real-World Use

- **Text editors**: rope data structures use splay trees internally for O(log n) split/join
  and cache-friendly cursor movement.
- **Network routing tables**: routing table lookups exhibit temporal locality — the same
  destination prefixes are accessed repeatedly.
- **Caches**: a splay tree intrinsically acts as an LRU-like structure; evicting the
  deepest node approximates evicting the least recently used.
- **malloc implementations** (e.g., dlmalloc): free block lists are splay trees.

## TypeScript Callouts

```typescript
// parent pointers make rotation O(1) but require careful null-safety with strict mode.
// Use SplayNode | null (not undefined) for compatibility with noUncheckedIndexedAccess.

class SplayNode {
  parent: SplayNode | null = null   // null means "I am the root"
  left:   SplayNode | null = null
  right:  SplayNode | null = null
}

// A private _size counter avoids an O(n) tree-walk on every size() call.
// Increment on insert; decrement on delete.
```

## Cross-References

- `02-trees/bst` — base structure; splay tree is a BST with post-access restructuring.
- `02-trees/avl-tree` — maintains **height balance** (|heightL − heightR| ≤ 1) with O(log n)
  worst-case guarantees. Better for lookup-heavy workloads without skewed access patterns.
- `02-trees/red-black-tree` — maintains **color invariants** for O(log n) worst-case.
  Preferred in the Linux scheduler and Java's `TreeMap` where worst-case matters.
- Splay achieves **amortized** O(log n) via access patterns alone — simpler to implement,
  better cache behaviour for skewed workloads, but no worst-case guarantee per operation.
