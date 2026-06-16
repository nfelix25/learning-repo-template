/**
 * Splay Tree — skeleton.
 *
 * All method bodies throw `new Error('TODO')`.
 * Implement the logic in solution.ts (which is self-contained).
 */

export class SplayNode {
  value: number
  left: SplayNode | null
  right: SplayNode | null
  parent: SplayNode | null

  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
    this.parent = null
  }
}

export class SplayTree {
  root: SplayNode | null
  private _size: number

  constructor() {
    this.root = null
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  // ---------------------------------------------------------------------------
  // Rotation primitives (exposed for direct testing)
  // ---------------------------------------------------------------------------

  /** Right-rotate: x must be the left child of its parent. x moves up. */
  rotateRight(_x: SplayNode): void {
    throw new Error('TODO')
  }

  /** Left-rotate: x must be the right child of its parent. x moves up. */
  rotateLeft(_x: SplayNode): void {
    throw new Error('TODO')
  }

  // ---------------------------------------------------------------------------
  // Splay (exposed for direct testing)
  // ---------------------------------------------------------------------------

  /**
   * Move `node` to the root by applying zig / zig-zig / zig-zag steps
   * until `node` has no parent.
   */
  splay(_node: SplayNode): void {
    throw new Error('TODO')
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Insert `value`. If it already exists, no duplicate is created.
   * The inserted (or found) node is splayed to the root.
   */
  insert(_value: number): void {
    throw new Error('TODO')
  }

  /**
   * Search for `value`. Returns true if found (found node splayed to root).
   * On a miss, the last accessed node is splayed to root; returns false.
   */
  search(_value: number): boolean {
    throw new Error('TODO')
  }

  /**
   * Delete `value`. Returns false if not found.
   * On success, the tree is restructured and size is decremented.
   */
  delete(_value: number): boolean {
    throw new Error('TODO')
  }

  /** Returns the node values in sorted (in-order) sequence. */
  inorder(): number[] {
    throw new Error('TODO')
  }

  /** Height of the tree (0 for empty, 1 for a single node). */
  height(): number {
    throw new Error('TODO')
  }
}
