/**
 * Finger Tree — test suite.
 *
 * Imports from the skeleton (finger-tree.ts). All tests fail until the
 * skeleton is implemented. The solution lives in solution.ts.
 */

import { describe, it, expect } from 'vitest'
import {
  empty,
  isEmpty,
  size,
  pushFront,
  pushBack,
  peekFront,
  peekBack,
  popFront,
  popBack,
  concat,
  toArray,
  fromArray,
} from './finger-tree.js'

// ---------------------------------------------------------------------------
// empty
// ---------------------------------------------------------------------------

describe('empty', () => {
  it('isEmpty(empty) is true', () => {
    expect(isEmpty(empty)).toBe(true)
  })

  it('size(empty) is 0', () => {
    expect(size(empty)).toBe(0)
  })

  it('peekFront(empty) throws', () => {
    expect(() => peekFront(empty)).toThrow()
  })

  it('peekBack(empty) throws', () => {
    expect(() => peekBack(empty)).toThrow()
  })

  it('popFront(empty) throws', () => {
    expect(() => popFront(empty)).toThrow()
  })

  it('popBack(empty) throws', () => {
    expect(() => popBack(empty)).toThrow()
  })
})

// ---------------------------------------------------------------------------
// pushFront
// ---------------------------------------------------------------------------

