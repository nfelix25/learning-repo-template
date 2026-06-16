/**
 * Binary Tree Zipper — navigate and edit an immutable binary tree with O(1) moves.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */

export interface BinNode<A> {
  value: A
  left: BinNode<A> | null
  right: BinNode<A> | null
}

type BinCrumb<A> =
  | { type: 'left';  parentValue: A; right: BinNode<A> | null }
  | { type: 'right'; parentValue: A; left:  BinNode<A> | null }

export class BinaryZipper<A> {
  private focus: BinNode<A>
  private context: BinCrumb<A>[]

  constructor(root: BinNode<A>) {
    void root
    this.focus = root
    this.context = []
    throw new Error('TODO')
  }

  /** Returns the currently focused node. */
  getFocus(): BinNode<A> {
    throw new Error('TODO')
  }

  /** Move focus to the left child. Returns null if no left child. */
  goLeft(): BinaryZipper<A> | null {
    throw new Error('TODO')
  }

  /** Move focus to the right child. Returns null if no right child. */
  goRight(): BinaryZipper<A> | null {
    throw new Error('TODO')
  }

  /** Move focus to the parent. Returns null if already at root. */
  goUp(): BinaryZipper<A> | null {
    throw new Error('TODO')
  }

  /** Replace the focused node's value. Returns a new zipper. */
  modify(newValue: A): BinaryZipper<A> {
    void newValue
    throw new Error('TODO')
  }

  /** Reconstruct and return the full tree from the current zipper state. */
  toTree(): BinNode<A> {
    throw new Error('TODO')
  }

  /** Returns true if the focus is at the root (no context). */
  isRoot(): boolean {
    throw new Error('TODO')
  }
}

/** Convenience helper to construct tree nodes for tests. */
export function binNode<A>(
  value: A,
  left: BinNode<A> | null = null,
  right: BinNode<A> | null = null
): BinNode<A> {
  return { value, left, right }
}
