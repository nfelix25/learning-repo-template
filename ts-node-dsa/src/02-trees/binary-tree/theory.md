# Binary Tree

## Concept

A **binary tree** is a hierarchical data structure where each node has at most two children, referred to as the **left** child and the **right** child. Unlike a BST, a plain binary tree imposes no ordering invariant — any value can appear anywhere.

### TreeNode<T> model

```typescript
class TreeNode<T> {
  value: T
  left: TreeNode<T> | null
  right: TreeNode<T> | null
}
```

This generic node type is the foundation reused in BST, AVL, Red-Black, Splay, and Huffman tree modules. Binary tree traversal functions operate on any `TreeNode<T>` regardless of ordering.

---

## Example Tree

```
        4
       / \
      2   6
     / \ / \
    1  3 5  7
```

---

## The Four Traversals

### 1. Inorder (Left → Root → Right)

Visit the left subtree, then the current node, then the right subtree.

Result for the example: **1, 2, 3, 4, 5, 6, 7**

For a BST, inorder traversal always yields values in sorted ascending order.

```
Recursive:
  inorder(node):
    inorder(node.left)
    visit(node)
    inorder(node.right)
```

### 2. Preorder (Root → Left → Right)

Visit the current node first, then recurse left, then right.

Result: **4, 2, 1, 3, 6, 5, 7**

Useful for: copying/serializing a tree (parent before children), expression tree evaluation.

```
Recursive:
  preorder(node):
    visit(node)
    preorder(node.left)
    preorder(node.right)
```

### 3. Postorder (Left → Right → Root)

Visit both subtrees before the current node.

Result: **1, 3, 2, 5, 7, 6, 4**

Useful for: deleting a tree (children before parent), computing directory sizes.

```
Recursive:
  postorder(node):
    postorder(node.left)
    postorder(node.right)
    visit(node)
```

### 4. Level-Order (Breadth-First)

Visit nodes level by level, left to right. Requires a queue.

Result: **4, 2, 6, 1, 3, 5, 7**

Useful for: finding the shortest path in an unweighted tree, printing by levels.

```
Iterative (queue required):
  levelOrder(root):
    queue = [root]
    while queue not empty:
      node = queue.dequeue()
      visit(node)
      if node.left: queue.enqueue(node.left)
      if node.right: queue.enqueue(node.right)
```

---

## Recursion vs Iteration

| Traversal   | Recursive | Iterative (stack/queue) |
|-------------|-----------|------------------------|
| Inorder     | Simple    | Needs explicit stack   |
| Preorder    | Simple    | Needs explicit stack   |
| Postorder   | Simple    | Needs two stacks or deque |
| Level-order | Awkward   | Natural with a queue   |

Recursive implementations risk **stack overflow** on very deep trees (e.g., a degenerate BST with 100,000 nodes). Iterative implementations avoid this at the cost of managing an explicit data structure.

---

## Height

The **height** of a tree is the number of edges on the longest path from root to a leaf — equivalently, the number of **levels**.

- `height(null)` = 0
- `height(leaf)` = 1
- `height(node)` = 1 + max(height(left), height(right))

For the example tree, height = 3.

```
height recursive:
  height(node):
    if node is null: return 0
    return 1 + max(height(node.left), height(node.right))
```

---

## Complexity

| Operation    | Time (balanced) | Time (degenerate) | Space |
|--------------|-----------------|-------------------|-------|
| Any traversal | O(n)           | O(n)              | O(h)  |
| Height        | O(n)           | O(n)              | O(h)  |

Where `h` = height of tree. For a balanced tree h = O(log n); for a degenerate (linked-list) tree h = O(n).

---

## TypeScript Callouts

- `TreeNode<T>` is generic — use it with any comparable or non-comparable type.
- With `noUncheckedIndexedAccess` enabled, array accesses return `T | undefined`. Use explicit null/undefined checks.
- `exactOptionalPropertyTypes` means you cannot set `left: undefined` — use `null` for absent children.
- All traversal functions return `T[]`, so an empty tree returns `[]` (not null or undefined).

---

## Cross-References

- **BST** (`../bst/`): adds the ordering invariant to `TreeNode<number>`. Inorder traversal of a BST yields sorted output.
- **AVL Tree** (`../avl-tree/`): augments the node with a `height` field to maintain balance.
- **Red-Black Tree** (`../red-black-tree/`): augments the node with a `color` field and uses a sentinel nil node.
- **Splay Tree** (`../splay-tree/`): self-adjusting BST that splays accessed nodes to the root.
- **Huffman Tree** (`../huffman-tree/`): a binary tree built bottom-up from frequency-weighted leaves.
