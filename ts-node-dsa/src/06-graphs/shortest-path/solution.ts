/**
 * Shortest Path solution — Dijkstra (inline binary min-heap) + Bellman-Ford.
 * Fully self-contained; no imports from shortest-path.ts.
 */

export interface WeightedEdge {
  to: number;
  weight: number;
}

// ---------------------------------------------------------------------------
// Inline binary min-heap keyed by dist (number)
// ---------------------------------------------------------------------------

interface HeapItem {
  dist: number;
  vertex: number;
}

class MinHeap {
  private items: HeapItem[] = [];

  get size(): number { return this.items.length; }

  push(item: HeapItem): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  pop(): HeapItem | undefined {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last !== undefined) {
      this.items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.items[p]!.dist <= this.items[i]!.dist) break;
      [this.items[p], this.items[i]] = [this.items[i]!, this.items[p]!];
      i = p;
    }
  }

  private siftDown(i: number): void {
    const n = this.items.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.items[l]!.dist < this.items[s]!.dist) s = l;
      if (r < n && this.items[r]!.dist < this.items[s]!.dist) s = r;
      if (s === i) break;
      [this.items[i], this.items[s]] = [this.items[s]!, this.items[i]!];
      i = s;
    }
  }
}

// ---------------------------------------------------------------------------
// Core Dijkstra (returns dist + prev arrays)
// ---------------------------------------------------------------------------

function dijkstraCore(
  adj: Array<WeightedEdge[]>,
  source: number,
): { dist: number[]; prev: number[] } {
  const n = adj.length;
  const dist = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  dist[source] = 0;

  const heap = new MinHeap();
  heap.push({ dist: 0, vertex: source });

  while (heap.size > 0) {
    const { dist: d, vertex: u } = heap.pop()!;
    if (d > dist[u]!) continue; // stale entry

    for (const edge of adj[u] ?? []) {
      const nd = dist[u]! + edge.weight;
      if (nd < dist[edge.to]!) {
        dist[edge.to] = nd;
        prev[edge.to] = u;
        heap.push({ dist: nd, vertex: edge.to });
      }
    }
  }

  return { dist, prev };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns dist[v] = shortest distance from source to v (Infinity if unreachable).
 */
export function dijkstra(adj: Array<WeightedEdge[]>, source: number): number[] {
  return dijkstraCore(adj, source).dist;
}

/**
 * Returns { dist, path } or null if target is unreachable.
 */
export function dijkstraPath(
  adj: Array<WeightedEdge[]>,
  source: number,
  target: number,
): { dist: number; path: number[] } | null {
  const { dist, prev } = dijkstraCore(adj, source);
  if (dist[target] === Infinity) return null;

  // Reconstruct path
  const path: number[] = [];
  let v = target;
  while (v !== -1) {
    path.push(v);
    v = prev[v]!;
  }
  path.reverse();

  return { dist: dist[target]!, path };
}

/**
 * Bellman-Ford SSSP. Returns null if a negative cycle reachable from source exists.
 */
export function bellmanFord(
  vertices: number,
  edges: Array<{ u: number; v: number; weight: number }>,
  source: number,
): number[] | null {
  const dist = new Array<number>(vertices).fill(Infinity);
  dist[source] = 0;

  // Relax all edges V-1 times
  for (let i = 0; i < vertices - 1; i++) {
    let changed = false;
    for (const { u, v, weight } of edges) {
      if (dist[u]! !== Infinity && dist[u]! + weight < dist[v]!) {
        dist[v] = dist[u]! + weight;
        changed = true;
      }
    }
    if (!changed) break; // Early exit optimisation
  }

  // V-th pass: detect negative cycle
  for (const { u, v, weight } of edges) {
    if (dist[u]! !== Infinity && dist[u]! + weight < dist[v]!) {
      return null; // negative cycle
    }
  }

  return dist;
}
