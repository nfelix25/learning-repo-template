import { describe, it, expect } from 'vitest';
import { AdjacencyMatrix, WeightedAdjacencyMatrix } from './adjacency-matrix.js';

describe('AdjacencyMatrix (unweighted)', () => {
  it('getMatrix() returns a Uint8Array', () => {
    const g = new AdjacencyMatrix(4);
    expect(g.getMatrix()).toBeInstanceOf(Uint8Array);
  });

  it('addEdge(0,1) sets directed edge: hasEdge(0,1) true, hasEdge(1,0) false', () => {
    const g = new AdjacencyMatrix(4);
    g.addEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(true);
    expect(g.hasEdge(1, 0)).toBe(false);
  });

  it('addUndirectedEdge(0,1): both hasEdge(0,1) and hasEdge(1,0) true', () => {
    const g = new AdjacencyMatrix(4);
    g.addUndirectedEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(true);
    expect(g.hasEdge(1, 0)).toBe(true);
  });

  it('removeEdge(0,1): hasEdge(0,1) becomes false', () => {
    const g = new AdjacencyMatrix(4);
    g.addEdge(0, 1);
    g.removeEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(false);
  });

  it('getNeighbors returns all vertices with edges from u', () => {
    const g = new AdjacencyMatrix(4);
    g.addEdge(1, 0);
    g.addEdge(1, 2);
    g.addEdge(1, 3);
    const neighbors = g.getNeighbors(1);
    expect(neighbors.sort()).toEqual([0, 2, 3]);
  });

  it('self-loop addEdge(0,0) works', () => {
    const g = new AdjacencyMatrix(4);
    g.addEdge(0, 0);
    expect(g.hasEdge(0, 0)).toBe(true);
  });

  it('index formula: matrix[u * V + v] equals 1 after addEdge(u,v)', () => {
    const V = 4;
    const g = new AdjacencyMatrix(V);
    g.addEdge(2, 3);
    const matrix = g.getMatrix();
    expect(matrix[2 * V + 3]).toBe(1);
    expect(matrix[2 * V + 0]).toBe(0);
  });
});

describe('WeightedAdjacencyMatrix', () => {
  it('getMatrix() returns a Float64Array', () => {
    const g = new WeightedAdjacencyMatrix(4);
    expect(g.getMatrix()).toBeInstanceOf(Float64Array);
  });

  it('addEdge(0,1,2.5): getWeight(0,1) === 2.5', () => {
    const g = new WeightedAdjacencyMatrix(4);
    g.addEdge(0, 1, 2.5);
    expect(g.getWeight(0, 1)).toBe(2.5);
  });

  it('getWeight for non-existent edge returns Infinity', () => {
    const g = new WeightedAdjacencyMatrix(4);
    expect(g.getWeight(0, 3)).toBe(Infinity);
  });

  it('hasEdge returns false when weight is Infinity (no edge)', () => {
    const g = new WeightedAdjacencyMatrix(4);
    expect(g.hasEdge(0, 2)).toBe(false);
  });

  it('addUndirectedEdge: both directions have the same weight', () => {
    const g = new WeightedAdjacencyMatrix(4);
    g.addUndirectedEdge(1, 2, 7.0);
    expect(g.getWeight(1, 2)).toBe(7.0);
    expect(g.getWeight(2, 1)).toBe(7.0);
  });

  it('getNeighbors returns vertices with their weights', () => {
    const g = new WeightedAdjacencyMatrix(4);
    g.addEdge(0, 1, 3.0);
    g.addEdge(0, 3, 5.5);
    const neighbors = g.getNeighbors(0);
    expect(neighbors).toHaveLength(2);
    const sorted = neighbors.sort((a, b) => a.vertex - b.vertex);
    expect(sorted[0]).toEqual({ vertex: 1, weight: 3.0 });
    expect(sorted[1]).toEqual({ vertex: 3, weight: 5.5 });
  });

  it('removeEdge makes hasEdge false and getWeight Infinity', () => {
    const g = new WeightedAdjacencyMatrix(4);
    g.addEdge(0, 1, 4.0);
    g.removeEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(false);
    expect(g.getWeight(0, 1)).toBe(Infinity);
  });
});
