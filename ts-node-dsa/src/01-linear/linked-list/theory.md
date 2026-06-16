# Linked List

A **linked list** is a sequence of nodes where each node holds a value and a pointer to
the next node (singly linked) or both the previous and next nodes (doubly linked). Unlike
arrays, nodes are not stored contiguously — they live at arbitrary heap locations
connected by references.

## Singly Linked List

Each node: `{ value, next }`.

```
head → [1|→] → [2|→] → [3|null]
                              ↑
                             tail
```

- Prepend (push front): O(1) — create node, set its `next` to `head`, update `head`.
- Append (push back):   O(1) with a `tail` pointer; O(n) without.
- Search:               O(n) — must traverse from `head`.
- Delete head:          O(1).
- Delete tail:          O(n) — must find the node before tail.
- Delete at index i:    O(i) — traverse to predecessor.

## Doubly Linked List

Each node: `{ value, prev, next }`.

```
head → [null|1|→] ↔ [←|2|→] ↔ [←|3|null] ← tail
```

Additional O(1) operations over singly:
- Delete tail: O(1) — `tail.prev` is the new tail.
- Insert before a known node: O(1).
- Reverse traversal.

The cost is 2× pointer overhead per node.

## Complexity table

| Operation        | Singly   | Doubly  |
|------------------|----------|---------|
| `prepend`        | O(1)     | O(1)    |
| `append`         | O(1)*    | O(1)*   |
| `insertAt(i)`    | O(i)     | O(i)    |
| `deleteHead`     | O(1)     | O(1)    |
| `deleteTail`     | O(n)**   | O(1)    |
| `deleteAt(i)`    | O(i)     | O(i)    |
| `find`           | O(n)     | O(n)    |
| `reverse`        | O(n)     | O(n)    |

*O(1) because both classes maintain a `tail` pointer.
**O(n) for singly because we must traverse to the second-to-last node.

## Callout: how this maps to flat memory

Class-based nodes use heap references. In a flat `Int32Array` the same structure is
encoded with **index-based pointers**:

```
Each node occupies two consecutive slots:
  memory[ptr]   = value
  memory[ptr+1] = nextPtr   (index into the array, or -1 for null)

Example: list [1, 2, 3] starting at ptr=0
  memory: [ 1,  2,  2,  4,  3, -1, ... ]
  index:    0   1   2   3   4   5
  head = 0
  node at 0: value=1, next=2
  node at 2: value=2, next=4
  node at 4: value=3, next=-1 (null)
```

This is exactly the layout explored in `src/00-foundations/memory-layout/theory.md`
and revisited in `src/05-advanced-functional/arena/theory.md`, where a bump allocator
hands out these two-slot "records" from a pre-allocated `Int32Array`.

## Cross-references

- `src/00-foundations/memory-layout/theory.md` — `ArrayBuffer`, `Int32Array`, and
  index-based pointer patterns.
- `src/05-advanced-functional/arena/theory.md` — reimplements linked-list nodes inside
  an `ArrayBuffer` using a bump allocator.
- `src/01-linear/skip-list/theory.md` — builds a probabilistic multi-level index on
  top of a linked-list node structure.
