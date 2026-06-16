import { describe, it, expect, beforeEach } from 'vitest';
import { kruskal, prim, mstWeight, type Edge } from './mst.js';

// Helpers
function buildAdj(vertices: number, edges: Edge[]): Array<Edge[]> {
  const adj: Array<Edge[]> = Array.from({ length: vertices }, () => []);
  for (const e of edges) {
    adj[e.u]!.push(e);
    adj[e.v]!.push({ u: e.v, v: e.u, weight: e.weight });
  }
  return adj;
}

function totalWeight(edges: Edge[]): number {
  return edges.reduce((s, e) => s + e.weight, 0);
}

function coveredVertices(edges: Edge[]): Set<number> {
  const s = new Set<number>();
  for (const e of edges) { s.add(e.u); s.add(e.v); }
  return s;
}

// Graph used in most tests (4 vertices):
//   0-1: 4,  0-2: 3,  1-2: 1,  0-3: 5
// MST: 1-2(1) + 0-2(3) + 0-3(5) = weight 9
const V4 = 4;
const edges4: Edge[] = [
  { u: 0, v: 1, weight: 4 },
  { u: 0, v: 2, weight: 3 },
  { u: 1, v: 2, weight: 1 },
  { u: 0, v: 3, weight: 5 },
];
const MST_WEIGHT_4 = 9;

describe('kruskal', () => {
  it('returns V-1 edges for a connected graph', () => {
    const mst = kruskal(V4, edges4);
    expect(mst).toHaveLength(V4 - 1);
  });

  it('produces the minimum total weight', () => {
    const mst = kruskal(V4, edges4);
    expect(totalWeight(mst)).toBe(MST_WEIGHT_4);
  });

  it('triangle graph: picks the 2 cheapest edges', () => {
    // Triangle: 0-1(10), 0-2(6), 1-2(5)
    const tri: Edge[] = [
      { u: 0, v: 1, weight: 10 },
      { u: 0, v: 2, weight: 6 },
      { u: 1, v: 2, weight: 5 },
    ];
    const mst = kruskal(3, tri);
    expect(mst).toHaveLength(2);
    expect(totalWeight(mst)).toBe(11); // 5 + 6
  });

  it('returns MST edges that span all vertices', () => {
    const mst = kruskal(V4, edges4);
    const verts = coveredVertices(mst);
    // All 4 vertices must appear in V-1 edges of a connected MST
    expect(verts.size).toBe(V4);
  });

  it('handles a disconnected graph (returns MSF with < V-1 edges)', () => {
    // Two isolated components: {0,1} and {2,3}; no edges between components
    const disconnected: Edge[] = [
      { u: 0, v: 1, weight: 2 },
      { u: 2, v: 3, weight: 4 },
    ];
    const msf = kruskal(4, disconnected);
    // MSF = both edges (one tree per component); total 2 edges < V-1=3
    expect(msf).toHaveLength(2);
    expect(totalWeight(msf)).toBe(6);
  });
});

describe('prim', () => {
  it('produces the same total weight as kruskal for a connected graph', () => {
    const adj = buildAdj(V4, edges4);
    const mst = prim(V4, adj, 0);
    expect(totalWeight(mst)).toBe(MST_WEIGHT_4);
  });

  it('returns V-1 edges for a connected graph', () => {
    const adj = buildAdj(V4, edges4);
    const mst = prim(V4, adj, 0);
    expect(mst).toHaveLength(V4 - 1);
  });

  it('different source vertex gives same total MST weight', () => {
    const adj = buildAdj(V4, edges4);
    const mst2 = prim(V4, adj, 2);
    expect(totalWeight(mst2)).toBe(MST_WEIGHT_4);
  });

  it('all vertices are covered', () => {
    const adj = buildAdj(V4, edges4);
    const mst = prim(V4, adj, 0);
    const verts = coveredVertices(mst);
    expect(verts.size).toBe(V4);
  });

  it('handles disconnected graph (returns MSF)', () => {
    const disconnected: Edge[] = [
      { u: 0, v: 1, weight: 2 },
      { u: 2, v: 3, weight: 4 },
    ];
    const adj = buildAdj(4, disconnected);
    const msf = prim(4, adj, 0);
    expect(msf).toHaveLength(2);
    expect(totalWeight(msf)).toBe(6);
  });
});

describe('mstWeight', () => {
  it('correctly sums edge weights', () => {
    const edges: Edge[] = [
      { u: 0, v: 1, weight: 3 },
      { u: 1, v: 2, weight: 5 },
      { u: 2, v: 3, weight: 2 },
    ];
    expect(mstWeight(edges)).toBe(10);
  });

  it('returns 0 for empty edge list', () => {
    expect(mstWeight([])).toBe(0);
  });

  it('returns the single edge weight for one-edge list', () => {
    expect(mstWeight([{ u: 0, v: 1, weight: 7 }])).toBe(7);
  });
});
