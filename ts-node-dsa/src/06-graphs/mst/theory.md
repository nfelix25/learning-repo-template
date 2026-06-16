# Minimum Spanning Tree (MST)

## What Is a Spanning Tree?

A **spanning tree** of an undirected connected graph is a subgraph that:
- Includes all vertices
- Is a tree (connected and acyclic)

A **Minimum Spanning Tree (MST)** is a spanning tree whose total edge weight is minimized.

For a disconnected graph the result is a **Minimum Spanning Forest (MSF)** — one MST per connected component.

---

## Example

```
Graph (5 vertices, 7 edges):

    0
   /|\
  3 4 1
 /     \
4       1
 \     /
  5   2
   \ /
    3

Edge list with weights:
  0-1: 4
  0-2: 3
  0-3: 5
  1-2: 1
  1-4: 6
  2-3: 2
  3-4: 7

MST (Kruskal picks cheapest non-cycle edges):
  Step 1: pick 1-2 (weight 1)
  Step 2: pick 2-3 (weight 2)
  Step 3: pick 0-2 (weight 3)   ← 0-1 would cycle through 1-2
  Step 4: pick 0-3 (weight 5)   ← wait, 0-3 would cycle: 0-2-3 exists
          pick 1-4 (weight 6)   ← connects isolated vertex 4

MST edges: 1-2 (1), 2-3 (2), 0-2 (3), 1-4 (6)
Total weight: 1 + 2 + 3 + 6 = 12
```

Cleaner example with 4 vertices:

```
    0
   /|\
  3  4 \
 /      1
1        \
 \        2
  1-------+
  
Edge weights:
  0-1: 4
  0-2: 3
  1-2: 1
  0-3: 5

Sorted edges: 1-2(1), 0-2(3), 0-1(4), 0-3(5)

Kruskal:
  Add 1-2 (1) → {1,2}
  Add 0-2 (3) → {0,1,2}
  Skip 0-1 (4) → would cycle 0-1-2-0
  Add 0-3 (5) → {0,1,2,3}

MST: 1-2(1) + 0-2(3) + 0-3(5) = 9
```

---

## Kruskal's Algorithm

**Approach:** sort all edges by weight, then greedily add an edge if it does not form a cycle.

Cycle detection uses a **Union-Find (Disjoint Set Union)** data structure.

```
function kruskal(V, edges):
  sort edges by weight ascending
  uf = new UnionFind(V)
  mst = []
  for each edge (u, v, w) in sorted order:
    if uf.find(u) != uf.find(v):   // different components → safe to add
      uf.union(u, v)
      mst.push(edge)
      if mst.length == V - 1: break
  return mst
```

**Complexity:** O(E log E) for sorting, O(E α(V)) for union-find operations ≈ O(E log E) overall.

---

## Prim's Algorithm

**Approach:** grow the MST from a source vertex; at each step add the cheapest edge crossing from the current tree to a non-tree vertex.

```
function prim(V, adj, source):
  inMST = [false] * V
  minEdge[v] = Infinity for all v
  minEdge[source] = 0
  parent[v] = -1 for all v
  mst = []
  priority queue Q with (0, source)

  while Q not empty:
    (cost, u) = Q.extractMin()
    if inMST[u]: continue
    inMST[u] = true
    if parent[u] != -1: mst.push(edge from parent[u] to u)

    for each neighbor (v, w) of u:
      if !inMST[v] and w < minEdge[v]:
        minEdge[v] = w
        parent[v] = u
        Q.insert(w, v)

  return mst
```

**Complexity:** O(E log V) with a binary min-heap.

---

## Kruskal vs Prim

| Property       | Kruskal              | Prim                        |
|----------------|----------------------|-----------------------------|
| Data structure | Union-Find           | Priority queue              |
| Best for       | Sparse graphs        | Dense graphs                |
| Complexity     | O(E log E)           | O(E log V) with binary heap |
| Works on       | Disconnected graphs  | Needs modification for MSF  |

Both only work on **undirected** graphs.

---

## TypeScript Callouts

- Represent edges as `{ u: number; v: number; weight: number }` — flat objects are fast to sort.
- `edges.sort((a, b) => a.weight - b.weight)` is idiomatic for Kruskal's sort step.
- `noUncheckedIndexedAccess` means `arr[i]` returns `T | undefined`; use the non-null assertion `!` after a bounds check or when you know the index is valid.
- For Prim's priority queue, a simple sorted scan (`O(V²)`) is fine for small graphs; for larger graphs use an inline binary min-heap.
- Union-Find with path compression and union-by-rank achieves near-constant time per operation.
