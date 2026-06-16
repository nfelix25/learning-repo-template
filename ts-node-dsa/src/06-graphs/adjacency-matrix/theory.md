# Adjacency Matrix

## Concept

A graph has **V vertices** (numbered 0..V-1) and **E edges**. An adjacency matrix represents the graph as a V×V grid where entry `(u, v) = 1` means there is an edge from vertex `u` to vertex `v`.

## Storage: Flattening to 1D

Instead of a 2D array, we flatten the matrix into a single typed array. The index for edge `(u, v)` in a graph with `V` vertices is:

```
index = u * V + v
```

This is the key lesson: 2D logical structure, 1D physical storage.

## ASCII Diagram

4-vertex graph with edges: 0→1, 1→2, 2→3, 3→0

```
     to: 0  1  2  3
from 0: [0, 1, 0, 0]  ← u=0: matrix[0*4+0..3]
     1: [0, 0, 1, 0]  ← u=1: matrix[1*4+0..3]
     2: [0, 0, 0, 1]  ← u=2: matrix[2*4+0..3]
     3: [1, 0, 0, 0]  ← u=3: matrix[3*4+0..3]

edge (1,2): matrix[1*4+2] = matrix[6] = 1
```

## Typed Arrays

- **Unweighted**: `Uint8Array` — 0 or 1 per entry, 1 byte each
- **Weighted**: `Float64Array` — weight per entry, 8 bytes each

## TypeScript Callout

> `Uint8Array` works for unweighted graphs. For weighted graphs, `Float64Array` stores edge weights — but `0.0` is ambiguous (no edge vs zero-weight edge). A common convention: use `Infinity` for "no edge", `0` for self-loops.

## Directed vs Undirected

- **Directed**: only set `matrix[u * V + v] = 1`
- **Undirected**: set both `matrix[u * V + v] = 1` AND `matrix[v * V + u] = 1`

## Complexity

| Operation     | Time   | Notes                          |
|---------------|--------|--------------------------------|
| hasEdge(u,v)  | O(1)   | Direct index access            |
| addEdge       | O(1)   | Direct index write             |
| removeEdge    | O(1)   | Direct index write             |
| getNeighbors  | O(V)   | Must scan entire row           |
| Space         | O(V²)  | Always allocates V×V entries   |

## When to Prefer Over Adjacency List

- Dense graphs where E ≈ V² (matrix wastes little space)
- Frequent `hasEdge` queries that need O(1) lookup
- Algorithms like Floyd-Warshall that naturally index by (u, v) pairs

## Cross-References

- `06-graphs/adjacency-list` — sparse representation, better for E << V²
- `06-graphs/mst` — Floyd-Warshall all-pairs shortest path uses a matrix
