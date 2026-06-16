# Shortest Path Algorithms

## Problem Statement

Given a weighted directed graph (or undirected), find the path from a **source** vertex to one or all other vertices with the **minimum total weight**.

---

## Dijkstra's Algorithm

**Constraints:** edge weights must be **non-negative**.

**Core idea:** greedy expansion — always relax the vertex with the currently smallest known distance.

```
dist[source] = 0; dist[v] = Infinity for all other v
priority queue Q = {(0, source)}

while Q not empty:
  (d, u) = Q.extractMin()
  if d > dist[u]: continue   // stale entry
  for each edge (u → v, weight w):
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w
      prev[v] = u
      Q.insert(dist[v], v)
```

**Relaxation step illustrated:**

```
  0 ──3─→ 1 ──1─→ 3
  │              ↑
  └──────6───────┘

Start at 0.
  dist = [0, Inf, Inf, Inf]
  Relax 0→1 (3): dist[1] = 3
  Relax 0→3 (6): dist[3] = 6
  Extract 1 (dist=3). Relax 1→3 (1): dist[3] = min(6, 3+1) = 4 ✓
  Extract 3 (dist=4). Done.
  Result: dist = [0, 3, Inf, 4]
```

**Complexity:** O((V + E) log V) with a binary min-heap.

---

## Bellman-Ford Algorithm

**Constraints:** handles **negative-weight edges**. Detects **negative cycles**.

**Core idea:** relax every edge V-1 times; if any distance still improves on the V-th pass, a negative cycle exists.

```
dist[source] = 0; dist[v] = Infinity for all other v

for i in 1..V-1:
  for each edge (u → v, weight w):
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w

// Check for negative cycle
for each edge (u → v, weight w):
  if dist[u] + w < dist[v]:
    return null  // negative cycle detected
```

**Example with negative edge:**

```
  0 ──5─→ 1 ──(-3)─→ 2
  │                  ↑
  └────────7──────────┘

dist = [0, Inf, Inf]
Pass 1:
  0→1 (5):   dist[1] = 5
  0→2 (7):   dist[2] = 7
  1→2 (-3):  dist[2] = min(7, 5-3) = 2 ✓
Result: dist = [0, 5, 2]
```

**Complexity:** O(V × E) — much slower than Dijkstra.

---

## When To Use Which

| Situation                          | Algorithm     |
|------------------------------------|---------------|
| All weights ≥ 0                   | Dijkstra      |
| Negative weights, no negative cycle| Bellman-Ford  |
| Need to detect negative cycles     | Bellman-Ford  |
| Dense graph, all weights ≥ 0      | Dijkstra      |
| SSSP on DAG (any weights)          | Topo-sort + relax |

---

## Path Reconstruction

Store a `prev` array while relaxing. To reconstruct path from source → target:

```
path = []
v = target
while v != -1:
  path.push(v)
  v = prev[v]
return path.reverse()
```

---

## TypeScript Callouts

- Use `Float64Array` for the `dist` array — distances are numbers and `Float64Array` initializes to `0`, so set initial values explicitly or use `new Array<number>(V).fill(Infinity)`.
- `Infinity` as initial distance is idiomatic TypeScript/JavaScript.
- `noUncheckedIndexedAccess` means `adj[v]` returns `WeightedEdge[] | undefined`; use `?? []` or non-null assertion after a bounds check.
- For Dijkstra an **inline binary min-heap** gives O(E log V); for small graphs a linear scan of all vertices also works.
- Avoid `Array.sort` inside the inner loop — it costs O(V log V) per extraction and makes the overall complexity O(V² log V).
