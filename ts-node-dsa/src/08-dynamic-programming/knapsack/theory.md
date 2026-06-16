# Knapsack Problems

## The Knapsack Family

Knapsack problems involve selecting items with weights and values to maximize total value without exceeding a capacity. The variant determines whether items can be repeated and whether fractions are allowed.

## 0/1 Knapsack

Each item can be **taken at most once** (0 = skip, 1 = take). This is the classic DP variant.

### DP Table

`dp[i][w]` = maximum value achievable using the **first i items** with a knapsack of **capacity w**.

```
Items:  [{weight:2, value:6}, {weight:2, value:10}, {weight:3, value:12}]
Capacity: 5

     w=0  w=1  w=2  w=3  w=4  w=5
i=0   0    0    0    0    0    0
i=1   0    0    6    6    6    6     ← item 1 (w=2,v=6)
i=2   0    0   10   10   16   16    ← item 2 (w=2,v=10)
i=3   0    0   10   12   16   22    ← item 3 (w=3,v=12)

Answer: dp[3][5] = 22  (items 2 and 3: value 10+12=22, weight 2+3=5)
```

### Recurrence

```
dp[i][w] = dp[i-1][w]                          // skip item i

if weight[i] <= w:
  dp[i][w] = max(dp[i-1][w],
                 dp[i-1][w - weight[i]] + value[i])  // take item i
```

Base case: `dp[0][w] = 0` for all w (no items → no value).

### Space Optimization: 1D dp Iterated Right-to-Left

Since row i only depends on row i-1, we can use a single array:

```typescript
const dp = new Int32Array(capacity + 1); // initialized to 0

for (const item of items) {
  // MUST iterate right-to-left to avoid using an item twice
  for (let w = capacity; w >= item.weight; w--) {
    dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
  }
}
```

The right-to-left iteration ensures that when we update `dp[w]`, `dp[w - item.weight]` still reflects the state before considering this item.

## Fractional Knapsack

You can take **fractions** of items. This is NOT a DP problem — it has a greedy solution:

1. Sort items by **value/weight ratio** descending
2. Take as much of the highest-ratio item as possible, then the next, and so on

Greedy works here because taking a fraction of an item never hurts — partial items are always beneficial.

## Unbounded Knapsack

Each item can be taken **unlimited times**. The key change from 0/1: iterate weights left-to-right (or equivalently, allow `dp[i][w - weight[i]]` instead of `dp[i-1][w - weight[i]]`).

```typescript
const dp = new Int32Array(capacity + 1);

for (let w = 1; w <= capacity; w++) {
  for (const item of items) {
    if (item.weight <= w) {
      dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
    }
  }
}
```

Left-to-right ensures the same item can be "picked again" for the same weight computation.

## TypeScript Callouts

### Item type
```typescript
interface Item {
  weight: number;
  value: number;
}
```

### Int32Array for integer DP
```typescript
const dp = new Int32Array(capacity + 1); // zeros by default, 32-bit integers
```

Advantages over `number[]`:
- Packed memory layout (no JS object overhead per element)
- Better CPU cache utilization for large tables
- Typed: cannot accidentally store floats

### Reconstructing selected items

After filling the 2D table, backtrack from `dp[n][capacity]`:

```typescript
let w = capacity;
const selected: Item[] = [];
for (let i = n; i > 0; i--) {
  if (dp[i][w] !== dp[i-1][w]) {
    selected.push(items[i-1]);   // item i was taken
    w -= items[i-1].weight;
  }
}
```

## Complexity

| Variant | Time | Space (optimized) |
|---------|------|-------------------|
| 0/1 Knapsack | O(n × W) | O(W) |
| Unbounded Knapsack | O(n × W) | O(W) |
| Fractional Knapsack | O(n log n) | O(1) |

Where n = number of items, W = capacity.
