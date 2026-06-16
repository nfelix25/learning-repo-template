// Tabulation — full working implementation

// Fibonacci, bottom-up O(n) time O(1) space
export function fibTab(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let prev2 = 0;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// Count paths from (0,0) to (rows-1, cols-1) moving only right or down
// Each cell can be reached from the cell above or the cell to the left.
export function gridPaths(rows: number, cols: number): number {
  // Use a single row and update in place (space optimized)
  const dp = new Array<number>(cols).fill(1);

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      // dp[c] currently holds value from row above; dp[c-1] is the value to the left
      dp[c] = dp[c]! + dp[c - 1]!;
    }
  }

  return dp[cols - 1]!;
}

// Max sum of non-adjacent elements
export function houseRobber(houses: number[]): number {
  if (houses.length === 0) return 0;
  if (houses.length === 1) return houses[0]!;

  let prev2 = 0;             // best result two positions back
  let prev1 = houses[0]!;    // best result at previous position

  for (let i = 1; i < houses.length; i++) {
    const curr = Math.max(prev1, prev2 + houses[i]!);
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// Min cost to reach top of stairs; from step i can climb 1 or 2 steps
// The top is just past the last index (index cost.length).
export function minCostClimbing(cost: number[]): number {
  const n = cost.length;
  if (n === 0) return 0;
  if (n === 1) return cost[0]!;

  // dp[i] = minimum cost to reach step i
  let prev2 = cost[0]!;  // cost to reach step 0
  let prev1 = cost[1]!;  // cost to reach step 1

  for (let i = 2; i < n; i++) {
    const curr = cost[i]! + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = curr;
  }

  // Top of stairs is reached from either last or second-to-last step
  return Math.min(prev1, prev2);
}
