# Skip List

A **skip list** is a probabilistic data structure that adds **express lanes** above a
sorted linked list, enabling expected O(log n) search, insert, and delete — comparable
to a balanced BST but simpler to implement.

## Structure

A skip list has multiple levels. Level 0 is the full sorted list; each higher level is
a sparse "express lane" containing a random subset of the nodes from the level below.

```
L3: head ──────────────────────→ [30] → null
L2: head ──────→ [10] ──────→ [30] → null
L1: head → [5] → [10] → [20] → [30] → null
L0: head → [5] → [10] → [15] → [20] → [25] → [30] → null
```

Each node has an array of `forward` pointers, one per level it participates in. The
`head` sentinel node spans all levels and holds no value.

## Probabilistic level assignment

When inserting a new node, its level height is chosen randomly:

```typescript
function randomLevel(maxLevel: number, p: number): number {
  let level = 0;
  while (Math.random() < p && level < maxLevel) level++;
  return level;
}
```

With `p = 0.5`, each extra level is taken with probability 1/2. The expected height of
any node is `1 / (1 - p)` = 2, and the expected maximum height of `n` nodes is
`log_{1/p}(n)`. With `MAX_LEVEL = 16` and `p = 0.5`, the structure handles up to
2^16 = 65 536 elements efficiently.

## Search algorithm

```
curr = head
for level from maxLevel-1 down to 0:
  while curr.forward[level].value < target:
    curr = curr.forward[level]
curr = curr.forward[0]
return curr.value === target
```

At each level, advance as far right as possible without passing the target, then drop
down one level and repeat.

## Insert algorithm

Maintains an `update[]` array that records the rightmost node at each level whose
`forward` pointer needs to be updated:

```typescript
const update: SkipListNode[] = new Array(this.maxLevel).fill(this.head);
let curr = this.head;
for (let lvl = this.level; lvl >= 0; lvl--) {
  while (curr.forward[lvl] !== null && curr.forward[lvl]!.value < value) {
    curr = curr.forward[lvl]!;
  }
  update[lvl] = curr;
}
// Splice new node in at each level up to newLevel
```

## Delete algorithm

Uses the same `update[]` construction. For each level where `update[lvl].forward[lvl]`
is the target node, relink `update[lvl].forward[lvl]` to the target's forward pointer
at that level. Shrink `this.level` if top levels become empty.

## Duplicate handling

This implementation **allows duplicate inserts** — inserting a value already present
adds a second node at level 0 (or higher). `search` returns `true` for any occurrence.
`delete` removes only one occurrence (the first encountered at level 0). If you need
set semantics, check `search` before `insert`.

## Complexity table

| Operation  | Expected | Worst case (no guarantee) |
|------------|----------|--------------------------|
| `search`   | O(log n) | O(n)                     |
| `insert`   | O(log n) | O(n)                     |
| `delete`   | O(log n) | O(n)                     |
| `toArray`  | O(n)     | O(n)                     |

Space: O(n log n) expected (each node participates in ~2 levels on average with p=0.5).

## Skip list vs balanced BST

| Property              | Skip list            | Balanced BST (AVL/RB) |
|-----------------------|----------------------|----------------------|
| Expected time         | O(log n)             | O(log n)             |
| Worst-case guarantee  | No (probabilistic)   | Yes (deterministic)  |
| Implementation complexity | Low              | High (rotations)     |
| Concurrent modification | Easier to lock per lane | Harder             |
| Cache friendliness    | Lower (pointer chasing) | Similar            |

The skip list trades worst-case determinism for implementation simplicity. In practice,
the probability of O(n) behaviour is astronomically small (same as a random quicksort
hitting worst case repeatedly).

## Cross-references

- `src/01-linear/linked-list/theory.md` — level-0 of the skip list is a sorted singly
  linked list with a tail pointer.
- `src/03-trees/` — balanced BSTs offer the same expected complexity with deterministic
  worst-case guarantees.
