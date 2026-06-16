# Trie, Compressed Trie & Aho-Corasick

## 1. Basic Trie (Prefix Tree)

A trie is a tree where each **path from the root to a marked node** spells out a word. Each node stores a `Map<string, TrieNode>` of its children.

### Insertion example: "apple", "app", "banana"

```
root
├── a
│   └── p
│       └── p  [end]
│           └── l
│               └── e  [end]
└── b
    └── a
        └── n
            └── a
                └── n
                    └── a  [end]
```

### Time and Space

| Operation  | Time  | Space           |
|------------|-------|-----------------|
| insert     | O(L)  | O(ALPHABET × N) |
| search     | O(L)  |                 |
| startsWith | O(L)  |                 |
| delete     | O(L)  |                 |

Where L = length of the word and N = total number of characters inserted.

### Deletion strategy

Walk to the target node. If found (and `isEnd === true`), clear `isEnd`. Then backtrack up: if a node has no children and is not an endpoint for another word, remove it from its parent's map. This avoids memory leaks.

---

## 2. Compressed (Patricia) Trie

A **compressed trie** merges single-child chains into edge labels (strings rather than single characters). This reduces node count significantly for sparse tries.

```
Standard trie for ["app", "apple", "application"]:
  a → p → p[end] → l → e[end]
                 → i → c → a → t → i → o → n[end]

Compressed trie:
  [app][end]
    ├── le[end]
    └── lication[end]
```

Node count drops from 18 nodes to 4 nodes.

### Insertion in a compressed trie

When inserting a new word:
1. Walk existing edges as long as characters match.
2. If a mismatch occurs mid-edge, split the edge at the mismatch point.
3. Create a new branch for the diverging suffix.

---

## 3. Aho-Corasick (Multi-Pattern String Matching)

Aho-Corasick extends the trie with **failure links** (similar to KMP's failure function) to search for multiple patterns simultaneously in O(n + m + z) time.

### Failure links

- Each node `u` has a `failure` pointer to the longest proper suffix of the string represented by `u` that is also a prefix of some pattern.
- Built via **BFS from the root**.
- During search: if the next character is not in `u.children`, follow `u.failure` instead of going back to the root (avoids re-examining text characters).

### Output links

- Each node stores the list of patterns that **end** at that node (including patterns reachable via failure chain).
- This lets us report all matches at each text position.

### Example

Patterns: `["he", "she", "his", "hers"]`, text: `"ushers"`

```
Text:      u  s  h  e  r  s
Position:  0  1  2  3  4  5

Matches found:
  "she" at [1, 3]
  "he"  at [2, 3]
  "hers" at [2, 5]
```

### Complexity

| Phase            | Time           |
|------------------|----------------|
| Build trie       | O(m)           |
| Build fail links | O(m)           |
| Search           | O(n + z)       |
| Total            | O(n + m + z)   |

Where n = text length, m = total pattern characters, z = number of matches.

---

## TypeScript Callouts

> **Map vs array for children**: Using `Map<string, TrieNode>` is cleaner for arbitrary alphabets than a fixed-size array. For ASCII-only tries (26 letters), an array lookup is ~2x faster, but `Map` is more general and readable.

> **Aho-Corasick failure links** are a `ACNode | null` field. TypeScript's strict null checks force you to handle the `null` root case explicitly, which matches the algorithm (root's failure is itself or null by convention).

---

## Applications

- Autocomplete / spell check (Trie)
- IP routing tables (Compressed Trie)
- Multiple keyword search in text (Aho-Corasick)
- Antivirus signature scanning (Aho-Corasick)
- `grep -F` (fixed string multi-pattern matching)

---

## Cross-References

- **04-hash-and-probabilistic/bloom-filter** — uses similar prefix key ideas
- **05-advanced-functional/zipper** — same discriminated-union pattern used in Finger Tree
