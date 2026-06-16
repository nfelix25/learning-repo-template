export class AdjacencyList {
  private adj: Map<number, number[]>;
  readonly vertices: number;
  private _edgeCount: number;

  constructor(vertices: number) {
    this.vertices = vertices;
    this._edgeCount = 0;
    this.adj = new Map();
    for (let i = 0; i < vertices; i++) {
      this.adj.set(i, []);
    }
  }

  addEdge(u: number, v: number): void {
    const neighbors = this.adj.get(u) ?? [];
    if (!neighbors.includes(v)) {
      neighbors.push(v);
      this.adj.set(u, neighbors);
      this._edgeCount++;
    }
  }

  addUndirectedEdge(u: number, v: number): void {
    this.addEdge(u, v);
    this.addEdge(v, u);
  }

  removeEdge(u: number, v: number): void {
    const neighbors = this.adj.get(u);
    if (neighbors === undefined) return;
    const idx = neighbors.indexOf(v);
    if (idx !== -1) {
      neighbors.splice(idx, 1);
      this._edgeCount--;
    }
  }

  hasEdge(u: number, v: number): boolean {
    const neighbors = this.adj.get(u);
    if (neighbors === undefined) return false;
    return neighbors.includes(v);
  }

  getNeighbors(u: number): number[] {
    return this.adj.get(u) ?? [];
  }

  get edgeCount(): number {
    return this._edgeCount;
  }
}

export class WeightedAdjacencyList {
  private adj: Map<number, Array<{ vertex: number; weight: number }>>;
  readonly vertices: number;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.adj = new Map();
    for (let i = 0; i < vertices; i++) {
      this.adj.set(i, []);
    }
  }

  addEdge(u: number, v: number, weight: number): void {
    const neighbors = this.adj.get(u) ?? [];
    const existing = neighbors.find((e) => e.vertex === v);
    if (existing !== undefined) {
      existing.weight = weight;
    } else {
      neighbors.push({ vertex: v, weight });
      this.adj.set(u, neighbors);
    }
  }

  addUndirectedEdge(u: number, v: number, weight: number): void {
    this.addEdge(u, v, weight);
    this.addEdge(v, u, weight);
  }

  removeEdge(u: number, v: number): void {
    const neighbors = this.adj.get(u);
    if (neighbors === undefined) return;
    const idx = neighbors.findIndex((e) => e.vertex === v);
    if (idx !== -1) {
      neighbors.splice(idx, 1);
    }
  }

  hasEdge(u: number, v: number): boolean {
    const neighbors = this.adj.get(u);
    if (neighbors === undefined) return false;
    return neighbors.some((e) => e.vertex === v);
  }

  getWeight(u: number, v: number): number | undefined {
    const neighbors = this.adj.get(u);
    if (neighbors === undefined) return undefined;
    return neighbors.find((e) => e.vertex === v)?.weight;
  }

  getNeighbors(u: number): Array<{ vertex: number; weight: number }> {
    return this.adj.get(u) ?? [];
  }
}
