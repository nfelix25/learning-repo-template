# Red-Black Tree

## Concept

A **Red-Black Tree** is a self-balancing Binary Search Tree where every node is colored either **red** or **black**. The coloring rules guarantee that the tree remains approximately balanced, ensuring O(log n) worst-case operations.

---

## The Five Red-Black Properties

1. **Every node is red or black.**
2. **The root is black.**
3. **Every null leaf (NIL sentinel) is black.**
4. **A red node has only black children** — no two consecutive red nodes on any path.
5. **All paths from any node to its descendant null leaves have the same number of black nodes** (called the **black-height**).

Properties 4 and 5 together guarantee that the longest path from root to leaf (alternating red-black) is at most twice the shortest path (all black). This gives height ≤ 2 × log₂(n+1).

### Sentinel NIL Node

Rather than using `null` for empty leaf pointers, a Red-Black Tree uses a single shared **NIL sentinel** — a permanent black node. All leaf pointers point to NIL instead of null. This simplifies fixup code because you can always read `.color` without null checks.

```typescript
const nil: RBNode = new RBNode(0, BLACK)
nil.left = nil
nil.right = nil
nil.parent = nil
```

---

## Insert Fixup

New nodes are always inserted as **red**. This may violate Property 4 (red parent + red child). The fixup procedure handles three cases, applied while the parent is red.

**Setup**: `z` = newly inserted node, `z.parent` = red, `z.parent.parent` = black (exists because root is always black).

### Case 1: Uncle is Red

Recolor parent and uncle to black, grandparent to red, then move `z` up to grandparent and continue fixing.

```
Before:                     After:
       B(G)                      R(G)  ← z moves here
      / \                        / \
    R(P)  R(U)    →           B(P)  B(U)
    /
  R(z)
```

### Case 2: Uncle is Black, z is Inner Child (LR or RL)

Rotate the parent to make `z` an outer child, then fall through to Case 3.

```
z is right child of left-child parent:
       B(G)                  B(G)
      / \                   / \
    R(P)  B(U)   →       R(z)  B(U)
      \                  /
      R(z)            R(P)
```

### Case 3: Uncle is Black, z is Outer Child (LL or RR)

Rotate grandparent, swap colors of parent and grandparent.

```
       B(G)                 B(P)
      / \                  / \
    R(P)  B(U)   →      R(z)  R(G)
    /                          \
  R(z)                         B(U)
```

After Case 3, the subtree root (P) is black — fixup terminates.

---

## Delete Fixup

Deletion is significantly more complex. When a **black** node is removed, the black-height property (Property 5) may be violated. The deleted position gets a "double-black" marker.

Let `x` = the node that replaced the deleted node (could be NIL). The fixup loop runs while `x` is not root and `x` is black.

**Setup**: `w` = sibling of `x`.

### Case 1: Sibling w is Red

Rotate parent toward `x`, recolor `w` black and parent red. This transforms the situation into Cases 2, 3, or 4 (sibling becomes black).

```
       B(P)                    B(w)
      /    \                  /    \
   B(x)   R(w)   →         R(P)   B(D)
           / \             /    \
         B(C) B(D)       B(x)  B(C)
```

### Case 2: Sibling w is Black with Two Black Children

Recolor `w` red. Move the double-black up to the parent. If parent was red, color it black and done. If parent was black, continue the loop.

### Case 3: Sibling w is Black with Red Near Child (Inner) and Black Far Child

Rotate `w` toward the far side, swap colors of `w` and its near child. Transforms into Case 4.

### Case 4: Sibling w is Black with Red Far Child

Rotate parent toward `x`. Recolor:
- `w` takes parent's color
- Parent becomes black
- `w`'s far child becomes black

This resolves the double-black. Fixup terminates.

---

## Complexity

| Operation | Time       |
|-----------|------------|
| Insert    | O(log n)   |
| Delete    | O(log n)   |
| Search    | O(log n)   |
| Traversal | O(n)       |

### RB vs AVL in Practice

| Property              | Red-Black | AVL           |
|-----------------------|-----------|---------------|
| Balance guarantee     | 2× log n  | 1.44× log n   |
| Rotations on insert   | ≤ 2       | ≤ 2           |
| Rotations on delete   | ≤ 3       | O(log n)      |
| Best for              | Insert/delete-heavy | Read-heavy |

Red-Black trees are used in: Linux kernel scheduler (CFS), C++ `std::map`, Java `TreeMap`, and `nginx` timer management.

---

## TypeScript Callouts

- `RED = 0`, `BLACK = 1` as `const` avoids enum overhead.
- The sentinel `nil` node is an `RBNode` with color `BLACK`. Treat `nil` as null in all structural operations but always `BLACK` in color checks.
- With `strictPropertyInitialization`, initialize all node fields in the constructor. The `nil` node requires a bootstrapping step: create it, then set its own pointers to itself.
- Iterative fixup loops (not recursive) are preferred to avoid call-stack concerns and to match the classic CLRS presentation.

---

## Cross-References

- **BST** (`../bst/`): the base BST operations that RB tree augments with color-based balancing.
- **AVL Tree** (`../avl-tree/`): an alternative self-balancing approach using height tracking. More strictly balanced than RB trees.
- **B-Tree** (`../b-tree/`): a 2-3-4 B-Tree (order 4) is isomorphic to a Red-Black Tree — each black RB node with its red children corresponds to one B-tree node.
