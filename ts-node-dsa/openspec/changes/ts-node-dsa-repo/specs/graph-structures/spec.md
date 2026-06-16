## ADDED Requirements

### Requirement: Adjacency Matrix represents a graph in a flat TypedArray
The Adjacency Matrix SHALL use a `Uint8Array` for unweighted graphs (0/1 entries) and a `Float64Array` for weighted graphs. The matrix index for edge (u, v) in a graph of N vertices SHALL be u * N + v.

#### Scenario: Adding an edge sets the correct cell
- **WHEN** addEdge(u, v) is called on an unweighted graph
- **THEN** matrix[u * N + v] is 1

#### Scenario: Undirected graph sets both directions
- **WHEN** addEdge(u, v) is called on an undirected graph
- **THEN** both matrix[u * N + v] and matrix[v * N + u] are set

#### Scenario: hasEdge returns true for added edges
- **WHEN** hasEdge(u, v) is called after addEdge(u, v)
- **THEN** it returns true

#### Scenario: hasEdge returns false for absent edges
- **WHEN** hasEdge(u, v) is called for a pair with no edge
- **THEN** it returns false

#### Scenario: removeEdge clears the correct cell
- **WHEN** removeEdge(u, v) is called
- **THEN** hasEdge(u, v) returns false

#### Scenario: Weighted graph stores Float64 weight values
- **WHEN** addEdge(u, v, weight) is called on a weighted graph
- **THEN** the underlying Float64Array at u * N + v stores the weight value

#### Scenario: getNeighbors returns all vertices with an edge from u
- **WHEN** getNeighbors(u) is called
- **THEN** it returns all v where hasEdge(u, v) is true

#### Scenario: Theory.md explains when adjacency matrix is preferred over list
- **WHEN** the learner reads theory.md
- **THEN** it explains that O(1) edge lookup and dense graphs favor matrices, while sparse graphs favor lists, with the memory cost O(V²) called out

### Requirement: Adjacency List represents a graph with per-vertex neighbor arrays
The Adjacency List SHALL use a Map or Array of neighbor arrays/sets, support addEdge, removeEdge, hasEdge, and getNeighbors.

#### Scenario: Adding an edge appends to the neighbor list
- **WHEN** addEdge(u, v) is called
- **THEN** v is in getNeighbors(u)

#### Scenario: Undirected graph adds both directions
- **WHEN** addEdge(u, v) is called on undirected graph
- **THEN** both u is in getNeighbors(v) and v is in getNeighbors(u)

#### Scenario: removeEdge removes from neighbor list
- **WHEN** removeEdge(u, v) is called
- **THEN** v is no longer in getNeighbors(u)

#### Scenario: hasEdge is O(degree) for list vs O(1) for matrix
- **WHEN** theory.md compares the two representations
- **THEN** it explains the O(degree) cost of hasEdge in adjacency list and when this matters

### Requirement: BFS traverses a graph level by level from a source vertex
BFS SHALL use a queue internally, visit each vertex at most once, and return vertices in discovery order. It SHALL track distance from source.

#### Scenario: BFS visits all reachable vertices
- **WHEN** BFS runs from a source in a connected graph
- **THEN** all vertices are visited

#### Scenario: BFS visits vertices in non-decreasing distance order
- **WHEN** BFS runs on a graph with known structure
- **THEN** vertices are reported in order of their shortest-hop distance from source

#### Scenario: BFS returns correct shortest-hop distances
- **WHEN** BFS completes
- **THEN** the distance map gives the correct minimum hop count from source to each vertex

#### Scenario: BFS does not revisit vertices
- **WHEN** BFS runs on a graph with cycles
- **THEN** each vertex appears in the output exactly once

#### Scenario: BFS on disconnected graph only visits reachable component
- **WHEN** BFS runs from a source in a disconnected graph
- **THEN** only vertices reachable from source are visited

### Requirement: DFS traverses a graph depth-first from a source vertex
DFS SHALL track discovery and finish times, return vertices in DFS order, and be implementable both recursively and iteratively (stack-based).

#### Scenario: DFS visits all reachable vertices
- **WHEN** DFS runs from a source in a connected graph
- **THEN** all vertices are visited

#### Scenario: DFS does not revisit vertices
- **WHEN** DFS runs on a graph with cycles
- **THEN** each vertex appears in the output exactly once

#### Scenario: Discovery time < finish time for every vertex
- **WHEN** DFS tracks timestamps
- **THEN** every vertex has discover[v] < finish[v]

#### Scenario: Ancestor's discovery time < descendant's finish time (parenthesis theorem)
- **WHEN** u is an ancestor of v in the DFS tree
- **THEN** discover[u] < discover[v] < finish[v] < finish[u]

### Requirement: Topological Sort produces a linear ordering of a DAG
Topological sort SHALL work on directed acyclic graphs, produce an ordering where for every edge (u, v), u comes before v, and detect cycles.

#### Scenario: Topological order respects all edge directions
- **WHEN** topological sort runs on a DAG
- **THEN** for every edge (u, v), u appears before v in the output

#### Scenario: Topological sort throws on a graph with a cycle
- **WHEN** topological sort runs on a graph containing a cycle
- **THEN** it throws an error or returns a cycle-detected signal

#### Scenario: Kahn's algorithm produces same valid ordering as DFS-based sort
- **WHEN** both algorithms run on the same DAG
- **THEN** both produce valid topological orderings (not necessarily identical)

### Requirement: Cycle Detection identifies directed and undirected cycles
Cycle detection SHALL handle both directed graphs (back edge via DFS coloring) and undirected graphs (parent-aware DFS or Union-Find).

#### Scenario: Directed cycle is detected via back edge
- **WHEN** DFS is run on a directed graph with a cycle
- **THEN** a back edge (gray → gray) is found and reported

#### Scenario: Undirected cycle is detected
- **WHEN** DFS or Union-Find runs on an undirected graph with a cycle
- **THEN** the cycle is detected

#### Scenario: DAG / tree returns no cycle detected
- **WHEN** cycle detection runs on an acyclic graph
- **THEN** it returns false or an empty cycle list

#### Scenario: Theory.md calls out Union-Find for undirected cycle detection
- **WHEN** the learner reads theory.md
- **THEN** it references the advanced-adt/disjoint-set module as an alternative approach for undirected graphs
