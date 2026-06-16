export interface Edge {
  u: number;
  v: number;
  weight: number;
}

/**
 * Kruskal's algorithm — MST via sorted edges + Union-Find.
 * For disconnected graphs returns the Minimum Spanning Forest (MSF).
 *
 * @param vertices - number of vertices (0-indexed)
 * @param edges    - list of undirected weighted edges
 * @returns edges included in the MST/MSF
 */
export function kruskal(vertices: number, edges: Edge[]): Edge[] {
  throw new Error('TODO');
}

/**
 * Prim's algorithm — MST via greedy expansion from a source vertex.
 * adj[v] contains all edges incident to vertex v (each edge appears
 * in both adj[u] and adj[v] for an undirected graph).
 * For disconnected graphs returns the Minimum Spanning Forest (MSF).
 *
 * @param vertices - number of vertices (0-indexed)
 * @param adj      - adjacency list; adj[v] is the list of edges at v
 * @param source   - starting vertex (default 0)
 * @returns edges included in the MST/MSF
 */
export function prim(vertices: number, adj: Array<Edge[]>, source?: number): Edge[] {
  throw new Error('TODO');
}

/**
 * Returns the total weight of a set of edges.
 */
export function mstWeight(edges: Edge[]): number {
  throw new Error('TODO');
}
