/**
 * Binary Heap — skeleton.
 *
 * All method bodies throw `new Error('TODO')`.
 * Implement the logic in solution.ts (which is self-contained).
 */

export type Comparator = (a: number, b: number) => number

/** comparator(a, b) < 0 when a should be closer to the root than b */
export const minComparator: Comparator = (a, b) => a - b
export const maxComparator: Comparator = (a, b) => b - a

export class BinaryHeap {
  private buffer: Int32Array
  private _size: number
  private compare: Comparator
  readonly capacity: number

  /**
   * @param capacity  Maximum number of elements the heap can hold.
   * @param comparator  Defaults to minComparator (min-heap).
   */
  constructor(capacity: number, comparator?: Comparator) {
    this.capacity = capacity
    this.buffer = new Int32Array(capacity)
    this._size = 0
    this.compare = comparator ?? minComparator
  }

  // ---------------------------------------------------------------------------
  // Index arithmetic helpers (exposed for testing — THE CORE LESSON)
  // ---------------------------------------------------------------------------

  /** Returns -1 for the root (no parent). */
  parentIndex(_i: number): number {
    throw new Error('TODO')
  }

  leftChildIndex(_i: number): number {
    throw new Error('TODO')
  }

  rightChildIndex(_i: number): number {
    throw new Error('TODO')
  }

  // ---------------------------------------------------------------------------
  // Core operations
  // ---------------------------------------------------------------------------

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    throw new Error('TODO')
  }

  /** Throws RangeError when the heap is full. */
  insert(_value: number): void {
    throw new Error('TODO')
  }

  /** Removes and returns the root (min or max per comparator). Throws RangeError when empty. */
  extract(): number {
    throw new Error('TODO')
  }

  /** Returns the root without removing it. Throws RangeError when empty. */
  peek(): number {
    throw new Error('TODO')
  }

  // ---------------------------------------------------------------------------
  // Static utilities
  // ---------------------------------------------------------------------------

  /**
   * Builds a valid heap from an existing Int32Array in O(n).
   * The returned heap shares NO memory with the input array.
   */
  static heapify(_arr: Int32Array, _comparator?: Comparator): BinaryHeap {
    throw new Error('TODO')
  }

  /**
   * Sorts `arr` in ascending order in place using heap sort.
   * O(n log n) time, O(1) extra space.
   */
  static heapSort(_arr: Int32Array): void {
    throw new Error('TODO')
  }
}
