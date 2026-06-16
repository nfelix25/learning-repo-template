import { describe, it, expect } from 'vitest'
import { BTree } from './b-tree.js'

// Using order=3 (2-3 tree) for clarity:
// - Max keys per node: 2
// - Min keys per non-root node: 1
// - Max children per node: 3

describe('insert', () => {
  it('insert into non-full leaf: key is in correct sorted position', () => {
    const bt = new BTree(3)
    bt.insert(10)
    bt.insert(5)
    // Root is a leaf with keys [5, 10]
    expect(bt.root.keys).toEqual([5, 10])
    expect(bt.size).toBe(2)
  })

  it('insert triggering leaf split: median promoted, parent gains a key', () => {
    const bt = new BTree(3)
    bt.insert(10)
    bt.insert(20)
    bt.insert(30) // triggers split: root was full after 2 keys, split on insert of 3rd
    // Root should now have one key (median) and two children
    expect(bt.root.keys.length).toBe(1)
    expect(bt.root.children.length).toBe(2)
    expect(bt.leavesAtSameDepth()).toBe(true)
  })

  it('insert triggering root split: new root created, tree height increases', () => {
    const bt = new BTree(3)
    // Fill and split multiple times to force root split
    for (const v of [10, 20, 30, 40, 50]) bt.insert(v)
    // After 5 inserts into an order-3 tree, height must be > 1
    expect(bt.root.isLeaf).toBe(false)
    expect(bt.leavesAtSameDepth()).toBe(true)
  })

  it('inserting [1..10] in order: inorder() yields [1..10], leavesAtSameDepth() true', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 10; i++) bt.insert(i)
    expect(bt.inorder()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(bt.leavesAtSameDepth()).toBe(true)
  })
})

describe('search', () => {
  it('search for existing key returns true', () => {
    const bt = new BTree(3)
    for (const v of [10, 20, 30, 5, 15]) bt.insert(v)
    expect(bt.search(15)).toBe(true)
    expect(bt.search(5)).toBe(true)
  })

  it('search for non-existing key returns false', () => {
    const bt = new BTree(3)
    for (const v of [10, 20, 30]) bt.insert(v)
    expect(bt.search(99)).toBe(false)
  })

  it('search on empty tree returns false', () => {
    const bt = new BTree(3)
    expect(bt.search(1)).toBe(false)
  })
})

describe('delete', () => {
  it('delete from leaf with excess keys: key removed, leaf still valid', () => {
    const bt = new BTree(3)
    bt.insert(10)
    bt.insert(20) // leaf has [10, 20] — excess keys
    bt.delete(10)
    expect(bt.search(10)).toBe(false)
    expect(bt.search(20)).toBe(true)
    expect(bt.isValid()).toBe(true)
  })

  it('delete causing underflow and borrow/merge: invariants maintained', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 6; i++) bt.insert(i)
    bt.delete(1)
    expect(bt.isValid()).toBe(true)
    expect(bt.inorder()).toEqual([2, 3, 4, 5, 6])
  })

  it('delete key from internal node: replaced by predecessor or successor, BST correct', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 7; i++) bt.insert(i)
    // After inserts, some keys are internal; delete an internal key
    bt.delete(4) // likely an internal key in a 7-key order-3 tree
    expect(bt.isValid()).toBe(true)
    expect(bt.inorder()).toEqual([1, 2, 3, 5, 6, 7])
  })

  it('inorder() is correct after a sequence of deletes', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 10; i++) bt.insert(i)
    bt.delete(3)
    bt.delete(7)
    bt.delete(1)
    expect(bt.inorder()).toEqual([2, 4, 5, 6, 8, 9, 10])
  })
})

describe('invariants after operations', () => {
  it('isValid() true after any mix of inserts and deletes', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 15; i++) bt.insert(i)
    for (const v of [3, 7, 11, 1, 15]) bt.delete(v)
    expect(bt.isValid()).toBe(true)
  })

  it('leavesAtSameDepth() true after any mix of inserts and deletes', () => {
    const bt = new BTree(3)
    for (let i = 1; i <= 15; i++) bt.insert(i)
    for (const v of [5, 10, 2, 14]) bt.delete(v)
    expect(bt.leavesAtSameDepth()).toBe(true)
  })
})
