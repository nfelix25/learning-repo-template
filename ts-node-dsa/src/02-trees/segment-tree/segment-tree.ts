export class SegmentTree {
  private tree: Int32Array    // size 4 * n, 1-indexed
  private lazy: Int32Array    // for lazy propagation
  readonly n: number          // input array size

  constructor(arr: number[]) {
    throw new Error('TODO')
  }

  /** Range sum query, inclusive 0-based indices. Throws RangeError for invalid range. */
  rangeSum(l: number, r: number): number {
    throw new Error('TODO')
  }

  /** Range minimum query, inclusive 0-based indices. */
  rangeMin(l: number, r: number): number {
    throw new Error('TODO')
  }

  /** Range maximum query, inclusive 0-based indices. */
  rangeMax(l: number, r: number): number {
    throw new Error('TODO')
  }

  /** Point update: set index i to value (0-based). */
  update(i: number, value: number): void {
    throw new Error('TODO')
  }

  /** Returns the internal tree buffer (for testing/inspection). */
  getBuffer(): Int32Array {
    throw new Error('TODO')
  }
}
