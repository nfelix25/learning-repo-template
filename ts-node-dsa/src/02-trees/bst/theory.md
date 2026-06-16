# Binary Search Tree (BST)

## Concept

A **Binary Search Tree** is a binary tree that maintains an ordering invariant at every subtree (not just between parent and immediate children):

> For every node N: all values in N's left subtree are **strictly less** than N's value, and all values in N's right subtree are **greater than or equal** to N's value.

This invariant enables O(log n) search, insert, and delete on a balanced tree.

---

## BST Invariant — Subtree Property

A common mistake is to only check the parent-child relationship. Consider:

```
      10
     /  \
    5    15
   / \
  3   12       ← 12 violates BST: it's in 10's left subtree but 12 > 10
```

A correct BST validator passes min/max bounds down recursively.

---

## Operations with ASCII

### Insert

```
Insert 4 into:          Result:
    5                       5
   / \                     / \
  3   7         →         3   7
                          \
                           4
```

Walk left if value < current, right if value ≥ current. Insert at the first null slot.

### Search

Walk the tree using BST comparisons. Return the node if found, null if you reach null.

```
Search 6 in:
    5
   / \
  3   7
     /
    6     ← found at depth 3
```

### Delete — Three Cases

**Case 1: Leaf node** — simply remove it.

```
Delete 3:               Result:
    5                       5
   / \                       \
  3   7          →            7
```

**Case 2: One child** — replace the node with its only child.

```
Delete 5 (has only right child 7):
    5
     \
      7     →    7
```

**Case 3: Two children** — replace the node's value with its **in-order successor** (the smallest value in the right subtree), then delete the successor from the right subtree.

```
Delete 5:               Result:
    5                       6
   / \                     / \
  3   7          →        3   7
     /
    6   ← in-order successor of 5
```

---

## Predecessor and Successor

- **Predecessor**: the largest value strictly less than the given value.
  - If the node has a left subtree, predecessor = rightmost node in that subtree.
  - Otherwise, walk up ancestors until you find a right-turn.

- **Successor**: the smallest value strictly greater than the given value.
  - If the node has a right subtree, successor = leftmost node in that subtree.
  - Otherwise, walk up ancestors until you find a left-turn.

---

## Inorder = Sorted

Inorder traversal of any valid BST always produces values in strictly ascending order. This is the canonical test that a BST is valid.

---

## Comparison: BST vs Sorted Array

| Operation | Balanced BST | Sorted Array |
|-----------|-------------|--------------|
| Search    | O(log n)    | O(log n)     |
| Insert    | O(log n)    | O(n)         |
| Delete    | O(log n)    | O(n)         |
| Min/Max   | O(log n)    | O(1)         |
| Space     | O(n)        | O(n)         |

A sorted array beats a BST for search (better cache locality), but BST wins for insert/delete because a sorted array requires shifting O(n) elements. However, a **degenerate BST** (inserting sorted data into a plain BST) degrades to O(n) for all operations — it becomes a linked list.

This is exactly why **balanced trees** (AVL, Red-Black) matter.

---

## Complexity

| Operation | Average (balanced) | Worst (degenerate) |
|-----------|-------------------|-------------------|
| Insert    | O(log n)          | O(n)              |
| Search    | O(log n)          | O(n)              |
| Delete    | O(log n)          | O(n)              |
| Traversal | O(n)              | O(n)              |
| Space     | O(n)              | O(n)              |

---

## TypeScript Callouts

- `BSTNode` uses `number` (not generic) since BST comparisons need `<` and `>`.
- `min()` and `max()` throw `RangeError` on an empty tree — this matches JavaScript's built-in array method convention.
- `isValid()` must pass min/max bounds to every recursive call, not just check the immediate parent.
- With `noUncheckedIndexedAccess` on, always check array access results against `undefined`.

---

## Cross-References

- **Binary Tree** (`../binary-tree/`): the base `TreeNode<T>` type and traversal functions.
- **AVL Tree** (`../avl-tree/`): self-balancing BST using height tracking — eliminates worst-case O(n).
- **Red-Black Tree** (`../red-black-tree/`): self-balancing BST using color tracking — fewer rotations on average than AVL.
- **Splay Tree** (`../splay-tree/`): self-adjusting BST that splays the most-recently accessed node to the root, giving amortized O(log n) without strict balance guarantees.
