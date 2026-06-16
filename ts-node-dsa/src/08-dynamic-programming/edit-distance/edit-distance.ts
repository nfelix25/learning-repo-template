// Returns Levenshtein distance between s1 and s2
export function editDistance(s1: string, s2: string): number {
  throw new Error('TODO');
}

export type EditOp =
  | { op: 'equal';   char: string }
  | { op: 'insert';  char: string }
  | { op: 'delete';  char: string }
  | { op: 'replace'; from: string; to: string }

// Returns minimum edit operations to transform s1 into s2
export function editOperations(s1: string, s2: string): EditOp[] {
  throw new Error('TODO');
}
