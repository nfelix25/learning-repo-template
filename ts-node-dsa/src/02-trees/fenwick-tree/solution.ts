/**
 * Fenwick Tree (Binary Indexed Tree) — working solution.
 *
 * Internally 1-indexed; external API is 0-based.
 * Core insight: i & -i extracts the lowest set bit, which drives both
 * the update traversal (add lowbit to climb) and query traversal (subtract lowbit).
 */

export class FenwickTree {
  private tree: Int32Array   // 1-indexed, size n+1
  readonly n: number

  constructor(n: number) {
    this.n = n
    this.tree = new Int32Array(n + 1)
  }

  static fromArray(arr: number[]): FenwickTree {
    const ft = new FenwickTree(arr.length)
    for (let i = 0; i < arr.length; i++) {
      ft.update(i, arr[i] ?? 0)
    }
    return ft
  }

  /** Add delta to the element at 0-based index i. */
  update(i: number, delta: number): void {
    let idx = i + 1          // shift to 1-indexed
    while (idx <= this.n) {
      this.tree[idx] = (this.tree[idx] ?? 0) + delta
      idx += idx & -idx      // move to next affected ancestor
    }
  }

  /** Return the prefix sum [0..i] (0-based, inclusive). */
  prefixSum(i: number): number {
    let idx = i + 1          // shift to 1-indexed
    let sum = 0
    while (idx > 0) {
      sum += this.tree[idx] ?? 0
      idx -= idx & -idx      // remove lowest bit → move to parent
    }
    return sum
  }

  /** Return the range sum [l..r] (0-based, inclusive). */
  rangeSum(l: number, r: number): number {
    return this.prefixSum(r) - (l > 0 ? this.prefixSum(l - 1) : 0)
  }

  getBuffer(): Int32Array {
    return this.tree
  }
}
