/**
 * MST solution — Kruskal's (Union-Find) + Prim's (inline min-heap).
 * Fully self-contained; no imports from mst.ts.
 */

export interface Edge {
  u: number;
  v: number;
  weight: number;
}

// ---------------------------------------------------------------------------
// Union-Find with path compression + union-by-rank
// ---------------------------------------------------------------------------

function makeUF(n: number): { parent: Int32Array; rank: Uint8Array } {
  const parent = Int32Array.from({ length: n }, (_, i) => i);
  const rank = new Uint8Array(n);
  return { parent, rank };
}

function find(parent: Int32Array, x: number): number {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]!]!; // path halving
    x = parent[x]!;
  }
  return x;
}

function union(parent: Int32Array, rank: Uint8Array, a: number, b: number): boolean {
  const ra = find(parent, a);
  const rb = find(parent, b);
  if (ra === rb) return false; // already same component
  if (rank[ra]! < rank[rb]!) {
    parent[ra] = rb;
  } else if (rank[ra]! > rank[rb]!) {
    parent[rb] = ra;
  } else {
    parent[rb] = ra;
    rank[ra]!++;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Inline binary min-heap keyed by weight
// ---------------------------------------------------------------------------

interface HeapItem {
  weight: number;
  u: number; // parent vertex (-1 for source)
  v: number; // this vertex
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
      const parent = (i - 1) >> 1;
      if (this.items[parent]!.weight <= this.items[i]!.weight) break;
      [this.items[parent], this.items[i]] = [this.items[i]!, this.items[parent]!];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.items.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.items[l]!.weight < this.items[smallest]!.weight) smallest = l;
      if (r < n && this.items[r]!.weight < this.items[smallest]!.weight) smallest = r;
      if (smallest === i) break;
      [this.items[i], this.items[smallest]] = [this.items[smallest]!, this.items[i]!];
      i = smallest;
    }
  }
}

// ---------------------------------------------------------------------------
// Kruskal's algorithm
// ---------------------------------------------------------------------------

/**
 * Returns edges forming the MST (or MSF for disconnected graphs).
 */
export function kruskal(vertices: number, edges: Edge[]): Edge[] {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const { parent, rank } = makeUF(vertices);
  const mst: Edge[] = [];

  for (const edge of sorted) {
    if (union(parent, rank, edge.u, edge.v)) {
      mst.push(edge);
      if (mst.length === vertices - 1) break;
    }
  }

  return mst;
}

// ---------------------------------------------------------------------------
// Prim's algorithm
// ---------------------------------------------------------------------------

/**
 * adj[v] = list of edges incident to v (each undirected edge appears twice).
 * Returns edges forming the MST/MSF rooted at source (default 0).
 */
export function prim(vertices: number, adj: Array<Edge[]>, source = 0): Edge[] {
  const inMST = new Uint8Array(vertices); // 0 = not in tree
  const mst: Edge[] = [];
  const heap = new MinHeap();

  // Kick off from source — u=-1 means no parent edge
  heap.push({ weight: 0, u: -1, v: source });

  // For MSF: after the first component is exhausted, restart from any unvisited vertex
  let visited = 0;

  const processFrom = (start: number): void => {
    heap.push({ weight: 0, u: -1, v: start });

    while (heap.size > 0 && visited < vertices) {
      const item = heap.pop()!;
      const { u, v, weight } = item;

      if (inMST[v]) continue;
      inMST[v] = 1;
      visited++;

      if (u !== -1) {
        mst.push({ u, v, weight });
      }

      for (const edge of adj[v] ?? []) {
        if (!inMST[edge.v]) {
          heap.push({ weight: edge.weight, u: v, v: edge.v });
        }
      }
    }
  };

  processFrom(source);

  // Handle disconnected components
  for (let w = 0; w < vertices; w++) {
    if (!inMST[w]) {
      processFrom(w);
    }
  }

  return mst;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Returns the sum of edge weights. */
export function mstWeight(edges: Edge[]): number {
  return edges.reduce((sum, e) => sum + e.weight, 0);
}
