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
  readonly order: number   // max children; max keys = order - 1
  private _size: number

  constructor(order: number) {
    if (order < 2) throw new RangeError('B-Tree order must be at least 2')
    this.order = order
    this.root = new BTreeNode(true)
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private maxKeys(): number {
    return this.order - 1
  }

  private minKeys(): number {
    return Math.ceil(this.order / 2) - 1
  }

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  search(key: number): boolean {
    return this.searchNode(this.root, key)
  }

  private searchNode(node: BTreeNode, key: number): boolean {
    let i = 0
    while (i < node.keys.length && key > (node.keys[i] as number)) i++
    if (i < node.keys.length && key === (node.keys[i] as number)) return true
    if (node.isLeaf) return false
    return this.searchNode(node.children[i] as BTreeNode, key)
  }

  // ---------------------------------------------------------------------------
  // Insert (split-on-the-way-down)
  // ---------------------------------------------------------------------------

  insert(key: number): void {
    if (this.search(key)) return // duplicate: ignored

    const root = this.root
    if (root.keys.length === this.maxKeys()) {
      // Root is full: split it
      const newRoot = new BTreeNode(false)
      newRoot.children.push(root)
      this.splitChild(newRoot, 0)
      this.root = newRoot
    }
    this.insertNonFull(this.root, key)
    this._size++
  }

  // Split the i-th child of parent (which must be full)
  private splitChild(parent: BTreeNode, i: number): void {
    const fullChild = parent.children[i] as BTreeNode
    const t = Math.ceil(this.order / 2) // minimum degree
    const median = fullChild.keys[t - 1] as number

    // Create the right sibling
    const rightChild = new BTreeNode(fullChild.isLeaf)
    rightChild.keys = fullChild.keys.splice(t) // keys after median
    fullChild.keys.splice(t - 1) // remove median from left child, left has t-1 keys now

    if (!fullChild.isLeaf) {
      rightChild.children = fullChild.children.splice(t)
    }

    // Insert median into parent
    parent.keys.splice(i, 0, median)
    parent.children.splice(i + 1, 0, rightChild)
  }

  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1

    if (node.isLeaf) {
      // Find the right position and insert
      node.keys.push(0) // placeholder
      while (i >= 0 && key < (node.keys[i] as number)) {
        node.keys[i + 1] = node.keys[i] as number
        i--
      }
      node.keys[i + 1] = key
    } else {
      // Find child to descend into
      while (i >= 0 && key < (node.keys[i] as number)) i--
      i++
      const child = node.children[i] as BTreeNode
      if (child.keys.length === this.maxKeys()) {
        // Proactively split full child before descending
        this.splitChild(node, i)
        // After split, the median is at node.keys[i]; decide which side to descend
        if (key > (node.keys[i] as number)) i++
      }
      this.insertNonFull(node.children[i] as BTreeNode, key)
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  delete(key: number): void {
    if (!this.search(key)) return // key not found
    this.deleteFromNode(this.root, key)
    this._size--

    // If root has no keys but has a child, shrink the tree
    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.root = this.root.children[0] as BTreeNode
    }
  }

  private deleteFromNode(node: BTreeNode, key: number): void {
    const t = this.minKeys() + 1 // minimum degree = minKeys + 1
    let i = 0
    while (i < node.keys.length && key > (node.keys[i] as number)) i++

    if (i < node.keys.length && key === (node.keys[i] as number)) {
      // Key found in this node
      if (node.isLeaf) {
        // Case 1: Delete from leaf
        node.keys.splice(i, 1)
      } else {
        // Case 2: Delete from internal node
        const leftChild = node.children[i] as BTreeNode
        const rightChild = node.children[i + 1] as BTreeNode

        if (leftChild.keys.length >= t) {
          // Case 2a: Left child has enough keys — use predecessor
          const pred = this.getMax(leftChild)
          node.keys[i] = pred
          this.deleteFromNode(leftChild, pred)
        } else if (rightChild.keys.length >= t) {
          // Case 2b: Right child has enough keys — use successor
          const succ = this.getMin(rightChild)
          node.keys[i] = succ
          this.deleteFromNode(rightChild, succ)
        } else {
          // Case 2c: Both children at minimum — merge and delete
          this.mergeChildren(node, i)
          this.deleteFromNode(leftChild, key)
        }
      }
    } else {
      // Key not in this node — descend
      if (node.isLeaf) return // key doesn't exist

      const child = node.children[i] as BTreeNode
      if (child.keys.length <= this.minKeys()) {
        // Ensure child has enough keys before descending
        this.fill(node, i)
        // After fill, the child at index i may have changed (due to merge)
        // Re-locate the index
        if (i > 0 && i >= node.keys.length) i = node.keys.length
      }
      // Re-find i after potential restructuring
      let newI = 0
      while (newI < node.keys.length && key > (node.keys[newI] as number)) newI++
      this.deleteFromNode(node.children[newI] as BTreeNode, key)
    }
  }

  // Ensure node.children[i] has at least minKeys+1 keys
  private fill(node: BTreeNode, i: number): void {
    const t = this.minKeys() + 1

    const leftSibling = i > 0 ? (node.children[i - 1] as BTreeNode) : null
    const rightSibling = i < node.children.length - 1 ? (node.children[i + 1] as BTreeNode) : null

    if (leftSibling !== null && leftSibling.keys.length >= t) {
      this.borrowFromLeft(node, i)
    } else if (rightSibling !== null && rightSibling.keys.length >= t) {
      this.borrowFromRight(node, i)
    } else if (leftSibling !== null) {
      this.mergeChildren(node, i - 1)
    } else {
      this.mergeChildren(node, i)
    }
  }

  // Borrow a key from the left sibling (node.children[i-1]) into node.children[i]
  private borrowFromLeft(node: BTreeNode, i: number): void {
    const child = node.children[i] as BTreeNode
    const leftSibling = node.children[i - 1] as BTreeNode

    // Move node.keys[i-1] down to the front of child
    child.keys.unshift(node.keys[i - 1] as number)
    // Move leftSibling's last key up to node
    node.keys[i - 1] = leftSibling.keys.pop() as number

    // If not leaf, move leftSibling's last child to child's front
    if (!child.isLeaf) {
      child.children.unshift(leftSibling.children.pop() as BTreeNode)
    }
  }

  // Borrow a key from the right sibling (node.children[i+1]) into node.children[i]
  private borrowFromRight(node: BTreeNode, i: number): void {
    const child = node.children[i] as BTreeNode
    const rightSibling = node.children[i + 1] as BTreeNode

    // Move node.keys[i] down to the end of child
    child.keys.push(node.keys[i] as number)
    // Move rightSibling's first key up to node
    node.keys[i] = rightSibling.keys.shift() as number

    // If not leaf, move rightSibling's first child to child's end
    if (!child.isLeaf) {
      child.children.push(rightSibling.children.shift() as BTreeNode)
    }
  }

  // Merge node.children[i+1] into node.children[i], pulling down node.keys[i]
  private mergeChildren(node: BTreeNode, i: number): void {
    const leftChild = node.children[i] as BTreeNode
    const rightChild = node.children[i + 1] as BTreeNode
    const medianKey = node.keys[i] as number

    // Pull the median key from parent into leftChild
    leftChild.keys.push(medianKey)
    // Append all keys from right child
    leftChild.keys.push(...rightChild.keys)
    // Append all children from right child (if not leaf)
    if (!leftChild.isLeaf) {
      leftChild.children.push(...rightChild.children)
    }

    // Remove median from parent and remove right child
    node.keys.splice(i, 1)
    node.children.splice(i + 1, 1)
  }

  private getMin(node: BTreeNode): number {
    let current = node
    while (!current.isLeaf) current = current.children[0] as BTreeNode
    return current.keys[0] as number
  }

  private getMax(node: BTreeNode): number {
    let current = node
    while (!current.isLeaf) current = current.children[current.children.length - 1] as BTreeNode
    return current.keys[current.keys.length - 1] as number
  }

  // ---------------------------------------------------------------------------
  // Traversal
  // ---------------------------------------------------------------------------

  inorder(): number[] {
    const result: number[] = []
    this.inorderNode(this.root, result)
    return result
  }

  private inorderNode(node: BTreeNode, result: number[]): void {
    for (let i = 0; i < node.keys.length; i++) {
      if (!node.isLeaf) {
        this.inorderNode(node.children[i] as BTreeNode, result)
      }
      result.push(node.keys[i] as number)
    }
    if (!node.isLeaf) {
      this.inorderNode(node.children[node.keys.length] as BTreeNode, result)
    }
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  isValid(): boolean {
    if (this.root.keys.length === 0) return true
    return this.validateNode(this.root, true, -Infinity, Infinity)
  }

  private validateNode(node: BTreeNode, isRoot: boolean, min: number, max: number): boolean {
    const minK = this.minKeys()
    const maxK = this.maxKeys()

    // Check key count bounds
    if (isRoot) {
      if (node.keys.length > maxK) return false
      // Root can have 0 keys only if it is the only node (leaf)
      if (!node.isLeaf && node.keys.length < 1) return false
    } else {
      if (node.keys.length < minK || node.keys.length > maxK) return false
    }

    // Check keys are sorted and within bounds
    let prev = min
    for (let i = 0; i < node.keys.length; i++) {
      const k = node.keys[i] as number
      if (k <= prev || k >= max) return false
      prev = k
    }

    // Check children count
    if (!node.isLeaf && node.children.length !== node.keys.length + 1) return false

    // Recurse into children
    if (!node.isLeaf) {
      for (let i = 0; i <= node.keys.length; i++) {
        const childMin = i === 0 ? min : (node.keys[i - 1] as number)
        const childMax = i === node.keys.length ? max : (node.keys[i] as number)
        if (!this.validateNode(node.children[i] as BTreeNode, false, childMin, childMax)) {
          return false
        }
      }
    }

    return true
  }

  leavesAtSameDepth(): boolean {
    let expectedDepth = -1

    const check = (node: BTreeNode, depth: number): boolean => {
      if (node.isLeaf) {
        if (expectedDepth === -1) {
          expectedDepth = depth
          return true
        }
        return depth === expectedDepth
      }
      for (const child of node.children) {
        if (!check(child, depth + 1)) return false
      }
      return true
    }

    return check(this.root, 0)
  }
}
