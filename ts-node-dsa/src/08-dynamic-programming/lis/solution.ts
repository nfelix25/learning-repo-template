// LIS — full working implementation

// Binary search: find the leftmost index in arr where arr[index] >= target
function lowerBound(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// Returns length of LIS — O(n log n) patience sorting
export function lisLength(arr: number[]): number {
  if (arr.length === 0) return 0;

  // tails[i] = smallest tail of all increasing subsequences of length i+1
  const tails: number[] = [];

  for (const x of arr) {
    const pos = lowerBound(tails, x);
    if (pos === tails.length) {
      tails.push(x);
    } else {
      tails[pos] = x;
    }
  }

  return tails.length;
}

// Returns one valid LIS using patience sorting with parent tracking
export function lis(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const n = arr.length;
  const tails: number[] = [];       // tails[i] = smallest tail value for LIS of length i+1
  const tailIndices: number[] = []; // index into arr of the element stored in tails[i]
  const parents: number[] = new Array<number>(n).fill(-1); // parents[i] = predecessor index

  for (let i = 0; i < n; i++) {
    const x = arr[i]!;
    const pos = lowerBound(tails, x);

    if (pos === tails.length) {
      tails.push(x);
      tailIndices.push(i);
    } else {
      tails[pos] = x;
      tailIndices[pos] = i;
    }

    // Parent is the element at the previous LIS length slot
    if (pos > 0) {
      parents[i] = tailIndices[pos - 1]!;
    }
  }

  // Reconstruct from last element in tailIndices
  const result: number[] = [];
  let idx = tailIndices[tailIndices.length - 1]!;
  while (idx !== -1) {
    result.push(arr[idx]!);
    idx = parents[idx]!;
  }

  return result.reverse();
}

// O(n²) DP implementation — dp[i] = length of LIS ending at index i
export function lisDP(arr: number[]): number {
  if (arr.length === 0) return 0;

  const dp = new Array<number>(arr.length).fill(1);
  let maxLen = 1;

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j]! < arr[i]!) {
        dp[i] = Math.max(dp[i]!, dp[j]! + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]!);
  }

  return maxLen;
}
