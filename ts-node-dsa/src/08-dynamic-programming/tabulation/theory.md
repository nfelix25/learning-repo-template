# Tabulation (Bottom-Up Dynamic Programming)

## What is Tabulation?

Tabulation is the bottom-up approach to dynamic programming. Instead of starting with the big problem and recursing down, you start from the smallest base cases and fill a table iteratively until you reach the answer.

The table is usually an array (1D or 2D) where `dp[i]` stores the answer to a subproblem of size `i`.

## Contrast with Memoization

| Aspect | Memoization (top-down) | Tabulation (bottom-up) |
|--------|------------------------|------------------------|
| Direction | Start from target, recurse to base | Start from base, iterate to target |
| Recursion | Yes (call stack used) | No (loop-based) |
| Call overhead | Higher (function calls) | Lower (array indexing) |
| Subproblems solved | Only necessary ones | All subproblems in order |
| Stack overflow risk | Yes (for deep recursion) | No |
| Order sensitivity | Handled automatically by recursion | Must be computed in correct order |

For most competitive programming and production code, tabulation is preferred because it avoids call stack issues and is often cache-friendlier.

## Space Optimization: Rolling Arrays

Many DP recurrences only need the last 1 or 2 values of the table, not the entire array:

### Fibonacci — from O(n) to O(1) space
```typescript
// Full table: O(n) space
const dp = new Array(n + 1);
dp[0] = 0; dp[1] = 1;
for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];

// Rolling variables: O(1) space
let prev2 = 0, prev1 = 1;
for (let i = 2; i <= n; i++) {
  const curr = prev1 + prev2;
  prev2 = prev1;
  prev1 = curr;
}
```

### 2D tables — from O(m*n) to O(n) space
When `dp[i][j]` only depends on row `i-1`, keep only two rows and alternate.

## TypeScript Callouts

### `Int32Array` for integer DP tables
```typescript
// Heap-allocated typed array — more cache-friendly than a regular Array
const dp = new Int32Array(n + 1); // initialized to 0
dp[0] = 1;
```

`Int32Array` stores 32-bit integers packed in memory (no boxing), which is faster than `number[]` for integer-only DP because of better CPU cache utilization.

### `Float64Array` for float results
```typescript
const dp = new Float64Array(n + 1); // like C's double[]
```

### 1D vs 2D tables
- **1D**: when each subproblem depends only on a single parameter (e.g., amount in coin change)
- **2D**: when subproblems depend on two parameters (e.g., (i, j) position in a grid, or two string indices in LCS)

```typescript
// 1D
const dp: number[] = new Array(n + 1).fill(0);

// 2D — array of arrays
const dp: number[][] = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
```

## Examples

### Fibonacci — O(1) space tabulation
```
dp[0] = 0
dp[1] = 1
dp[i] = dp[i-1] + dp[i-2]   for i >= 2

Optimized: keep only prev1 and prev2
```

### 0/1 Knapsack — 2D table
```
dp[i][w] = max value using first i items with capacity w

Recurrence:
  dp[i][w] = dp[i-1][w]                          (skip item i)
  dp[i][w] = max(dp[i-1][w],
               dp[i-1][w - weight[i]] + value[i]) (take item i, if weight[i] <= w)

Base case: dp[0][w] = 0 for all w (no items → no value)
```

Space optimization: iterate items in outer loop, weights right-to-left in inner loop using a single 1D array.

## Comparison of Space Complexities

| Problem | Naive table | Optimized |
|---------|------------|-----------|
| Fibonacci | O(n) | O(1) |
| Grid paths | O(rows×cols) | O(cols) |
| Knapsack | O(n×W) | O(W) |
| LCS | O(m×n) | O(min(m,n)) |
| Edit distance | O(m×n) | O(min(m,n)) |
