# Heuristic Search — A*

## What Is A*?

A* is a **best-first search** algorithm that finds the shortest path from a start node to a goal node. It extends Dijkstra's algorithm by using a **heuristic function** to guide the search toward the goal, exploring far fewer nodes in practice.

**Cost function:**

```
f(n) = g(n) + h(n)
```

| Term | Meaning |
|------|---------|
| `g(n)` | Exact cost from start to node n (known so far) |
| `h(n)` | Heuristic estimate of cost from n to goal |
| `f(n)` | Estimated total cost through n |

A* always expands the node with the **smallest f(n)** next.

---

## Admissibility

A heuristic is **admissible** if it **never overestimates** the true cost to the goal:

```
h(n) ≤ h*(n)   for all n    (h* = true optimal cost)
```

When h is admissible, A* is **guaranteed to find the optimal path**.

A heuristic is **consistent** (a.k.a. monotone) if it additionally satisfies the triangle inequality:

```
h(n) ≤ cost(n, n') + h(n')   for all edges n → n'
```

Consistency implies admissibility.

---

## A* vs Dijkstra

| Property       | Dijkstra           | A*                       |
|----------------|--------------------|--------------------------|
| Heuristic      | h(n) = 0           | h(n) = problem-specific  |
| Explores       | All reachable nodes| Only promising nodes      |
| Optimal?       | Yes                | Yes (if h admissible)    |
| Typical speed  | Baseline           | Much faster with good h  |

Dijkstra is **A* with h(n) = 0** for all n.

---

## Common Heuristics

### Manhattan Distance (4-directional grids)
```
h = |row_a - row_b| + |col_a - col_b|
```
Admissible when movement is restricted to 4 directions and each step costs 1.

### Euclidean Distance (any direction)
```
h = sqrt((row_a - row_b)² + (col_a - col_b)²)
```
Admissible when diagonal movement is allowed and step cost ≥ 1.

### Chebyshev Distance (8-directional grids)
```
h = max(|row_a - row_b|, |col_a - col_b|)
```
Admissible for 8-directional movement with equal costs.

---

## Grid Example

```
S = start (0,0)    G = goal (3,4)    # = wall    . = passable

     0   1   2   3   4
  0  S   .   .   .   .
  1  #   #   .   #   .
  2  .   .   .   #   .
  3  .   #   .   .   G

A* with Manhattan heuristic:
  Open:   {S, f=0+7=7}
  Expand S → neighbours: (0,1) g=1 h=6 f=7
  Expand (0,1) → (0,2) g=2 h=5 f=7, (1,2)  ...
  ... skips (1,0),(1,1) entirely — heuristic steers right

BFS/Dijkstra would explore all 20 cells in a wave;
A* reaches G having explored ~10.

Path found: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(3,2)→(3,3)→(3,4)
```

---

## Algorithm Pseudocode

```
open = min-priority-queue keyed by f
open.push(start, f=g[start]+h[start])
g[start] = 0
closed = set()

while open not empty:
  current = open.pop()
  if current == goal: reconstruct and return path
  if current in closed: continue
  closed.add(current)

  for each neighbour n of current with edge cost w:
    tentative_g = g[current] + w
    if tentative_g < g[n]:
      g[n] = tentative_g
      prev[n] = current
      open.push(n, f = g[n] + h[n])

return null  // goal unreachable
```

---

## Complexity

- **Time:** O(E log V) in practice with a good heuristic and a binary heap.
- **Worst case:** exponential if h is poor (degrades toward BFS).
- **Space:** O(V) for the open/closed sets and g-score array.

---

## TypeScript Callouts

- Use `Float64Array` for g-scores and f-scores — they are floating-point numbers.
- Represent grid positions as `{ row: number; col: number }` objects or encode as `row * cols + col` integer for use as array indices.
- The open set is a **min-priority queue** keyed by f-score. An inline binary min-heap gives O(log n) insert/extract.
- A closed set (`Set<number>` with encoded positions) prevents re-expansion.
- With `noUncheckedIndexedAccess`, `grid[row]?.[col]` returns `number | undefined`; use `=== 1` checks carefully and guard against `undefined`.
- Default heuristic: Manhattan distance (most common for grid pathfinding).
