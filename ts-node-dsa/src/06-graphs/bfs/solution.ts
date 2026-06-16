// adjacency list format: graph[v] is array of neighbors

export function bfs(graph: number[][], source: number): number[] {
  const visited = new Uint8Array(graph.length);
  const order: number[] = [];
  const queue: number[] = [source];
  visited[source] = 1;

  while (queue.length > 0) {
    const v = queue.shift()!;
    order.push(v);
    const neighbors = graph[v] ?? [];
    for (const neighbor of neighbors) {
      if (visited[neighbor] === 0) {
        visited[neighbor] = 1;
        queue.push(neighbor);
      }
    }
  }

  return order;
}

export function bfsShortestPath(
  graph: number[][],
  source: number,
  target: number,
): number[] | null {
  if (source === target) return [source];

  const visited = new Uint8Array(graph.length);
  const parent = new Int32Array(graph.length).fill(-1);
  const queue: number[] = [source];
  visited[source] = 1;

  while (queue.length > 0) {
    const v = queue.shift()!;
    const neighbors = graph[v] ?? [];
    for (const neighbor of neighbors) {
      if (visited[neighbor] === 0) {
        visited[neighbor] = 1;
        parent[neighbor] = v;
        if (neighbor === target) {
          // Reconstruct path
          const path: number[] = [];
          let cur = target;
          while (cur !== -1) {
            path.push(cur);
            cur = parent[cur]!;
          }
          return path.reverse();
        }
        queue.push(neighbor);
      }
    }
  }

  return null;
}

export function bfsDistances(graph: number[][], source: number): number[] {
  const distances: number[] = new Array(graph.length).fill(Infinity) as number[];
  const queue: number[] = [source];
  distances[source] = 0;

  while (queue.length > 0) {
    const v = queue.shift()!;
    const dist = distances[v]!;
    const neighbors = graph[v] ?? [];
    for (const neighbor of neighbors) {
      if (distances[neighbor] === Infinity) {
        distances[neighbor] = dist + 1;
        queue.push(neighbor);
      }
    }
  }

  return distances;
}
