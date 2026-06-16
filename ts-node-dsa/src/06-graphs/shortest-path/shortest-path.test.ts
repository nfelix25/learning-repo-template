import { describe, it, expect } from 'vitest';
import {
  dijkstra,
  dijkstraPath,
  bellmanFord,
  type WeightedEdge,
} from './shortest-path.js';

// ---------------------------------------------------------------------------
// Test graph helpers
// ---------------------------------------------------------------------------

/**
 * Builds a directed adjacency list from a simple edge description.
 * edges: [from, to, weight]
 */
function buildAdj(v: number, edges: [number, number, number][]): Array<WeightedEdge[]> {
  const adj: Array<WeightedEdge[]> = Array.from({ length: v }, () => []);
  for (const [u, to, weight] of edges) {
    adj[u]!.push({ to, weight });
  }
  return adj;
}

// ---------------------------------------------------------------------------
// Graph used in most tests (5 vertices, directed):
//   0→1 (2), 0→2 (6), 1→3 (5), 2→3 (8), 2→4 (9), 3→4 (1), 1→4 (3)
// Shortest from 0: [0, 2, 6, 7, 5]
//   0→0: 0
//   0→1: 2
//   0→2: 6
//   0→3: 2+5=7
//   0→4: 2+3=5  (via 0→1→4)
// ---------------------------------------------------------------------------
const V = 5;
const graphEdges: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 6],
  [1, 3, 5],
  [1, 4, 3],
  [2, 3, 8],
  [2, 4, 9],
  [3, 4, 1],
];
const expectedDist = [0, 2, 6, 7, 5];

describe('dijkstra', () => {
  it('dist[source] === 0', () => {
    const adj = buildAdj(V, graphEdges);
    const dist = dijkstra(adj, 0);
    expect(dist[0]).toBe(0);
  });

  it('returns correct distances for a simple directed graph', () => {
    const adj = buildAdj(V, graphEdges);
    const dist = dijkstra(adj, 0);
    expect(dist).toEqual(expectedDist);
  });

  it('returns Infinity for unreachable vertices', () => {
    // Source is vertex 1; vertex 0 has no incoming edges → unreachable
    const adj = buildAdj(V, graphEdges);
    const dist = dijkstra(adj, 1);
    expect(dist[0]).toBe(Infinity);
  });

  it('single vertex graph → dist[0] === 0', () => {
    const adj: Array<WeightedEdge[]> = [[]];
    const dist = dijkstra(adj, 0);
    expect(dist[0]).toBe(0);
  });
});

describe('dijkstraPath', () => {
  it('returns null when target is unreachable', () => {
    const adj = buildAdj(V, graphEdges);
    // vertex 0 is unreachable from vertex 1
    expect(dijkstraPath(adj, 1, 0)).toBeNull();
  });

  it('path starts with source and ends with target', () => {
    const adj = buildAdj(V, graphEdges);
    const result = dijkstraPath(adj, 0, 4);
    expect(result).not.toBeNull();
    expect(result!.path[0]).toBe(0);
    expect(result!.path.at(-1)).toBe(4);
  });

  it('dist matches total weight along the returned path', () => {
    const adj = buildAdj(V, graphEdges);
    const result = dijkstraPath(adj, 0, 4);
    expect(result).not.toBeNull();
    // Recompute weight along path
    const path = result!.path;
    let computed = 0;
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      const edge = adj[u]!.find(e => e.to === v);
      expect(edge).toBeDefined();
      computed += edge!.weight;
    }
    expect(result!.dist).toBe(computed);
  });

  it('returns [source] when source === target', () => {
    const adj = buildAdj(V, graphEdges);
    const result = dijkstraPath(adj, 2, 2);
    expect(result).not.toBeNull();
    expect(result!.path).toEqual([2]);
    expect(result!.dist).toBe(0);
  });
});

describe('bellmanFord', () => {
  it('dist[source] === 0', () => {
    const edges = graphEdges.map(([u, to, w]) => ({ u, v: to, weight: w }));
    const dist = bellmanFord(V, edges, 0);
    expect(dist).not.toBeNull();
    expect(dist![0]).toBe(0);
  });

  it('returns the same distances as Dijkstra for non-negative weights', () => {
    const edges = graphEdges.map(([u, to, w]) => ({ u, v: to, weight: w }));
    const dist = bellmanFord(V, edges, 0);
    expect(dist).not.toBeNull();
    expect(dist).toEqual(expectedDist);
  });

  it('handles negative-weight edges (no negative cycle)', () => {
    // 0→1 (5), 0→2 (7), 1→2 (-3)
    // Shortest 0→2: 5 + (-3) = 2
    const edges = [
      { u: 0, v: 1, weight: 5 },
      { u: 0, v: 2, weight: 7 },
      { u: 1, v: 2, weight: -3 },
    ];
    const dist = bellmanFord(3, edges, 0);
    expect(dist).not.toBeNull();
    expect(dist![0]).toBe(0);
    expect(dist![1]).toBe(5);
    expect(dist![2]).toBe(2);
  });

  it('returns null when a negative cycle is present', () => {
    // 0→1 (1), 1→2 (-4), 2→1 (2)  — cycle 1→2→1 has weight -2 (negative)
    const edges = [
      { u: 0, v: 1, weight: 1 },
      { u: 1, v: 2, weight: -4 },
      { u: 2, v: 1, weight: 2 },
    ];
    const result = bellmanFord(3, edges, 0);
    expect(result).toBeNull();
  });

  it('returns Infinity for vertices unreachable from source', () => {
    const edges = graphEdges.map(([u, to, w]) => ({ u, v: to, weight: w }));
    // source=1, vertex 0 is unreachable
    const dist = bellmanFord(V, edges, 1);
    expect(dist).not.toBeNull();
    expect(dist![0]).toBe(Infinity);
  });
});
