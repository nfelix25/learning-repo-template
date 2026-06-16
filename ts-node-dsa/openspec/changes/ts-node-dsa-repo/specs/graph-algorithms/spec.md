## ADDED Requirements

### Requirement: Kruskal's MST algorithm uses Disjoint Set to build a minimum spanning tree
Kruskal's algorithm SHALL sort all edges by weight and add them greedily when they connect two different components, using the Disjoint Set from advanced-adt.

#### Scenario: MST contains exactly V-1 edges for a connected graph
- **WHEN** Kruskal runs on a connected graph with V vertices
- **THEN** the resulting MST has exactly V-1 edges

#### Scenario: MST total weight is minimal
- **WHEN** Kruskal runs on a graph with a known optimal MST
- **THEN** the total edge weight matches the known optimum

#### Scenario: Edges are processed in non-decreasing weight order
- **WHEN** Kruskal runs
- **THEN** edges are sorted by weight before the greedy selection loop

#### Scenario: Disjoint Set is used for cycle detection
- **WHEN** an edge (u, v) is considered
- **THEN** it is included only if find(u) !== find(v) (using Disjoint Set from advanced-adt)

#### Scenario: Kruskal handles disconnected graph — returns forest
- **WHEN** the graph is disconnected
- **THEN** the result is a minimum spanning forest (one MST per component)

### Requirement: Prim's MST algorithm uses a min-heap to grow the spanning tree greedily
Prim's algorithm SHALL start from an arbitrary source, use a Binary Heap (from heaps module) as a priority queue, and add the minimum-weight edge connecting the current tree to a new vertex.

#### Scenario: MST produced by Prim matches Kruskal's weight on the same graph
- **WHEN** both algorithms run on the same connected graph
- **THEN** their MST total weights are equal

#### Scenario: Prim correctly handles negative edge weights
- **WHEN** the graph contains negative edge weights
- **THEN** the MST is still computed correctly

#### Scenario: Theory.md compares Prim and Kruskal complexity
- **WHEN** the learner reads theory.md
- **THEN** it explains Prim is better for dense graphs (adjacency matrix + binary heap = O(V² + E log V)) and Kruskal for sparse (O(E log E))

### Requirement: Dijkstra's algorithm finds shortest paths from a source in non-negative weighted graphs
Dijkstra's algorithm SHALL use a min-heap for the priority queue, produce correct shortest distances to all reachable vertices, and record the predecessor of each vertex for path reconstruction.

#### Scenario: Shortest distances are correct for all reachable vertices
- **WHEN** Dijkstra runs from a source
- **THEN** dist[v] equals the true shortest path weight for every reachable v

#### Scenario: Unreachable vertices have distance Infinity
- **WHEN** a vertex is not reachable from the source
- **THEN** dist[v] is Infinity

#### Scenario: Path reconstruction returns correct sequence of vertices
- **WHEN** the predecessor map is traced back from a target to the source
- **THEN** the sequence is a valid shortest path

#### Scenario: Dijkstra is incorrect on graphs with negative edge weights
- **WHEN** theory.md covers Dijkstra
- **THEN** it explicitly explains why negative weights break the greedy invariant and references Bellman-Ford as the correct alternative

#### Scenario: Theory.md calls out Fibonacci Heap for O(V log V + E) Dijkstra
- **WHEN** the learner reads theory.md
- **THEN** it references heaps/fibonacci-heap and explains the theoretical improvement from O(1) decrease-key

### Requirement: Bellman-Ford finds shortest paths and detects negative weight cycles
Bellman-Ford SHALL relax all edges V-1 times and perform a V-th relaxation pass to detect negative cycles.

#### Scenario: Shortest distances are correct including through negative edges
- **WHEN** Bellman-Ford runs on a graph with negative edges (no negative cycle)
- **THEN** dist[v] is correct for all vertices

#### Scenario: Negative cycle is detected
- **WHEN** Bellman-Ford runs on a graph containing a negative cycle
- **THEN** it returns a negative-cycle-detected signal

#### Scenario: V-1 relaxation passes suffice for a graph with V vertices
- **WHEN** Bellman-Ford runs on a shortest path of length V-1 hops
- **THEN** the correct distance is found after exactly V-1 passes

### Requirement: Floyd-Warshall computes all-pairs shortest paths in O(V³)
Floyd-Warshall SHALL initialize the distance matrix from the adjacency matrix and apply the recurrence dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for each intermediate vertex k.

#### Scenario: All-pairs distances are correct
- **WHEN** Floyd-Warshall runs on a graph with known pairwise distances
- **THEN** dist[i][j] is correct for every (i, j) pair

#### Scenario: Self-distances are 0
- **WHEN** Floyd-Warshall completes
- **THEN** dist[i][i] === 0 for all i

#### Scenario: Negative cycle is detectable via negative diagonal
- **WHEN** Floyd-Warshall runs on a graph with a negative cycle
- **THEN** some dist[i][i] < 0

### Requirement: A* finds the shortest path using a heuristic to guide search
A* SHALL use a min-heap ordered by f(n) = g(n) + h(n), support a pluggable admissible heuristic function, use `Float64Array` for g and h score storage, and guarantee optimal paths when the heuristic is admissible.

#### Scenario: A* finds the optimal path
- **WHEN** A* runs with an admissible heuristic on a graph with a known optimal path
- **THEN** the path found has minimum total cost

#### Scenario: A* with h=0 degenerates to Dijkstra
- **WHEN** A* runs with a zero heuristic
- **THEN** it expands nodes in the same order as Dijkstra

#### Scenario: g and h scores are stored in Float64Arrays
- **WHEN** the A* implementation is inspected
- **THEN** g-scores and h-scores use Float64Array for floating-point precision

#### Scenario: Inadmissible heuristic may produce suboptimal path
- **WHEN** theory.md covers heuristic admissibility
- **THEN** it defines admissibility (h(n) <= true cost), gives examples of admissible vs inadmissible heuristics, and explains why Float64 matters for precision in h comparisons

#### Scenario: IDA* uses iterative deepening to avoid heap memory overhead
- **WHEN** IDA* runs on the same graph
- **THEN** it finds the same optimal path as A* with O(d) space instead of O(b^d)

#### Scenario: Bidirectional BFS finds shortest hop path from both ends
- **WHEN** bidirectional BFS runs with source s and target t
- **THEN** it finds the shortest-hop path by expanding from both s and t simultaneously, meeting in the middle
