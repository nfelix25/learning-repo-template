import { describe, it, expect } from 'vitest';
import {
  manhattanDistance,
  euclideanDistance,
  aStar,
  aStarGraph,
  type GridPos,
} from './heuristic-search.js';

// ---------------------------------------------------------------------------
// manhattanDistance
// ---------------------------------------------------------------------------

describe('manhattanDistance', () => {
  it('(0,0) → (3,4) = 7', () => {
    expect(manhattanDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(7);
  });

  it('same position = 0', () => {
    expect(manhattanDistance({ row: 2, col: 5 }, { row: 2, col: 5 })).toBe(0);
  });

  it('is symmetric', () => {
    const a: GridPos = { row: 1, col: 3 };
    const b: GridPos = { row: 4, col: 0 };
    expect(manhattanDistance(a, b)).toBe(manhattanDistance(b, a));
  });

  it('handles negative-offset coordinates', () => {
    expect(manhattanDistance({ row: -1, col: -1 }, { row: 2, col: 3 })).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// euclideanDistance
// ---------------------------------------------------------------------------

describe('euclideanDistance', () => {
  it('(0,0) → (3,4) ≈ 5', () => {
    expect(euclideanDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBeCloseTo(5, 5);
  });

  it('same position = 0', () => {
    expect(euclideanDistance({ row: 7, col: 2 }, { row: 7, col: 2 })).toBe(0);
  });

  it('is symmetric', () => {
    const a: GridPos = { row: 0, col: 0 };
    const b: GridPos = { row: 3, col: 4 };
    expect(euclideanDistance(a, b)).toBeCloseTo(euclideanDistance(b, a), 10);
  });
});

// ---------------------------------------------------------------------------
// aStar (grid)
// ---------------------------------------------------------------------------

describe('aStar', () => {
  // 3×3 open grid (no walls)
  const open3x3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  it('finds a path in a 3×3 grid with no obstacles', () => {
    const path = aStar(open3x3, { row: 0, col: 0 }, { row: 2, col: 2 });
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path!.at(-1)).toEqual({ row: 2, col: 2 });
  });

  it('returns [start] when start === goal', () => {
    const path = aStar(open3x3, { row: 1, col: 1 }, { row: 1, col: 1 });
    expect(path).not.toBeNull();
    expect(path).toHaveLength(1);
    expect(path![0]).toEqual({ row: 1, col: 1 });
  });

  it('path avoids walls', () => {
    // Force path to go around the wall in column 1
    //  S . .
    //  # # .
    //  . . G
    const grid = [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const path = aStar(grid, { row: 0, col: 0 }, { row: 2, col: 2 });
    expect(path).not.toBeNull();
    // No cell in the path should be a wall
    for (const pos of path!) {
      expect(grid[pos.row]![pos.col]).toBe(0);
    }
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path!.at(-1)).toEqual({ row: 2, col: 2 });
  });

  it('returns null when goal is completely blocked', () => {
    // Goal (2,2) is surrounded by walls on all sides it can be reached from
    const grid = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0], // goal is (2,2) but wall separates it
    ];
    // Start at (0,0), goal at (2,2): only route is through walls
    const path = aStar(grid, { row: 0, col: 0 }, { row: 2, col: 2 });
    expect(path).toBeNull();
  });

  it('path length is optimal (matches BFS for unweighted grid)', () => {
    // Open 5×5 grid — optimal path from (0,0) to (4,4) = 8 steps = 9 cells
    const grid5 = Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]);
    const path = aStar(grid5, { row: 0, col: 0 }, { row: 4, col: 4 });
    expect(path).not.toBeNull();
    // Optimal path length (Manhattan distance + 1 for inclusive endpoints)
    expect(path!.length).toBe(9); // 8 moves = 9 cells
  });

  it('works with a custom heuristic (Euclidean)', () => {
    const path = aStar(
      open3x3,
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      (a, b) => Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2),
    );
    expect(path).not.toBeNull();
    expect(path!.at(-1)).toEqual({ row: 2, col: 2 });
  });
});

// ---------------------------------------------------------------------------
// aStarGraph
// ---------------------------------------------------------------------------

describe('aStarGraph', () => {
  // Directed graph:
  //   0 → 1 (1), 0 → 3 (4)
  //   1 → 2 (2), 1 → 3 (1)
  //   2 → 4 (1)
  //   3 → 4 (3)
  // Shortest 0→4: 0→1→2→4 (cost 4)
  // True shortest distances to vertex 4 (admissible & consistent heuristic):
  //   h[0]=4, h[1]=3, h[2]=1, h[3]=3, h[4]=0
  const adj = [
    [{ to: 1, weight: 1 }, { to: 3, weight: 4 }],   // 0
    [{ to: 2, weight: 2 }, { to: 3, weight: 1 }],   // 1
    [{ to: 4, weight: 1 }],                          // 2
    [{ to: 4, weight: 3 }],                          // 3
    [],                                              // 4
  ];
  const h = [4, 3, 1, 3, 0]; // admissible heuristic (true shortest distances to target)

  it('finds the shortest path', () => {
    const result = aStarGraph(adj, 0, 4, h);
    expect(result).not.toBeNull();
    expect(result!.path[0]).toBe(0);
    expect(result!.path.at(-1)).toBe(4);
  });

  it('cost is correct (optimal path 0→1→2→4 = 4)', () => {
    const result = aStarGraph(adj, 0, 4, h);
    expect(result).not.toBeNull();
    expect(result!.cost).toBe(4);
  });

  it('returns null when target is unreachable', () => {
    // Add isolated vertex 5 with no incoming edges
    const adjWithIsolated = [...adj, []];
    const hExtended = [...h, 0];
    const result = aStarGraph(adjWithIsolated, 0, 5, hExtended);
    expect(result).toBeNull();
  });

  it('returns single-vertex path when source === target', () => {
    const result = aStarGraph(adj, 2, 2, h);
    expect(result).not.toBeNull();
    expect(result!.path).toEqual([2]);
    expect(result!.cost).toBe(0);
  });
});
