import { describe, it, expect } from 'vitest';
import {
  topologicalSortDFS,
  topologicalSortKahn,
} from './topological-sort.js';

// DAG used in the theory.md example:
// 5 → 0, 5 → 2, 4 → 0, 4 → 1, 2 → 3
// Vertices: 0, 1, 2, 3, 4, 5
const dag6: number[][] = [
  [],     // 0: no outgoing edges
  [],     // 1: no outgoing edges
  [3],    // 2 → 3
  [],     // 3: no outgoing edges
  [0, 1], // 4 → 0, 4 → 1
  [0, 2], // 5 → 0, 5 → 2
];

// Graph with a cycle: 0 → 1 → 2 → 0
const cyclicGraph: number[][] = [
  [1], // 0 → 1
  [2], // 1 → 2
  [0], // 2 → 0
];

// Linear chain: 0 → 1 → 2 → 3
const chainGraph: number[][] = [
  [1], // 0
  [2], // 1
  [3], // 2
  [],  // 3
];

/** Verifies a topological order by checking that for every edge u→v, u appears before v. */
function isValidTopologicalOrder(order: number[], graph: number[][]): boolean {
  const pos = new Map<number, number>();
  for (let i = 0; i < order.length; i++) {
    pos.set(order[i]!, i);
  }
  for (let u = 0; u < graph.length; u++) {
    for (const v of graph[u] ?? []) {
      const uPos = pos.get(u);
      const vPos = pos.get(v);
      if (uPos === undefined || vPos === undefined) return false;
      if (uPos >= vPos) return false;
    }
  }
  return true;
}

describe('topologicalSortDFS', () => {
  it('returns a valid topological order for the example DAG', () => {
    const order = topologicalSortDFS(dag6);
    expect(order).not.toBeNull();
    expect(isValidTopologicalOrder(order!, dag6)).toBe(true);
  });

  it('result contains all vertices', () => {
    const order = topologicalSortDFS(dag6);
    expect(order).not.toBeNull();
    expect(order!.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('returns null when graph has a cycle', () => {
    expect(topologicalSortDFS(cyclicGraph)).toBeNull();
  });

  it('returns [] for empty graph (0 vertices)', () => {
    expect(topologicalSortDFS([])).toEqual([]);
  });

  it('returns [0] for single vertex', () => {
    expect(topologicalSortDFS([[]])).toEqual([0]);
  });

  it('linear chain returns valid order (must be [0,1,2,3])', () => {
    const order = topologicalSortDFS(chainGraph);
    expect(order).not.toBeNull();
    expect(order).toEqual([0, 1, 2, 3]);
  });
});

describe('topologicalSortKahn', () => {
  it('returns a valid topological order for the example DAG', () => {
    const order = topologicalSortKahn(dag6);
    expect(order).not.toBeNull();
    expect(isValidTopologicalOrder(order!, dag6)).toBe(true);
  });

  it('result contains all vertices', () => {
    const order = topologicalSortKahn(dag6);
    expect(order).not.toBeNull();
    expect(order!.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('returns null when graph has a cycle', () => {
    expect(topologicalSortKahn(cyclicGraph)).toBeNull();
  });

  it('returns [] for empty graph (0 vertices)', () => {
    expect(topologicalSortKahn([])).toEqual([]);
  });

  it('returns [0] for single vertex', () => {
    expect(topologicalSortKahn([[]])).toEqual([0]);
  });

  it('linear chain returns valid order (must be [0,1,2,3])', () => {
    const order = topologicalSortKahn(chainGraph);
    expect(order).not.toBeNull();
    expect(order).toEqual([0, 1, 2, 3]);
  });
});

describe('both algorithms agree on validity', () => {
  it('both return valid orderings for the same DAG', () => {
    const dfsOrder = topologicalSortDFS(dag6);
    const kahnOrder = topologicalSortKahn(dag6);
    expect(dfsOrder).not.toBeNull();
    expect(kahnOrder).not.toBeNull();
    expect(isValidTopologicalOrder(dfsOrder!, dag6)).toBe(true);
    expect(isValidTopologicalOrder(kahnOrder!, dag6)).toBe(true);
  });

  it('both return null for a cyclic graph', () => {
    expect(topologicalSortDFS(cyclicGraph)).toBeNull();
    expect(topologicalSortKahn(cyclicGraph)).toBeNull();
  });
});
