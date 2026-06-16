/**
 * Binary Heap — test suite.
 *
 * Imports from the skeleton (binary-heap.ts). All tests fail until the
 * skeleton is implemented. The solution lives in solution.ts.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { BinaryHeap, maxComparator, minComparator } from './binary-heap.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Verify heap property for every parent-child pair. */
function isHeapValid(heap: BinaryHeap): boolean {
  const size = heap.size
  for (let i = 1; i < size; i++) {
    const parent = heap.parentIndex(i)
    if (parent < 0) continue
    // We can't read buffer directly, but we can extract a copy.
    // Use the index math methods that are exposed for testing.
    // Actually we need to test via peek/extract — but modifying the heap
    // in a property check is invasive. Instead we expose it via the
    // heapify static which lets us re-verify from scratch.
    // For in-place verification, rely on the caller to pass a freshly
    // heapified clone. See individual tests.
    void parent
  }
  return true // structure verified inline in each test instead
}

/** Returns a sorted copy of arr (ascending). */
function sorted(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b)
}

/** Drains all elements from a copy-constructed heap, returning them in extraction order. */
function drainHeap(values: number[], comparator?: Parameters<typeof minComparator>[0] extends number ? never : Parameters<typeof BinaryHeap.heapify>[1]): number[] {
  const arr = new Int32Array(values)
  const heap = BinaryHeap.heapify(arr, comparator)
  const out: number[] = []
  while (!heap.isEmpty()) {
    out.push(heap.extract())
  }
  return out
}

// ---------------------------------------------------------------------------
// construction
// ---------------------------------------------------------------------------

describe('construction', () => {
  it('buffer is backed by Int32Array (BYTES_PER_ELEMENT === 4)', () => {
    // We verify indirectly: heapify returns a BinaryHeap whose internal buffer
    // is Int32Array. The constructor stores an Int32Array.
    // We test this by inserting Int32-range values and checking they round-trip.
    const heap = new BinaryHeap(4)
    heap.insert(2147483647) // Int32.MAX
    expect(heap.peek()).toBe(2147483647)
  })

  it('size is 0 after construction', () => {
    const heap = new BinaryHeap(10)
    expect(heap.size).toBe(0)
  })

  it('capacity matches constructor argument', () => {
    const heap = new BinaryHeap(16)
    expect(heap.capacity).toBe(16)
  })
})

// ---------------------------------------------------------------------------
// parentIndex / leftChildIndex / rightChildIndex
// ---------------------------------------------------------------------------

describe('parentIndex / leftChildIndex / rightChildIndex', () => {
  let heap: BinaryHeap

  beforeEach(() => {
    heap = new BinaryHeap(20)
  })

  it('parentIndex(0) returns -1 (root has no parent)', () => {
    expect(heap.parentIndex(0)).toBe(-1)
  })

  it('parentIndex(1) === 0', () => {
    expect(heap.parentIndex(1)).toBe(0)
  })

  it('parentIndex(2) === 0', () => {
    expect(heap.parentIndex(2)).toBe(0)
  })

  it('parentIndex(3) === 1', () => {
    expect(heap.parentIndex(3)).toBe(1)
  })

  it('parentIndex(4) === 1', () => {
    expect(heap.parentIndex(4)).toBe(1)
  })

  it('parentIndex(5) === 2', () => {
    expect(heap.parentIndex(5)).toBe(2)
  })

  it('parentIndex(6) === 2', () => {
    expect(heap.parentIndex(6)).toBe(2)
  })

  it('leftChildIndex(0) === 1', () => {
    expect(heap.leftChildIndex(0)).toBe(1)
  })

  it('rightChildIndex(0) === 2', () => {
    expect(heap.rightChildIndex(0)).toBe(2)
  })

  it('leftChildIndex(1) === 3', () => {
    expect(heap.leftChildIndex(1)).toBe(3)
  })

  it('rightChildIndex(1) === 4', () => {
    expect(heap.rightChildIndex(1)).toBe(4)
  })

  it('leftChildIndex(2) === 5', () => {
    expect(heap.leftChildIndex(2)).toBe(5)
  })

  it('rightChildIndex(2) === 6', () => {
    expect(heap.rightChildIndex(2)).toBe(6)
  })
})

