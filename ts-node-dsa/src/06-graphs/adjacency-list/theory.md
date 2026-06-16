# Adjacency List

## Concept

An adjacency list stores **only existing edges**: for each vertex `u`, keep a list of its neighbors `[v1, v2, ...]`. This is far more space-efficient than a matrix when the graph is sparse (few edges relative to V²).

## Representations

- **Unweighted**: `Map<number, number[]>` or `Array<number[]>` indexed by vertex
- **Weighted**: `Map<number, Array<{vertex: number, weight: number}>>`

## ASCII Diagram

Graph with edges: 0→1, 0→2, 1→3, 2→3

```
Adjacency List:
0 → [1, 2]
1 → [3]
2 → [3]
3 → []

Adjacency Matrix (same graph, 4×4):
[0, 1, 1, 0]
[0, 0, 0, 1]
[0, 0, 0, 1]
[0, 0, 0, 0]

The list stores 4 entries. The matrix allocates 16 cells.
```

## Space and Time Complexity

```
Operation      | Matrix    | List
hasEdge(u,v)   | O(1)      | O(deg(u))
addEdge        | O(1)      | O(1) amortized
getNeighbors   | O(V)      | O(deg(u))
space          | O(V²)     | O(V + E)
```

`deg(u)` is the out-degree of vertex `u` — the number of edges leaving it.

## Directed vs Undirected

- **Directed**: push `v` into `adj[u]` only
- **Undirected**: push `v` into `adj[u]` AND push `u` into `adj[v]`

## When to Prefer Over Adjacency Matrix

- **Sparse graphs** where E << V² (most real-world graphs: social networks, road maps)
- **Frequent neighbor iteration** — BFS and DFS traverse neighbor lists; O(deg) beats O(V) per vertex
- When memory matters: a sparse graph with V=10,000 and E=50,000 uses 500MB in a matrix vs ~1MB in a list

## TypeScript Notes

- `Map<number, number[]>` gives O(1) vertex lookup and clean initialization
- `noUncheckedIndexedAccess` means `adj.get(u)` returns `number[] | undefined` — always guard or default to `[]`

## Cross-References

- `06-graphs/adjacency-matrix` — the dense alternative; O(1) hasEdge
- `06-graphs/bfs` — BFS uses `getNeighbors` in O(deg(u))
- `06-graphs/dfs` — DFS traverses neighbor lists
- `06-graphs/topological-sort`, `06-graphs/cycle-detection` — all use this as the backing graph
