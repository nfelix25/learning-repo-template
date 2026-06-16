import { describe, it, expect } from 'vitest';
import {
  hasUndirectedCycle,
  hasDirectedCycle,
  findCycleVertices,
} from './cycle-detection.js';

// ---- Undirected graphs ----

// Acyclic tree: 0-1, 1-2, 1-3 (star from 1)
const acyclicTree: number[][] = [
  [1],     // 0
  [0, 2, 3], // 1
  [1],     // 2
  [1],     // 3
];

// Triangle: 0-1-2-0
const triangle: number[][] = [
  [1, 2], // 0
  [0, 2], // 1
  [0, 1], // 2
];

// Disconnected: {0,1,2} form a tree; {3,4,5} form a triangle
const disconnectedWithCycle: number[][] = [
  [1],       // 0
  [0, 2],    // 1
  [1],       // 2
  [4, 5],    // 3
  [3, 5],    // 4
  [3, 4],    // 5
];

// Single node, no self-loop
const singleNode: number[][] = [[]];

// ---- Directed graphs ----

// DAG: 0 → 1 → 3, 0 → 2 → 3
const dag: number[][] = [
  [1, 2], // 0
  [3],    // 1
  [3],    // 2
  [],     // 3
];

// Directed cycle: 0 → 1 → 2 → 0
const directedCycle: number[][] = [
  [1], // 0
  [2], // 1
  [0], // 2
];

// Self-loop: 0 → 0
const selfLoop: number[][] = [
  [0], // 0
];

// Chain with one cycle embedded: 0 → 1 → 2 → 3 → 1 (cycle at 1-2-3)
const chainWithCycle: number[][] = [
  [1], // 0
  [2], // 1
  [3], // 2
  [1], // 3 → back to 1
];

describe('hasUndirectedCycle', () => {
  it('acyclic tree returns false', () => {
    expect(hasUndirectedCycle(acyclicTree)).toBe(false);
  });

  it('triangle returns true', () => {
    expect(hasUndirectedCycle(triangle)).toBe(true);
  });

  it('disconnected graph with one cyclic component returns true', () => {
    expect(hasUndirectedCycle(disconnectedWithCycle)).toBe(true);
  });

  it('single node returns false', () => {
    expect(hasUndirectedCycle(singleNode)).toBe(false);
  });
});

describe('hasDirectedCycle', () => {
  it('DAG returns false', () => {
    expect(hasDirectedCycle(dag)).toBe(false);
  });

  it('directed cycle (0→1→2→0) returns true', () => {
    expect(hasDirectedCycle(directedCycle)).toBe(true);
  });

  it('single node with self-loop returns true', () => {
    expect(hasDirectedCycle(selfLoop)).toBe(true);
  });

  it('chain with embedded cycle returns true', () => {
    expect(hasDirectedCycle(chainWithCycle)).toBe(true);
  });
});

describe('findCycleVertices', () => {
  it('returns null for a DAG', () => {
    expect(findCycleVertices(dag)).toBeNull();
  });

  it('returns a non-empty array for a cyclic directed graph', () => {
    const cycle = findCycleVertices(directedCycle);
    expect(cycle).not.toBeNull();
    expect(cycle!.length).toBeGreaterThan(0);
  });

  it('returned vertices form a valid directed cycle', () => {
    const cycle = findCycleVertices(directedCycle);
    expect(cycle).not.toBeNull();
    const verts = cycle!;
    // Each consecutive pair must be a valid directed edge;
    // the last vertex must connect back to the first.
    for (let i = 0; i < verts.length; i++) {
      const u = verts[i]!;
      const v = verts[(i + 1) % verts.length]!;
      expect(directedCycle[u]).toContain(v);
    }
  });

  it('returned cycle for chainWithCycle forms a valid directed loop', () => {
    const cycle = findCycleVertices(chainWithCycle);
    expect(cycle).not.toBeNull();
    const verts = cycle!;
    for (let i = 0; i < verts.length; i++) {
      const u = verts[i]!;
      const v = verts[(i + 1) % verts.length]!;
      expect(chainWithCycle[u]).toContain(v);
    }
  });

  it('self-loop returns a cycle containing just that vertex', () => {
    const cycle = findCycleVertices(selfLoop);
    expect(cycle).not.toBeNull();
    expect(cycle).toContain(0);
  });
});
