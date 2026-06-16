export class AdjacencyMatrix {
  private matrix: Uint8Array;
  readonly vertices: number;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.matrix = new Uint8Array(vertices * vertices);
  }

  addEdge(u: number, v: number): void {
    this.matrix[u * this.vertices + v] = 1;
  }

  addUndirectedEdge(u: number, v: number): void {
    this.matrix[u * this.vertices + v] = 1;
    this.matrix[v * this.vertices + u] = 1;
  }

  removeEdge(u: number, v: number): void {
    this.matrix[u * this.vertices + v] = 0;
  }

  hasEdge(u: number, v: number): boolean {
    return this.matrix[u * this.vertices + v] === 1;
  }

  getNeighbors(u: number): number[] {
    const neighbors: number[] = [];
    for (let v = 0; v < this.vertices; v++) {
      if (this.matrix[u * this.vertices + v] === 1) {
        neighbors.push(v);
      }
    }
    return neighbors;
  }

  getMatrix(): Uint8Array {
    return this.matrix;
  }
}

export class WeightedAdjacencyMatrix {
  private matrix: Float64Array;
  readonly vertices: number;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.matrix = new Float64Array(vertices * vertices).fill(Infinity);
  }

  addEdge(u: number, v: number, weight: number): void {
    this.matrix[u * this.vertices + v] = weight;
  }

  addUndirectedEdge(u: number, v: number, weight: number): void {
    this.matrix[u * this.vertices + v] = weight;
    this.matrix[v * this.vertices + u] = weight;
  }

  removeEdge(u: number, v: number): void {
    this.matrix[u * this.vertices + v] = Infinity;
  }

  hasEdge(u: number, v: number): boolean {
    return this.matrix[u * this.vertices + v] !== Infinity;
  }

  getWeight(u: number, v: number): number {
    return this.matrix[u * this.vertices + v] ?? Infinity;
  }

  getNeighbors(u: number): Array<{ vertex: number; weight: number }> {
    const neighbors: Array<{ vertex: number; weight: number }> = [];
    for (let v = 0; v < this.vertices; v++) {
      const w = this.matrix[u * this.vertices + v];
      if (w !== undefined && w !== Infinity) {
        neighbors.push({ vertex: v, weight: w });
      }
    }
    return neighbors;
  }

  getMatrix(): Float64Array {
    return this.matrix;
  }
}
