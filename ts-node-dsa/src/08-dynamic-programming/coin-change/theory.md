# Coin Change

## The Two Variants

### 1. Minimum Coins (Optimization)
Given coin denominations and a target amount, find the **minimum number of coins** to make exact change.

### 2. Count Ways (Counting)
Given coin denominations and a target amount, find the **number of distinct combinations** of coins that sum to the amount.

## Why Greedy Fails

The greedy approach — always pick the largest coin that fits — works for some coin systems (like US currency) but not in general.

**Counter-example:** denominations `[1, 3, 4]`, target `6`

- Greedy: picks 4, then 1+1 → 3 coins
- Optimal: picks 3+3 → **2 coins**

Greedy fails because picking the locally best choice can block a globally optimal solution. DP considers all possibilities.

## Minimum Coins: Bottom-Up DP

```
dp[a] = minimum coins needed to make amount a
dp[0] = 0     (zero coins to make zero)
dp[a] = Infinity initially (amount not reachable)

For each amount a from 1 to target:
  For each coin c:
    if c <= a and dp[a - c] != Infinity:
      dp[a] = min(dp[a], dp[a - c] + 1)
```

**Example:** coins = [1, 2, 5], amount = 11

```
dp[0]  = 0
dp[1]  = 1  (1)
dp[2]  = 1  (2)
dp[3]  = 2  (2+1)
dp[4]  = 2  (2+2)
dp[5]  = 1  (5)
dp[6]  = 2  (5+1)
dp[7]  = 2  (5+2)
dp[8]  = 3  (5+2+1)
dp[9]  = 3  (5+2+2)
dp[10] = 2  (5+5)
dp[11] = 3  (5+5+1)
```

Answer: 3

## Count Ways: Bottom-Up DP

The order of loops matters:

```typescript
// Coin-first outer loop: each combination counted once (order of coins doesn't matter)
for (const coin of coins) {
  for (let a = coin; a <= amount; a++) {
    dp[a] += dp[a - coin];
  }
}
```

vs.

```typescript
// Amount-first outer loop: counts ordered permutations (1,2 and 2,1 counted separately)
for (let a = 1; a <= amount; a++) {
  for (const coin of coins) {
    if (coin <= a) dp[a] += dp[a - coin];
  }
}
```

For "distinct combinations" (ignoring order), use **coin-first**. For "ordered sequences", use **amount-first**.

## TypeScript Callouts

### Int32Array for integer dp arrays

```typescript
const dp = new Int32Array(amount + 1); // initialized to 0
```

### Representing "impossible" states

```typescript
const dp = new Array<number>(amount + 1).fill(Infinity);
dp[0] = 0;
// After filling:
return dp[amount] === Infinity ? -1 : dp[amount];
```

Using `Infinity` (not -1 or MAX_INT) avoids special-case conditionals inside the inner loop because `Infinity + 1 = Infinity` and `Math.min(x, Infinity) = x`.

## Complexity

| Variant | Time | Space |
|---------|------|-------|
| Minimum coins | O(amount × numCoins) | O(amount) |
| Count ways | O(amount × numCoins) | O(amount) |

Both are pseudo-polynomial (polynomial in the numeric value of amount, not its binary length).

## Common Pitfalls

1. **Forgetting the impossible case**: when amount is not reachable, return -1 not Infinity.
2. **Wrong loop order for counting**: coin-first for combinations, amount-first for permutations.
3. **Off-by-one on base case**: `dp[0] = 1` for counting ways (empty selection = 1 way), `dp[0] = 0` for minimum coins.
