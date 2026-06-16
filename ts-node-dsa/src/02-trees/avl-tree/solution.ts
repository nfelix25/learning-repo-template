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

function nodeHeight(node: AVLNode | null): number {
  return node === null ? 0 : node.height
}

function updateHeight(node: AVLNode): void {
  node.height = 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right))
}

function balanceFactor(node: AVLNode): number {
  return nodeHeight(node.right) - nodeHeight(node.left)
}

function rotateRight(z: AVLNode): AVLNode {
  const y = z.left!
  const T3 = y.right
  y.right = z
  z.left = T3
  updateHeight(z)
  updateHeight(y)
  return y
}

function rotateLeft(z: AVLNode): AVLNode {
  const y = z.right!
  const T2 = y.left
  y.left = z
  z.right = T2
  updateHeight(z)
  updateHeight(y)
  return y
}

function rebalance(node: AVLNode): AVLNode {
  updateHeight(node)
  const bf = balanceFactor(node)

  // Left heavy (bf = -2)
  if (bf < -1) {
    const left = node.left!
    if (balanceFactor(left) > 0) {
      // LR case: left-rotate left child first
      node.left = rotateLeft(left)
    }
    return rotateRight(node)
  }

  // Right heavy (bf = +2)
  if (bf > 1) {
    const right = node.right!
    if (balanceFactor(right) < 0) {
      // RL case: right-rotate right child first
      node.right = rotateRight(right)
    }
    return rotateLeft(node)
  }

  return node
}

// Returns [newRoot, wasInserted]
function insertNode(node: AVLNode | null, value: number): [AVLNode, boolean] {
  if (node === null) return [new AVLNode(value), true]
  let inserted = false
  if (value < node.value) {
    const [newLeft, ins] = insertNode(node.left, value)
    node.left = newLeft
    inserted = ins
  } else if (value > node.value) {
    const [newRight, ins] = insertNode(node.right, value)
    node.right = newRight
    inserted = ins
  } else {
    // Duplicate: ignored
    return [node, false]
  }
  return [rebalance(node), inserted]
}

function findMin(node: AVLNode): AVLNode {
  let current = node
  while (current.left !== null) current = current.left
  return current
}

// Returns [newRoot, wasDeleted]
function deleteNode(node: AVLNode | null, value: number): [AVLNode | null, boolean] {
  if (node === null) return [null, false]
  let deleted = false
  if (value < node.value) {
    const [newLeft, del] = deleteNode(node.left, value)
    node.left = newLeft
    deleted = del
  } else if (value > node.value) {
    const [newRight, del] = deleteNode(node.right, value)
    node.right = newRight
    deleted = del
  } else {
    deleted = true
    if (node.left === null) return [node.right, true]
    if (node.right === null) return [node.left, true]
    const successor = findMin(node.right)
    node.value = successor.value
    // Delete the successor from the right subtree; this delete is guaranteed to succeed
    const [newRight] = deleteNode(node.right, successor.value)
    node.right = newRight
  }
  return [rebalance(node), deleted]
}

export class AVLTree {
  root: AVLNode | null
  private _size: number

  constructor() {
    this.root = null
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  insert(value: number): void {
    const [newRoot, inserted] = insertNode(this.root, value)
    this.root = newRoot
    if (inserted) this._size++
  }

  delete(value: number): void {
    const [newRoot, deleted] = deleteNode(this.root, value)
    this.root = newRoot
    if (deleted) this._size--
  }

  search(value: number): boolean {
    let current = this.root
    while (current !== null) {
      if (value === current.value) return true
      current = value < current.value ? current.left : current.right
    }
    return false
  }

  inorder(): number[] {
    const result: number[] = []
    function traverse(node: AVLNode | null): void {
      if (node === null) return
      traverse(node.left)
      result.push(node.value)
      traverse(node.right)
    }
    traverse(this.root)
    return result
  }

  height(): number {
    return nodeHeight(this.root)
  }

  isBalanced(): boolean {
    function check(node: AVLNode | null): boolean {
      if (node === null) return true
      if (Math.abs(balanceFactor(node)) > 1) return false
      return check(node.left) && check(node.right)
    }
    return check(this.root)
  }

  isValidBST(): boolean {
    function check(node: AVLNode | null, min: number, max: number): boolean {
      if (node === null) return true
      if (node.value <= min || node.value > max) return false
      return check(node.left, min, node.value) && check(node.right, node.value, max)
    }
    return check(this.root, -Infinity, Infinity)
  }
}
