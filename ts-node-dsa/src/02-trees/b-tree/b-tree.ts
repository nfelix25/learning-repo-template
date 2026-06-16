export class BTreeNode {
  keys: number[]
  children: BTreeNode[]
  isLeaf: boolean

  constructor(isLeaf: boolean) {
    this.keys = []
    this.children = []
    this.isLeaf = isLeaf
  }
}

export class BTree {
  root: BTreeNode
  readonly order: number   // max children per node; max keys = order - 1
  private _size: number

  constructor(order: number) {
    if (order < 2) throw new RangeError('B-Tree order must be at least 2')
    this.order = order
    this.root = new BTreeNode(true)
    this._size = 0
  }

  get size(): number {
    throw new Error('TODO')
  }

  insert(key: number): void {
    throw new Error('TODO')
  }

  search(key: number): boolean {
    throw new Error('TODO')
  }

  delete(key: number): void {
    throw new Error('TODO')
  }

  /** Returns all keys in sorted order via inorder traversal. */
  inorder(): number[] {
    throw new Error('TODO')
  }

  /**
   * Checks that:
   * - Every non-root node has between ⌈order/2⌉ and (order-1) keys
   * - Root has between 1 and (order-1) keys (if non-empty)
   * - Keys within each node are sorted
   * - All leaves are at the same depth
   */
  isValid(): boolean {
    throw new Error('TODO')
  }

  /** Returns true if all leaves are at the same depth. */
  leavesAtSameDepth(): boolean {
    throw new Error('TODO')
  }
}
