// graph is a directed adjacency list: graph[u] = [v1, v2, ...] means u → vi

// Color constants for DFS-based sort
const WHITE = 0; // unvisited
const GRAY = 1;  // in progress (on current DFS path)
const BLACK = 2; // finished

export function topologicalSortDFS(graph: number[][]): number[] | null {
  const n = graph.length;
  const color = new Uint8Array(n); // all WHITE
  const postOrder: number[] = [];
  let hasCycle = false;

  function visit(v: number): void {
    if (hasCycle) return;
    color[v] = GRAY;
    for (const w of graph[v] ?? []) {
      if (color[w] === GRAY) {
        hasCycle = true;
        return;
      }
      if (color[w] === WHITE) {
        visit(w);
      }
    }
    color[v] = BLACK;
    postOrder.push(v);
  }

  for (let v = 0; v < n; v++) {
    if (color[v] === WHITE) {
      visit(v);
    }
  }

  if (hasCycle) return null;
  return postOrder.reverse();
}

export function topologicalSortKahn(graph: number[][]): number[] | null {
  const n = graph.length;
  const inDegree = new Int32Array(n);

  for (let u = 0; u < n; u++) {
    for (const v of graph[u] ?? []) {
      inDegree[v]!++;
    }
  }

  const queue: number[] = [];
  for (let v = 0; v < n; v++) {
    if (inDegree[v] === 0) queue.push(v);
  }

  const result: number[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);
    for (const v of graph[u] ?? []) {
      inDegree[v]!--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }

  return result.length === n ? result : null;
}
