# Depth-First Search (DFS)

## Concept

DFS explores a graph by going **as deep as possible** along each branch before backtracking. Where BFS uses a queue (FIFO), DFS uses a **stack** (LIFO) — either an explicit stack (iterative) or the call stack (recursive).

DFS is the foundation for many advanced algorithms: topological sort, cycle detection, strongly connected components (Tarjan/Kosaraju), and articulation point detection.

---

## Iterative vs Recursive

### Recursive DFS

```
dfs(v):
  mark v visited
  for each neighbor w of v:
    if w not visited:
      dfs(w)
```

Elegant and readable, but **can cause a stack overflow** on very deep graphs (many thousands of vertices in a chain). In strict TypeScript, every code path must return a value (`noImplicitReturns`), so the recursive helper needs an explicit `void` return type.

### Iterative DFS

```
stack = [source]
while stack not empty:
  v = stack.pop()
  if v visited: continue
  mark v visited
  for each neighbor w of v (reversed, to match recursive order):
    push w
```

Avoids call-stack limits. Note: **the order of neighbor iteration matters** — pushing neighbors in reverse order makes the iterative version visit them in the same order as the recursive version.

---

## Pre-order vs Post-order

```
Graph: 0 → 1 → 3
            ↘ 2

Pre-order (visit on entry):   0, 1, 2, 3   ← vertex recorded when first reached
Post-order (visit on exit):   3, 2, 1, 0   ← vertex recorded after all descendants visited
```

**Post-order reversed = topological order** (for DAGs). This is why DFS-based topological sort uses reverse post-order.

---

## Discovery and Finish Times

Each vertex gets two timestamps:
- `disc[v]`: when DFS first visits `v`
- `fin[v]`: when DFS finishes exploring all of `v`'s descendants

```
Example (0→1→2, 0→3):

disc: [0, 1, 2, 4]
fin:  [5, 3, 3, 5]  (approximately)
```

Properties:
- If `disc[u] < disc[v] < fin[v] < fin[u]`, then `v` is a descendant of `u`.
- A **back edge** (u → already-open ancestor) indicates a **cycle** in a directed graph.

---

## ASCII: DFS on an Example Graph

```
Graph (undirected):        DFS from 0 (recursive, visit neighbors in order):

  0 - 1 - 3               Visit: 0
  |   |                   → go to 1 (first neighbor)
  2   4                     → go to 3 (first unvisited neighbor of 1)
                              → backtrack to 1
                            → go to 4
                              → backtrack to 1
                          → backtrack to 0
                          → go to 2
                          Order: [0, 1, 3, 4, 2]
```

---

## Complexity

| Operation      | Time      | Space  |
|----------------|-----------|--------|
| DFS (single)   | O(V + E)  | O(V)   |
| All components | O(V + E)  | O(V)   |

- Each vertex is pushed/visited once: **O(V)**.
- Each edge is examined once per endpoint: **O(E)**.
- Recursive call stack depth up to **O(V)** in worst case (a linear chain).

---

## TypeScript Callouts

**`noImplicitReturns`**: Recursive helpers must be typed as returning `void`:

```typescript
function dfsHelper(v: number, visited: Uint8Array, result: number[]): void {
  visited[v] = 1;
  result.push(v);
  for (const w of graph[v] ?? []) {
    if (visited[w] === 0) dfsHelper(w, visited, result);
  }
  // no return needed — void is explicit
}
```

**Iterative order caveat**: Pushing neighbors onto a stack in the original order means the **last** neighbor is visited first (LIFO). Push in **reverse** to match the recursive order, or accept that iterative DFS will visit neighbors in reverse order.

**Stack overflow**: For production code on very large graphs, prefer the iterative version. Node.js's default stack is ~10 000 frames — a chain graph of 100 000 nodes will crash the recursive version.

---

## Cross-References

- **BFS** (`../bfs/`): level-by-level exploration; guarantees shortest paths in unweighted graphs.
- **Topological Sort** (`../topological-sort/`): uses DFS post-order or Kahn's BFS.
- **Cycle Detection** (`../cycle-detection/`): DFS color method (WHITE/GRAY/BLACK) for directed graphs.
- **Adjacency List** (`../adjacency-list/`): the standard graph representation used here.
