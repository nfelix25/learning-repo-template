// Color constants for directed cycle detection
const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

export function hasUndirectedCycle(graph: number[][]): boolean {
  const visited = new Uint8Array(graph.length);

  function dfs(v: number, parent: number): boolean {
    visited[v] = 1;
    for (const w of graph[v] ?? []) {
      if (visited[w] === 0) {
        if (dfs(w, v)) return true;
      } else if (w !== parent) {
        return true;
      }
    }
    return false;
  }

  for (let v = 0; v < graph.length; v++) {
    if (visited[v] === 0) {
      if (dfs(v, -1)) return true;
    }
  }

  return false;
}

export function hasDirectedCycle(graph: number[][]): boolean {
  const color = new Uint8Array(graph.length); // all WHITE

  function dfs(v: number): boolean {
    color[v] = GRAY;
    for (const w of graph[v] ?? []) {
      if (color[w] === GRAY) return true;
      if (color[w] === WHITE && dfs(w)) return true;
    }
    color[v] = BLACK;
    return false;
  }

  for (let v = 0; v < graph.length; v++) {
    if (color[v] === WHITE) {
      if (dfs(v)) return true;
    }
  }

  return false;
}

export function findCycleVertices(graph: number[][]): number[] | null {
  const color = new Uint8Array(graph.length); // all WHITE
  // path tracks the current DFS stack
  const path: number[] = [];
  let foundCycle: number[] | null = null;

  function dfs(v: number): boolean {
    color[v] = GRAY;
    path.push(v);

    for (const w of graph[v] ?? []) {
      if (foundCycle !== null) return true;
      if (color[w] === GRAY) {
        // Found back edge v → w: extract cycle from path starting at w
        const cycleStart = path.indexOf(w);
        foundCycle = path.slice(cycleStart);
        return true;
      }
      if (color[w] === WHITE) {
        if (dfs(w)) return true;
      }
    }

    path.pop();
    color[v] = BLACK;
    return false;
  }

  for (let v = 0; v < graph.length; v++) {
    if (color[v] === WHITE) {
      if (dfs(v)) return foundCycle;
    }
  }

  return null;
}
