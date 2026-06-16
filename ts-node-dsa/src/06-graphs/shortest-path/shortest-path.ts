export interface WeightedEdge {
  to: number;
  weight: number;
}

/**
 * Dijkstra's single-source shortest path algorithm.
 * Edge weights must be non-negative.
 *
 * @param adj    - adjacency list; adj[v] is the list of outgoing edges from v
 * @param source - starting vertex
 * @returns dist[v] = shortest distance from source to v (Infinity if unreachable)
 */
export function dijkstra(adj: Array<WeightedEdge[]>, source: number): number[] {
  throw new Error('TODO');
}

/**
 * Dijkstra — returns the shortest distance and the actual path.
 *
 * @returns { dist, path } where path is an array of vertex indices
 *          from source to target (inclusive), or null if target is unreachable.
 */
export function dijkstraPath(
  adj: Array<WeightedEdge[]>,
  source: number,
  target: number,
): { dist: number; path: number[] } | null {
  throw new Error('TODO');
}

/**
 * Bellman-Ford single-source shortest path algorithm.
 * Handles negative-weight edges. Returns null if a negative cycle is reachable
 * from source.
 *
 * @param vertices - number of vertices (0-indexed)
 * @param edges    - list of directed edges {u, v, weight}
 * @param source   - starting vertex
 * @returns dist[] or null if a negative cycle is detected
 */
export function bellmanFord(
  vertices: number,
  edges: Array<{ u: number; v: number; weight: number }>,
  source: number,
): number[] | null {
  throw new Error('TODO');
}
