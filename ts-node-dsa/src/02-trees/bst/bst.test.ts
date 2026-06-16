import { describe, it, expect, beforeEach } from 'vitest'
import { BST, BSTNode } from './bst.js'

describe('insert', () => {
  it('insert into empty BST becomes root', () => {
    const bst = new BST()
    bst.insert(5)
    expect(bst.root?.value).toBe(5)
    expect(bst.size).toBe(1)
  })

  it('insert smaller than root goes to left child', () => {
    const bst = new BST()
    bst.insert(5)
    bst.insert(3)
    expect(bst.root?.left?.value).toBe(3)
  })

  it('insert larger than root goes to right child', () => {
    const bst = new BST()
    bst.insert(5)
    bst.insert(7)
    expect(bst.root?.right?.value).toBe(7)
  })

  it('insert sequence [5,3,7,1,4,6,8] yields inorder [1,3,4,5,6,7,8]', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4, 6, 8]) bst.insert(v)
    expect(bst.inorder()).toEqual([1, 3, 4, 5, 6, 7, 8])
  })

  it('inserting a duplicate leaves size unchanged (duplicates ignored)', () => {
    const bst = new BST()
    bst.insert(5)
    bst.insert(5)
    expect(bst.size).toBe(1)
  })
})

describe('search', () => {
  it('search for existing value returns BSTNode with correct value', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    const node = bst.search(3)
    expect(node).not.toBeNull()
    expect(node?.value).toBe(3)
  })

  it('search for non-existing value returns null', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    expect(bst.search(99)).toBeNull()
  })

  it('search on empty BST returns null', () => {
    const bst = new BST()
    expect(bst.search(1)).toBeNull()
  })
})

describe('delete', () => {
  it('delete leaf: parent pointer becomes null', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    bst.delete(3)
    expect(bst.root?.left).toBeNull()
    expect(bst.size).toBe(2)
  })

  it('delete node with only left child: left child replaces it', () => {
    const bst = new BST()
    // 5 -> left: 3 -> left: 1 (3 has only left child)
    for (const v of [5, 3, 1]) bst.insert(v)
    bst.delete(3)
    expect(bst.root?.left?.value).toBe(1)
    expect(bst.size).toBe(2)
  })

  it('delete node with only right child: right child replaces it', () => {
    const bst = new BST()
    // 5 -> left: 3 -> right: 4 (3 has only right child)
    for (const v of [5, 3, 4]) bst.insert(v)
    bst.delete(3)
    expect(bst.root?.left?.value).toBe(4)
    expect(bst.size).toBe(2)
  })

  it('delete node with two children: replaced by in-order successor, BST invariant maintained', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4, 6, 8]) bst.insert(v)
    bst.delete(3)
    expect(bst.isValid()).toBe(true)
    expect(bst.inorder()).toEqual([1, 4, 5, 6, 7, 8])
  })

  it('delete root with two children: in-order successor becomes new root', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 6, 8]) bst.insert(v)
    bst.delete(5)
    expect(bst.root?.value).toBe(6)
    expect(bst.isValid()).toBe(true)
  })

  it('delete non-existing value: tree unchanged, no error', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    expect(() => bst.delete(99)).not.toThrow()
    expect(bst.size).toBe(3)
  })
})

describe('min/max/predecessor/successor', () => {
  it('min returns leftmost value', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4]) bst.insert(v)
    expect(bst.min()).toBe(1)
  })

  it('max returns rightmost value', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4]) bst.insert(v)
    expect(bst.max()).toBe(7)
  })

  it('min on empty tree throws RangeError', () => {
    const bst = new BST()
    expect(() => bst.min()).toThrow(RangeError)
  })

  it('predecessor returns largest value less than given value', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4, 6, 8]) bst.insert(v)
    expect(bst.predecessor(5)).toBe(4)
    expect(bst.predecessor(7)).toBe(6)
  })

  it('predecessor of min value returns null', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    expect(bst.predecessor(3)).toBeNull()
  })

  it('successor returns smallest value greater than given value', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4, 6, 8]) bst.insert(v)
    expect(bst.successor(5)).toBe(6)
    expect(bst.successor(3)).toBe(4)
  })

  it('successor of max value returns null', () => {
    const bst = new BST()
    for (const v of [5, 3, 7]) bst.insert(v)
    expect(bst.successor(7)).toBeNull()
  })
})

describe('isValid', () => {
  it('valid BST returns true', () => {
    const bst = new BST()
    for (const v of [5, 3, 7, 1, 4, 6, 8]) bst.insert(v)
    expect(bst.isValid()).toBe(true)
  })

  it('tree with subtree violation (not just parent violation) returns false', () => {
    // Build a valid BST [5,3,7], then manually attach a node with value 7 as left
    // child of 5's left (3). Node 7 is > 5, so it cannot be in the left subtree of 5.
    const bst = new BST()
    bst.insert(5)
    bst.insert(3)
    bst.insert(7)
    // Manually attach a BSTNode with value 7 as left child of node 3
    // (7 > 5 = root, so this violates the subtree invariant for root)
    const badNode = new BSTNode(7)
    if (bst.root?.left !== null && bst.root?.left !== undefined) {
      bst.root.left.left = badNode
    }
    expect(bst.isValid()).toBe(false)
  })
})
