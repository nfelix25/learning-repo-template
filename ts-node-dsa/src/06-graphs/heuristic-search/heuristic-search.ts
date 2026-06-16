export interface GridPos {
  row: number;
  col: number;
}

/**
 * Manhattan distance — admissible heuristic for 4-directional grid movement.
 */
export function manhattanDistance(a: GridPos, b: GridPos): number {
  throw new Error('TODO');
}

/**
 * Euclidean distance — admissible heuristic when diagonal movement is allowed.
 */
export function euclideanDistance(a: GridPos, b: GridPos): number {
  throw new Error('TODO');
}

/**
 * A* pathfinding on a 2-D grid.
 *
 * grid[row][col] === 0 means passable, === 1 means wall.
 * Movement is 4-directional (up/down/left/right), each step costs 1.
 *
 * @param grid      - 2-D array of 0 (passable) or 1 (wall)
 * @param start     - starting cell
 * @param goal      - goal cell
 * @param heuristic - distance heuristic (default: manhattanDistance)
 * @returns array of GridPos from start to goal (inclusive), or null if unreachable
 */
export function aStar(
  grid: number[][],
  start: GridPos,
  goal: GridPos,
  heuristic?: (a: GridPos, b: GridPos) => number,
): GridPos[] | null {
  throw new Error('TODO');
}

/**
 * Graph-based A*.
 *
 * adj[v] = list of { to, weight } outgoing edges from v.
 * h[v]   = heuristic estimate from v to target (must be admissible).
 *
 * @returns { path, cost } or null if target is unreachable
 */
export function aStarGraph(
  adj: Array<Array<{ to: number; weight: number }>>,
  source: number,
  target: number,
  h: number[],
): { path: number[]; cost: number } | null {
  throw new Error('TODO');
}
