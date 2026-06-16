export const RED = 0
export const BLACK = 1
export type Color = 0 | 1

export class RBNode {
  value: number
  color: Color
  left: RBNode
  right: RBNode
  parent: RBNode

  // Overloaded constructor: the sentinel bootstraps itself
  constructor(value: number, color: Color, sentinel: RBNode | null = null) {
    this.value = value
    this.color = color
    // During bootstrap, sentinel is null so we point to self temporarily
    this.left = sentinel ?? (this as RBNode)
    this.right = sentinel ?? (this as RBNode)
    this.parent = sentinel ?? (this as RBNode)
  }
}

export class RedBlackTree {
  root: RBNode
  private nil: RBNode
  private _size: number

  constructor() {
    // Create the nil sentinel: it points to itself
    this.nil = new RBNode(0, BLACK, null)
    // root starts as nil (empty tree)
    this.root = this.nil
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  // -------------------------------------------------------------------------
  // Rotations
  // -------------------------------------------------------------------------

  private rotateLeft(x: RBNode): void {
    const y = x.right
    x.right = y.left
    if (y.left !== this.nil) y.left.parent = x
    y.parent = x.parent
    if (x.parent === this.nil) {
      this.root = y
    } else if (x === x.parent.left) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }
    y.left = x
    x.parent = y
  }

  private rotateRight(x: RBNode): void {
    const y = x.left
    x.left = y.right
    if (y.right !== this.nil) y.right.parent = x
    y.parent = x.parent
    if (x.parent === this.nil) {
      this.root = y
    } else if (x === x.parent.right) {
      x.parent.right = y
    } else {
      x.parent.left = y
    }
    y.right = x
    x.parent = y
  }

  // -------------------------------------------------------------------------
  // Insert
  // -------------------------------------------------------------------------

  insert(value: number): void {
    // Standard BST insert
    const z = new RBNode(value, RED, this.nil)
    let y = this.nil
    let x = this.root

    while (x !== this.nil) {
      y = x
      if (z.value < x.value) {
        x = x.left
      } else if (z.value > x.value) {
        x = x.right
      } else {
        // Duplicate: ignored
        return
      }
    }

    z.parent = y
    if (y === this.nil) {
      this.root = z
    } else if (z.value < y.value) {
      y.left = z
    } else {
      y.right = z
    }

    z.left = this.nil
    z.right = this.nil
    z.color = RED
    this._size++
    this.insertFixup(z)
  }

  private insertFixup(z: RBNode): void {
    while (z.parent.color === RED) {
      if (z.parent === z.parent.parent.left) {
        // Parent is left child
        const uncle = z.parent.parent.right
        if (uncle.color === RED) {
          // Case 1: Uncle is red — recolor
          z.parent.color = BLACK
          uncle.color = BLACK
          z.parent.parent.color = RED
          z = z.parent.parent
        } else {
          if (z === z.parent.right) {
            // Case 2: Uncle is black, z is inner child — rotate parent left
            z = z.parent
            this.rotateLeft(z)
          }
          // Case 3: Uncle is black, z is outer child — rotate grandparent right
          z.parent.color = BLACK
          z.parent.parent.color = RED
          this.rotateRight(z.parent.parent)
        }
      } else {
        // Parent is right child (mirror cases)
        const uncle = z.parent.parent.left
        if (uncle.color === RED) {
          // Case 1 (mirror)
          z.parent.color = BLACK
          uncle.color = BLACK
          z.parent.parent.color = RED
          z = z.parent.parent
        } else {
          if (z === z.parent.left) {
            // Case 2 (mirror)
            z = z.parent
            this.rotateRight(z)
          }
          // Case 3 (mirror)
          z.parent.color = BLACK
          z.parent.parent.color = RED
          this.rotateLeft(z.parent.parent)
        }
      }
    }
    this.root.color = BLACK
  }

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------

  delete(value: number): void {
    const z = this.findNode(value)
    if (z === this.nil) return
    this.rbDelete(z)
    this._size--
  }

  private findNode(value: number): RBNode {
    let x = this.root
    while (x !== this.nil) {
      if (value === x.value) return x
      x = value < x.value ? x.left : x.right
    }
    return this.nil
  }

  private transplant(u: RBNode, v: RBNode): void {
    if (u.parent === this.nil) {
      this.root = v
    } else if (u === u.parent.left) {
      u.parent.left = v
    } else {
      u.parent.right = v
    }
    v.parent = u.parent
  }

  private treeMin(node: RBNode): RBNode {
    let x = node
    while (x.left !== this.nil) x = x.left
    return x
  }

