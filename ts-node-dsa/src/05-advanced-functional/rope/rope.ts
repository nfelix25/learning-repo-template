/**
 * Rope — a binary tree of string chunks for O(1) concatenation.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */

type RopeNode = LeafNode | InternalNode

interface LeafNode {
  type: 'leaf'
  content: Uint8Array  // UTF-8 bytes
  length: number
}

interface InternalNode {
  type: 'internal'
  left: RopeNode
  right: RopeNode
  length: number
}

export class Rope {
  private root: RopeNode | null = null

  constructor(text?: string) {
    void text
    throw new Error('TODO')
  }

  get length(): number {
    throw new Error('TODO')
  }

  toString(): string {
    throw new Error('TODO')
  }

  /** Returns the character at the given index. Throws RangeError if out of bounds. */
  charAt(index: number): string {
    void index
    throw new Error('TODO')
  }

  /** Returns the substring [start, end). */
  substring(start: number, end: number): string {
    void start
    void end
    throw new Error('TODO')
  }

  /** Returns a new Rope that is the concatenation of this and other. Does NOT mutate either rope. */
  concat(other: Rope): Rope {
    void other
    throw new Error('TODO')
  }

  /** Splits this rope at index, returning [left, right] — two new Ropes. */
  split(index: number): [Rope, Rope] {
    void index
    throw new Error('TODO')
  }

  /** Returns the number of leaf nodes in the tree. */
  leafCount(): number {
    throw new Error('TODO')
  }

  /** Returns the height of the tree (leaf = 0). */
  height(): number {
    throw new Error('TODO')
  }
}
