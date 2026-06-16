# Disjoint Set (Union-Find)

## What Is a Disjoint Set?

A **Disjoint Set** (also called **Union-Find** or **Merge-Find**) is a data structure
that tracks a partition of `n` elements into non-overlapping (disjoint) sets.

It supports two core operations:
- **find(x)** — identify which set element `x` belongs to (returns the set's
  *representative* / *root*)
- **union(x, y)** — merge the sets containing `x` and `y` into one set

A common example: given a graph, which nodes belong to the same connected component?

## Forest Representation

Internally, each set is stored as a **tree**. The root is the representative.
All `n` elements start as singletons (trees of depth 0).

```
Initial state (5 elements, each its own root):
  0   1   2   3   4

After union(0,1):   After union(2,3):   After union(0,2):
    0   2               0     2              0
    |   |              / \   / \            /|\
    1   3             1   ?  3   ?          1 2  4
                                              |
                                              3
```

## Flat-Array Encoding

Instead of allocating tree node objects, the forest is encoded in a pair of arrays:

```
Elements: 0 1 2 3 4
After union(0,1), union(2,3), union(0,2):

Forest:       parent[]         rank[]
    0         [0, 0, 0, 2, 4]  [2, 0, 0, 1, 0]
   / \
  1   2        ↑               ↑
      |      parent[i] = i     rank[i] = tree height
      3      means i is root
```

`parent[i]` is the index of `i`'s parent. If `parent[i] === i`, then `i` is a root.
`rank[i]` approximates the height of the subtree rooted at `i` (upper bound).

Using **`Int32Array`** instead of plain JS arrays:
- Values are fixed-width 32-bit integers — no boxing overhead
- Stored contiguously in memory (cache-friendly linear scans)
- Makes the flat-array encoding explicit and pedagogically clear
- Allocation is `O(n)` with a single `new Int32Array(n)` call

## Two Key Optimizations

### 1. Path Compression (during `find`)

When walking up the tree to find the root, set every visited node's parent
directly to the root. Future `find` calls on those nodes become O(1).

```
Before find(3):    After find(3):
    0                  0
    |               /  |  \
    2              1   2   3
    |
    3
```

### 2. Union by Rank (during `union`)

When merging two sets, attach the root with **lower rank** under the root with
**higher rank**. This keeps trees shallow.

If ranks are equal, pick either root and increment the surviving root's rank by 1.

```
union(rootA, rootB) where rank[A]=2, rank[B]=1:
   A         A
  / \   →   /|\
 ... ...   ... B
               |
              ...
```

## Complexity

| Operation        | Amortized Time | Notes                                    |
|------------------|---------------|------------------------------------------|
| `find(x)`        | O(α(n))       | Path compression; α = inverse Ackermann  |
| `union(x, y)`    | O(α(n))       | Union by rank + path compression         |
| `connected(x,y)` | O(α(n))       | Two `find` calls                         |

**α(n)** is the inverse Ackermann function — effectively constant (≤ 4) for any
realistic input size. The amortized per-operation cost is nearly **O(1)**.

Space: **O(n)** for the two arrays.

## Applications

- **Kruskal's MST algorithm** — union edges; skip if endpoints already connected
- **Cycle detection** in undirected graphs — union edge endpoints; cycle if `find`
  returns the same root
- **Connected components** — `componentCount()` tracks how many roots remain
- **Image segmentation** — cluster adjacent pixels into regions

## TypeScript Callout: `noUncheckedIndexedAccess`

With `noUncheckedIndexedAccess: true`, TypeScript types `parent[i]` as
`number | undefined`, even when `i` is a valid index, because the compiler
cannot prove it at compile time.

After an explicit bounds check (e.g. `if (i >= 0 && i < this.size)`), use
the non-null assertion operator:

```typescript
const p = this.parent[i]!  // safe: we verified i is in range
```

Alternatively, wrap the access in a helper:

```typescript
private get(arr: Int32Array, i: number): number {
  const v = arr[i]
  if (v === undefined) throw new RangeError(`index ${i} out of range`)
  return v
}
```

## Cross-References

- **graphs/kruskal** — uses DisjointSet as its core primitive
- **03-heaps/binary-heap** — also uses an array-based representation; compare how
  the two structures exploit flat arrays differently