  private rbDelete(z: RBNode): void {
    let y = z
    let yOriginalColor: Color = y.color
    let x: RBNode

    if (z.left === this.nil) {
      x = z.right
      this.transplant(z, z.right)
    } else if (z.right === this.nil) {
      x = z.left
      this.transplant(z, z.left)
    } else {
      // Two children: find in-order successor (min of right subtree)
      y = this.treeMin(z.right)
      yOriginalColor = y.color
      x = y.right
      if (y.parent === z) {
        x.parent = y
      } else {
        this.transplant(y, y.right)
        y.right = z.right
        y.right.parent = y
      }
      this.transplant(z, y)
      y.left = z.left
      y.left.parent = y
      y.color = z.color
    }

    if (yOriginalColor === BLACK) {
      this.deleteFixup(x)
    }
  }

  private deleteFixup(x: RBNode): void {
    while (x !== this.root && x.color === BLACK) {
      if (x === x.parent.left) {
        let w = x.parent.right
        if (w.color === RED) {
          // Case 1: Sibling is red
          w.color = BLACK
          x.parent.color = RED
          this.rotateLeft(x.parent)
          w = x.parent.right
        }
        if (w.left.color === BLACK && w.right.color === BLACK) {
          // Case 2: Sibling has two black children
          w.color = RED
          x = x.parent
        } else {
          if (w.right.color === BLACK) {
            // Case 3: Sibling's right child is black (near child is red)
            w.left.color = BLACK
            w.color = RED
            this.rotateRight(w)
            w = x.parent.right
          }
          // Case 4: Sibling's right child is red
          w.color = x.parent.color
          x.parent.color = BLACK
          w.right.color = BLACK
          this.rotateLeft(x.parent)
          x = this.root
        }
      } else {
        // Mirror cases
        let w = x.parent.left
        if (w.color === RED) {
          // Case 1 (mirror)
          w.color = BLACK
          x.parent.color = RED
          this.rotateRight(x.parent)
          w = x.parent.left
        }
        if (w.right.color === BLACK && w.left.color === BLACK) {
          // Case 2 (mirror)
          w.color = RED
          x = x.parent
        } else {
          if (w.left.color === BLACK) {
            // Case 3 (mirror)
            w.right.color = BLACK
            w.color = RED
            this.rotateLeft(w)
            w = x.parent.left
          }
          // Case 4 (mirror)
          w.color = x.parent.color
          x.parent.color = BLACK
          w.left.color = BLACK
          this.rotateRight(x.parent)
          x = this.root
        }
      }
    }
    x.color = BLACK
  }

  // -------------------------------------------------------------------------
  // Search
  // -------------------------------------------------------------------------

  search(value: number): boolean {
    return this.findNode(value) !== this.nil
  }

  // -------------------------------------------------------------------------
  // Traversal
  // -------------------------------------------------------------------------

  inorder(): number[] {
    const result: number[] = []
    const traverse = (node: RBNode): void => {
      if (node === this.nil) return
      traverse(node.left)
      result.push(node.value)
      traverse(node.right)
    }
    traverse(this.root)
    return result
  }

  // -------------------------------------------------------------------------
  // Invariant checks (for testing)
  // -------------------------------------------------------------------------

  isRootBlack(): boolean {
    return this.root === this.nil || this.root.color === BLACK
  }

  hasNoRedRedViolation(): boolean {
    const check = (node: RBNode): boolean => {
      if (node === this.nil) return true
      if (node.color === RED) {
        if (node.left.color === RED || node.right.color === RED) return false
      }
      return check(node.left) && check(node.right)
    }
    return check(this.root)
  }

  hasUniformBlackHeight(): boolean {
    let expectedBlackHeight = -1

    const check = (node: RBNode, currentBlackHeight: number): boolean => {
      if (node === this.nil) {
        const bh = currentBlackHeight + 1
        if (expectedBlackHeight === -1) {
          expectedBlackHeight = bh
          return true
        }
        return bh === expectedBlackHeight
      }
      const nextBH = node.color === BLACK ? currentBlackHeight + 1 : currentBlackHeight
      return check(node.left, nextBH) && check(node.right, nextBH)
    }

    return check(this.root, 0)
  }

  isValidBST(): boolean {
    const check = (node: RBNode, min: number, max: number): boolean => {
      if (node === this.nil) return true
      if (node.value <= min || node.value > max) return false
      return check(node.left, min, node.value) && check(node.right, node.value, max)
    }
    return check(this.root, -Infinity, Infinity)
  }
}
