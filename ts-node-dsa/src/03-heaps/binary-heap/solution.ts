/**
 * Binary Heap — reference implementation.
 *
 * Self-contained: no imports from binary-heap.ts.
 * Uses Int32Array as the backing buffer (cache-friendly, contiguous memory).
 */

export type Comparator = (a: number, b: number) => number

export const minComparator: Comparator = (a, b) => a - b
export const maxComparator: Comparator = (a, b) => b - a

export class BinaryHeap {
  private buffer: Int32Array
  private _size: number
  private compare: Comparator
  readonly capacity: number

  constructor(capacity: number, comparator: Comparator = minComparator) {
    this.capacity = capacity
    this.buffer = new Int32Array(capacity)
    this._size = 0
    this.compare = comparator
  }

  // ---------------------------------------------------------------------------
  // Index arithmetic — THE CORE LESSON
  // ---------------------------------------------------------------------------

  /** Returns -1 for the root (sentinel: no parent). */
  parentIndex(i: number): number {
    if (i === 0) return -1
    return Math.floor((i - 1) / 2)
  }

  leftChildIndex(i: number): number {
    return 2 * i + 1
  }

  rightChildIndex(i: number): number {
    return 2 * i + 2
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private swap(i: number, j: number): void {
    // noUncheckedIndexedAccess: we guard with size checks before calling swap,
    // so these reads are always in bounds. Use non-null assertions.
    const tmp = this.buffer[i]!
    this.buffer[i] = this.buffer[j]!
    this.buffer[j] = tmp
  }

  /**
   * Sift element at index `i` up toward the root until the heap property holds.
   * Called after inserting at the end.
   */
  private siftUp(i: number): void {
    while (i > 0) {
      const parent = this.parentIndex(i)
      // compare(child, parent) < 0 means child should be above parent
      if (this.compare(this.buffer[i]!, this.buffer[parent]!) < 0) {
        this.swap(i, parent)
        i = parent
      } else {
        break
      }
    }
  }

  /**
   * Sift element at index `i` down toward the leaves until the heap property holds.
   * Called after extracting the root and moving the last element to index 0.
   *
   * @param size  Treat the buffer as having this many elements (used by heapSort
   *              which shrinks the logical size without changing _size).
   */
  private siftDown(i: number, size: number = this._size): void {
    while (true) {
      const left = this.leftChildIndex(i)
      const right = this.rightChildIndex(i)

      // Find the "better" child (the one that should be closer to the root)
      let best = i
      if (left < size && this.compare(this.buffer[left]!, this.buffer[best]!) < 0) {
        best = left
      }
      if (right < size && this.compare(this.buffer[right]!, this.buffer[best]!) < 0) {
        best = right
      }

      if (best === i) break // heap property satisfied

      this.swap(i, best)
      i = best
    }
  }

  // ---------------------------------------------------------------------------
  // Core operations
  // ---------------------------------------------------------------------------

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    return this._size === 0
  }

  /** Throws RangeError when the heap is full. */
  insert(value: number): void {
    if (this._size >= this.capacity) {
      throw new RangeError(`Heap is full (capacity: ${this.capacity})`)
    }
    this.buffer[this._size] = value
    this._size++
    this.siftUp(this._size - 1)
  }

  /** Removes and returns the root (min for min-heap, max for max-heap). Throws RangeError when empty. */
  extract(): number {
    if (this._size === 0) {
      throw new RangeError('Cannot extract from an empty heap')
    }
    const root = this.buffer[0]!
    this._size--
    if (this._size > 0) {
      // Move last element to root and sift down
      this.buffer[0] = this.buffer[this._size]!
      this.siftDown(0)
    }
    return root
  }

  /** Returns the root without removing it. Throws RangeError when empty. */
  peek(): number {
    if (this._size === 0) {
      throw new RangeError('Cannot peek at an empty heap')
    }
    return this.buffer[0]!
  }

  // ---------------------------------------------------------------------------
  // Static utilities
  // ---------------------------------------------------------------------------

  /**
   * Builds a valid heap from an existing Int32Array in O(n) using bottom-up heapification.
   * Returns a new BinaryHeap; the input array is not modified.
   */
  static heapify(arr: Int32Array, comparator: Comparator = minComparator): BinaryHeap {
    const heap = new BinaryHeap(arr.length, comparator)
    // Copy data into the heap buffer
    heap.buffer.set(arr)
    heap._size = arr.length

    // Start at the last non-leaf and sift-down each node.
    // last non-leaf index = floor(n/2) - 1
    const lastNonLeaf = Math.floor(arr.length / 2) - 1
    for (let i = lastNonLeaf; i >= 0; i--) {
      heap.siftDown(i)
    }
    return heap
  }

  /**
   * Sorts `arr` in ascending order in place using heap sort.
   *
   * Algorithm:
   *   1. Build a max-heap (O(n)) — largest element rises to index 0.
   *   2. Repeatedly swap root with the last unsorted element and sift-down
   *      within the shrinking heap (each step O(log n), n times = O(n log n)).
   *
   * Result: ascending order (smallest at index 0).
   */
  static heapSort(arr: Int32Array): void {
    const n = arr.length
    if (n <= 1) return

    // Build a max-heap in place (maxComparator: larger values bubble to root)
    const heapSortSiftDown = (i: number, size: number): void => {
      while (true) {
        const left = 2 * i + 1
        const right = 2 * i + 2
        let best = i

        // maxComparator: pick child with larger value
        if (left < size && (arr[left]! > arr[best]!)) best = left
        if (right < size && (arr[right]! > arr[best]!)) best = right

        if (best === i) break

        const tmp = arr[i]!
        arr[i] = arr[best]!
        arr[best] = tmp
        i = best
      }
    }

    // Phase 1: build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapSortSiftDown(i, n)
    }

    // Phase 2: extract max to end, shrink heap
    for (let end = n - 1; end > 0; end--) {
      // Swap root (current max) with last element of unsorted region
      const tmp = arr[0]!
      arr[0] = arr[end]!
      arr[end] = tmp
      // Restore heap property for the reduced heap
      heapSortSiftDown(0, end)
    }
  }
}
