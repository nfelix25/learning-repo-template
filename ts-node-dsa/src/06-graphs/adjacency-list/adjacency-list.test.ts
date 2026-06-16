import { describe, it, expect } from 'vitest';
import { AdjacencyList, WeightedAdjacencyList } from './adjacency-list.js';

describe('AdjacencyList', () => {
  it('constructor: vertices property is set correctly', () => {
    const g = new AdjacencyList(5);
    expect(g.vertices).toBe(5);
  });

  it('constructor: no edges exist initially', () => {
    const g = new AdjacencyList(4);
    expect(g.edgeCount).toBe(0);
    expect(g.hasEdge(0, 1)).toBe(false);
  });

  it('addEdge: hasEdge(u,v) is true after adding directed edge', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(true);
  });

  it('addEdge is directed: hasEdge(v,u) is false when only (u,v) added', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    expect(g.hasEdge(1, 0)).toBe(false);
  });

  it('addUndirectedEdge: hasEdge(u,v) and hasEdge(v,u) both true', () => {
    const g = new AdjacencyList(4);
    g.addUndirectedEdge(2, 3);
    expect(g.hasEdge(2, 3)).toBe(true);
    expect(g.hasEdge(3, 2)).toBe(true);
  });

  it('removeEdge: hasEdge is false after removal', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    g.removeEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(false);
  });

  it('removeEdge: no error when removing non-existent edge', () => {
    const g = new AdjacencyList(4);
    expect(() => g.removeEdge(0, 1)).not.toThrow();
  });

  it('getNeighbors: returns empty array for isolated vertex', () => {
    const g = new AdjacencyList(4);
    expect(g.getNeighbors(0)).toEqual([]);
  });

  it('getNeighbors: returns correct neighbors after addEdge', () => {
    const g = new AdjacencyList(5);
    g.addEdge(1, 2);
    g.addEdge(1, 3);
    g.addEdge(1, 4);
    const neighbors = g.getNeighbors(1).slice().sort((a, b) => a - b);
    expect(neighbors).toEqual([2, 3, 4]);
  });

  it('edgeCount: 0 initially', () => {
    const g = new AdjacencyList(4);
    expect(g.edgeCount).toBe(0);
  });

  it('edgeCount: increments by 1 on addEdge', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    expect(g.edgeCount).toBe(1);
    g.addEdge(1, 2);
    expect(g.edgeCount).toBe(2);
  });

  it('edgeCount: decrements by 1 on removeEdge', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.removeEdge(0, 1);
    expect(g.edgeCount).toBe(1);
  });

  it('edgeCount: undirected edge adds 2', () => {
    const g = new AdjacencyList(4);
    g.addUndirectedEdge(0, 1);
    expect(g.edgeCount).toBe(2);
  });

  it('duplicate edge: adding same directed edge twice does not create duplicate neighbor', () => {
    const g = new AdjacencyList(4);
    g.addEdge(0, 1);
    g.addEdge(0, 1);
    const neighbors = g.getNeighbors(0);
    expect(neighbors.filter((v) => v === 1)).toHaveLength(1);
  });
});

describe('WeightedAdjacencyList', () => {
  it('addEdge with weight: getWeight(u,v) returns correct weight', () => {
    const g = new WeightedAdjacencyList(4);
    g.addEdge(0, 1, 3.5);
    expect(g.getWeight(0, 1)).toBe(3.5);
  });

  it('addUndirectedEdge: both directions have the weight', () => {
    const g = new WeightedAdjacencyList(4);
    g.addUndirectedEdge(1, 2, 7.0);
    expect(g.getWeight(1, 2)).toBe(7.0);
    expect(g.getWeight(2, 1)).toBe(7.0);
  });

  it('getNeighbors: returns {vertex, weight} objects', () => {
    const g = new WeightedAdjacencyList(4);
    g.addEdge(0, 1, 2.0);
    g.addEdge(0, 3, 5.5);
    const neighbors = g.getNeighbors(0).slice().sort((a, b) => a.vertex - b.vertex);
    expect(neighbors).toHaveLength(2);
    expect(neighbors[0]).toEqual({ vertex: 1, weight: 2.0 });
    expect(neighbors[1]).toEqual({ vertex: 3, weight: 5.5 });
  });

  it('getWeight: returns undefined for non-existent edge', () => {
    const g = new WeightedAdjacencyList(4);
    expect(g.getWeight(0, 3)).toBeUndefined();
  });

  it('hasEdge: false when no edge added', () => {
    const g = new WeightedAdjacencyList(4);
    expect(g.hasEdge(0, 1)).toBe(false);
  });

  it('hasEdge: true after addEdge', () => {
    const g = new WeightedAdjacencyList(4);
    g.addEdge(0, 1, 1.0);
    expect(g.hasEdge(0, 1)).toBe(true);
  });

  it('removeEdge: hasEdge false and getWeight undefined after removal', () => {
    const g = new WeightedAdjacencyList(4);
    g.addEdge(0, 1, 4.0);
    g.removeEdge(0, 1);
    expect(g.hasEdge(0, 1)).toBe(false);
    expect(g.getWeight(0, 1)).toBeUndefined();
  });
});
