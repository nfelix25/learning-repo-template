/**
 * Splay Tree — reference implementation.
 *
 * Self-contained: no imports from splay-tree.ts.
 *
 * Key ideas:
 *   - Parent pointers enable O(1) rotations.
 *   - splay(x) brings x to the root via zig / zig-zig / zig-zag steps.
 *   - All public operations finish with a splay, so frequently accessed nodes
 *     naturally cluster near the root.
 */

// ---------------------------------------------------------------------------
// Node
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

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
  // Rotation primitives
  // ---------------------------------------------------------------------------

  /**
   * Right-rotate: `x` is the left child of its parent p.
   * After: x moves up, p becomes x's right child.
   *
   *     p            x
   *    / \          / \
   *   x   C   →   A   p
   *  / \              / \
   * A   B            B   C
   */
  rotateRight(x: SplayNode): void {
    const p = x.parent
    if (p === null) return // x is already root; nothing to do

    const B = x.right

    // x takes p's place
    x.parent = p.parent
    if (p.parent !== null) {
      if (p.parent.left === p) {
        p.parent.left = x
      } else {
        p.parent.right = x
      }
    } else {
      // p was the root
      this.root = x
    }

    // x's right child becomes p
    x.right = p
    p.parent = x

    // x's old right child (B) becomes p's left child
    p.left = B
    if (B !== null) B.parent = p
  }

  /**
   * Left-rotate: `x` is the right child of its parent p.
   * After: x moves up, p becomes x's left child.
   *
   *   p              x
   *  / \            / \
   * A   x    →    p   C
   *    / \        / \
   *   B   C      A   B
   */
  rotateLeft(x: SplayNode): void {
    const p = x.parent
    if (p === null) return

    const B = x.left

    // x takes p's place
    x.parent = p.parent
    if (p.parent !== null) {
      if (p.parent.left === p) {
        p.parent.left = x
      } else {
        p.parent.right = x
      }
    } else {
      this.root = x
    }

    // x's left child becomes p
    x.left = p
    p.parent = x

    // x's old left child (B) becomes p's right child
    p.right = B
    if (B !== null) B.parent = p
  }

  // ---------------------------------------------------------------------------
  // Splay
  // ---------------------------------------------------------------------------

  /**
   * Bring `node` to the root by repeatedly applying:
   *   Zig      — parent is root (one rotation)
   *   Zig-Zig  — node and parent on the same side (rotate parent first, then node)
   *   Zig-Zag  — node and parent on opposite sides (rotate node twice)
   */
  splay(node: SplayNode): void {
    while (node.parent !== null) {
      const p = node.parent
      const g = p.parent

      if (g === null) {
        // Zig — single rotation
        if (p.left === node) {
          this.rotateRight(node)
        } else {
          this.rotateLeft(node)
        }
      } else if (g.left === p && p.left === node) {
        // Zig-Zig (left-left): rotate p first, then node
        this.rotateRight(p)
        this.rotateRight(node)
      } else if (g.right === p && p.right === node) {
        // Zig-Zig (right-right): rotate p first, then node
        this.rotateLeft(p)
        this.rotateLeft(node)
      } else if (g.left === p && p.right === node) {
        // Zig-Zag (left-right): rotate node left, then right
        this.rotateLeft(node)
        this.rotateRight(node)
      } else {
        // Zig-Zag (right-left): rotate node right, then left
        this.rotateRight(node)
        this.rotateLeft(node)
      }
    }
    // After splaying, node has no parent — it must be the root
    this.root = node
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Insert `value`. Duplicate inserts splay the existing node but do not add
   * a second copy. The inserted (or found) node is splayed to the root.
   */
  insert(value: number): void {
    if (this.root === null) {
      this.root = new SplayNode(value)
      this._size++
      return
    }

    let current: SplayNode = this.root
    while (true) {
      if (value === current.value) {
        // Duplicate: splay the existing node to root; don't increment size
        this.splay(current)
        return
      }

      if (value < current.value) {
        if (current.left === null) {
          const node = new SplayNode(value)
          node.parent = current
          current.left = node
          this._size++
          this.splay(node)
          return
        }
        current = current.left
      } else {
        if (current.right === null) {
          const node = new SplayNode(value)
          node.parent = current
          current.right = node
          this._size++
          this.splay(node)
          return
        }
        current = current.right
      }
    }
  }

  /**
   * Search for `value`.
   * - Found: splay the node to root, return true.
   * - Not found: splay the last accessed node to root (keeping BST valid), return false.
   */
  search(value: number): boolean {
    if (this.root === null) return false

    let current: SplayNode = this.root
    let last: SplayNode = current

    while (current !== null) {
      last = current
      if (value === current.value) {
        this.splay(current)
        return true
      }
      if (value < current.value) {
        if (current.left === null) break
        current = current.left
      } else {
        if (current.right === null) break
        current = current.right
      }
    }

    // Splay the last accessed node (standard splay tree behaviour on miss)
    this.splay(last)
    return false
  }

  /**
   * Delete `value`. Returns false if not found.
   *
   * Algorithm:
   *   1. Splay `value` to the root. If not present, return false.
   *   2. Split into L = root.left and R = root.right.
   *   3. If L is null, root = R. Done.
   *   4. Splay the max of L to the top of L. That max has no right child.
   *   5. Attach R as its right child.
   */
  delete(value: number): boolean {
    if (!this.search(value)) return false

    // After search, the node (if found) is at the root
    const root = this.root!
    // search returned true so root.value === value
    const L = root.left
    const R = root.right

    // Detach children
    if (L !== null) L.parent = null
    if (R !== null) R.parent = null

    this._size--

    if (L === null) {
      this.root = R
      return true
    }

    // Splay the maximum of L to the top of L (it will have no right child)
    this.root = L
    let maxNode: SplayNode = L
    while (maxNode.right !== null) {
      maxNode = maxNode.right
    }
    this.splay(maxNode)

    // Now this.root === maxNode (which has no right child); attach R
    this.root.right = R
    if (R !== null) R.parent = this.root

    return true
  }

  /** Returns node values in sorted (in-order) sequence using an iterative stack. */
  inorder(): number[] {
    const result: number[] = []
    const stack: SplayNode[] = []
    let current: SplayNode | null = this.root

    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push(current)
        current = current.left
      }
      current = stack.pop() ?? null
      if (current === null) break
      result.push(current.value)
      current = current.right
    }

    return result
  }

  /** Height of the tree (0 for empty, 1 for a single node). */
  height(): number {
    function nodeHeight(n: SplayNode | null): number {
      if (n === null) return 0
      return 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right))
    }
    return nodeHeight(this.root)
  }
}
