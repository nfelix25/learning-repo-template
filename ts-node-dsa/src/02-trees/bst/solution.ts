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
    return this._size
  }

  insert(value: number): void {
    if (this.root === null) {
      this.root = new BSTNode(value)
      this._size++
      return
    }
    let current: BSTNode = this.root
    while (true) {
      if (value === current.value) return // duplicate: ignored
      if (value < current.value) {
        if (current.left === null) {
          current.left = new BSTNode(value)
          this._size++
          return
        }
        current = current.left
      } else {
        if (current.right === null) {
          current.right = new BSTNode(value)
          this._size++
          return
        }
        current = current.right
      }
    }
  }

  search(value: number): BSTNode | null {
    let current = this.root
    while (current !== null) {
      if (value === current.value) return current
      current = value < current.value ? current.left : current.right
    }
    return null
  }

  delete(value: number): void {
    this.root = this._delete(this.root, value)
  }

  private _delete(node: BSTNode | null, value: number): BSTNode | null {
    if (node === null) return null
    if (value < node.value) {
      node.left = this._delete(node.left, value)
    } else if (value > node.value) {
      node.right = this._delete(node.right, value)
    } else {
      // Found the node to delete
      this._size--
      if (node.left === null) return node.right
      if (node.right === null) return node.left
      // Two children: replace with in-order successor (min of right subtree)
      const successor = this._findMin(node.right)
      node.value = successor.value
      // Delete the successor from the right subtree
      // We already decremented size above; increment temporarily to avoid double-decrement
      this._size++
      node.right = this._delete(node.right, successor.value)
    }
    return node
  }

  private _findMin(node: BSTNode): BSTNode {
    let current = node
    while (current.left !== null) current = current.left
    return current
  }

  private _findMax(node: BSTNode): BSTNode {
    let current = node
    while (current.right !== null) current = current.right
    return current
  }

  min(): number {
    if (this.root === null) throw new RangeError('Tree is empty')
    return this._findMin(this.root).value
  }

  max(): number {
    if (this.root === null) throw new RangeError('Tree is empty')
    return this._findMax(this.root).value
  }

  predecessor(value: number): number | null {
    let predecessor: number | null = null
    let current = this.root
    while (current !== null) {
      if (current.value < value) {
        predecessor = current.value
        current = current.right
      } else {
        current = current.left
      }
    }
    return predecessor
  }

  successor(value: number): number | null {
    let successor: number | null = null
    let current = this.root
    while (current !== null) {
      if (current.value > value) {
        successor = current.value
        current = current.left
      } else {
        current = current.right
      }
    }
    return successor
  }

  inorder(): number[] {
    const result: number[] = []
    function traverse(node: BSTNode | null): void {
      if (node === null) return
      traverse(node.left)
      result.push(node.value)
      traverse(node.right)
    }
    traverse(this.root)
    return result
  }

  preorder(): number[] {
    const result: number[] = []
    function traverse(node: BSTNode | null): void {
      if (node === null) return
      result.push(node.value)
      traverse(node.left)
      traverse(node.right)
    }
    traverse(this.root)
    return result
  }

  postorder(): number[] {
    const result: number[] = []
    function traverse(node: BSTNode | null): void {
      if (node === null) return
      traverse(node.left)
      traverse(node.right)
      result.push(node.value)
    }
    traverse(this.root)
    return result
  }

  levelOrder(): number[] {
    if (this.root === null) return []
    const result: number[] = []
    const queue: BSTNode[] = [this.root]
    while (queue.length > 0) {
      const node = queue.shift()!
      result.push(node.value)
      if (node.left !== null) queue.push(node.left)
      if (node.right !== null) queue.push(node.right)
    }
    return result
  }

  height(): number {
    function nodeHeight(node: BSTNode | null): number {
      if (node === null) return 0
      return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right))
    }
    return nodeHeight(this.root)
  }

  isValid(): boolean {
    function check(node: BSTNode | null, min: number, max: number): boolean {
      if (node === null) return true
      if (node.value <= min || node.value > max) return false
      return check(node.left, min, node.value) && check(node.right, node.value, max)
    }
    return check(this.root, -Infinity, Infinity)
  }
}
