# Topological Sort

## Concept

A **topological ordering** of a directed graph is a linear arrangement of its vertices such that for every directed edge `u → v`, vertex `u` appears **before** vertex `v` in the ordering.

Topological sort is **only possible for DAGs** (Directed Acyclic Graphs). A directed cycle makes it impossible to order all vertices — if `u → v → u`, neither can come first.

**Applications**: build systems (compile dependencies), task scheduling, package managers, course prerequisites, data pipeline ordering.

---

## Example DAG and Valid Orderings

```
DAG:

  5 → 0 ← 4
  |         \
  ↓          ↓
  2 → 3      1

One valid topological order: [4, 5, 2, 3, 1, 0]
Another valid order:         [5, 4, 2, 3, 1, 0]
(Any order where 5 and 4 precede 0, 5 precedes 2, etc.)
```

Topological order is **not unique** unless the DAG is a single chain.

---

## Algorithm 1: DFS-based (Reverse Post-order)

**Key insight**: In DFS, a vertex is fully processed (all its descendants explored) before it is "finished". If we record vertices in their finish order and **reverse** that list, we get a valid topological ordering.

```
function topologicalDFS(graph):
  visited = all WHITE
  postOrder = []

  for each vertex v:
    if v is WHITE:
      dfs(v, visited, postOrder)

  return postOrder.reverse()

function dfs(v, visited, postOrder):
  visited[v] = GRAY        // in progress
  for each neighbor w of v:
    if visited[w] == WHITE:
      dfs(w, visited, postOrder)
    elif visited[w] == GRAY:
      // back edge → cycle detected → return null
  visited[v] = BLACK       // finished
  postOrder.push(v)        // record AFTER all descendants
```

**Why reverse post-order works**: For edge `u → v`, `v` finishes before `u` (DFS on `u` spawns DFS on `v`), so `v` appears in `postOrder` before `u`. Reversing puts `u` before `v`. Correct!

---

## Algorithm 2: Kahn's Algorithm (In-degree BFS)

**Key insight**: A vertex with **in-degree 0** has no prerequisites — it can always come first. Repeatedly remove such vertices, decrement the in-degrees of their successors, and enqueue any newly zero-in-degree vertices.

```
function kahn(graph):
  inDegree[v] = number of edges pointing into v, for all v
  queue = all vertices v where inDegree[v] == 0
  result = []

  while queue is not empty:
    u = dequeue
    result.push(u)
    for each neighbor v of u:
      inDegree[v]--
      if inDegree[v] == 0:
        enqueue v

  if result.length < V:
    return null  // cycle exists (some vertices never reached in-degree 0)
  return result
```

**Cycle detection**: If the result has fewer than `V` vertices, some vertices were never enqueued (they are part of a cycle and never reached in-degree 0).

---

## DFS vs Kahn's Comparison

| Property              | DFS (Reverse Post-order) | Kahn's (BFS / In-degree) |
|-----------------------|--------------------------|--------------------------|
| Cycle detection       | GRAY ancestor back edge  | `result.length < V`      |
| Output style          | Reverse of finish order  | BFS-like, level by level |
| In-place on adj. list | Yes                      | Needs extra in-degree array |
| Easier to implement   | Recursive: yes           | Iterative: yes           |

---

## Complexity

| Algorithm | Time     | Space  |
|-----------|----------|--------|
| DFS-based | O(V + E) | O(V)   |
| Kahn's    | O(V + E) | O(V)   |

Both algorithms are O(V + E): each vertex and edge is processed once.

---

## TypeScript Callouts

**`Int32Array` for in-degree**: Cache-efficient for large graphs. Fill with zeros (the default):

```typescript
const inDegree = new Int32Array(graph.length); // all zeros
for (let u = 0; u < graph.length; u++) {
  for (const v of graph[u] ?? []) {
    inDegree[v]++;
  }
}
```

**`noUncheckedIndexedAccess`**: `graph[u]` returns `number[] | undefined` — always use `?? []`:

```typescript
for (const v of graph[u] ?? []) { ... }
```

**Null-returning functions**: TypeScript requires `number[] | null` return type when the algorithm can fail (cycle detected):

```typescript
export function topologicalSortKahn(graph: number[][]): number[] | null { ... }
```

---

## Cross-References

- **DFS** (`../dfs/`): the underlying traversal used in DFS-based topological sort.
- **Cycle Detection** (`../cycle-detection/`): directed cycle detection using GRAY/BLACK coloring.
- **BFS** (`../bfs/`): Kahn's algorithm uses BFS-style queue processing.
