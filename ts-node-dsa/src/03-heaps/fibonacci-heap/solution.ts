/**
 * Fibonacci Heap — reference implementation.
 *
 * Self-contained: no imports from fibonacci-heap.ts.
 *
 * Key invariants maintained throughout:
 *   1. Every node's left/right pointers form a valid circular doubly-linked list.
 *   2. Every non-root node satisfies parent.key <= node.key.
 *   3. this.min points to the root with the smallest key (or null if empty).
 */

export interface FibNode {
  key: number
  degree: number
  marked: boolean
  parent: FibNode | null
  child: FibNode | null
  left: FibNode
  right: FibNode
}

// ---------------------------------------------------------------------------
// Internal helpers for circular doubly-linked lists
// ---------------------------------------------------------------------------

/** Creates a new isolated node. left and right point to itself (valid singleton list). */
function makeNode(key: number): FibNode {
  const node = {
    key,
    degree: 0,
    marked: false,
    parent: null,
    child: null,
  } as Partial<FibNode> as FibNode
  node.left = node
  node.right = node
  return node
}

/**
 * Inserts `node` immediately to the left of `anchor` in anchor's circular list.
 * After: ... ↔ node ↔ anchor ↔ ...
 */
function insertIntoList(anchor: FibNode, node: FibNode): void {
  node.right = anchor
  node.left = anchor.left
  anchor.left.right = node
  anchor.left = node
}

/**
 * Removes `node` from its circular list.
 * After removal, node.left = node.right = node (isolated).
 * DOES NOT update parent/child pointers — caller must do that.
 */
function removeFromList(node: FibNode): void {
  node.left.right = node.right
  node.right.left = node.left
  node.left = node
  node.right = node
}

// ---------------------------------------------------------------------------
// FibonacciHeap
// ---------------------------------------------------------------------------

export class FibonacciHeap {
  private min: FibNode | null
  private _size: number

  constructor() {
    this.min = null
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    return this._min === null
  }

  // Keep TypeScript happy: expose min through a private getter alias
  // (the field is named min, used directly in methods)
  private get _min(): FibNode | null {
    return this.min
  }

  // ---------------------------------------------------------------------------
  // insert — O(1)
  // ---------------------------------------------------------------------------

  insert(key: number): FibNode {
    const node = makeNode(key)
    this._addToRootList(node)
    this._size++
    return node
  }

  // ---------------------------------------------------------------------------
  // findMin — O(1)
  // ---------------------------------------------------------------------------

  findMin(): number {
    if (this.min === null) {
      throw new RangeError('Cannot findMin on an empty heap')
    }
    return this.min.key
  }

  // ---------------------------------------------------------------------------
  // extractMin — O(log n) amortized
  // ---------------------------------------------------------------------------

  extractMin(): number {
    if (this.min === null) {
      throw new RangeError('Cannot extractMin from an empty heap')
    }

    const minNode = this.min

    // 1. Add all children of minNode to the root list
    if (minNode.child !== null) {
      // Collect children first (child list will be mutated)
      const children: FibNode[] = []
      let cur = minNode.child
      do {
        children.push(cur)
        cur = cur.right
      } while (cur !== minNode.child)

      for (const child of children) {
        removeFromList(child)
        child.parent = null
        this._addToRootList(child)
      }
      minNode.child = null
    }

    // 2. Remove minNode from root list
    if (minNode.right === minNode) {
      // minNode was the only root
      this.min = null
    } else {
      // Temporarily set min to some other root before consolidating
      this.min = minNode.right
      removeFromList(minNode)
      // 3. Consolidate
      this._consolidate()
    }

    this._size--
    return minNode.key
  }

  // ---------------------------------------------------------------------------
  // decreaseKey — O(1) amortized
  // ---------------------------------------------------------------------------

  decreaseKey(node: FibNode, newKey: number): void {
    if (newKey > node.key) {
      throw new RangeError(
        `newKey (${newKey}) must be ≤ node.key (${node.key})`
      )
    }
    node.key = newKey

    const parent = node.parent
    if (parent !== null && node.key < parent.key) {
      // Heap property violated: cut the node
      this._cut(node, parent)
      this._cascadeCut(parent)
    }

    // Update min pointer if needed
    if (this.min !== null && node.key < this.min.key) {
      this.min = node
    }
  }

  // ---------------------------------------------------------------------------
  // delete — O(log n) amortized
  // ---------------------------------------------------------------------------

  delete(node: FibNode): void {
    this.decreaseKey(node, -Infinity)
    this.extractMin()
  }

  // ---------------------------------------------------------------------------
  // Testing helpers
  // ---------------------------------------------------------------------------

