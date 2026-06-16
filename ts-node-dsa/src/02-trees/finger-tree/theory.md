# Finger Tree

## Concept

A **finger tree** is a purely functional, persistent data structure that provides an
amortized O(1) push and pop at **both** ends, and O(log n) concatenation and splitting.
It generalises deques, priority queues, and sequences.

Invented by Ralf Hinze and Ross Paterson (2006), it is the basis for Haskell's
`Data.Sequence` library and any functional language's efficient sequence type.

## Structure

```
type FingerTree<A> =
  | Empty                                             -- no elements
  | Single(a: A)                                      -- exactly one element
  | Deep(prefix: Digit<A>, spine: FingerTree<Node<A>>, suffix: Digit<A>)

type Digit<A> = [A] | [A,A] | [A,A,A] | [A,A,A,A]   -- 1 to 4 elements
type Node<A>  = [A,A] | [A,A,A]                       -- 2 or 3 elements (internal)
```

- **Digits** are the "fingers" — they allow direct access to the front and back
  without traversing the spine.
- **Spine** is itself a `FingerTree` whose elements are `Node`s (2–3 trees at each level).
  This recursive nesting gives the O(log n) depth.
- **Nodes** can only have 2 or 3 children (unlike digits which allow 1 or 4). This
  invariant is what guarantees the amortized O(1) cost of push/pop.

## ASCII: Deep Structure

```
Tree containing [1, 2, 3, 4, 5, 6, 7, 8]:

Deep(
  prefix = [1, 2],
  spine  = Single(Node3(3, 4, 5)),
  suffix = [6, 7, 8]
)

front→  [1, 2, | 3, 4, 5 | 6, 7, 8]  ←back
         ↑               ↑
       prefix          suffix
            └── spine ──┘
```

## Operations

### pushFront(value) — O(1) amortized

- `Empty` → `Single(value)`
- `Single(a)` → `Deep([value], Empty, [a])`
- `Deep([w,x,y,z], spine, suffix)` — prefix is full (4 elements):
  - Promote the inner three `[x,y,z]` as a `Node3` pushed to the spine
  - New prefix is `[value, w]`
  - Result: `Deep([value, w], pushFront(spine, Node3(x,y,z)), suffix)`
- `Deep(prefix, spine, suffix)` where `|prefix| < 4` — just prepend to prefix.

### pushBack(value) — O(1) amortized

Symmetric to `pushFront`. Overflow goes to the spine from the suffix end.

### popFront — O(1) amortized

- `Single(a)` → `[a, Empty]`
- `Deep([a, ...rest], spine, suffix)` where `rest` is non-empty → `[a, Deep(rest, spine, suffix)]`
- `Deep([a], spine, suffix)` — prefix exhausted:
  - Pull one `Node` from the front of the spine
  - Expand its elements as the new prefix
  - If the spine is empty, the new tree is built from the suffix (using `fromDigit`)

### popBack — O(1) amortized

Symmetric to `popFront`.

### concat — O(log n)

Concatenating `left` and `right` must account for the "gap" between them — the
suffix of `left` and prefix of `right`. These are grouped into Node2/Node3 chunks
(the `nodes` helper) and recursively fed into the spines.

```
concat(Deep(lp, ls, lsuf), Deep(rp, rs, rsuf)):
  middle = [...lsuf, ...rp]          // 2–8 elements
  nodes  = groupIntoNodes(middle)    // array of Node2/Node3
  newSpine = concatWithMiddle(ls, nodes, rs)
  return Deep(lp, newSpine, rsuf)
```

## Persistence

Every operation returns a **new** tree. The original trees are never mutated — all
nodes are immutable (`readonly` in TypeScript). Old and new trees share unchanged
sub-trees (structural sharing), so persistent operations use O(log n) extra space.

## Complexity

| Operation | Amortized | Worst Case |
|-----------|-----------|------------|
| pushFront | O(1)      | O(log n)   |
| pushBack  | O(1)      | O(log n)   |
| popFront  | O(1)      | O(log n)   |
| popBack   | O(1)      | O(log n)   |
| peekFront | O(1)      | O(1)       |
| peekBack  | O(1)      | O(1)       |
| concat    | O(log n)  | O(log n)   |
| split     | O(log n)  | O(log n)   |
| size      | O(n)*     | O(n)       |

*`size` requires traversal unless you annotate each node with a cached count.
In annotated variants (used for priority queues and interval trees), size is O(1).

## TypeScript Callouts

```typescript
// Discriminated unions via a `type` field are the canonical TypeScript pattern
// for recursive data structures. TypeScript's exhaustiveness checker ensures
// all variants are handled:

type FingerTree<A> =
  | { readonly type: 'empty' }
  | { readonly type: 'single'; readonly value: A }
  | { readonly type: 'deep'; readonly prefix: Digit<A>; readonly spine: FingerTree<FTNode<A>>; readonly suffix: Digit<A> }

function size<A>(tree: FingerTree<A>): number {
  switch (tree.type) {
    case 'empty':  return 0
    case 'single': return 1
    case 'deep':   return ...   // TypeScript knows all cases are handled
    // No `default` needed — TypeScript will warn if a new variant is added
  }
}

// `readonly` tuples enforce the Node2/Node3/Digit invariants at the type level.
// noUncheckedIndexedAccess means tuple[0] is A (not A | undefined) only when
// TypeScript can prove the index is in range — use destructuring or typed access.
```

## Cross-References

- `05-advanced-functional/zipper` — same **discriminated union** pattern for a recursive
  functional tree structure; compare how both use `type` fields and exhaustive switches.
- Haskell's `Data.Sequence` is the canonical finger tree library; this module mirrors
  the Hinze-Paterson paper's core algorithms.
- Used as the backing structure for functional deques in Clojure, Scala, and PureScript.
