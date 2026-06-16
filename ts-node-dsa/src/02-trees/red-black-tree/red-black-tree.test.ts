import { describe, it, expect } from 'vitest'
import { RedBlackTree } from './red-black-tree.js'

describe('insert invariants', () => {
  it('root is black after any number of inserts', () => {
    const rb = new RedBlackTree()
    for (const v of [1, 2, 3, 4, 5, 6, 7]) rb.insert(v)
    expect(rb.isRootBlack()).toBe(true)
  })

  it('no red node has a red parent after inserting [1..7] in order', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    expect(rb.hasNoRedRedViolation()).toBe(true)
  })

  it('uniform black height after inserting [1..7] in order', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })

  it('isValidBST() true after inserts', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    expect(rb.isValidBST()).toBe(true)
  })
})

describe('insert cases', () => {
  it('uncle red (case 1): insert [10,20,15] — root is black after recolor', () => {
    const rb = new RedBlackTree()
    rb.insert(10)
    rb.insert(20)
    rb.insert(15)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
  })

  it('uncle black outer (case 3): insert [10,5,1] — triggers right rotation, invariants hold', () => {
    const rb = new RedBlackTree()
    rb.insert(10)
    rb.insert(5)
    rb.insert(1)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })

  it('uncle black inner (case 2+3): insert [10,5,8] — triggers LR double rotation, invariants hold', () => {
    const rb = new RedBlackTree()
    rb.insert(10)
    rb.insert(5)
    rb.insert(8)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })
})

describe('delete invariants', () => {
  it('root is black after delete', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    rb.delete(4)
    expect(rb.isRootBlack()).toBe(true)
  })

  it('no red-red violation after delete', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    rb.delete(3)
    expect(rb.hasNoRedRedViolation()).toBe(true)
  })

  it('uniform black height after delete', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    rb.delete(5)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })

  it('BST order preserved after delete', () => {
    const rb = new RedBlackTree()
    for (let i = 1; i <= 7; i++) rb.insert(i)
    rb.delete(3)
    expect(rb.isValidBST()).toBe(true)
    expect(rb.inorder()).toEqual([1, 2, 4, 5, 6, 7])
  })
})

describe('delete cases', () => {
  it('delete red leaf: invariants hold', () => {
    const rb = new RedBlackTree()
    // Insert enough so at least one red leaf exists
    for (const v of [10, 5, 15, 3]) rb.insert(v)
    rb.delete(3)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })

  it('delete black node with red sibling: rotations and recolor, invariants hold', () => {
    const rb = new RedBlackTree()
    for (const v of [10, 5, 15, 3, 7]) rb.insert(v)
    rb.delete(15)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })

  it('root delete with two children: invariants hold', () => {
    const rb = new RedBlackTree()
    for (const v of [10, 5, 15]) rb.insert(v)
    rb.delete(10)
    expect(rb.isRootBlack()).toBe(true)
    expect(rb.hasNoRedRedViolation()).toBe(true)
    expect(rb.hasUniformBlackHeight()).toBe(true)
  })
})
