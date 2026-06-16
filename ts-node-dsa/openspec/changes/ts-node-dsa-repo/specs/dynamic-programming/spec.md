## ADDED Requirements

### Requirement: Memoization module teaches top-down DP with recursive subproblem caching
The memoization module SHALL teach top-down DP through worked examples, implement a generic `memoize` wrapper, and demonstrate that memoized recursion equals bottom-up tabulation in result.

#### Scenario: Memoized Fibonacci avoids recomputation
- **WHEN** memoized fibonacci(n) is called
- **THEN** each subproblem fib(k) is computed exactly once (verified via call count)

#### Scenario: Memoize wrapper caches results by serialized arguments
- **WHEN** a memoized function is called twice with identical arguments
- **THEN** the underlying function is invoked only once

#### Scenario: Memoize wrapper handles multiple argument functions
- **WHEN** a two-argument function is memoized and called with same args
- **THEN** the cache key distinguishes different argument combinations correctly

#### Scenario: Stack overflow risk for very large n without tail recursion
- **WHEN** theory.md covers memoization
- **THEN** it explains the call stack depth limit, how iterative (tabulation) avoids it, and references Node.js stack limits

### Requirement: Tabulation module teaches bottom-up DP with iterative table filling
The tabulation module SHALL implement bottom-up DP for the same problems as memoization, showing that the iteration order must match subproblem dependencies.

#### Scenario: Tabulated Fibonacci fills the table left to right
- **WHEN** tabulated fibonacci(n) runs
- **THEN** dp[i] = dp[i-1] + dp[i-2] is filled from i=2 to n without recursion

#### Scenario: Space optimization reduces O(n) table to O(1) for Fibonacci
- **WHEN** the space-optimized variant runs
- **THEN** only two variables are maintained (not a full array) and the result is identical

#### Scenario: Iteration order respects subproblem dependencies
- **WHEN** theory.md explains tabulation
- **THEN** it includes an ASCII dependency DAG showing which cells must be computed before others

### Requirement: LCS (Longest Common Subsequence) is solved with a 2D DP table
#### Scenario: LCS length is correct for known string pairs
- **WHEN** LCS is computed for ("ABCBDAB", "BDCAB")
- **THEN** the length is 4

#### Scenario: LCS reconstruction produces a valid common subsequence
- **WHEN** the LCS string is reconstructed from the DP table
- **THEN** it appears as a subsequence in both input strings

#### Scenario: LCS of identical strings returns the string itself
- **WHEN** LCS("abc", "abc") is called
- **THEN** the result is "abc"

#### Scenario: LCS of disjoint strings is empty
- **WHEN** LCS("abc", "xyz") is called
- **THEN** the length is 0

### Requirement: 0/1 Knapsack is solved with a 2D DP table over items and capacity
#### Scenario: Optimal value is correct for known instance
- **WHEN** knapsack runs on a known instance with items [(w=2,v=3),(w=3,v=4),(w=4,v=5)] and capacity=5
- **THEN** the optimal value is 7 (items 1 and 2)

#### Scenario: Item selection is reconstructed from the DP table
- **WHEN** the selected items are traced back
- **THEN** their total weight does not exceed capacity and their total value equals the optimal

#### Scenario: Capacity-0 knapsack returns 0
- **WHEN** knapsack runs with capacity=0
- **THEN** optimal value is 0

#### Scenario: No items returns 0
- **WHEN** knapsack runs with an empty item list
- **THEN** optimal value is 0

### Requirement: Edit Distance (Levenshtein) is solved with a 2D DP table
#### Scenario: Edit distance between identical strings is 0
- **WHEN** editDistance("abc", "abc") is called
- **THEN** it returns 0

#### Scenario: Edit distance between empty and non-empty string equals non-empty length
- **WHEN** editDistance("", "abc") is called
- **THEN** it returns 3

#### Scenario: Edit distance for known pair is correct
- **WHEN** editDistance("kitten", "sitting") is called
- **THEN** it returns 3

#### Scenario: Edit operations are reconstructable from the DP table
- **WHEN** the operation sequence is traced back
- **THEN** applying the operations to the source string produces the target string

### Requirement: Coin Change (minimum coins) is solved with bottom-up tabulation
#### Scenario: Minimum coins for known amount is correct
- **WHEN** coinChange([1, 5, 6, 9], 11) is called
- **THEN** it returns 2 (9+2×1 is not optimal; 5+6=11 is optimal)

#### Scenario: Amount that cannot be made returns -1
- **WHEN** coinChange([2], 3) is called
- **THEN** it returns -1

#### Scenario: Amount of 0 returns 0
- **WHEN** coinChange([1, 5], 0) is called
- **THEN** it returns 0

#### Scenario: Theory.md contrasts greedy coin change (fails for some denominations) with DP
- **WHEN** the learner reads theory.md
- **THEN** it shows a counterexample where greedy fails (e.g., denominations [1,3,4], amount 6) and DP gives the correct 2-coin answer

### Requirement: LIS (Longest Increasing Subsequence) is solved in O(n log n)
#### Scenario: O(n²) DP solution produces correct LIS length
- **WHEN** the O(n²) DP runs on a known sequence
- **THEN** it returns the correct LIS length

#### Scenario: O(n log n) patience sorting solution produces same length
- **WHEN** the O(n log n) solution runs on the same sequence
- **THEN** it returns the same LIS length as the O(n²) solution

#### Scenario: LIS of a sorted array is the full array
- **WHEN** LIS runs on [1, 2, 3, 4, 5]
- **THEN** it returns 5

#### Scenario: LIS of a reverse-sorted array is 1
- **WHEN** LIS runs on [5, 4, 3, 2, 1]
- **THEN** it returns 1

#### Scenario: Theory.md explains binary search in patience sorting
- **WHEN** the learner reads theory.md
- **THEN** it explains how binary search on the tails array achieves O(n log n) and references the sorting/non-comparison module for the relationship to patience sort
