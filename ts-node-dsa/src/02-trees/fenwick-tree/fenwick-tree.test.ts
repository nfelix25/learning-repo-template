import { describe, it, expect } from 'vitest'
import { FenwickTree } from './fenwick-tree.js'

describe('FenwickTree construction', () => {
  it('getBuffer() returns an Int32Array', () => {
    const ft = new FenwickTree(5)
    expect(ft.getBuffer()).toBeInstanceOf(Int32Array)
  })

  it('empty tree: prefixSum of any index is 0', () => {
    const ft = new FenwickTree(5)
    expect(ft.prefixSum(0)).toBe(0)
    expect(ft.prefixSum(4)).toBe(0)
  })
})

describe('FenwickTree update', () => {
  it('update(2, 10): prefixSum(2) increases by 10', () => {
    const ft = new FenwickTree(5)
    const before = ft.prefixSum(2)
    ft.update(2, 10)
    expect(ft.prefixSum(2)).toBe(before + 10)
  })

  it('update(2, 10): prefixSum(4) also increases by 10 (i >= 2)', () => {
    const ft = new FenwickTree(5)
    const before = ft.prefixSum(4)
    ft.update(2, 10)
    expect(ft.prefixSum(4)).toBe(before + 10)
  })

  it('update(0, 5): prefixSum(j) for all j >= 0 increases by 5', () => {
    const ft = new FenwickTree(5)
    ft.update(0, 5)
    for (let j = 0; j < 5; j++) {
      expect(ft.prefixSum(j)).toBe(5)
    }
  })
})

describe('FenwickTree prefixSum', () => {
  it('fromArray([1,3,2,5,7]): prefixSum values are correct', () => {
    const ft = FenwickTree.fromArray([1, 3, 2, 5, 7])
    expect(ft.prefixSum(0)).toBe(1)
    expect(ft.prefixSum(1)).toBe(4)
    expect(ft.prefixSum(2)).toBe(6)
    expect(ft.prefixSum(3)).toBe(11)
    expect(ft.prefixSum(4)).toBe(18)
  })

  it('prefixSum(n-1) === sum of all elements', () => {
    const arr = [1, 3, 2, 5, 7]
    const ft = FenwickTree.fromArray(arr)
    const total = arr.reduce((a, b) => a + b, 0)
    expect(ft.prefixSum(ft.n - 1)).toBe(total)
  })
})

describe('FenwickTree rangeSum', () => {
  it('rangeSum(1, 3) === 10 (3+2+5)', () => {
    const ft = FenwickTree.fromArray([1, 3, 2, 5, 7])
    expect(ft.rangeSum(1, 3)).toBe(10)
  })

  it('rangeSum(l, l) === single element value', () => {
    const ft = FenwickTree.fromArray([1, 3, 2, 5, 7])
    expect(ft.rangeSum(2, 2)).toBe(2)
    expect(ft.rangeSum(0, 0)).toBe(1)
  })

  it('rangeSum(0, n-1) === prefixSum(n-1)', () => {
    const ft = FenwickTree.fromArray([1, 3, 2, 5, 7])
    expect(ft.rangeSum(0, ft.n - 1)).toBe(ft.prefixSum(ft.n - 1))
  })
})

describe('FenwickTree bit trick', () => {
  it('lowbit of 6 is 2 (i & -i)', () => {
    // Documents the core bit trick: extracting the lowest set bit
    // 6 = 0b0110 → 6 & -6 = 0b0010 = 2
    expect(6 & -6).toBe(2)
  })

  it('lowbit of 12 is 4', () => {
    // 12 = 0b1100 → 12 & -12 = 0b0100 = 4
    expect(12 & -12).toBe(4)
  })

  it('lowbit of 8 is 8 (power of two)', () => {
    expect(8 & -8).toBe(8)
  })
})
