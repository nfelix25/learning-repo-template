// Knapsack — full working implementation

export interface Item { weight: number; value: number }

// 0/1 knapsack: returns max value — O(n*W) time, O(n*W) space (full table for backtracking)
export function knapsack01(items: Item[], capacity: number): number {
  const n = items.length;
  // dp[i][w] = max value using first i items with capacity w
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      dp[i]![w] = dp[i - 1]![w]!; // skip item
      if (item.weight <= w) {
        dp[i]![w] = Math.max(dp[i]![w]!, dp[i - 1]![w - item.weight]! + item.value);
      }
    }
  }

  return dp[n]![capacity]!;
}

// Returns the actual items selected by 0/1 knapsack via backtracking
export function knapsack01Items(items: Item[], capacity: number): Item[] {
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      dp[i]![w] = dp[i - 1]![w]!;
      if (item.weight <= w) {
        dp[i]![w] = Math.max(dp[i]![w]!, dp[i - 1]![w - item.weight]! + item.value);
      }
    }
  }

  // Backtrack to find selected items
  const selected: Item[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i]![w] !== dp[i - 1]![w]) {
      const item = items[i - 1]!;
      selected.push(item);
      w -= item.weight;
    }
  }

  return selected;
}

// Unbounded knapsack: each item can be used multiple times — O(n*W) time, O(W) space
export function knapsackUnbounded(items: Item[], capacity: number): number {
  const dp = new Array<number>(capacity + 1).fill(0);

  for (let w = 1; w <= capacity; w++) {
    for (const item of items) {
      if (item.weight <= w) {
        dp[w] = Math.max(dp[w]!, dp[w - item.weight]! + item.value);
      }
    }
  }

  return dp[capacity]!;
}
