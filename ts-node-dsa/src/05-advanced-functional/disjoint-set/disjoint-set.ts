/**
 * Disjoint Set (Union-Find) — skeleton.
 *
 * Implement path compression + union by rank.
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */

export class DisjointSet {
  private parent: Int32Array
  private rank: Int32Array
  readonly size: number

  constructor(n: number) {
    void n
    this.size = n
    this.parent = new Int32Array(n)
    this.rank = new Int32Array(n)
    throw new Error('TODO')
  }

  /**
   * Find the representative (root) of the set containing x.
   * Applies path compression.
   */
  find(x: number): number {
    void x
    throw new Error('TODO')
  }

  /**
   * Merge the sets containing x and y.
   * Returns true if they were in different sets, false if already the same.
   * Uses union by rank.
   */
  union(x: number, y: number): boolean {
    void x; void y
    throw new Error('TODO')
  }

  /** Returns true if x and y are in the same set. */
  connected(x: number, y: number): boolean {
    void x; void y
    throw new Error('TODO')
  }

  /** Returns the number of disjoint sets (roots). */
  componentCount(): number {
    throw new Error('TODO')
  }
}