  /** Returns the number of trees in the root list. */
  rootCount(): number {
    if (this.min === null) return 0
    let count = 0
    let cur = this.min
    do {
      count++
      cur = cur.right
    } while (cur !== this.min)
    return count
  }

  /**
   * Returns true if every parent-child pair satisfies parent.key <= child.key.
   * Does a DFS over all nodes reachable from the root list.
   */
  isHeapOrdered(): boolean {
    if (this.min === null) return true
    return this._checkSubtree(this.min, null, new Set<FibNode>())
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /** Adds `node` (already isolated) to the root list and updates min. */
  private _addToRootList(node: FibNode): void {
    node.parent = null
    node.marked = false
    if (this.min === null) {
      this.min = node
      // node.left = node.right = node already (makeNode guarantee)
    } else {
      insertIntoList(this.min, node)
      if (node.key < this.min.key) {
        this.min = node
      }
    }
  }

  /**
   * Consolidate the root list so that no two roots have the same degree.
   * Uses a degree table (array indexed by degree).
   * After consolidation, resets this.min to the root with the smallest key.
   */
  private _consolidate(): void {
    // Max possible degree: floor(log_phi(n)) where phi = golden ratio ≈ 1.618
    // A safe upper bound: floor(log2(n) * 1.5) + 2
    const maxDegree = Math.floor(Math.log2(this._size + 1) * 2) + 2
    const degreeTable: Array<FibNode | null> = new Array(maxDegree + 1).fill(null)

    // Collect all roots into an array (root list will be mutated during consolidation)
    const roots: FibNode[] = []
    if (this.min !== null) {
      let cur = this.min
      do {
        roots.push(cur)
        cur = cur.right
      } while (cur !== this.min)
    }

    for (let root of roots) {
      let degree = root.degree

      // Grow table if needed (for safety with large heaps)
      while (degree >= degreeTable.length) {
        degreeTable.push(null)
      }

      while (degreeTable[degree] !== null) {
        let other = degreeTable[degree]! // non-null by while condition
        degreeTable[degree] = null

        // Ensure `root` has the smaller key (it will become the parent)
        if (other.key < root.key) {
          const tmp = root
          root = other
          other = tmp
        }

        // Link `other` under `root`
        this._link(other, root)
        degree++

        // Grow table if needed
        while (degree >= degreeTable.length) {
          degreeTable.push(null)
        }
      }
      degreeTable[degree] = root
    }

    // Rebuild root list from degree table and find new min
    this.min = null
    for (const root of degreeTable) {
      if (root === null) continue
      // Isolate and re-add to root list
      root.left = root
      root.right = root
      root.parent = null
      if (this.min === null) {
        this.min = root
      } else {
        insertIntoList(this.min, root)
        if (root.key < this.min.key) {
          this.min = root
        }
      }
    }
  }

  /**
   * Links `child` under `parent`: removes `child` from root list,
   * adds it to `parent`'s child list, increments `parent.degree`.
   */
  private _link(child: FibNode, parent: FibNode): void {
    // child will be removed from root list by consolidate (already collected)
    child.parent = parent
    child.marked = false
    if (parent.child === null) {
      parent.child = child
      child.left = child
      child.right = child
    } else {
      insertIntoList(parent.child, child)
    }
    parent.degree++
  }

  /**
   * Cuts `node` from `parent`'s child list and adds it to the root list.
   */
  private _cut(node: FibNode, parent: FibNode): void {
    // Remove node from parent's child list
    if (node.right === node) {
      // Only child
      parent.child = null
    } else {
      if (parent.child === node) {
        parent.child = node.right
      }
      removeFromList(node)
    }
    parent.degree--
    node.parent = null
    node.marked = false
    // Add to root list
    this._addToRootList(node)
  }

  /**
   * If `node` is marked (previously lost a child), cut it from its parent
   * and cascade upward. Otherwise, mark it.
   */
  private _cascadeCut(node: FibNode): void {
    const parent = node.parent
    if (parent !== null) {
      if (!node.marked) {
        node.marked = true
      } else {
        this._cut(node, parent)
        this._cascadeCut(parent)
      }
    }
  }

  /**
   * Recursive DFS heap-order check. Uses `visited` to handle circular lists.
   */
  private _checkSubtree(
    start: FibNode,
    parentNode: FibNode | null,
    visited: Set<FibNode>
  ): boolean {
    let cur = start
    do {
      if (visited.has(cur)) break
      visited.add(cur)

      if (parentNode !== null && cur.key < parentNode.key) {
        return false
      }

      if (cur.child !== null) {
        if (!this._checkSubtree(cur.child, cur, visited)) {
          return false
        }
      }

      cur = cur.right
    } while (cur !== start)

    return true
  }
}
