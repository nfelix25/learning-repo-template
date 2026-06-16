/**
 * Binary Tree Zipper — solution implementation.
 *
 * Exports the same interface as zipper.ts so tests can be pointed at either file.
 */

export interface BinNode<A> {
  value: A
  left: BinNode<A> | null
  right: BinNode<A> | null
}

export function binNode<A>(
  value: A,
  left: BinNode<A> | null = null,
  right: BinNode<A> | null = null
): BinNode<A> {
  return { value, left, right }
}

// A breadcrumb records which direction we descended and what we left behind.
type BinCrumb<A> =
  | { type: 'left';  parentValue: A; right: BinNode<A> | null }
  | { type: 'right'; parentValue: A; left:  BinNode<A> | null }

export class BinaryZipper<A> {
  // Using readonly private fields; all mutations return new instances.
  private readonly focus: BinNode<A>
  private readonly context: readonly BinCrumb<A>[]

  constructor(focus: BinNode<A>, context: readonly BinCrumb<A>[] = []) {
    this.focus = focus
    this.context = context
  }

  /** Returns the currently focused node. */
  getFocus(): BinNode<A> {
    return this.focus
  }

  /** Move focus to the left child. Returns null if no left child. */
  goLeft(): BinaryZipper<A> | null {
    if (this.focus.left === null) return null
    const crumb: BinCrumb<A> = {
      type: 'left',
      parentValue: this.focus.value,
      right: this.focus.right,
    }
    return new BinaryZipper<A>(this.focus.left, [crumb, ...this.context])
  }

  /** Move focus to the right child. Returns null if no right child. */
  goRight(): BinaryZipper<A> | null {
    if (this.focus.right === null) return null
    const crumb: BinCrumb<A> = {
      type: 'right',
      parentValue: this.focus.value,
      left: this.focus.left,
    }
    return new BinaryZipper<A>(this.focus.right, [crumb, ...this.context])
  }

  /** Move focus to the parent. Returns null if already at root. */
  goUp(): BinaryZipper<A> | null {
    if (this.context.length === 0) return null
    const [crumb, ...rest] = this.context as [BinCrumb<A>, ...BinCrumb<A>[]]
    let parent: BinNode<A>
    if (crumb.type === 'left') {
      parent = { value: crumb.parentValue, left: this.focus, right: crumb.right }
    } else {
      parent = { value: crumb.parentValue, left: crumb.left, right: this.focus }
    }
    return new BinaryZipper<A>(parent, rest)
  }

  /** Replace the focused node's value. Returns a new zipper — original is untouched. */
  modify(newValue: A): BinaryZipper<A> {
    const newFocus: BinNode<A> = {
      value: newValue,
      left: this.focus.left,
      right: this.focus.right,
    }
    return new BinaryZipper<A>(newFocus, this.context)
  }

  /** Reconstruct and return the full tree from the current zipper state. */
  toTree(): BinNode<A> {
    // Walk all the way up, then return the focus (which is the root).
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: BinaryZipper<A> = this
    while (!current.isRoot()) {
      current = current.goUp()!
    }
    return current.focus
  }

  /** Returns true if the focus is at the root (no breadcrumbs). */
  isRoot(): boolean {
    return this.context.length === 0
  }
}
