export interface Item { weight: number; value: number }

// 0/1 knapsack: returns max value
export function knapsack01(items: Item[], capacity: number): number {
  throw new Error('TODO');
}

// Returns the actual items selected by 0/1 knapsack
export function knapsack01Items(items: Item[], capacity: number): Item[] {
  throw new Error('TODO');
}

// Unbounded knapsack: can use each item multiple times
export function knapsackUnbounded(items: Item[], capacity: number): number {
  throw new Error('TODO');
}
