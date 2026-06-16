import { describe, it, expect, beforeEach } from 'vitest'
import { SegmentTree } from './segment-tree.js'

const arr = [1, 3, 2, 5, 7]

describe('SegmentTree construction', () => {
  it('getBuffer() returns an Int32Array', () => {
    const st = new SegmentTree(arr)
    expect(st.getBuffer()).toBeInstanceOf(Int32Array)
  })

  it('rangeSum(0, 4) === 18 (full range)', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeSum(0, 4)).toBe(18)
  })

  it('rangeMin(0, 4) === 1', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMin(0, 4)).toBe(1)
  })

  it('rangeMax(0, 4) === 7', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMax(0, 4)).toBe(7)
  })
})

describe('SegmentTree rangeSum', () => {
  it('rangeSum(1, 3) === 10 (3+2+5)', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeSum(1, 3)).toBe(10)
  })

  it('rangeSum(0, 0) === 1 (single element)', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeSum(0, 0)).toBe(1)
  })

  it('rangeSum(4, 4) === 7 (last element)', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeSum(4, 4)).toBe(7)
  })

  it('rangeSum(l > r) throws RangeError', () => {
    const st = new SegmentTree(arr)
    expect(() => st.rangeSum(3, 1)).toThrow(RangeError)
  })

  it('rangeSum(l < 0) throws RangeError', () => {
    const st = new SegmentTree(arr)
    expect(() => st.rangeSum(-1, 2)).toThrow(RangeError)
  })

  it('rangeSum(r >= n) throws RangeError', () => {
    const st = new SegmentTree(arr)
    expect(() => st.rangeSum(0, 5)).toThrow(RangeError)
  })
})

describe('SegmentTree rangeMin', () => {
  it('rangeMin(0, 2) === 1', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMin(0, 2)).toBe(1)
  })

  it('rangeMin(1, 4) === 2', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMin(1, 4)).toBe(2)
  })
})

describe('SegmentTree rangeMax', () => {
  it('rangeMax(0, 2) === 3', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMax(0, 2)).toBe(3)
  })

  it('rangeMax(2, 4) === 7', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeMax(2, 4)).toBe(7)
  })
})

describe('SegmentTree update', () => {
  it('update(2, 10): rangeSum(0, 4) becomes 26', () => {
    const st = new SegmentTree(arr)
    st.update(2, 10)
    expect(st.rangeSum(0, 4)).toBe(26)
  })

  it('update(2, 10): rangeMax(0, 4) becomes 10', () => {
    const st = new SegmentTree(arr)
    st.update(2, 10)
    expect(st.rangeMax(0, 4)).toBe(10)
  })

  it('update(2, 10): rangeSum(1, 3) updates from 10 to 18', () => {
    const st = new SegmentTree(arr)
    expect(st.rangeSum(1, 3)).toBe(10)
    st.update(2, 10)
    expect(st.rangeSum(1, 3)).toBe(18)
  })
})