describe('pushFront', () => {
  it('pushFront into empty: peekFront returns that value', () => {
    const t = pushFront(empty, 1)
    expect(peekFront(t)).toBe(1)
  })

  it('pushFront into empty: size becomes 1', () => {
    const t = pushFront(empty, 1)
    expect(size(t)).toBe(1)
  })

  it('pushFront multiple: peekFront returns the most recently pushed value', () => {
    let t: FingerTree<number> = pushFront(empty, 1)
    t = pushFront(t, 2)
    t = pushFront(t, 3)
    expect(peekFront(t)).toBe(3)
  })

  it('persistence: original tree is unchanged after pushFront', () => {
    const t1 = pushFront(empty, 1)
    pushFront(t1, 2) // result discarded
    expect(size(t1)).toBe(1)
    expect(peekFront(t1)).toBe(1)
  })

  it('pushFront 5 elements: toArray returns them in LIFO order (most recent first)', () => {
    let t: FingerTree<number> = empty
    for (const v of [1, 2, 3, 4, 5]) {
      t = pushFront(t, v)
    }
    // Pushed: 1 then 2 then 3 then 4 then 5; front is 5
    expect(toArray(t)).toEqual([5, 4, 3, 2, 1])
  })

  it('isEmpty is false after pushFront', () => {
    expect(isEmpty(pushFront(empty, 42))).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pushBack
// ---------------------------------------------------------------------------

describe('pushBack', () => {
  it('pushBack into empty: peekBack returns that value', () => {
    const t = pushBack(empty, 1)
    expect(peekBack(t)).toBe(1)
  })

  it('pushBack multiple: peekBack returns the most recently pushed value', () => {
    let t: FingerTree<number> = pushBack(empty, 1)
    t = pushBack(t, 2)
    t = pushBack(t, 3)
    expect(peekBack(t)).toBe(3)
  })

  it('persistence: original tree is unchanged after pushBack', () => {
    const t1 = pushBack(empty, 1)
    pushBack(t1, 2) // result discarded
    expect(size(t1)).toBe(1)
    expect(peekBack(t1)).toBe(1)
  })

  it('pushBack 5 elements: toArray returns them in FIFO order', () => {
    let t: FingerTree<number> = empty
    for (const v of [1, 2, 3, 4, 5]) {
      t = pushBack(t, v)
    }
    // Pushed to back in order 1..5; toArray should be front-to-back = [1,2,3,4,5]
    expect(toArray(t)).toEqual([1, 2, 3, 4, 5])
  })
})

// ---------------------------------------------------------------------------
// FIFO via pushBack + popFront
// ---------------------------------------------------------------------------

describe('FIFO queue via pushBack + popFront', () => {
  it('push [1,2,3] back then pop from front yields [1, 2, 3]', () => {
    let t = pushBack(pushBack(pushBack(empty, 1), 2), 3)
    const out: number[] = []
    while (!isEmpty(t)) {
      const [val, rest] = popFront(t)
      out.push(val)
      t = rest
    }
    expect(out).toEqual([1, 2, 3])
  })
})

// ---------------------------------------------------------------------------
// popFront
// ---------------------------------------------------------------------------

describe('popFront', () => {
  it('returns [frontValue, rest] where rest has one fewer element', () => {
    const t = fromArray([1, 2, 3])
    const [val, rest] = popFront(t)
    expect(val).toBe(1)
    expect(toArray(rest)).toEqual([2, 3])
  })

  it('persistence: original tree is unchanged after popFront', () => {
    const t = fromArray([10, 20, 30])
    popFront(t) // result discarded
    expect(toArray(t)).toEqual([10, 20, 30])
  })

  it('popping all elements yields an empty tree', () => {
    let t = fromArray([1, 2, 3])
    while (!isEmpty(t)) {
      const [, rest] = popFront(t)
      t = rest
    }
    expect(isEmpty(t)).toBe(true)
  })

  it('popFront on single-element tree: rest is empty', () => {
    const t = pushBack(empty, 42)
    const [val, rest] = popFront(t)
    expect(val).toBe(42)
    expect(isEmpty(rest)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// popBack
// ---------------------------------------------------------------------------

describe('popBack', () => {
  it('returns [backValue, rest] where rest has one fewer element', () => {
    const t = fromArray([1, 2, 3])
    const [val, rest] = popBack(t)
    expect(val).toBe(3)
    expect(toArray(rest)).toEqual([1, 2])
  })

  it('persistence: original tree is unchanged after popBack', () => {
    const t = fromArray([10, 20, 30])
    popBack(t) // result discarded
    expect(toArray(t)).toEqual([10, 20, 30])
  })

  it('popBack on single-element tree: rest is empty', () => {
    const t = pushBack(empty, 99)
    const [val, rest] = popBack(t)
    expect(val).toBe(99)
    expect(isEmpty(rest)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// concat
// ---------------------------------------------------------------------------

describe('concat', () => {
  it('concat two non-empty trees gives all elements in order', () => {
    const left = fromArray([1, 2, 3])
    const right = fromArray([4, 5, 6])
    expect(toArray(concat(left, right))).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('concat with empty on left returns right', () => {
    const right = fromArray([1, 2, 3])
    expect(toArray(concat(empty, right))).toEqual([1, 2, 3])
  })

  it('concat with empty on right returns left', () => {
    const left = fromArray([1, 2, 3])
    expect(toArray(concat(left, empty))).toEqual([1, 2, 3])
  })

  it('persistence: originals are unchanged after concat', () => {
    const left = fromArray([1, 2, 3])
    const right = fromArray([4, 5, 6])
    concat(left, right) // result discarded
    expect(toArray(left)).toEqual([1, 2, 3])
    expect(toArray(right)).toEqual([4, 5, 6])
  })

  it('concat of larger trees preserves order', () => {
    const left = fromArray([1, 2, 3, 4, 5])
    const right = fromArray([6, 7, 8, 9, 10])
    expect(toArray(concat(left, right))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('concat two single-element trees', () => {
    const l = pushBack(empty, 1)
    const r = pushBack(empty, 2)
    expect(toArray(concat(l, r))).toEqual([1, 2])
  })
})

// ---------------------------------------------------------------------------
// size
// ---------------------------------------------------------------------------

describe('size', () => {
  it('empty tree has size 0', () => {
    expect(size(empty)).toBe(0)
  })

  it('single-element tree has size 1', () => {
    expect(size(pushBack(empty, 42))).toBe(1)
  })

  it('size matches toArray().length for a tree of 10 elements', () => {
    const t = fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(size(t)).toBe(toArray(t).length)
  })

  it('size after 10 pushFronts is 10', () => {
    let t: FingerTree<number> = empty
    for (let i = 0; i < 10; i++) t = pushFront(t, i)
    expect(size(t)).toBe(10)
  })

})

// ---------------------------------------------------------------------------
// fromArray / toArray roundtrip
// ---------------------------------------------------------------------------

describe('fromArray / toArray roundtrip', () => {
  it('toArray(fromArray([1,2,3,4,5])) equals [1,2,3,4,5]', () => {
    expect(toArray(fromArray([1, 2, 3, 4, 5]))).toEqual([1, 2, 3, 4, 5])
  })

  it('fromArray([]) is empty', () => {
    expect(isEmpty(fromArray([]))).toBe(true)
  })

  it('roundtrip with 1 element', () => {
    expect(toArray(fromArray([42]))).toEqual([42])
  })

  it('roundtrip with 8 elements (spans prefix, spine, suffix)', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8]
    expect(toArray(fromArray(arr))).toEqual(arr)
  })

  it('roundtrip with 20 elements (deep spine)', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i + 1)
    expect(toArray(fromArray(arr))).toEqual(arr)
  })
})

// ---------------------------------------------------------------------------
// Type alias for test helpers
// ---------------------------------------------------------------------------

// Helper type alias so TypeScript is happy with `let t: FingerTree<number>`
type FingerTree<A> = ReturnType<typeof fromArray<A>>
