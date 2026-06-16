// Coin Change — full working implementation

// Returns minimum coins needed to make amount, or -1 if impossible
export function coinChangeMin(coins: number[], amount: number): number {
  // dp[a] = minimum coins to make amount a; Infinity = not reachable
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin]! !== Infinity) {
        dp[a] = Math.min(dp[a]!, dp[a - coin]! + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]!;
}

// Returns number of distinct combinations of coins that sum to amount.
// Coin-first outer loop ensures each combination is counted once (order-independent).
export function coinChangeWays(coins: number[], amount: number): number {
  // dp[a] = number of ways to make amount a
  const dp = new Array<number>(amount + 1).fill(0);
  dp[0] = 1; // one way to make 0: use no coins

  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a]! += dp[a - coin]!;
    }
  }

  return dp[amount]!;
}
