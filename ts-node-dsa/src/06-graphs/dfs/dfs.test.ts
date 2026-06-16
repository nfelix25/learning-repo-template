import { describe, it, expect } from 'vitest';
import { dfsIterative, dfsRecursive, dfsAllComponents } from './dfs.js';

// Connected graph:
//   0 - 1 - 3
//   |   |
//   2   4
const connectedGraph: number[][] = [
  [1, 2], // 0
  [0, 3, 4], // 1
  [0],    // 2
  [1],    // 3
  [1],    // 4
];

// Disconnected graph: component {0,1,2} and component {3,4}
const disconnectedGraph: number[][] = [
  [1, 2], // 0
  [0, 2], // 1
  [0, 1], // 2
  [4],    // 3
  [3],    // 4
];

// Graph with no edges (3 isolated nodes)
const isolatedGraph: number[][] = [[], [], []];

describe('dfsIterative', () => {
  it('source is visited first', () => {
    const order = dfsIterative(connectedGraph, 0);
    expect(order[0]).toBe(0);
  });

  it('all reachable vertices are visited exactly once', () => {
    const order = dfsIterative(connectedGraph, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
    // Each vertex appears exactly once
    const unique = new Set(order);
    expect(unique.size).toBe(order.length);
  });

  it('order is DFS not BFS: child of first neighbor visited before sibling', () => {
    // In DFS from 0 on connectedGraph, the algorithm goes deep before wide.
    // 1 is a neighbor of 0; 3 and 4 are neighbors of 1.
    // At least one of {3,4} should appear before 2 (the other neighbor of 0),
    // which is the hallmark of depth-first (not breadth-first) traversal.
    const order = dfsIterative(connectedGraph, 0);
    const idx = (v: number) => order.indexOf(v);
    // In BFS, idx(2) would be 2 (level 1). In DFS, we go deep through 1 first.
    // vertex 2's index should NOT be 1 in a proper DFS (that would be BFS level-order).
    // The simplest property: at least one of {3, 4} appears before 2.
    const idx2 = idx(2);
    const idx3 = idx(3);
    const idx4 = idx(4);
    expect(Math.min(idx3, idx4)).toBeLessThan(idx2);
  });

  it('on disconnected graph: only reachable vertices returned', () => {
    const order = dfsIterative(disconnectedGraph, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2]);
    expect(order).not.toContain(3);
    expect(order).not.toContain(4);
  });

  it('single node graph returns [0]', () => {
    expect(dfsIterative([[]], 0)).toEqual([0]);
  });
});

describe('dfsRecursive', () => {
  it('visits the same set of vertices as iterative', () => {
    const iterOrder = dfsIterative(connectedGraph, 0);
    const recOrder = dfsRecursive(connectedGraph, 0);
    expect(recOrder.slice().sort((a, b) => a - b)).toEqual(
      iterOrder.slice().sort((a, b) => a - b),
    );
  });

  it('all reachable vertices visited exactly once', () => {
    const order = dfsRecursive(connectedGraph, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
    const unique = new Set(order);
    expect(unique.size).toBe(order.length);
  });

  it('source is visited first', () => {
    const order = dfsRecursive(connectedGraph, 2);
    expect(order[0]).toBe(2);
  });

  it('on disconnected graph: only reachable vertices returned', () => {
    const order = dfsRecursive(disconnectedGraph, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2]);
  });
});

describe('dfsAllComponents', () => {
  it('returns one array per connected component', () => {
    const components = dfsAllComponents(disconnectedGraph);
    expect(components).toHaveLength(2);
  });

  it('each vertex appears in exactly one component', () => {
    const components = dfsAllComponents(disconnectedGraph);
    const allVertices = components.flat().sort((a, b) => a - b);
    expect(allVertices).toEqual([0, 1, 2, 3, 4]);
  });

  it('total elements across all components equals vertex count', () => {
    const components = dfsAllComponents(connectedGraph);
    const total = components.reduce((sum, c) => sum + c.length, 0);
    expect(total).toBe(connectedGraph.length);
  });

  it('connected graph produces exactly one component with all vertices', () => {
    const components = dfsAllComponents(connectedGraph);
    expect(components).toHaveLength(1);
    expect(components[0]!.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('three isolated nodes returns [[0],[1],[2]] (each node is its own component)', () => {
    const components = dfsAllComponents(isolatedGraph);
    expect(components).toHaveLength(3);
    // Each component is a single node
    const flat = components.map((c) => c[0]!).sort((a, b) => a - b);
    expect(flat).toEqual([0, 1, 2]);
    components.forEach((c) => expect(c).toHaveLength(1));
  });
});
