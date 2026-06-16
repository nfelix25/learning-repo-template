// adjacency list format: graph[v] is array of neighbors

export function bfs(graph: number[][], source: number): number[] {
  // Returns vertices in BFS visit order starting from source
  throw new Error('TODO');
}

export function bfsShortestPath(
  graph: number[][],
  source: number,
  target: number,
): number[] | null {
  // Returns shortest path [source, ..., target] or null if not reachable
  throw new Error('TODO');
}

export function bfsDistances(graph: number[][], source: number): number[] {
  // Returns distances[v] = shortest edge-count distance from source to v
  // (Infinity if unreachable)
  throw new Error('TODO');
}
