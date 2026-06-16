export const RED = 0
export const BLACK = 1
export type Color = 0 | 1

export class RBNode {
  value: number
  color: Color
  left: RBNode | null
  right: RBNode | null
  parent: RBNode | null

  constructor(value: number, color: Color = RED) {
    this.value = value
    this.color = color
    this.left = null
    this.right = null
    this.parent = null
  }
}

export class RedBlackTree {
  root: RBNode | null
  private nil: RBNode   // sentinel null node (always black)
  private _size: number

  constructor() {
    // Bootstrap the nil sentinel
    this.nil = new RBNode(0, BLACK)
    this.nil.left = this.nil
    this.nil.right = this.nil
    this.nil.parent = this.nil
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

  /** Returns true if the root is black (or tree is empty). */
  isRootBlack(): boolean {
    throw new Error('TODO')
  }

  /** Returns true if no red node has a red parent. */
  hasNoRedRedViolation(): boolean {
    throw new Error('TODO')
  }

  /** Returns true if all root-to-null paths have the same count of black nodes. */
  hasUniformBlackHeight(): boolean {
    throw new Error('TODO')
  }

  /** Returns true if BST ordering holds for all subtrees. */
  isValidBST(): boolean {
    throw new Error('TODO')
  }
}
