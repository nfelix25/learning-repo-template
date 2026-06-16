/**
 * Splay Tree — test suite.
 *
 * Imports from the skeleton (splay-tree.ts). All tests fail until the
 * skeleton is implemented. The solution lives in solution.ts.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { SplayTree, SplayNode } from './splay-tree.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a tree by inserting values in order. Returns the tree. */
function buildTree(values: number[]): SplayTree {
  const t = new SplayTree()
  for (const v of values) t.insert(v)
  return t
}

/** Check BST invariant: inorder array is strictly ascending. */
function isBSTSorted(tree: SplayTree): boolean {
  const arr = tree.inorder()
  for (let i = 1; i < arr.length; i++) {
    if ((arr[i] ?? 0) <= (arr[i - 1] ?? 0)) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// rotateRight
// ---------------------------------------------------------------------------

describe('rotateRight', () => {
  it('x becomes the new subtree root after rotating its parent right', () => {
    // Build: p(10) with left child x(5) — do this manually, not via insert
    // (insert would splay, obscuring what we're testing)
    const t = new SplayTree()
    const p = new SplayNode(10)
    const x = new SplayNode(5)
    p.left = x
    x.parent = p
    t.root = p

    // rotateRight takes the node being rotated UP (x), rotating its parent down
    // Per the skeleton API: rotateRight(x) where x is a left child
    t.rotateRight(x)

    expect(t.root?.value).toBe(5)
    expect(t.root?.right?.value).toBe(10)
    expect(t.root?.left).toBeNull()
    expect(t.root?.right?.left).toBeNull()
  })

  it("x's right child becomes the old parent's left child", () => {
    // p(10), x(5, right=B(7))
    const t = new SplayTree()
    const p = new SplayNode(10)
    const x = new SplayNode(5)
    const B = new SplayNode(7)
    p.left = x
    x.parent = p
    x.right = B
    B.parent = x
    t.root = p

    t.rotateRight(x)

    // After: x(5) is root, x.right = p(10), p.left = B(7)
    expect(t.root?.value).toBe(5)
    expect(t.root?.right?.value).toBe(10)
    expect(t.root?.right?.left?.value).toBe(7)
  })

  it('parent pointers are updated correctly after rotateRight', () => {
    const t = new SplayTree()
    const p = new SplayNode(10)
    const x = new SplayNode(5)
    p.left = x
    x.parent = p
    t.root = p

    t.rotateRight(x)

    expect(x.parent).toBeNull()   // x is new root
    expect(p.parent?.value).toBe(5) // p's parent is now x
  })
})

// ---------------------------------------------------------------------------
// rotateLeft
// ---------------------------------------------------------------------------

describe('rotateLeft', () => {
  it('x becomes the new subtree root after rotating its parent left', () => {
    const t = new SplayTree()
    const p = new SplayNode(5)
    const x = new SplayNode(10)
    p.right = x
    x.parent = p
    t.root = p

    t.rotateLeft(x)

    expect(t.root?.value).toBe(10)
    expect(t.root?.left?.value).toBe(5)
    expect(t.root?.right).toBeNull()
  })

  it("x's left child becomes the old parent's right child", () => {
    const t = new SplayTree()
    const p = new SplayNode(5)
    const x = new SplayNode(10)
    const B = new SplayNode(7)
    p.right = x
    x.parent = p
    x.left = B
    B.parent = x
    t.root = p

    t.rotateLeft(x)

    // After: x(10) is root, x.left = p(5), p.right = B(7)
    expect(t.root?.value).toBe(10)
    expect(t.root?.left?.value).toBe(5)
    expect(t.root?.left?.right?.value).toBe(7)
  })

  it('parent pointers are updated correctly after rotateLeft', () => {
    const t = new SplayTree()
    const p = new SplayNode(5)
    const x = new SplayNode(10)
    p.right = x
    x.parent = p
    t.root = p

    t.rotateLeft(x)

    expect(x.parent).toBeNull()
    expect(p.parent?.value).toBe(10)
  })
})

// ---------------------------------------------------------------------------
// Zig (parent is root — single rotation)
// ---------------------------------------------------------------------------

describe('zig (parent is root)', () => {
  it('left zig: splaying the left child of the root makes it the new root', () => {
    // Insert 10 then 5: after splay 5 becomes root (since insert splays)
    // Use manual construction instead so we can test splay() directly
    const t = new SplayTree()
    const root = new SplayNode(10)
    const node5 = new SplayNode(5)
    root.left = node5
    node5.parent = root
    t.root = root

    t.splay(node5)

    expect(t.root?.value).toBe(5)
    expect(t.root?.right?.value).toBe(10)
    expect(t.root?.left).toBeNull()
  })

  it('right zig: splaying the right child of the root makes it the new root', () => {
    const t = new SplayTree()
    const root = new SplayNode(5)
    const node10 = new SplayNode(10)
    root.right = node10
    node10.parent = root
    t.root = root

    t.splay(node10)

    expect(t.root?.value).toBe(10)
    expect(t.root?.left?.value).toBe(5)
    expect(t.root?.right).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Zig-Zig (same-side — grandparent, parent, node all same direction)
// ---------------------------------------------------------------------------

describe('zig-zig (same-side)', () => {
  it('splaying the leftmost node of a left-left chain makes it the root', () => {
    // Build manually: g(10) -> p(5, left) -> x(1, left)
    const t = new SplayTree()
    const g = new SplayNode(10)
    const p = new SplayNode(5)
    const x = new SplayNode(1)
    g.left = p; p.parent = g
    p.left = x; x.parent = p
    t.root = g

    t.splay(x)

    expect(t.root?.value).toBe(1)
  })

  it('BST invariant is preserved after zig-zig splay', () => {
    // insert [10, 5, 1] — after each insert the inserted node splays to root
    // After all inserts the tree has 1 at root (last inserted)
    const t = buildTree([10, 5, 1])
    expect(isBSTSorted(t)).toBe(true)
  })

  it('inorder traversal is still sorted after zig-zig', () => {
    const t = new SplayTree()
    const g = new SplayNode(10)
    const p = new SplayNode(5)
    const x = new SplayNode(1)
    g.left = p; p.parent = g
    p.left = x; x.parent = p
    t.root = g

    t.splay(x)
    expect(t.inorder()).toEqual([1, 5, 10])
  })
})

// ---------------------------------------------------------------------------
// Zig-Zag (opposite-side)
// ---------------------------------------------------------------------------

describe('zig-zag (opposite-side)', () => {
  it('splaying the inner node (right child of left child) makes it the root', () => {
    // g(10) -> p(5, left) -> x(8, right of p)
    const t = new SplayTree()
    const g = new SplayNode(10)
    const p = new SplayNode(5)
    const x = new SplayNode(8)
    g.left = p; p.parent = g
    p.right = x; x.parent = p
    t.root = g

    t.splay(x)

    expect(t.root?.value).toBe(8)
  })

  it('BST invariant is preserved after zig-zag splay', () => {
    // [10, 5, 8]: 8 is right child of 5 (left child of 10) → zig-zag on 8
    const t = buildTree([10, 5, 8])
    expect(isBSTSorted(t)).toBe(true)
  })

  it('inorder traversal is still sorted after zig-zag', () => {
    const t = new SplayTree()
    const g = new SplayNode(10)
    const p = new SplayNode(5)
    const x = new SplayNode(8)
    g.left = p; p.parent = g
    p.right = x; x.parent = p
    t.root = g

    t.splay(x)
    expect(t.inorder()).toEqual([5, 8, 10])
  })
})

// ---------------------------------------------------------------------------
// insert
// ---------------------------------------------------------------------------

describe('insert', () => {
  it('inserted value becomes the root', () => {
    const t = new SplayTree()
    t.insert(42)
    expect(t.root?.value).toBe(42)
  })

  it('most recently inserted value is always the root', () => {
    const t = new SplayTree()
    t.insert(10)
    t.insert(5)
    t.insert(20)
    expect(t.root?.value).toBe(20)
  })

  it('inorder() is sorted after multiple inserts', () => {
    const t = buildTree([10, 5, 20, 3, 7, 15, 25])
    expect(t.inorder()).toEqual([3, 5, 7, 10, 15, 20, 25])
  })

  it('size increments on each unique insert', () => {
    const t = new SplayTree()
    expect(t.size).toBe(0)
    t.insert(1)
    expect(t.size).toBe(1)
    t.insert(2)
    expect(t.size).toBe(2)
    t.insert(3)
    expect(t.size).toBe(3)
  })

  it('duplicate insert does not increase size', () => {
    const t = new SplayTree()
    t.insert(5)
    t.insert(5)
    expect(t.size).toBe(1)
  })

  it('duplicate insert still splays the node to root', () => {
    const t = buildTree([10, 5, 20])
    t.insert(10) // duplicate
    expect(t.root?.value).toBe(10)
  })
})

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

describe('search', () => {
  let t: SplayTree

  beforeEach(() => {
    t = buildTree([10, 5, 20, 3, 7, 15, 25])
  })

  it('returns true when the value is in the tree', () => {
    expect(t.search(7)).toBe(true)
  })

  it('found node is splayed to the root', () => {
    t.search(15)
    expect(t.root?.value).toBe(15)
  })

  it('returns false when the value is not in the tree', () => {
    expect(t.search(99)).toBe(false)
  })

  it('BST ordering is preserved after a failed search', () => {
    t.search(99)
    expect(isBSTSorted(t)).toBe(true)
  })

  it('returns false on an empty tree', () => {
    const empty = new SplayTree()
    expect(empty.search(1)).toBe(false)
  })

  it('search on single-node tree: found returns true and root stays', () => {
    const single = new SplayTree()
    single.insert(42)
    expect(single.search(42)).toBe(true)
    expect(single.root?.value).toBe(42)
  })
})

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

describe('delete', () => {
  let t: SplayTree

  beforeEach(() => {
    t = buildTree([10, 5, 20, 3, 7, 15, 25])
  })

  it('deleted value is no longer in inorder()', () => {
    t.delete(10)
    expect(t.inorder()).not.toContain(10)
  })

  it('inorder() remains sorted after delete', () => {
    t.delete(5)
    expect(isBSTSorted(t)).toBe(true)
  })

  it('delete returns false when value is not found', () => {
    expect(t.delete(99)).toBe(false)
  })

  it('size decrements on a successful delete', () => {
    const before = t.size
    t.delete(7)
    expect(t.size).toBe(before - 1)
  })

  it('size does not change when delete misses', () => {
    const before = t.size
    t.delete(99)
    expect(t.size).toBe(before)
  })

  it('can delete all elements one by one without error', () => {
    const values = [10, 5, 20, 3, 7, 15, 25]
    for (const v of values) {
      t.delete(v)
    }
    expect(t.size).toBe(0)
    expect(t.root).toBeNull()
  })

  it('can delete a leaf node', () => {
    t.delete(3) // leaf
    expect(t.inorder()).not.toContain(3)
    expect(isBSTSorted(t)).toBe(true)
  })

  it('can delete a node with two children', () => {
    t.delete(20) // has children 15 and 25
    expect(t.inorder()).not.toContain(20)
    expect(isBSTSorted(t)).toBe(true)
  })

  it('delete returns true on a successful delete', () => {
    expect(t.delete(10)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// height
// ---------------------------------------------------------------------------

describe('height', () => {
  it('empty tree has height 0', () => {
    expect(new SplayTree().height()).toBe(0)
  })

  it('single node has height 1', () => {
    const t = new SplayTree()
    t.insert(1)
    expect(t.height()).toBe(1)
  })

  it('two nodes have height 2', () => {
    // After insert(1) then insert(2): 2 at root, 1 at left → height 2
    // (actual height depends on structure, but must be >= 2)
    const t = new SplayTree()
    t.insert(1)
    t.insert(2)
    expect(t.height()).toBeGreaterThanOrEqual(2)
  })

  it('height is at least ceil(log2(n+1)) for a balanced tree', () => {
    const t = buildTree([4, 2, 6, 1, 3, 5, 7])
    // 7 nodes → min height is 3
    expect(t.height()).toBeGreaterThanOrEqual(3)
  })
})
