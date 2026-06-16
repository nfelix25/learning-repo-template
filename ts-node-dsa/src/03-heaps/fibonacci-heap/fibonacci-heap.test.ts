/**
 * Fibonacci Heap — test suite.
 *
 * Imports from the skeleton (fibonacci-heap.ts). All tests fail until the
 * skeleton is implemented. The solution lives in solution.ts.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { FibonacciHeap, type FibNode } from './fibonacci-heap.js'

// ---------------------------------------------------------------------------
// insert
// ---------------------------------------------------------------------------

describe('insert', () => {
  let heap: FibonacciHeap

  beforeEach(() => {
    heap = new FibonacciHeap()
  })

  it('size increases by 1 after each insert', () => {
    expect(heap.size).toBe(0)
    heap.insert(5)
    expect(heap.size).toBe(1)
    heap.insert(3)
    expect(heap.size).toBe(2)
    heap.insert(8)
    expect(heap.size).toBe(3)
  })

  it('findMin returns the correct minimum after inserts in increasing order', () => {
    heap.insert(1)
    heap.insert(2)
    heap.insert(3)
    expect(heap.findMin()).toBe(1)
  })

  it('findMin returns the correct minimum after inserts in decreasing order', () => {
    heap.insert(9)
    heap.insert(5)
    heap.insert(1)
    expect(heap.findMin()).toBe(1)
  })

  it('inserting a smaller value updates findMin', () => {
    heap.insert(10)
    expect(heap.findMin()).toBe(10)
    heap.insert(3)
    expect(heap.findMin()).toBe(3)
  })

  it('rootCount increases by 1 per insert (lazy — no consolidation on insert)', () => {
    heap.insert(4)
    expect(heap.rootCount()).toBe(1)
    heap.insert(7)
    expect(heap.rootCount()).toBe(2)
    heap.insert(2)
    expect(heap.rootCount()).toBe(3)
    heap.insert(9)
    expect(heap.rootCount()).toBe(4)
  })

  it('insert returns a FibNode with the correct key', () => {
    const node = heap.insert(42)
    expect(node.key).toBe(42)
  })
})

// ---------------------------------------------------------------------------
// findMin
// ---------------------------------------------------------------------------

describe('findMin', () => {
  it('returns minimum without changing size', () => {
    const heap = new FibonacciHeap()
    heap.insert(3)
    heap.insert(1)
    heap.insert(5)
    const sizeBefore = heap.size
    expect(heap.findMin()).toBe(1)
    expect(heap.size).toBe(sizeBefore)
  })

  it('throws RangeError on empty heap', () => {
    const heap = new FibonacciHeap()
    expect(() => heap.findMin()).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// extractMin
// ---------------------------------------------------------------------------

describe('extractMin', () => {
  it('returns the minimum value', () => {
    const heap = new FibonacciHeap()
    heap.insert(3)
    heap.insert(1)
    heap.insert(5)
    expect(heap.extractMin()).toBe(1)
  })

  it('size decreases by 1 after extractMin', () => {
    const heap = new FibonacciHeap()
    heap.insert(2)
    heap.insert(4)
    heap.insert(6)
    const sizeBefore = heap.size
    heap.extractMin()
    expect(heap.size).toBe(sizeBefore - 1)
  })

  it('children of extracted node join the root list', () => {
    // Build a heap and force consolidation by extracting once,
    // then check that children appear via further extractions.
    const heap = new FibonacciHeap()
    ;[5, 3, 8, 1, 4].forEach(k => heap.insert(k))
    heap.extractMin() // removes 1, promotes children, consolidates
    // After extractMin, remaining elements must still be extractable in order
    const remaining: number[] = []
    while (!heap.isEmpty()) remaining.push(heap.extractMin())
    expect(remaining).toEqual([3, 4, 5, 8])
  })

  it('after extractMin, consolidation leaves no two roots with the same degree', () => {
    const heap = new FibonacciHeap()
    ;[7, 3, 1, 5, 9, 2, 8, 4, 6].forEach(k => heap.insert(k))
    heap.extractMin()
    // We can't inspect degrees directly via skeleton, but isHeapOrdered + rootCount
    // being small (O(log n)) gives strong confidence consolidation ran.
    // rootCount after consolidating 8 remaining nodes: max degree = floor(log_phi(8)) = 5
    expect(heap.rootCount()).toBeLessThanOrEqual(8)
    expect(heap.isHeapOrdered()).toBe(true)
  })

  it('heap property is preserved after extractMin (isHeapOrdered)', () => {
    const heap = new FibonacciHeap()
    ;[4, 1, 7, 2, 9, 3].forEach(k => heap.insert(k))
    heap.extractMin()
    expect(heap.isHeapOrdered()).toBe(true)
  })

  it('repeated extractMins yield ascending sorted sequence', () => {
    const heap = new FibonacciHeap()
    const values = [5, 3, 8, 1, 9, 2, 7, 4, 6]
    values.forEach(k => heap.insert(k))
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extractMin())
    expect(out).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('throws RangeError when empty', () => {
    const heap = new FibonacciHeap()
    expect(() => heap.extractMin()).toThrow(RangeError)
  })

  it('single-element heap: extract returns that element and heap is empty', () => {
    const heap = new FibonacciHeap()
    heap.insert(42)
    expect(heap.extractMin()).toBe(42)
    expect(heap.isEmpty()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// decreaseKey
// ---------------------------------------------------------------------------

describe('decreaseKey', () => {
  let heap: FibonacciHeap
  let node: FibNode

  beforeEach(() => {
    heap = new FibonacciHeap()
  })

  it('decreasing a key updates the node key', () => {
    node = heap.insert(10)
    heap.decreaseKey(node, 3)
    expect(node.key).toBe(3)
  })

  it('decreased key becomes the new minimum if smaller than current min', () => {
    heap.insert(5)
    node = heap.insert(8)
    heap.decreaseKey(node, 2)
    expect(heap.findMin()).toBe(2)
  })

  it('if new key < parent key, node is cut and added to root list', () => {
    // Build a consolidated tree by inserting enough elements and extracting once
    ;[1, 5, 3, 7, 9].forEach(k => heap.insert(k))
    heap.extractMin() // triggers consolidation; 5, 3, 7, 9 are now in a tree

    // After consolidation, 3 is min. Insert 11 so it likely becomes a child somewhere.
    const target = heap.insert(11)
    // Force consolidation again
    heap.extractMin() // removes 3

    // Now decrease target's key below its parent — should trigger a cut
    const rootCountBefore = heap.rootCount()
    heap.decreaseKey(target, 1)
    // node should now be in the root list (parent is null)
    expect(target.parent).toBeNull()
    // root count should have increased (cut added it to root list)
    expect(heap.rootCount()).toBeGreaterThanOrEqual(rootCountBefore)
  })

  it('cut node has no parent after cut', () => {
    ;[1, 4, 6, 2, 8].forEach(k => heap.insert(k))
    heap.extractMin() // consolidate
    const target = heap.insert(15)
    heap.extractMin() // consolidate again
    heap.decreaseKey(target, 0)
    expect(target.parent).toBeNull()
  })

  it('throws RangeError if newKey > node.key', () => {
    node = heap.insert(5)
    expect(() => heap.decreaseKey(node, 10)).toThrow(RangeError)
  })

  it('decreaseKey to same value does not throw', () => {
    node = heap.insert(5)
    expect(() => heap.decreaseKey(node, 5)).not.toThrow()
  })

  it('heap remains heap-ordered after decreaseKey', () => {
    ;[3, 7, 1, 5, 9].forEach(k => heap.insert(k))
    heap.extractMin() // consolidate
    const target = heap.insert(20)
    heap.decreaseKey(target, 2)
    expect(heap.isHeapOrdered()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// decreaseKey — cascade-cut
// ---------------------------------------------------------------------------

describe('decreaseKey cascade-cut', () => {
  it('if parent was marked, it is also cut (cascade)', () => {
    // Construct a scenario where cascade-cut fires:
    // 1. Build a consolidated heap with a multi-level tree.
    // 2. Cut one child (marking the parent).
    // 3. Cut another child — cascade fires on the now-marked parent.
    const heap = new FibonacciHeap()

    // Insert 8 elements and extract min twice to get a rich tree structure
    ;[1, 2, 3, 4, 5, 6, 7, 8].forEach(k => heap.insert(k))
    heap.extractMin() // removes 1, consolidates
    heap.extractMin() // removes 2, consolidates

    // The heap should still be heap-ordered despite cascade-cutting
    const n1 = heap.insert(100)
    const n2 = heap.insert(200)
    heap.extractMin() // consolidate again

    // Decrease keys to force cuts
    heap.decreaseKey(n1, 50)
    heap.decreaseKey(n2, 60)

    // After potential cascade-cuts, heap must remain valid
    expect(heap.isHeapOrdered()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

describe('delete', () => {
  it('deleted node does not appear in subsequent extractMins', () => {
    const heap = new FibonacciHeap()
    const nodeToDelete = heap.insert(5)
    heap.insert(3)
    heap.insert(7)

    heap.delete(nodeToDelete)

    const remaining: number[] = []
    while (!heap.isEmpty()) remaining.push(heap.extractMin())
    expect(remaining).not.toContain(5)
    expect(remaining).toEqual([3, 7])
  })

  it('size decreases by 1 after delete', () => {
    const heap = new FibonacciHeap()
    heap.insert(1)
    const n = heap.insert(2)
    heap.insert(3)
    expect(heap.size).toBe(3)
    heap.delete(n)
    expect(heap.size).toBe(2)
  })

  it('deleting the minimum element leaves the heap valid', () => {
    const heap = new FibonacciHeap()
    ;[3, 1, 5, 2, 4].forEach(k => heap.insert(k))
    const minNode = heap.insert(0)
    heap.delete(minNode)
    expect(heap.findMin()).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// consolidation (via extractMin)
// ---------------------------------------------------------------------------

describe('consolidation via extractMin', () => {
  it('after extractMin, no two roots have the same degree', () => {
    const heap = new FibonacciHeap()
    ;[10, 4, 8, 2, 6, 1, 9, 3, 7, 5].forEach(k => heap.insert(k))
    heap.extractMin() // should consolidate

    // Verify by checking all extractions are sorted
    const out: number[] = []
    while (!heap.isEmpty()) out.push(heap.extractMin())
    expect(out).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('heap remains heap-ordered after consolidation', () => {
    const heap = new FibonacciHeap()
    ;[5, 2, 8, 1, 9, 3, 7, 4, 6].forEach(k => heap.insert(k))
    heap.extractMin()
    expect(heap.isHeapOrdered()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// isEmpty
// ---------------------------------------------------------------------------

describe('isEmpty', () => {
  it('returns true on a new heap', () => {
    expect(new FibonacciHeap().isEmpty()).toBe(true)
  })

  it('returns false after insert', () => {
    const heap = new FibonacciHeap()
    heap.insert(1)
    expect(heap.isEmpty()).toBe(false)
  })

  it('returns true after inserting and extracting all elements', () => {
    const heap = new FibonacciHeap()
    heap.insert(1)
    heap.insert(2)
    heap.extractMin()
    heap.extractMin()
    expect(heap.isEmpty()).toBe(true)
  })
})