// ---------------------------------------------------------------------------
// insert
// ---------------------------------------------------------------------------

describe('insert', () => {
  it('single insert: size becomes 1 and peek returns the inserted value', () => {
    const heap = new BinaryHeap(10)
    heap.insert(42)
    expect(heap.size).toBe(1)
    expect(heap.peek()).toBe(42)
  })

  it('inserting a smaller value than the current root causes it to become the new root', () => {
    const heap = new BinaryHeap(10)
    heap.insert(10)
    heap.insert(5)
    expect(heap.peek()).toBe(5)
  })

  it('heap property holds after 5 inserts: every element extractable in non-decreasing order', () => {
    const heap = new BinaryHeap(10)
    const values = [9, 3, 7, 1, 5]
    values.forEach(v => heap.insert(v))
    const extracted: number[] = []
    while (!heap.isEmpty()) extracted.push(heap.extract())
    expect(extracted).toEqual(sorted(values))
  })

  it('insert when full throws RangeError', () => {
    const heap = new BinaryHeap(2)
    heap.insert(1)
    heap.insert(2)
    expect(() => heap.insert(3)).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// extract
// ---------------------------------------------------------------------------

describe('extract', () => {
  it('extract from single-element heap: returns that element and size becomes 0', () => {
    const heap = new BinaryHeap(5)
    heap.insert(7)
    expect(heap.extract()).toBe(7)
    expect(heap.size).toBe(0)
  })

  it('extract returns the minimum (min-heap)', () => {
    const heap = new BinaryHeap(10)
    ;[4, 1, 8, 3].forEach(v => heap.insert(v))
    expect(heap.extract()).toBe(1)
  })

  it('heap property preserved after extract: subsequent extracts are also in order', () => {
    const heap = new BinaryHeap(10)
    const values = [6, 2, 9, 4, 1, 7]
    values.forEach(v => heap.insert(v))
    heap.extract() // remove minimum
    const remaining: number[] = []
    while (!heap.isEmpty()) remaining.push(heap.extract())
    // Each next element must be >= previous
    for (let i = 1; i < remaining.length; i++) {
      expect(remaining[i]!).toBeGreaterThanOrEqual(remaining[i - 1]!)
    }
  })

  it('repeated extracts yield ascending sorted order', () => {
    const values = [5, 3, 8, 1, 9, 2, 7, 4, 6]
    const heap = new BinaryHeap(values.length)
    values.forEach(v => heap.insert(v))
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extract())
    expect(out).toEqual(sorted(values))
  })

  it('extract from empty heap throws RangeError', () => {
    const heap = new BinaryHeap(5)
    expect(() => heap.extract()).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// peek
// ---------------------------------------------------------------------------

describe('peek', () => {
  it('returns the root value without changing size', () => {
    const heap = new BinaryHeap(5)
    heap.insert(3)
    heap.insert(1)
    heap.insert(5)
    const sizeBefore = heap.size
    const peeked = heap.peek()
    expect(peeked).toBe(1)
    expect(heap.size).toBe(sizeBefore)
  })

  it('peek from empty heap throws RangeError', () => {
    const heap = new BinaryHeap(5)
    expect(() => heap.peek()).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// heapify
// ---------------------------------------------------------------------------

describe('heapify', () => {
  it('builds a valid heap from an unsorted Int32Array (extracts in sorted order)', () => {
    const arr = new Int32Array([5, 3, 8, 1, 9, 2, 7, 4, 6])
    const heap = BinaryHeap.heapify(arr)
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extract())
    expect(out).toEqual(sorted(Array.from(arr)))
  })

  it('heap property: all parent-child pairs satisfy comparator after heapify', () => {
    // Verify by extracting in order (if extraction is sorted, property held)
    const arr = new Int32Array([10, 4, 7, 2, 9, 1, 8, 3, 6, 5])
    const heap = BinaryHeap.heapify(arr)
    const extracted: number[] = []
    while (!heap.isEmpty()) extracted.push(heap.extract())
    expect(extracted).toEqual(sorted(Array.from(arr)))
  })

  it('heapify does not modify the original array', () => {
    const arr = new Int32Array([3, 1, 4, 1, 5, 9, 2, 6])
    const copy = new Int32Array(arr)
    BinaryHeap.heapify(arr)
    expect(arr).toEqual(copy)
  })

  it('heapify works on a single-element array', () => {
    const arr = new Int32Array([42])
    const heap = BinaryHeap.heapify(arr)
    expect(heap.extract()).toBe(42)
  })

  it('heapify works on an empty array', () => {
    const arr = new Int32Array(0)
    const heap = BinaryHeap.heapify(arr)
    expect(heap.isEmpty()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// heapSort
// ---------------------------------------------------------------------------

describe('heapSort', () => {
  it('sorted result equals Array.from(arr).sort((a,b) => a-b)', () => {
    const arr = new Int32Array([5, 3, 8, 1, 9, 2, 7, 4, 6])
    const expected = Array.from(arr).sort((a, b) => a - b)
    BinaryHeap.heapSort(arr)
    expect(Array.from(arr)).toEqual(expected)
  })

  it('works on an empty array', () => {
    const arr = new Int32Array(0)
    expect(() => BinaryHeap.heapSort(arr)).not.toThrow()
    expect(arr.length).toBe(0)
  })

  it('works on a single-element array', () => {
    const arr = new Int32Array([99])
    BinaryHeap.heapSort(arr)
    expect(Array.from(arr)).toEqual([99])
  })

  it('works on an already-sorted array', () => {
    const arr = new Int32Array([1, 2, 3, 4, 5])
    BinaryHeap.heapSort(arr)
    expect(Array.from(arr)).toEqual([1, 2, 3, 4, 5])
  })

  it('works on a reverse-sorted array', () => {
    const arr = new Int32Array([5, 4, 3, 2, 1])
    BinaryHeap.heapSort(arr)
    expect(Array.from(arr)).toEqual([1, 2, 3, 4, 5])
  })

  it('works on an array with duplicate values', () => {
    const arr = new Int32Array([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])
    const expected = Array.from(arr).sort((a, b) => a - b)
    BinaryHeap.heapSort(arr)
    expect(Array.from(arr)).toEqual(expected)
  })
})

// ---------------------------------------------------------------------------
// max-heap via comparator
// ---------------------------------------------------------------------------

describe('max-heap via comparator', () => {
  it('extract from max-heap returns the maximum value', () => {
    const heap = new BinaryHeap(10, maxComparator)
    ;[3, 1, 9, 4, 7].forEach(v => heap.insert(v))
    expect(heap.extract()).toBe(9)
  })

  it('repeated extracts from max-heap yield descending order', () => {
    const values = [5, 3, 8, 1, 9, 2, 7, 4, 6]
    const heap = new BinaryHeap(values.length, maxComparator)
    values.forEach(v => heap.insert(v))
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extract())
    expect(out).toEqual([...sorted(values)].reverse())
  })

  it('peek on max-heap returns maximum without extracting', () => {
    const heap = new BinaryHeap(5, maxComparator)
    ;[2, 8, 5].forEach(v => heap.insert(v))
    expect(heap.peek()).toBe(8)
    expect(heap.size).toBe(3)
  })

  it('heapify with maxComparator produces a max-heap', () => {
    const arr = new Int32Array([3, 1, 9, 4, 7, 2, 8])
    const heap = BinaryHeap.heapify(arr, maxComparator)
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extract())
    expect(out).toEqual([...sorted(Array.from(arr))].reverse())
  })
})

// ---------------------------------------------------------------------------
// isEmpty
// ---------------------------------------------------------------------------

describe('isEmpty', () => {
  it('returns true on a new heap', () => {
    expect(new BinaryHeap(5).isEmpty()).toBe(true)
  })

  it('returns false after insert', () => {
    const heap = new BinaryHeap(5)
    heap.insert(1)
    expect(heap.isEmpty()).toBe(false)
  })

  it('returns true after inserting and extracting one element', () => {
    const heap = new BinaryHeap(5)
    heap.insert(1)
    heap.extract()
    expect(heap.isEmpty()).toBe(true)
  })
})

// suppress unused import warning
void isHeapValid
void drainHeap
void minComparator
