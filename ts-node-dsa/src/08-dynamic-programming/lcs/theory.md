# Longest Common Subsequence (LCS)

## What is LCS?

A **subsequence** is a sequence derived from another by deleting some (or no) elements without changing the order of the remaining elements. Unlike a substring, the elements do not need to be contiguous.

The **Longest Common Subsequence** of two strings s1 and s2 is the longest sequence that appears as a subsequence in both strings.

Example:
```
s1 = "ABCBDAB"
s2 = "BDCAB"
LCS = "BCAB" or "BDAB"  (length 4)
```

## The 2D DP Table

Define `dp[i][j]` = the length of the LCS of `s1[0..i-1]` and `s2[0..j-1]`.

- The table is `(m+1) × (n+1)` where m = s1.length, n = s2.length.
- Row 0 and column 0 are all zeros (LCS with an empty string is 0).

## Recurrence

```
if s1[i-1] === s2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1      // characters match: extend the LCS
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])  // skip one char from either string
```

Filling the table for `("ABCBDAB", "BDCAB")`:

```
    ""  B  D  C  A  B
""   0  0  0  0  0  0
A    0  0  0  0  1  1
B    0  1  1  1  1  2
C    0  1  1  2  2  2
B    0  1  1  2  2  3
D    0  1  2  2  2  3
A    0  1  2  2  3  3
B    0  1  2  2  3  4   ← dp[7][5] = 4
```

## Backtracking to Reconstruct the LCS

Starting from `dp[m][n]`, trace back to find the actual characters:

```typescript
function backtrack(i: number, j: number): string {
  if (i === 0 || j === 0) return '';
  if (s1[i-1] === s2[j-1]) return backtrack(i-1, j-1) + s1[i-1];
  if (dp[i-1][j] >= dp[i][j-1]) return backtrack(i-1, j);
  return backtrack(i, j-1);
}
```

## Space Optimization

The recurrence only reads from the previous row, so we can keep just two rows:

```typescript
let prev = new Array(n + 1).fill(0);
let curr = new Array(n + 1).fill(0);

for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    if (s1[i-1] === s2[j-1]) curr[j] = prev[j-1] + 1;
    else curr[j] = Math.max(prev[j], curr[j-1]);
  }
  [prev, curr] = [curr, prev];
}
// Answer is in prev[n]
```

This reduces space from O(m×n) to O(min(m,n)) (use the shorter string as columns).

## Complexity

| Variant | Time | Space |
|---------|------|-------|
| Full table (with reconstruction) | O(m×n) | O(m×n) |
| Space-optimized (length only) | O(m×n) | O(min(m,n)) |

## Applications

- **git diff / Unix diff**: finds LCS of lines to show what changed
- **DNA sequencing**: identifies common genetic subsequences between organisms
- **Spell checking / fuzzy matching**: measures similarity between strings
- **File synchronization**: rsync uses LCS-like algorithms to minimize data transfer
- **Version control merging**: three-way merge finds LCS of base vs both branches

## Relationship to Edit Distance

LCS and edit distance (Levenshtein) are closely related:
```
editDistance(s1, s2) = m + n - 2 * lcsLength(s1, s2)
```
(assuming only insertions and deletions, no substitutions)
