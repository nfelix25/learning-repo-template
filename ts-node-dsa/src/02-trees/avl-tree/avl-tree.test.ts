import { describe, it, expect } from 'vitest'
import { AVLTree } from './avl-tree.js'

describe('rotations', () => {
  it('right rotation (LL case): insert [30,20,10] → root is 20, left is 10, right is 30', () => {
    const avl = new AVLTree()
    avl.insert(30)
    avl.insert(20)
    avl.insert(10)
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
  })

  it('left rotation (RR case): insert [10,20,30] → root is 20, left is 10, right is 30', () => {
    const avl = new AVLTree()
    avl.insert(10)
    avl.insert(20)
    avl.insert(30)
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
  })

  it('left-right rotation (LR case): insert [30,10,20] → root is 20', () => {
    const avl = new AVLTree()
    avl.insert(30)
    avl.insert(10)
    avl.insert(20)
    expect(avl.root?.value).toBe(20)
  })

  it('right-left rotation (RL case): insert [10,30,20] → root is 20', () => {
    const avl = new AVLTree()
    avl.insert(10)
    avl.insert(30)
    avl.insert(20)
    expect(avl.root?.value).toBe(20)
  })
})

describe('balance after insert', () => {
  it('insert 1 through 10 in ascending order (worst case for BST) → isBalanced() is true', () => {
    const avl = new AVLTree()
    for (let i = 1; i <= 10; i++) avl.insert(i)
    expect(avl.isBalanced()).toBe(true)
  })

  it('insert 10 down to 1 in descending order → isBalanced() is true', () => {
    const avl = new AVLTree()
    for (let i = 10; i >= 1; i--) avl.insert(i)
    expect(avl.isBalanced()).toBe(true)
  })

  it('isValidBST() is true after sequential inserts', () => {
    const avl = new AVLTree()
    for (let i = 1; i <= 10; i++) avl.insert(i)
    expect(avl.isValidBST()).toBe(true)
  })
})

describe('balance after delete', () => {
  it('insert [1,2,3,4,5], delete 5 → isBalanced() true', () => {
    const avl = new AVLTree()
    for (const v of [1, 2, 3, 4, 5]) avl.insert(v)
    avl.delete(5)
    expect(avl.isBalanced()).toBe(true)
  })

  it('insert [1,2,3,4,5], delete 1 → isBalanced() true and isValidBST() true', () => {
    const avl = new AVLTree()
    for (const v of [1, 2, 3, 4, 5]) avl.insert(v)
    avl.delete(1)
    expect(avl.isBalanced()).toBe(true)
    expect(avl.isValidBST()).toBe(true)
  })
})

describe('search', () => {
  it('returns true for inserted values', () => {
    const avl = new AVLTree()
    for (const v of [5, 3, 7, 1, 4]) avl.insert(v)
    expect(avl.search(7)).toBe(true)
    expect(avl.search(1)).toBe(true)
  })

  it('returns false for values not inserted', () => {
    const avl = new AVLTree()
    for (const v of [5, 3, 7]) avl.insert(v)
    expect(avl.search(99)).toBe(false)
    expect(avl.search(0)).toBe(false)
  })
})
