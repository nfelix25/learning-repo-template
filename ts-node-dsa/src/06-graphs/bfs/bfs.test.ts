import { describe, it, expect } from 'vitest';
import { bfs, bfsShortestPath, bfsDistances } from './bfs.js';

// Graph used in most tests:
//   0 - 1 - 2
//   |       |
//   3       4
//           |
//           5
// graph[v] = neighbors (undirected, so both directions listed)
const graph6: number[][] = [
  [1, 3], // 0
  [0, 2], // 1
  [1, 4], // 2
  [0],    // 3
  [2, 5], // 4
  [4],    // 5
];

// Disconnected: vertices 0-2 form a triangle; vertices 3-4 form an edge
const disconnectedGraph: number[][] = [
  [1, 2], // 0
  [0, 2], // 1
  [0, 1], // 2
  [4],    // 3 (not reachable from 0)
  [3],    // 4 (not reachable from 0)
];

describe('bfs', () => {
  it('visits source first', () => {
    const order = bfs(graph6, 0);
    expect(order[0]).toBe(0);
  });

  it('visits all reachable vertices', () => {
    const order = bfs(graph6, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('visits in BFS (level) order: neighbors of source before their neighbors', () => {
    const order = bfs(graph6, 0);
    // Level 0: 0; Level 1: 1, 3; Level 2: 2; Level 3: 4; Level 4: 5
    const idx = (v: number) => order.indexOf(v);
    // Level-1 vertices (1, 3) appear before level-2 vertex (2)
    expect(idx(1)).toBeLessThan(idx(2));
    expect(idx(3)).toBeLessThan(idx(2));
    // Level-2 (2) before level-3 (4)
    expect(idx(2)).toBeLessThan(idx(4));
    // Level-3 (4) before level-4 (5)
    expect(idx(4)).toBeLessThan(idx(5));
  });

  it('on disconnected graph: unreachable vertices are not in result', () => {
    const order = bfs(disconnectedGraph, 0);
    expect(order.slice().sort((a, b) => a - b)).toEqual([0, 1, 2]);
    expect(order).not.toContain(3);
    expect(order).not.toContain(4);
  });

  it('on single node graph: returns [source]', () => {
    const single: number[][] = [[]];
    expect(bfs(single, 0)).toEqual([0]);
  });
});

describe('bfsShortestPath', () => {
  it('returns [source] when source === target', () => {
    expect(bfsShortestPath(graph6, 2, 2)).toEqual([2]);
  });

  it('returns correct path from source to target', () => {
    const path = bfsShortestPath(graph6, 0, 5);
    expect(path).not.toBeNull();
    // Shortest path: 0 → 1 → 2 → 4 → 5 (length 5) or equivalent
    expect(path![0]).toBe(0);
    expect(path![path!.length - 1]).toBe(5);
  });

  it('path forms a valid chain: each consecutive pair is connected', () => {
    const path = bfsShortestPath(graph6, 0, 5);
    expect(path).not.toBeNull();
    for (let i = 0; i < path!.length - 1; i++) {
      const u = path![i]!;
      const v = path![i + 1]!;
      expect(graph6[u]).toContain(v);
    }
  });

  it('path has minimal number of edges', () => {
    const path = bfsShortestPath(graph6, 0, 5);
    expect(path).not.toBeNull();
    // Shortest path has 4 edges → 5 vertices
    expect(path!.length - 1).toBe(4);
  });

  it('returns null when target is unreachable', () => {
    const result = bfsShortestPath(disconnectedGraph, 0, 3);
    expect(result).toBeNull();
  });
});

describe('bfsDistances', () => {
  it('source has distance 0', () => {
    const distances = bfsDistances(graph6, 0);
    expect(distances[0]).toBe(0);
  });

  it('adjacent vertices have distance 1', () => {
    const distances = bfsDistances(graph6, 0);
    expect(distances[1]).toBe(1);
    expect(distances[3]).toBe(1);
  });

  it('distance-2 vertex (vertex 2) is correct', () => {
    const distances = bfsDistances(graph6, 0);
    // Path: 0 → 1 → 2, so dist[2] = 2
    expect(distances[2]).toBe(2);
  });

  it('distance-3 vertex (vertex 4) is correct', () => {
    const distances = bfsDistances(graph6, 0);
    // Path: 0 → 1 → 2 → 4, so dist[4] = 3
    expect(distances[4]).toBe(3);
  });

  it('distance-4 vertex (vertex 5) is correct', () => {
    const distances = bfsDistances(graph6, 0);
    // Path: 0 → 1 → 2 → 4 → 5, so dist[5] = 4
    expect(distances[5]).toBe(4);
  });

  it('unreachable vertices have Infinity', () => {
    const distances = bfsDistances(disconnectedGraph, 0);
    expect(distances[3]).toBe(Infinity);
    expect(distances[4]).toBe(Infinity);
  });
});
