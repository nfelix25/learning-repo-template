# Cycle Detection

## Concept

A **cycle** is a path in a graph that starts and ends at the same vertex. Detecting cycles is fundamental: it tells us whether a dependency graph is safe to process (no circular deps), whether a directed graph is a valid DAG (prerequisite for topological sort), and whether an undirected graph is a tree.

Cycle detection algorithms differ for **undirected** vs **directed** graphs.

---

## Undirected Graphs: DFS with Parent Tracking

In an undirected graph, a cycle exists if DFS discovers an already-visited neighbor that is **not the immediate parent** (the vertex we came from).

```
Graph (undirected, has a cycle):
  0 - 1
  |   |
  2---+

DFS from 0:
  Visit 0, parent = -1
    Visit 1, parent = 0
      Visit 2, parent = 1
        Neighbor 0 is visited and 0 ≠ parent(2)=1 → CYCLE!
```

**Why ignore the parent?** In an undirected graph, every edge `(u, v)` appears as both `u→v` and `v→u`. When DFS is at `v` (reached from `u`), it will see `u` in `v`'s neighbor list. That's not a cycle — it's just the edge we traversed. We only flag a cycle when a *different* already-visited vertex is encountered.

```
function hasUndirectedCycle(graph):
  visited = all false
  for each v:
    if not visited[v]:
      if dfs(v, -1, visited):
        return true
  return false

function dfs(v, parent, visited):
  visited[v] = true
  for each neighbor w of v:
    if not visited[w]:
      if dfs(w, v, visited): return true
    elif w != parent:
      return true  // back edge to non-parent = cycle
  return false
```

**Alternative — Union-Find**: Add edges one by one. If `find(u) == find(v)` before `union(u, v)`, the edge creates a cycle.

---

## Directed Graphs: DFS with Three Colors

In a directed graph, we need to distinguish between:
- **WHITE** (0): unvisited
- **GRAY** (1): currently being explored (on the active DFS path / recursion stack)
- **BLACK** (2): fully explored

A **back edge** (edge from a GRAY vertex to another GRAY ancestor) indicates a cycle. An edge to a BLACK vertex is fine — it means we already fully explored that subtree via a different path.

```
Graph (directed, has a cycle):
  0 → 1 → 2 → 0  (cycle!)

DFS from 0:
  Color 0 GRAY
    Color 1 GRAY
      Color 2 GRAY
        Neighbor 0 is GRAY → CYCLE!
      Color 2 BLACK
    Color 1 BLACK
  Color 0 BLACK
```

```
Graph (directed DAG, no cycle):
  0 → 1 → 3
  0 → 2 → 3  (2 → 3 is fine even though 3 was already visited via 1)

DFS from 0:
  GRAY 0 → GRAY 1 → GRAY 3 → BLACK 3 → BLACK 1
           → visit 2 → GRAY 2 → neighbor 3 is BLACK (not GRAY) → fine
           BLACK 2 → BLACK 0
```

---

## ASCII: Color States During DFS

```
Start:     WHITE   WHITE   WHITE
           [0]     [1]     [2]

Enter 0:   GRAY    WHITE   WHITE
Enter 1:   GRAY    GRAY    WHITE
Enter 2:   GRAY    GRAY    GRAY
See 0:     GRAY ← neighbor 0 is GRAY → CYCLE DETECTED!
```

---

## Complexity

| Algorithm                    | Time     | Space  |
|------------------------------|----------|--------|
| Undirected DFS (parent)      | O(V + E) | O(V)   |
| Directed DFS (color)         | O(V + E) | O(V)   |
| Union-Find (undirected)      | O(E α(V))| O(V)   |

`α` is the inverse Ackermann function, effectively constant.

---

## Finding the Cycle Vertices

To return the actual vertices in a cycle (for directed graphs), track the DFS path in a stack. When a back edge is found (GRAY → GRAY), extract the suffix of the current path from the ancestor to the current vertex.

```
DFS path stack: [0, 1, 2]
Back edge: 2 → 0
Cycle: [0, 1, 2] (all vertices from 0 to 2 on the path)
```

---

## TypeScript Callouts

**Numeric constants for colors** — use `const` assertions or a `const enum`:

```typescript
const WHITE = 0;
const GRAY  = 1;
const BLACK = 2;

const color = new Uint8Array(graph.length); // all WHITE (0)
```

`Uint8Array` is ideal: each element is a single byte (values 0, 1, 2 fit), and it's cache-efficient.

**`noUncheckedIndexedAccess`**: `graph[v]` returns `number[] | undefined` — guard with `?? []`:

```typescript
for (const w of graph[v] ?? []) { ... }
```

**`noImplicitReturns`**: DFS helpers returning `boolean` must have explicit returns on every path:

```typescript
function dfs(v: number, parent: number): boolean {
  color[v] = GRAY;
  for (const w of graph[v] ?? []) {
    if (color[w] === GRAY) return true; // cycle
    if (color[w] === WHITE && dfs(w, v)) return true;
  }
  color[v] = BLACK;
  return false; // no cycle found from v
}
```

---

## Cross-References

- **DFS** (`../dfs/`): the traversal backbone for both cycle detection approaches.
- **Topological Sort** (`../topological-sort/`): requires a DAG (no directed cycles); Kahn's algorithm detects cycles as a byproduct.
- **Adjacency List** (`../adjacency-list/`): typical graph representation used here.
