// Edit Distance — full working implementation

export type EditOp =
  | { op: 'equal';   char: string }
  | { op: 'insert';  char: string }
  | { op: 'delete';  char: string }
  | { op: 'replace'; from: string; to: string }

// Build the full DP table for edit distance
function buildTable(s1: string, s2: string): number[][] {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i]![0] = i; // delete all of s1
  for (let j = 0; j <= n; j++) dp[0]![j] = j; // insert all of s2

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] = 1 + Math.min(
          dp[i - 1]![j]!,      // delete
          dp[i]![j - 1]!,      // insert
          dp[i - 1]![j - 1]!,  // replace
        );
      }
    }
  }

  return dp;
}

// Returns Levenshtein distance between s1 and s2
export function editDistance(s1: string, s2: string): number {
  const dp = buildTable(s1, s2);
  return dp[s1.length]![s2.length]!;
}

// Returns minimum edit operations to transform s1 into s2 (iterative backtracking)
export function editOperations(s1: string, s2: string): EditOp[] {
  const dp = buildTable(s1, s2);
  const ops: EditOp[] = [];

  let i = s1.length;
  let j = s2.length;

  // Collect ops in reverse order, then reverse at end
  const reversed: EditOp[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      reversed.push({ op: 'equal', char: s1[i - 1]! });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i - 1]![j - 1]! <= dp[i - 1]![j]! && dp[i - 1]![j - 1]! <= dp[i]![j - 1]!) {
      // Replace is cheapest
      reversed.push({ op: 'replace', from: s1[i - 1]!, to: s2[j - 1]! });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1]![j]! <= dp[i]![j - 1]!)) {
      // Delete from s1
      reversed.push({ op: 'delete', char: s1[i - 1]! });
      i--;
    } else {
      // Insert from s2
      reversed.push({ op: 'insert', char: s2[j - 1]! });
      j--;
    }
  }

  reversed.reverse();
  for (const op of reversed) ops.push(op);
  return ops;
}
