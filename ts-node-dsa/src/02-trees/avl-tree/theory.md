# AVL Tree

## Concept

An **AVL Tree** (Adelson-Velsky and Landis, 1962) is a self-balancing Binary Search Tree. After every insert or delete, it checks the **balance factor** of each affected node and performs rotations to restore balance.

### Balance Factor

```
balanceFactor(node) = height(right subtree) - height(left subtree)
```

An AVL tree maintains the invariant: for every node, `balanceFactor ∈ {-1, 0, 1}`.

- `-1`: left-heavy by one level
- `0`: perfectly balanced
- `+1`: right-heavy by one level

If the balance factor becomes `±2`, the tree is unbalanced and requires a rotation.

### Node Structure

```typescript
class AVLNode {
  value: number
  left: AVLNode | null
  right: AVLNode | null
  height: number   // cached height for O(1) balance factor computation
}
```

Caching height avoids recomputing it from scratch on every insert/delete.

---

## The Four Rotation Cases

### Case 1: LL — Right Rotation (Left-heavy, Left subtree is left-heavy)

```
Right Rotation:
    z              y
   / \           /   \
  y   T4   →   x     z
 / \           / \   / \
x   T3        T1 T2 T3 T4
```

Triggered when: `balanceFactor(z) = -2` and `balanceFactor(y) ≤ 0`.

```
rightRotate(z):
  y = z.left
  T3 = y.right
  y.right = z
  z.left = T3
  update heights of z, then y
  return y
```

### Case 2: RR — Left Rotation (Right-heavy, Right subtree is right-heavy)

```
Left Rotation:
  z                y
 / \             /   \
T1   y    →    z     x
    / \        / \   / \
   T2  x      T1 T2 T3 T4
      / \
     T3  T4
```

Triggered when: `balanceFactor(z) = +2` and `balanceFactor(y) ≥ 0`.

### Case 3: LR — Left-Right Double Rotation (Left-heavy, Right subtree of left child is heavy)

```
Step 1 — Left rotate y:        Step 2 — Right rotate z:
     z             z              x
    / \           / \           /   \
   y   T4   →   x   T4   →   y     z
  / \          / \           / \   / \
 T1   x       y  T3        T1 T2 T3 T4
     / \     / \
    T2  T3  T1  T2
```

Triggered when: `balanceFactor(z) = -2` and `balanceFactor(y) > 0`.

```
leftRightRotate(z):
  z.left = leftRotate(z.left)
  return rightRotate(z)
```

### Case 4: RL — Right-Left Double Rotation (Right-heavy, Left subtree of right child is heavy)

```
Step 1 — Right rotate y:       Step 2 — Left rotate z:
  z               z                  x
 / \             / \               /   \
T1   y    →    T1   x     →     z     y
    / \            / \          / \   / \
   x   T4         T2  y       T1 T2 T3 T4
  / \                / \
 T2  T3             T3  T4
```

Triggered when: `balanceFactor(z) = +2` and `balanceFactor(y) < 0`.

---

## Height Update Rule

After any rotation or structural change, update heights bottom-up:

```
height(node) = 1 + max(height(node.left), height(node.right))
```

Always update child heights before parent heights.

---

## Insert Algorithm

1. Perform standard BST insert recursively.
2. On the way back up (unwinding recursion), update the height of each ancestor.
3. Compute the balance factor. If `|bf| > 1`, perform the appropriate rotation.
4. Return the (possibly rotated) subtree root.

---

## Delete Algorithm

1. Perform standard BST delete recursively (replace with in-order successor for two-child case).
2. On the way back up, update heights and rebalance.
3. After deleting, up to O(log n) rotations may be needed (vs at most 2 for insert).

---

## Complexity

| Operation | Time       | Space |
|-----------|------------|-------|
| Insert    | O(log n)   | O(log n) stack |
| Delete    | O(log n)   | O(log n) stack |
| Search    | O(log n)   | O(1)  |
| Traversal | O(n)       | O(n)  |
| Height    | O(1)*      | O(1)  |

*O(1) height access because height is cached in each node.

Guaranteed O(log n) because the AVL invariant keeps height ≤ 1.44 × log₂(n+2).

---

## TypeScript Callouts

- `height` is stored as `number` on every node (0 for null, updated after rotations).
- Helper function: `nodeHeight(node: AVLNode | null): number` returns `0` for null safely.
- After each rotation, update heights in order: first the node that moved down, then the node that moved up.
- `isBalanced()` should traverse every node and check `|balanceFactor| ≤ 1` — do not rely on the stored height field alone for testing.

---

## Cross-References

- **BST** (`../bst/`): plain BST that AVL tree extends with balancing. AVL operations are BST operations plus rotations.
- **Red-Black Tree** (`../red-black-tree/`): alternative self-balancing approach using colors. Red-Black trees do fewer rotations on average (better for insert-heavy workloads); AVL trees are more strictly balanced (better for read-heavy workloads).
- **B-Tree** (`../b-tree/`): generalizes the idea of balance to wider nodes; used in databases.
