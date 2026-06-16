// Returns length of LCS
export function lcsLength(s1: string, s2: string): number {
  throw new Error('TODO');
}

// Returns the actual LCS string
export function lcs(s1: string, s2: string): string {
  throw new Error('TODO');
}

// Returns the full DP table (for visualization/learning)
// dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
export function lcsTable(s1: string, s2: string): number[][] {
  throw new Error('TODO');
}

// Returns a simple diff array:
//   ' x' — character x is unchanged (in LCS)
//   '-x' — character x was in s1 but not s2 (deleted)
//   '+x' — character x is in s2 but not s1 (inserted)
export function diff(s1: string, s2: string): string[] {
  throw new Error('TODO');
}
