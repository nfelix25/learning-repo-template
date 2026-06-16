export class FenwickTree {
  private tree: Int32Array   // 1-indexed, size n+1
  readonly n: number

  /** Create an empty Fenwick Tree of size n (supports 0-based indices 0..n-1). */
  constructor(n: number) {
    throw new Error('TODO')
  }

  /** Build a Fenwick Tree from an array of values. */
  static fromArray(arr: number[]): FenwickTree {
    throw new Error('TODO')
  }

  /** Add delta to the element at 0-based index i. */
  update(i: number, delta: number): void {
    throw new Error('TODO')
  }

  /** Return the prefix sum [0..i] (0-based, inclusive). */
  prefixSum(i: number): number {
    throw new Error('TODO')
  }

  /** Return the range sum [l..r] (0-based, inclusive). */
  rangeSum(l: number, r: number): number {
    throw new Error('TODO')
  }

  /** Returns the internal tree buffer (for testing/inspection). */
  getBuffer(): Int32Array {
    throw new Error('TODO')
  }
}
