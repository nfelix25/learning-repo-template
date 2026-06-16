export class AdjacencyList {
  private adj: Map<number, number[]>;
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

  get edgeCount(): number {
    throw new Error('TODO');
  }
}

export class WeightedAdjacencyList {
  private adj: Map<number, Array<{ vertex: number; weight: number }>>;
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

  getWeight(u: number, v: number): number | undefined {
    throw new Error('TODO');
  }

  getNeighbors(u: number): Array<{ vertex: number; weight: number }> {
    throw new Error('TODO');
  }
}
