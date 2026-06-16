/**
 * Disjoint Set (Union-Find) — solution implementation.
 *
 * Uses path compression (during find) and union by rank (during union).
 * Exports the same interface as disjoint-set.ts.
 */

export class DisjointSet {
  private parent: Int32Array
  private rank: Int32Array
  readonly size: number
  private _componentCount: number

  constructor(n: number) {
    this.size = n
    this.parent = new Int32Array(n)
    this.rank = new Int32Array(n)
    this._componentCount = n
    // Each element is its own parent (singleton set).
    for (let i = 0; i < n; i++) {
      this.parent[i] = i
    }
    // rank is initialised to 0 by Int32Array constructor.
  }

  // Safe typed-array accessor; avoids noUncheckedIndexedAccess issues.
  private getParent(i: number): number {
    const v = this.parent[i]
    if (v === undefined) throw new RangeError(`index ${i} out of range [0, ${this.size})`)
    return v
  }

  private setParent(i: number, v: number): void {
    this.parent[i] = v
  }

  private getRank(i: number): number {
    const v = this.rank[i]
    if (v === undefined) throw new RangeError(`index ${i} out of range [0, ${this.size})`)
    return v
  }

  private setRank(i: number, v: number): void {
    this.rank[i] = v
  }

  /**
   * Find the representative (root) of the set containing x.
   * Applies path compression — every node on the path is pointed directly to root.
   */
  find(x: number): number {
    if (x < 0 || x >= this.size) throw new RangeError(`index ${x} out of range`)
    let root = x
    // Walk to root.
    while (this.getParent(root) !== root) {
      root = this.getParent(root)
    }
    // Path compression: point every visited node directly to root.
    let cur = x
    while (cur !== root) {
      const next = this.getParent(cur)
      this.setParent(cur, root)
      cur = next
    }
    return root
  }

  /**
   * Merge the sets containing x and y.
   * Returns true if they were in different sets, false if already the same.
   */
  union(x: number, y: number): boolean {
    const rx = this.find(x)
    const ry = this.find(y)
    if (rx === ry) return false // already same set

    // Union by rank: attach the lower-rank root under the higher-rank root.
    const rankX = this.getRank(rx)
    const rankY = this.getRank(ry)

    if (rankX > rankY) {
      this.setParent(ry, rx)
    } else if (rankY > rankX) {
      this.setParent(rx, ry)
    } else {
      // Equal rank: choose rx as root and bump its rank.
      this.setParent(ry, rx)
      this.setRank(rx, rankX + 1)
    }

    this._componentCount--
    return true
  }

  /** Returns true if x and y are in the same set. */
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y)
  }

  /** Returns the number of disjoint sets (roots). */
  componentCount(): number {
    return this._componentCount
  }
}
