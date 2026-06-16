export class AVLNode {
  value: number
  left: AVLNode | null
  right: AVLNode | null
  height: number

  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

export class AVLTree {
  root: AVLNode | null
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

  delete(value: number): void {
    throw new Error('TODO')
  }

  search(value: number): boolean {
    throw new Error('TODO')
  }

  inorder(): number[] {
    throw new Error('TODO')
  }

  height(): number {
    throw new Error('TODO')
  }

  /** Returns true if every node has a balance factor in {-1, 0, 1}. */
  isBalanced(): boolean {
    throw new Error('TODO')
  }

  /** Returns true if the BST ordering invariant holds for all subtrees. */
  isValidBST(): boolean {
    throw new Error('TODO')
  }
}
