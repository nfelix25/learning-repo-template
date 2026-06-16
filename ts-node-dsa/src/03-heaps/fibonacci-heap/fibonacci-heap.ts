/**
 * Fibonacci Heap — skeleton.
 *
 * All method bodies throw `new Error('TODO')`.
 * Implement the logic in solution.ts (which is self-contained).
 */

export interface FibNode {
  key: number
  degree: number
  marked: boolean
  parent: FibNode | null
  child: FibNode | null
  left: FibNode      // circular doubly-linked — always set (points to self when alone)
  right: FibNode     // circular doubly-linked — always set (points to self when alone)
}

export class FibonacciHeap {
  private min: FibNode | null
  private _size: number

  constructor() {
    this.min = null
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    throw new Error('TODO')
  }

  /**
   * Inserts a new key into the heap.
   * O(1) — lazy: just add to root list.
   * Returns the inserted node (caller can hold a reference for decreaseKey/delete).
   */
  insert(_key: number): FibNode {
    throw new Error('TODO')
  }

  /**
   * Returns the minimum key without modifying the heap.
   * Throws RangeError if the heap is empty.
   */
  findMin(): number {
    throw new Error('TODO')
  }

  /**
   * Removes and returns the minimum key.
   * Promotes children of min node to root list, then consolidates.
   * O(log n) amortized.
   * Throws RangeError if the heap is empty.
   */
  extractMin(): number {
    throw new Error('TODO')
  }

  /**
   * Decreases the key of `node` to `newKey`.
   * Throws RangeError if `newKey > node.key`.
   * If the heap property is violated, cuts the node and cascade-cuts up.
   * O(1) amortized.
   */
  decreaseKey(_node: FibNode, _newKey: number): void {
    throw new Error('TODO')
  }

  /**
   * Deletes a node from the heap.
   * Implemented as decreaseKey(-Infinity) + extractMin.
   * O(log n) amortized.
   */
  delete(_node: FibNode): void {
    throw new Error('TODO')
  }

  // ---------------------------------------------------------------------------
  // Testing helpers
  // ---------------------------------------------------------------------------

  /** Returns the number of trees in the root list. */
  rootCount(): number {
    throw new Error('TODO')
  }

  /**
   * Returns true if every parent-child pair in the heap satisfies
   * parent.key <= child.key (min-heap property).
   */
  isHeapOrdered(): boolean {
    throw new Error('TODO')
  }
}
