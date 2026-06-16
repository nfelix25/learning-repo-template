// LCS — full working implementation

// Build the DP table for s1 and s2.
// dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
function buildTable(s1: string, s2: string): number[][] {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
      } else {
        dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
      }
    }
  }

  return dp;
}

// Returns length of LCS
export function lcsLength(s1: string, s2: string): number {
  const dp = buildTable(s1, s2);
  return dp[s1.length]![s2.length]!;
}

// Returns the actual LCS string by backtracking the DP table
export function lcs(s1: string, s2: string): string {
  const dp = buildTable(s1, s2);

  function backtrack(i: number, j: number): string {
    if (i === 0 || j === 0) return '';
    if (s1[i - 1] === s2[j - 1]) return backtrack(i - 1, j - 1) + s1[i - 1];
    if (dp[i - 1]![j]! >= dp[i]![j - 1]!) return backtrack(i - 1, j);
    return backtrack(i, j - 1);
  }

  return backtrack(s1.length, s2.length);
}

// Returns the full DP table (for visualization/learning)
export function lcsTable(s1: string, s2: string): number[][] {
  return buildTable(s1, s2);
}

// Returns a simple character-level diff using LCS
// ' x' — unchanged, '-x' — deleted from s1, '+x' — inserted into s2
export function diff(s1: string, s2: string): string[] {
  const dp = buildTable(s1, s2);
  const result: string[] = [];

  let i = s1.length;
  let j = s2.length;

  // Collect operations in reverse, then reverse at end
  const ops: string[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      ops.push(' ' + s1[i - 1]);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
      ops.push('+' + s2[j - 1]);
      j--;
    } else {
      ops.push('-' + s1[i - 1]);
      i--;
    }
  }

  return ops.reverse();
}
