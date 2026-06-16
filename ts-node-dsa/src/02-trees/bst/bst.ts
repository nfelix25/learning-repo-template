export class BSTNode {
  value: number
  left: BSTNode | null
  right: BSTNode | null

  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
  }
}

export class BST {
  root: BSTNode | null
  private _size: number

  constructor() {
    this.root = null
    this._size = 0
  }

  get size(): number {
    throw new Error('TODO')
  }

  insert(value: number): void {
    throw new Error('TODO')
  }

  search(value: number): BSTNode | null {
    throw new Error('TODO')
  }

  delete(value: number): void {
    throw new Error('TODO')
  }

  /** Returns the minimum value in the tree. Throws RangeError if empty. */
  min(): number {
    throw new Error('TODO')
  }

  /** Returns the maximum value in the tree. Throws RangeError if empty. */
  max(): number {
    throw new Error('TODO')
  }

  /** Returns the largest value strictly less than the given value, or null if none exists. */
  predecessor(value: number): number | null {
    throw new Error('TODO')
  }

  /** Returns the smallest value strictly greater than the given value, or null if none exists. */
  successor(value: number): number | null {
    throw new Error('TODO')
  }

  inorder(): number[] {
    throw new Error('TODO')
  }

  preorder(): number[] {
    throw new Error('TODO')
  }

  postorder(): number[] {
    throw new Error('TODO')
  }

  levelOrder(): number[] {
    throw new Error('TODO')
  }

  height(): number {
    throw new Error('TODO')
  }

  /** Verifies the BST invariant holds for ALL subtrees using min/max bounds. */
  isValid(): boolean {
    throw new Error('TODO')
  }
}
