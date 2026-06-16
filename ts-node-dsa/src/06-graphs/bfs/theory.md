# Breadth-First Search (BFS)

## Concept

BFS explores a graph **level by level**, visiting all vertices at distance `k` from the source before visiting any vertex at distance `k + 1`. It uses a **queue** (FIFO) to track which vertex to visit next.

BFS is the canonical algorithm for finding **shortest paths** in unweighted graphs because it guarantees that the first time a vertex is dequeued, it was reached via the fewest edges possible.

---

## Level-by-Level Expansion

```
Graph (undirected):       BFS from vertex 0:

  0 - 1 - 2              Level 0: [0]
  |       |              Level 1: [1, 3]
  3       4              Level 2: [2]
          |              Level 3: [4]
          5              Level 4: [5]

Visit order: 0, 1, 3, 2, 4, 5
```

The queue at each step:

```
Start:    queue = [0],       visited = {0}
Step 1:   dequeue 0 → enqueue 1, 3   queue = [1, 3]
Step 2:   dequeue 1 → enqueue 2      queue = [3, 2]
Step 3:   dequeue 3 → (no new)       queue = [2]
Step 4:   dequeue 2 → enqueue 4      queue = [4]
Step 5:   dequeue 4 → enqueue 5      queue = [5]
Step 6:   dequeue 5 → done           queue = []
```

---

## Key Data Structures

### visited array
- Prevents re-processing already-discovered vertices.
- Space: **O(V)**.
- A vertex is marked visited **when enqueued**, not when dequeued, to avoid duplicate enqueues.

### parent array
- `parent[v] = u` means vertex `u` discovered vertex `v`.
- Allows path reconstruction: follow parent links from `target` back to `source`, then reverse.

```typescript
// Path reconstruction
function reconstruct(parent: number[], source: number, target: number): number[] {
  const path: number[] = [];
  let cur = target;
  while (cur !== source) {
    path.push(cur);
    cur = parent[cur]!; // safe after bounds check
  }
  path.push(source);
  return path.reverse();
}
```

---

## Complexity

| Operation | Time      | Space  |
|-----------|-----------|--------|
| BFS       | O(V + E)  | O(V)   |

- Every vertex is enqueued and dequeued at most once: **O(V)**.
- Every edge is examined at most twice (once per endpoint in undirected): **O(E)**.
- `visited` and `parent` arrays: **O(V)** space.

---

## TypeScript Callouts

**Queue with `shift()`**: Using a plain `number[]` as a queue and calling `shift()` is **O(n)** per operation (elements must be shifted left). This is pedagogically clear but can be slow for large graphs. A proper queue backed by a linked list or a ring buffer is O(1) dequeue.

```typescript
// Simple O(n) queue — fine for learning:
const queue: number[] = [source];
while (queue.length > 0) {
  const v = queue.shift()!; // O(n) shift
  // ...
}
```

**`Uint8Array` vs `boolean[]` for visited**: `Uint8Array` is more memory-efficient (1 byte per entry vs pointer overhead) and can be faster due to cache locality, but `boolean[]` is idiomatic TypeScript.

```typescript
// Memory-efficient visited flags:
const visited = new Uint8Array(graph.length);
visited[source] = 1;
```

**`noUncheckedIndexedAccess`**: Array indexing returns `T | undefined`. Use `!` after a bounds check or logical guard:

```typescript
const v = queue.shift(); // number | undefined
if (v === undefined) break;
const neighbors = graph[v]!; // safe: v < graph.length
```

---

## Cross-References

- **DFS** (`../dfs/`): explores depth-first; no shortest-path guarantee for unweighted graphs.
- **Dijkstra's algorithm**: BFS generalized with a priority queue for weighted graphs.
- **Topological Sort** (`../topological-sort/`): Kahn's algorithm uses BFS with in-degree counts.
- **Cycle Detection** (`../cycle-detection/`): BFS can detect cycles in undirected graphs (using parent tracking).
