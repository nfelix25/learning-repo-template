# Rope

## Problem: Naive String Concatenation is O(n²)

JavaScript strings are **immutable**. Every `a + b` allocates a new string of length
`|a| + |b|` and copies all bytes from both sides. If you build a string by concatenating
N small pieces:

```
s = ""
for each piece p:  s = s + p    // copies all of s again
```

The total bytes copied = `0 + 1 + 2 + ... + N = O(N²)`. For large documents or
templating engines this is a serious bottleneck.

## Rope Solution: Binary Tree of Chunks

A **Rope** represents a string as a balanced binary tree where:

- **Leaf nodes** store actual string content as a `Uint8Array` (UTF-8 encoded bytes).
- **Internal nodes** store only the total length of their subtree — no content.

```
Rope for "Hello, World!":

        [13]
       /    \
     [7]    [6]
    /   \    |
"Hello" ","  "World!"  ← leaf nodes with Uint8Array content
```

### Why Uint8Array at the leaves?

UTF-8 encoding stores characters as 1–4 bytes each. `Uint8Array` is a view over a
raw `ArrayBuffer` — no per-element boxing, no GC pressure per character.
`TextEncoder` converts `string → Uint8Array`; `TextDecoder` converts back.

> **TS callout:** `TextEncoder` and `TextDecoder` are the Web standard API for UTF-8
> encoding. In Node 24, they are available globally without an import statement.

## Complexity Table

| Operation   | Time         | Notes                                           |
|-------------|--------------|--------------------------------------------------|
| `concat`    | O(1)         | Create new root node pointing to both trees      |
| `charAt(i)` | O(log n)     | Traverse tree comparing i to left subtree length |
| `split(i)`  | O(log n)     | Split at position, rearrange tree                |
| `substring` | O(log n + k) | Split + concat + traverse k output bytes         |
| `toString`  | O(n)         | Visit all leaves, decode bytes                   |
| Space       | O(n)         | Total bytes across all leaves                    |

## Rebalancing

A rope can degenerate into a linked list if concatenations always go to the same side.
The **Boehm et al.** criterion: rebalance when `height > 1.44 × log₂(length)`.

Rebalancing collects all leaves in order, then rebuilds a balanced tree bottom-up —
similar to building a balanced BST from a sorted array.

## Operations in Detail

### `charAt(i)`

Traverse the tree. At each internal node, if `i < node.left.length`, go left;
otherwise subtract `node.left.length` from `i` and go right. At a leaf, index
into the `Uint8Array` at position `i`, then decode the byte(s) as a UTF-8 character.

### `concat(a, b)`

```
new root = InternalNode { left: a.root, right: b.root, length: a.length + b.length }
```
O(1) — no copying.

### `split(i)`

Recursively split the tree at position `i`. Returns two sub-ropes:
- `left`: characters `[0, i)`
- `right`: characters `[i, length)`

At each internal node, compare `i` to `node.left.length` and recursively split
the appropriate subtree, then reassemble with concat.

## Cross-References

- **00-foundations/memory-layout** — `Uint8Array` / `ArrayBuffer` fundamentals
- **01-linear/linked-list** — illustrates what naive string building with a linked
  list of characters looks like (and why it's slow)
