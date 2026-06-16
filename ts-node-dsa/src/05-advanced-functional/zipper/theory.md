# Zipper

## Problem: Editing Immutable Trees

In functional programming, trees are immutable — you never mutate a node in place.
To change a node deep in the tree, you must rebuild all its ancestors:

```
Change node 3 (deep leaf) →  rebuild 2 (parent), rebuild 1 (root)
     1                           1'
    / \          ====>          / \
   2   4                       2'  4
  / \                         / \
 3   5                        3'  5
```

For a tree of depth D, every "edit" allocates O(D) new nodes. This is correct and
efficient for single edits, but for a cursor moving through a tree (like a text
editor's cursor), performing many edits means D allocations per step.

## Zipper Solution: Focus + Context

A **Zipper** is a pair of:
- **focus**: the node currently being "looked at"
- **context**: a list of **breadcrumbs** — the path from the root down to the focus,
  stored in reverse order (innermost breadcrumb first).

Each breadcrumb remembers:
- which direction we came from (left or right)
- the parent node's value
- the sibling subtree we did NOT descend into

```
Original tree:           Zipper focused on node 3:
     1                   focus = 3
    / \                  context = [
   2   4                   { type: 'left', parentValue: 2, right: 5 },   ← deepest
  / \                      { type: 'left', parentValue: 1, right: 4 },   ← outermost
 3   5                   ]   (breadcrumbs deepest-first)
```

## Discriminated Union for Breadcrumbs

```typescript
type BinCrumb<A> =
  | { type: 'left';  parentValue: A; right: BinNode<A> | null }
  // We went LEFT — so right sibling is stored, left sibling IS the focus.
  | { type: 'right'; parentValue: A; left:  BinNode<A> | null }
  // We went RIGHT — so left sibling is stored, right sibling IS the focus.
```

> **TS callout:** Discriminated unions are the canonical TypeScript model for zippers.
> The `type` field on `BinCrumb` entries lets TypeScript narrow the union —
> `if (crumb.type === 'left') { crumb.right /* available */ }`.
> This is the same pattern used in Finger Trees for their internal digit/node types.

## Operations

### `goLeft()`
Move focus to the left child. Push a `'left'` breadcrumb storing the parent value
and the right subtree.

```
focus = node.left
context = [{ type: 'left', parentValue: node.value, right: node.right }, ...context]
```

### `goUp()`
Pop the top breadcrumb and reconstruct the parent node.

```
crumb = context[0]
if crumb.type === 'left':
  parent = { value: crumb.parentValue, left: focus, right: crumb.right }
else:
  parent = { value: crumb.parentValue, left: crumb.left, right: focus }
focus = parent
context = context.slice(1)
```

### `modify(newValue)`
Replace the focus node's value. Returns a new zipper — the original is untouched.

### `toTree()`
Apply all breadcrumbs from innermost to outermost via repeated `goUp()` steps,
then return the focus (which is now the reconstructed root).

## Persistence

All operations return **new** `BinaryZipper` instances. The original tree and zipper
are untouched. Structural sharing means unchanged subtrees are reused — no copying.

## Complexity Table

| Operation  | Time   | Notes                                      |
|------------|--------|--------------------------------------------|
| `goLeft`   | O(1)   | Push one breadcrumb                        |
| `goRight`  | O(1)   | Push one breadcrumb                        |
| `goUp`     | O(1)   | Pop one breadcrumb, rebuild one node       |
| `modify`   | O(1)   | Create new focus node                      |
| `toTree`   | O(D)   | D = depth of focus from root               |

## Cross-References

- **02-trees/finger-tree** — uses the same discriminated union pattern for digit types
- **Structured editors** — Zippers are the data structure behind cursor-based editing
  of syntax trees (used in Paredit, tree-sitter edit modes)
