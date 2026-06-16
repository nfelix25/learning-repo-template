export class AdjacencyMatrix {
  private matrix: Uint8Array;
  readonly vertices: number;

  constructor(vertices: number) {
    throw new Error('TODO');
  }

  addEdge(u: number, v: number): void {
    throw new Error('TODO');
  }

  addUndirectedEdge(u: number, v: number): void {
    throw new Error('TODO');
  }

  removeEdge(u: number, v: number): void {
    throw new Error('TODO');
  }

  hasEdge(u: number, v: number): boolean {
    throw new Error('TODO');
  }

  getNeighbors(u: number): number[] {
    throw new Error('TODO');
  }

  getMatrix(): Uint8Array {
    throw new Error('TODO');
  }
}

export class WeightedAdjacencyMatrix {
  private matrix: Float64Array;
  readonly vertices: number;

  constructor(vertices: number) {
    throw new Error('TODO');
  }

  addEdge(u: number, v: number, weight: number): void {
    throw new Error('TODO');
  }

  addUndirectedEdge(u: number, v: number, weight: number): void {
    throw new Error('TODO');
  }

  removeEdge(u: number, v: number): void {
    throw new Error('TODO');
  }

  hasEdge(u: number, v: number): boolean {
    throw new Error('TODO');
  }

  getWeight(u: number, v: number): number {
    throw new Error('TODO');
  }

  getNeighbors(u: number): Array<{ vertex: number; weight: number }> {
    throw new Error('TODO');
  }

  getMatrix(): Float64Array {
    throw new Error('TODO');
  }
}
