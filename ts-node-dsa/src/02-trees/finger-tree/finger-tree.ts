/**
 * Finger Tree — skeleton.
 *
 * All function bodies throw `new Error('TODO')`.
 * Implement the logic in solution.ts (which is self-contained).
 *
 * Finger trees are persistent (immutable): every operation returns a new tree.
 * The originals are never mutated.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A 2-3 node: either a pair or triple of elements (or sub-nodes). */
export type Node2<A> = readonly [A, A]
export type Node3<A> = readonly [A, A, A]
export type FTNode<A> = Node2<A> | Node3<A>

/** Digit: 1 to 4 elements — the "fingers" at each end of a Deep node. */
export type Digit<A> =
  | readonly [A]
  | readonly [A, A]
  | readonly [A, A, A]
  | readonly [A, A, A, A]

/** The finger tree type — a discriminated union. */
export type FingerTree<A> =
  | { readonly type: 'empty' }
  | { readonly type: 'single'; readonly value: A }
  | {
      readonly type: 'deep'
      readonly prefix: Digit<A>
      readonly spine: FingerTree<FTNode<A>>
      readonly suffix: Digit<A>
    }

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** The canonical empty finger tree value. */
export const empty: FingerTree<never> = { type: 'empty' }

// ---------------------------------------------------------------------------
// Predicates and metrics
// ---------------------------------------------------------------------------

/** Returns true if the tree contains no elements. */
export function isEmpty<A>(tree: FingerTree<A>): boolean {
  throw new Error('TODO')
}

/**
 * Returns the number of elements in the tree.
 * O(n) — traverses the whole tree.
 */
export function size<A>(tree: FingerTree<A>): number {
  throw new Error('TODO')
}

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

/** Add `value` to the front of `tree`. O(1) amortized. */
export function pushFront<A>(tree: FingerTree<A>, value: A): FingerTree<A> {
  throw new Error('TODO')
}

/** Add `value` to the back of `tree`. O(1) amortized. */
export function pushBack<A>(tree: FingerTree<A>, value: A): FingerTree<A> {
  throw new Error('TODO')
}

// ---------------------------------------------------------------------------
// Peek (no removal)
// ---------------------------------------------------------------------------

/** Return the front element without removing it. Throws if empty. */
export function peekFront<A>(tree: FingerTree<A>): A {
  throw new Error('TODO')
}

/** Return the back element without removing it. Throws if empty. */
export function peekBack<A>(tree: FingerTree<A>): A {
  throw new Error('TODO')
}

// ---------------------------------------------------------------------------
// Pop (returns new tree)
// ---------------------------------------------------------------------------

/**
 * Remove and return the front element as [value, newTree].
 * Throws if empty.
 */
export function popFront<A>(tree: FingerTree<A>): [A, FingerTree<A>] {
  throw new Error('TODO')
}

/**
 * Remove and return the back element as [value, newTree].
 * Throws if empty.
 */
export function popBack<A>(tree: FingerTree<A>): [A, FingerTree<A>] {
  throw new Error('TODO')
}

// ---------------------------------------------------------------------------
// Concatenation
// ---------------------------------------------------------------------------

/** Concatenate two finger trees. O(log n). */
export function concat<A>(left: FingerTree<A>, right: FingerTree<A>): FingerTree<A> {
  throw new Error('TODO')
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/** Return all elements as a flat array in front-to-back order. */
export function toArray<A>(tree: FingerTree<A>): A[] {
  throw new Error('TODO')
}

/** Build a finger tree from an array (front = arr[0]). */
export function fromArray<A>(arr: A[]): FingerTree<A> {
  throw new Error('TODO')
}
