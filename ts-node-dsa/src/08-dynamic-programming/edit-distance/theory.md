# Edit Distance (Levenshtein Distance)

## What is Edit Distance?

The **Levenshtein distance** between two strings is the minimum number of single-character edits — **insertions**, **deletions**, and **substitutions** — required to transform one string into the other.

```
"kitten" → "sitting"

kitten
sitten   (substitute 'k' → 's')
sittin   (substitute 'e' → 'i')
sitting  (insert 'g')

Edit distance = 3
```

## DP Table

Define `dp[i][j]` = the edit distance between `s1[0..i-1]` and `s2[0..j-1]`.

- The table is `(m+1) × (n+1)` where m = s1.length, n = s2.length.
- First row: `dp[0][j] = j` (insert j characters from s2 into empty string)
- First column: `dp[i][0] = i` (delete i characters from s1 to get empty string)

## Recurrence

```
if s1[i-1] === s2[j-1]:
    dp[i][j] = dp[i-1][j-1]               // characters match: no edit needed

else:
    dp[i][j] = 1 + min(
        dp[i-1][j],     // delete from s1
        dp[i][j-1],     // insert into s1 (equivalently, delete from s2)
        dp[i-1][j-1]    // replace s1[i-1] with s2[j-1]
    )
```

### Table for ("kitten", "sitting"):

```
    ""  s  i  t  t  i  n  g
""   0  1  2  3  4  5  6  7
k    1  1  2  3  4  5  6  7
i    2  2  1  2  3  4  5  6
t    3  3  2  1  2  3  4  5
t    4  4  3  2  1  2  3  4
e    5  5  4  3  2  2  3  4
n    6  6  5  4  3  3  2  3
                          ↑
                     dp[6][7] = 3
```

## Backtracking to Reconstruct Edit Operations

Starting from `dp[m][n]`, trace back to recover the sequence of operations:

```typescript
function backtrack(i: number, j: number): EditOp[] {
  if (i === 0 && j === 0) return [];
  if (i === 0) return [...backtrack(0, j-1), { op: 'insert', char: s2[j-1] }];
  if (j === 0) return [...backtrack(i-1, 0), { op: 'delete', char: s1[i-1] }];

  if (s1[i-1] === s2[j-1])
    return [...backtrack(i-1, j-1), { op: 'equal', char: s1[i-1] }];

  const del  = dp[i-1][j];
  const ins  = dp[i][j-1];
  const repl = dp[i-1][j-1];
  const best = Math.min(del, ins, repl);

  if (repl === best)
    return [...backtrack(i-1, j-1), { op: 'replace', from: s1[i-1], to: s2[j-1] }];
  if (del === best)
    return [...backtrack(i-1, j), { op: 'delete', char: s1[i-1] }];
  return [...backtrack(i, j-1), { op: 'insert', char: s2[j-1] }];
}
```

## Applications

- **Spell checking**: suggest corrections with edit distance 1 or 2
- **DNA mutation distance**: measure how many point mutations separate two sequences
- **Fuzzy string matching**: search for "close" strings in a database
- **Plagiarism detection**: detect near-duplicate text
- **Natural language processing**: word alignment in machine translation

## Complexity

| Variant | Time | Space |
|---------|------|-------|
| Full table | O(m×n) | O(m×n) |
| Space-optimized (distance only) | O(m×n) | O(min(m,n)) |

Space optimization: since row i only depends on row i-1, keep two rolling rows of length n+1.

## TypeScript Notes

The `EditOp` discriminated union makes the type of each operation explicit:

```typescript
type EditOp =
  | { op: 'equal';   char: string }
  | { op: 'insert';  char: string }
  | { op: 'delete';  char: string }
  | { op: 'replace'; from: string; to: string }
```

The TypeScript exhaustive check pattern with `switch (editOp.op)` will warn if you forget a case.
