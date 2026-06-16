/**
 * Rope — working implementation.
 *
 * A Rope represents a string as a balanced binary tree of Uint8Array chunks.
 * Concatenation is O(1). charAt / split are O(log n). toString is O(n).
 *
 * Import in tests via:  import { Rope } from './solution.js'
 */

const encoder = new TextEncoder()
const decoder = new TextDecoder()

// ---------------------------------------------------------------------------
// Internal node types
// ---------------------------------------------------------------------------

type RopeNode = LeafNode | InternalNode

interface LeafNode {
  type: 'leaf'
  content: Uint8Array
  length: number
}

interface InternalNode {
  type: 'internal'
  left: RopeNode
  right: RopeNode
  length: number
}

// ---------------------------------------------------------------------------
// Node-level helpers
// ---------------------------------------------------------------------------

function makeLeaf(text: string): LeafNode {
  const content = encoder.encode(text)
  return { type: 'leaf', content, length: content.length }
}

function makeInternal(left: RopeNode, right: RopeNode): InternalNode {
  return { type: 'internal', left, right, length: left.length + right.length }
}

function nodeLength(node: RopeNode | null): number {
  return node === null ? 0 : node.length
}

function nodeHeight(node: RopeNode | null): number {
  if (node === null) return -1
  if (node.type === 'leaf') return 0
  return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right))
}

function nodeLeafCount(node: RopeNode | null): number {
  if (node === null) return 0
  if (node.type === 'leaf') return 1
  return nodeLeafCount(node.left) + nodeLeafCount(node.right)
}

function collectLeaves(node: RopeNode | null, out: Uint8Array[]): void {
  if (node === null) return
  if (node.type === 'leaf') {
    out.push(node.content)
    return
  }
  collectLeaves(node.left, out)
  collectLeaves(node.right, out)
}

function nodeToString(node: RopeNode | null): string {
  if (node === null) return ''
  const leaves: Uint8Array[] = []
  collectLeaves(node, leaves)
  const total = leaves.reduce((s, l) => s + l.length, 0)
  const combined = new Uint8Array(total)
  let offset = 0
  for (const leaf of leaves) {
    combined.set(leaf, offset)
    offset += leaf.length
  }
  return decoder.decode(combined)
}

function nodeCharAt(node: RopeNode, index: number): number {
  if (node.type === 'leaf') {
    const byte = node.content[index]
    if (byte === undefined) throw new RangeError(`Index ${index} out of leaf bounds`)
    return byte
  }
  if (index < node.left.length) {
    return nodeCharAt(node.left, index)
  }
  return nodeCharAt(node.right, index - node.left.length)
}

/**
 * Split a node at byte position `index`.
 * Returns [left | null, right | null].
 */
function nodeSplit(
  node: RopeNode | null,
  index: number
): [RopeNode | null, RopeNode | null] {
  if (node === null) return [null, null]
  if (index <= 0) return [null, node]
  if (index >= node.length) return [node, null]

  if (node.type === 'leaf') {
    const leftContent = node.content.slice(0, index)
    const rightContent = node.content.slice(index)
    const left: LeafNode = { type: 'leaf', content: leftContent, length: leftContent.length }
    const right: LeafNode = { type: 'leaf', content: rightContent, length: rightContent.length }
    return [left, right]
  }

  const leftLen = node.left.length
  if (index < leftLen) {
    const [ll, lr] = nodeSplit(node.left, index)
    const right: RopeNode = lr !== null ? makeInternal(lr, node.right) : node.right
    return [ll, right]
  }
  if (index === leftLen) {
    return [node.left, node.right]
  }
  // index > leftLen
  const [rl, rr] = nodeSplit(node.right, index - leftLen)
  const left: RopeNode = rl !== null ? makeInternal(node.left, rl) : node.left
  return [left, rr]
}

function maybeRebalance(node: RopeNode): RopeNode {
  if (node.type === 'leaf') return node
  const h = nodeHeight(node)
  const threshold = node.length > 1 ? 1.44 * Math.log2(node.length) : 1
  if (h <= threshold) return node
  return rebalanceNode(node)
}

function rebalanceNode(node: RopeNode): RopeNode {
  const leaves: Uint8Array[] = []
  collectLeaves(node, leaves)
  if (leaves.length === 0) return { type: 'leaf', content: new Uint8Array(0), length: 0 }
  return buildBalanced(leaves, 0, leaves.length)
}

function buildBalanced(leaves: Uint8Array[], start: number, end: number): RopeNode {
  const count = end - start
  if (count === 1) {
    const content = leaves[start]!
    return { type: 'leaf', content, length: content.length }
  }
  const mid = start + Math.floor(count / 2)
  const left = buildBalanced(leaves, start, mid)
  const right = buildBalanced(leaves, mid, end)
  return makeInternal(left, right)
}

// ---------------------------------------------------------------------------
// Rope class
// ---------------------------------------------------------------------------

export class Rope {
  // Private field: store root node. We use a symbol-keyed property so the
  // class can be instantiated with `new Rope(text)` just like the skeleton.
  private _root: RopeNode | null

  constructor(text?: string) {
    if (text === undefined || text === '') {
      this._root = null
    } else {
      this._root = makeLeaf(text)
    }
  }

  /** Used internally to create a Rope with an existing node. */
  private static _fromNode(node: RopeNode | null): Rope {
    const r = new Rope()
    r._root = node
    return r
  }

  get length(): number {
    return nodeLength(this._root)
  }

  toString(): string {
    return nodeToString(this._root)
  }

  /** Returns the character at the given index. Throws RangeError if out of bounds. */
  charAt(index: number): string {
    if (this._root === null || index < 0 || index >= this._root.length) {
      throw new RangeError(`Index ${index} out of bounds (length=${this.length})`)
    }
    const byte = nodeCharAt(this._root, index)
    return decoder.decode(new Uint8Array([byte]))
  }

  /** Returns the substring [start, end). */
  substring(start: number, end: number): string {
    if (start >= end) return ''
    const [, afterStart] = nodeSplit(this._root, start)
    const len = end - start
    const [middle] = nodeSplit(afterStart, len)
    return nodeToString(middle)
  }

  /** Returns a new Rope = this + other. Does NOT mutate. */
  concat(other: Rope): Rope {
    if (this._root === null) return other
    if (other._root === null) return this
    const combined = makeInternal(this._root, other._root)
    return Rope._fromNode(maybeRebalance(combined))
  }

  /** Splits this rope at index, returning [left, right] — two new Ropes. */
  split(index: number): [Rope, Rope] {
    const [l, r] = nodeSplit(this._root, index)
    return [Rope._fromNode(l), Rope._fromNode(r)]
  }

  /** Number of leaf nodes. */
  leafCount(): number {
    return nodeLeafCount(this._root)
  }

  /** Height of the tree (leaf = 0, empty = -1). */
  height(): number {
    return nodeHeight(this._root)
  }
}
