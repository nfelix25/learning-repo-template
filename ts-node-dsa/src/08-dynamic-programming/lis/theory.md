# Longest Increasing Subsequence (LIS)

## What is LIS?

A **subsequence** is derived from an array by deleting some elements without changing the order of the remaining elements.

An **increasing subsequence** is one where each element is **strictly greater** than the one before it.

The **Longest Increasing Subsequence** is the longest such subsequence.

```
arr = [10, 9, 2, 5, 3, 7, 101, 18]

Some increasing subsequences:
  [2, 5, 7, 101]  length 4
  [2, 3, 7, 101]  length 4
  [2, 5, 7, 18]   length 4  ← all valid LIS answers

LIS length = 4
```

## O(n²) DP Approach

Define `dp[i]` = length of the LIS **ending at index i**.

```
dp[i] = 1 + max(dp[j]) for all j < i where arr[j] < arr[i]
       = 1  if no such j exists
```

The answer is `max(dp[i])` over all i.

**Example:**
```
arr:  10   9   2   5   3   7  101   18
dp:    1   1   1   2   2   3    4    4

dp[3] = 2  because arr[2]=2 < arr[3]=5, dp[2]=1 → dp[3] = 1+1 = 2
dp[5] = 3  because arr[4]=3 < arr[5]=7, dp[4]=2 → dp[5] = 2+1 = 3
dp[6] = 4  because arr[5]=7 < arr[6]=101, dp[5]=3 → dp[6] = 3+1 = 4
```

## O(n log n) Algorithm: Patience Sorting

This algorithm uses a `tails` array where `tails[i]` = the **smallest tail element** of all increasing subsequences of length `i+1` seen so far.

**Invariant:** `tails` is always strictly increasing.

**For each element x:**
1. Binary search `tails` for the leftmost index `pos` where `tails[pos] >= x`
2. If found: replace `tails[pos]` with `x` (maintain the invariant with a smaller tail)
3. If not found (x is larger than all tails): append x (extend the LIS by 1)

The final LIS length = `tails.length`

**Example trace:** `[10, 9, 2, 5, 3, 7, 101, 18]`

```
x=10: tails=[]      → append → tails=[10]
x=9:  pos=0         → replace → tails=[9]
x=2:  pos=0         → replace → tails=[2]
x=5:  pos=1 (append)→ append  → tails=[2,5]
x=3:  pos=1         → replace → tails=[2,3]
x=7:  pos=2 (append)→ append  → tails=[2,3,7]
x=101:pos=3 (append)→ append  → tails=[2,3,7,101]
x=18: pos=3         → replace → tails=[2,3,7,18]

Answer: tails.length = 4
```

Note: `tails` is NOT the LIS itself — it's a maintenance array. The actual LIS must be reconstructed separately.

## LIS Reconstruction with Patience Sorting

To reconstruct the actual LIS, track two arrays:
- `tails`: the patience-sorting array
- `tailIndices`: `tailIndices[i]` = the index in `arr` of the element stored in `tails[i]`
- `parents`: `parents[i]` = index of the predecessor of `arr[i]` in the LIS path

After processing all elements, backtrack from the last element in `tailIndices` using `parents`.

## Applications

- **Box stacking problem**: stack boxes with decreasing dimensions (LIS on sorted boxes)
- **Longest chain**: chain pairs where each pair's first element follows the previous pair's second
- **Sequence alignment**: find the longest common subsequence via LIS on index mappings
- **Activity scheduling**: find the maximum number of non-overlapping activities (sort + LIS variant)

## Complexity

| Approach | Time | Space |
|----------|------|-------|
| O(n²) DP | O(n²) | O(n) |
| O(n log n) patience sorting | O(n log n) | O(n) |

For n = 10,000: n² = 100M operations vs n log n ≈ 130K. The binary search approach is dramatically faster.

## TypeScript Notes

### Binary search for first element >= x
```typescript
function lowerBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

With `noUncheckedIndexedAccess`, always use `!` after confirming the index is in bounds, or use optional chaining with a fallback.
