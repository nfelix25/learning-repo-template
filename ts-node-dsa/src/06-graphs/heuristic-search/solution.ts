/**
 * A* (heuristic search) solution — grid A* + graph A*.
 * Fully self-contained; no imports from heuristic-search.ts.
 */

export interface GridPos {
  row: number;
  col: number;
}

// ---------------------------------------------------------------------------
// Heuristics
// ---------------------------------------------------------------------------

export function manhattanDistance(a: GridPos, b: GridPos): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclideanDistance(a: GridPos, b: GridPos): number {
  return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
}

// ---------------------------------------------------------------------------
// Inline binary min-heap keyed by f-score
// ---------------------------------------------------------------------------

interface HeapItem {
  f: number;
  g: number; // g-score at insertion time (used for stale-entry detection)
  id: number; // encoded position (row*cols+col) or vertex index
}

class MinHeap {
  private items: HeapItem[] = [];

  get size(): number { return this.items.length; }

  push(item: HeapItem): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  pop(): HeapItem | undefined {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last !== undefined) {
      this.items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.items[p]!.f <= this.items[i]!.f) break;
      [this.items[p], this.items[i]] = [this.items[i]!, this.items[p]!];
      i = p;
    }
  }

  private siftDown(i: number): void {
    const n = this.items.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.items[l]!.f < this.items[s]!.f) s = l;
      if (r < n && this.items[r]!.f < this.items[s]!.f) s = r;
      if (s === i) break;
      [this.items[i], this.items[s]] = [this.items[s]!, this.items[i]!];
      i = s;
    }
  }
}

// ---------------------------------------------------------------------------
// Grid A*
// ---------------------------------------------------------------------------

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function aStar(
  grid: number[][],
  start: GridPos,
  goal: GridPos,
  heuristic: (a: GridPos, b: GridPos) => number = manhattanDistance,
): GridPos[] | null {
  const rows = grid.length;
  const cols = rows > 0 ? (grid[0]?.length ?? 0) : 0;

  const encode = (pos: GridPos): number => pos.row * cols + pos.col;

  // Early exit: start === goal
  if (start.row === goal.row && start.col === goal.col) {
    return [{ ...start }];
  }

  const gScore = new Map<number, number>();
  const prev = new Map<number, number>(); // encoded id → encoded id
  const closed = new Set<number>();

  const startId = encode(start);
  gScore.set(startId, 0);

  const open = new MinHeap();
  open.push({ f: heuristic(start, goal), g: 0, id: startId });

  while (open.size > 0) {
    const { id: curId, g: poppedG } = open.pop()!;

    // Stale-entry detection
    if (poppedG > (gScore.get(curId) ?? Infinity)) continue;
    if (closed.has(curId)) continue;
    closed.add(curId);

    const curRow = Math.floor(curId / cols);
    const curCol = curId % cols;

    if (curRow === goal.row && curCol === goal.col) {
      // Reconstruct path
      const path: GridPos[] = [];
      let id: number | undefined = curId;
      while (id !== undefined) {
        path.push({ row: Math.floor(id / cols), col: id % cols });
        id = prev.get(id);
      }
      path.reverse();
      return path;
    }

    const curG = gScore.get(curId) ?? Infinity;

    for (const [dr, dc] of DIRS) {
      const nr = curRow + dr;
      const nc = curCol + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if ((grid[nr]?.[nc] ?? 1) === 1) continue; // wall or out-of-bounds

      const nId = nr * cols + nc;
      if (closed.has(nId)) continue;

      const tentativeG = curG + 1; // uniform step cost
      if (tentativeG < (gScore.get(nId) ?? Infinity)) {
        gScore.set(nId, tentativeG);
        prev.set(nId, curId);
        const nPos: GridPos = { row: nr, col: nc };
        open.push({ f: tentativeG + heuristic(nPos, goal), g: tentativeG, id: nId });
      }
    }
  }

  return null; // unreachable
}

// ---------------------------------------------------------------------------
// Graph A*
// ---------------------------------------------------------------------------

export function aStarGraph(
  adj: Array<Array<{ to: number; weight: number }>>,
  source: number,
  target: number,
  h: number[],
): { path: number[]; cost: number } | null {
  // Early exit: source === target
  if (source === target) return { path: [source], cost: 0 };

  const n = adj.length;
  const g = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);

  g[source] = 0;
  const open = new MinHeap();
  open.push({ f: (h[source] ?? 0), g: 0, id: source });

  while (open.size > 0) {
    const { id: u, g: poppedG } = open.pop()!;

    // Stale-entry detection: if the g-score at push time is no longer optimal, skip
    if (poppedG > g[u]!) continue;

    if (u === target) {
      // Reconstruct path using the best g-score
      const path: number[] = [];
      let v = target;
      while (v !== -1) {
        path.push(v);
        v = prev[v]!;
      }
      path.reverse();
      return { path, cost: g[target]! };
    }

    for (const edge of adj[u] ?? []) {
      const tentG = g[u]! + edge.weight;
      if (tentG < g[edge.to]!) {
        g[edge.to] = tentG;
        prev[edge.to] = u;
        open.push({ f: tentG + (h[edge.to] ?? 0), g: tentG, id: edge.to });
      }
    }
  }

  return null; // unreachable
}
