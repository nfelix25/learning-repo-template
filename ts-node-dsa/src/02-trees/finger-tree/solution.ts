/**
 * Finger Tree — reference implementation.
 *
 * Self-contained: no imports from finger-tree.ts.
 *
 * Persistent (immutable): every operation returns a new tree; originals are
 * never mutated. All nodes use `readonly` tuples for structural sharing.
 *
 * Key algorithms follow Hinze & Paterson, "Finger Trees: A Simple General-purpose
 * Data Structure", JFP 2006.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Node2<A> = readonly [A, A]
export type Node3<A> = readonly [A, A, A]
export type FTNode<A> = Node2<A> | Node3<A>

export type Digit<A> =
  | readonly [A]
  | readonly [A, A]
  | readonly [A, A, A]
  | readonly [A, A, A, A]

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

export const empty: FingerTree<never> = { type: 'empty' }

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Node size: 2 or 3 */
function nodeSize<A>(n: FTNode<A>): number {
  return n.length
}

/** Size of a digit (1–4) */
function digitSize<A>(d: Digit<A>): number {
  return d.length
}

/** Flatten a Node into an array of leaves */
function nodeToArray<A>(n: FTNode<A>): A[] {
  return Array.from(n) as A[]
}

/** Flatten a Digit into an array */
function digitToArray<A>(d: Digit<A>): A[] {
  return Array.from(d) as A[]
}

/**
 * Build a Deep node (or fall back to Single/Empty) when the suffix/prefix
 * could be empty — used when pulling from the spine in popFront/popBack.
 *
 * `deepL`: used after consuming the prefix. The `node` array came from the
 * front of the spine and becomes the new prefix.
 */
function deepL<A>(
  elements: A[],
  spine: FingerTree<FTNode<A>>,
  suffix: Digit<A>
): FingerTree<A> {
  if (elements.length === 0) {
    // Pull from spine
    if (spine.type === 'empty') {
      // Build from suffix alone
      return fromDigit(suffix)
    }
    const [node, newSpine] = popFront(spine)
    const newPrefix = nodeToArray(node) as unknown as Digit<A>
    return { type: 'deep', prefix: newPrefix, spine: newSpine, suffix }
  }
  const prefix = elements as unknown as Digit<A>
  return { type: 'deep', prefix, spine, suffix }
}

/** deepR: symmetric to deepL, used after consuming the suffix */
function deepR<A>(
  prefix: Digit<A>,
  spine: FingerTree<FTNode<A>>,
  elements: A[]
): FingerTree<A> {
  if (elements.length === 0) {
    if (spine.type === 'empty') {
      return fromDigit(prefix)
    }
    const [node, newSpine] = popBack(spine)
    const newSuffix = nodeToArray(node) as unknown as Digit<A>
    return { type: 'deep', prefix, spine: newSpine, suffix: newSuffix }
  }
  const suffix = elements as unknown as Digit<A>
  return { type: 'deep', prefix, spine, suffix }
}

/** Build a FingerTree from a Digit (used when the spine is empty). */
function fromDigit<A>(d: Digit<A>): FingerTree<A> {
  if (d.length === 1) return { type: 'single', value: d[0] }
  // For 2–4 elements, build via repeated pushBack
  let t: FingerTree<A> = empty
  for (const v of d) t = pushBack(t, v)
  return t
}

/**
 * Group an array of 2–12 elements into Node2/Node3 chunks.
 * Used by concat to package the "gap" elements between two trees.
 */
function groupIntoNodes<A>(elems: A[]): FTNode<A>[] {
  const result: FTNode<A>[] = []
  let i = 0
  const n = elems.length
  while (i < n) {
    const remaining = n - i
    if (remaining === 2) {
      result.push([elems[i]!, elems[i + 1]!] as Node2<A>)
      i += 2
    } else if (remaining === 4) {
      // 4 → two Node2s (avoids a single Node4 which doesn't exist)
      result.push([elems[i]!, elems[i + 1]!] as Node2<A>)
      result.push([elems[i + 2]!, elems[i + 3]!] as Node2<A>)
      i += 4
    } else {
      // 3, 5, 6, 7, ... → emit Node3 then continue
      result.push([elems[i]!, elems[i + 1]!, elems[i + 2]!] as Node3<A>)
      i += 3
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Predicates and metrics
// ---------------------------------------------------------------------------

export function isEmpty<A>(tree: FingerTree<A>): boolean {
  return tree.type === 'empty'
}

export function size<A>(tree: FingerTree<A>): number {
  switch (tree.type) {
    case 'empty':
      return 0
    case 'single':
      return 1
    case 'deep': {
      const prefixSize = digitSize(tree.prefix)
      const suffixSize = digitSize(tree.suffix)
      // Spine elements are nodes; each node holds 2 or 3 leaves
      const spineNodeCount = size(tree.spine)
      // We need to know how many leaves are in the spine nodes
      let spineLeafCount = 0
      // Walk the spine collecting node sizes
      let s: FingerTree<FTNode<A>> = tree.spine
      while (s.type !== 'empty') {
        if (s.type === 'single') {
          spineLeafCount += nodeSize(s.value)
          break
        }
        // deep spine: nodes are nested FTNode<FTNode<...>>
        // We must recurse into the spine's own structure
        // Easier: just use toArray which handles the recursion
        break
      }
      void spineNodeCount
      // Fall back to toArray for correctness (O(n) either way)
      return toArray(tree).length
    }
  }
}

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

export function pushFront<A>(tree: FingerTree<A>, value: A): FingerTree<A> {
  switch (tree.type) {
    case 'empty':
      return { type: 'single', value }

    case 'single':
      return {
        type: 'deep',
        prefix: [value],
        spine: empty,
        suffix: [tree.value],
      }

    case 'deep': {
      const p = tree.prefix
      if (p.length < 4) {
        // Prepend to prefix
        const newPrefix = [value, ...p] as unknown as Digit<A>
        return { type: 'deep', prefix: newPrefix, spine: tree.spine, suffix: tree.suffix }
      }
      // Prefix is full ([w, x, y, z]): keep [value, w], promote [x, y, z] to spine
      const [w, x, y, z] = p as readonly [A, A, A, A]
      const promoted: Node3<A> = [x, y, z]
      return {
        type: 'deep',
        prefix: [value, w],
        spine: pushFront(tree.spine, promoted),
        suffix: tree.suffix,
      }
    }
  }
}

export function pushBack<A>(tree: FingerTree<A>, value: A): FingerTree<A> {
  switch (tree.type) {
    case 'empty':
      return { type: 'single', value }

    case 'single':
      return {
        type: 'deep',
        prefix: [tree.value],
        spine: empty,
        suffix: [value],
      }

    case 'deep': {
      const s = tree.suffix
      if (s.length < 4) {
        const newSuffix = [...s, value] as unknown as Digit<A>
        return { type: 'deep', prefix: tree.prefix, spine: tree.spine, suffix: newSuffix }
      }
      // Suffix is full ([w, x, y, z]): keep [y, value] (last two), promote [w, x, y...] to spine
      // More precisely: keep [z, value] at back; promote [w, x, y] to spine
      const [w, x, y, z] = s as readonly [A, A, A, A]
      const promoted: Node3<A> = [w, x, y]
      return {
        type: 'deep',
        prefix: tree.prefix,
        spine: pushBack(tree.spine, promoted),
        suffix: [z, value],
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Peek
// ---------------------------------------------------------------------------

export function peekFront<A>(tree: FingerTree<A>): A {
  switch (tree.type) {
    case 'empty':
      throw new RangeError('peekFront on empty finger tree')
    case 'single':
      return tree.value
    case 'deep':
      return tree.prefix[0]
  }
}

export function peekBack<A>(tree: FingerTree<A>): A {
  switch (tree.type) {
    case 'empty':
      throw new RangeError('peekBack on empty finger tree')
    case 'single':
      return tree.value
    case 'deep': {
      const s = tree.suffix
      return s[s.length - 1] as A
    }
  }
}

// ---------------------------------------------------------------------------
// Pop
// ---------------------------------------------------------------------------

export function popFront<A>(tree: FingerTree<A>): [A, FingerTree<A>] {
  switch (tree.type) {
    case 'empty':
      throw new RangeError('popFront on empty finger tree')

    case 'single':
      return [tree.value, empty]

    case 'deep': {
      const p = tree.prefix
      const front = p[0]

      if (p.length > 1) {
        // Remove front from prefix
        const newPrefix = p.slice(1) as unknown as Digit<A>
        return [front, { type: 'deep', prefix: newPrefix, spine: tree.spine, suffix: tree.suffix }]
      }

      // Prefix exhausted (length was 1): pull from spine or use suffix
      const newTree = deepL<A>([], tree.spine, tree.suffix)
      return [front, newTree]
    }
  }
}

export function popBack<A>(tree: FingerTree<A>): [A, FingerTree<A>] {
  switch (tree.type) {
    case 'empty':
      throw new RangeError('popBack on empty finger tree')

    case 'single':
      return [tree.value, empty]

    case 'deep': {
      const s = tree.suffix
      const back = s[s.length - 1] as A

      if (s.length > 1) {
        const newSuffix = s.slice(0, -1) as unknown as Digit<A>
        return [back, { type: 'deep', prefix: tree.prefix, spine: tree.spine, suffix: newSuffix }]
      }

      // Suffix exhausted
      const newTree = deepR<A>(tree.prefix, tree.spine, [])
      return [back, newTree]
    }
  }
}

// ---------------------------------------------------------------------------
// Concat
// ---------------------------------------------------------------------------

/**
 * Recursively concatenate two spine trees, passing the "middle" elements
 * (already grouped into FTNode chunks) downward.
 */
function concatWithMiddle<A>(
  left: FingerTree<A>,
  middle: A[],
  right: FingerTree<A>
): FingerTree<A> {
  if (left.type === 'empty') {
    // Prepend middle elements to right
    let t = right
    for (let i = middle.length - 1; i >= 0; i--) {
      t = pushFront(t, middle[i]!)
    }
    return t
  }

  if (right.type === 'empty') {
    // Append middle elements to left
    let t: FingerTree<A> = left
    for (const v of middle) {
      t = pushBack(t, v)
    }
    return t
  }

  if (left.type === 'single') {
    return pushFront(concatWithMiddle(empty as FingerTree<A>, middle, right), left.value)
  }

  if (right.type === 'single') {
    return pushBack(concatWithMiddle(left, middle, empty as FingerTree<A>), right.value)
  }

  // Both are Deep
  // Gather the gap: left.suffix + middle + right.prefix
  const gap: A[] = [
    ...digitToArray(left.suffix),
    ...middle,
    ...digitToArray(right.prefix),
  ]

  // Group gap elements into nodes
  const nodes = groupIntoNodes(gap) as FTNode<A>[]

  // Recurse into spines
  const newSpine = concatWithMiddle(
    left.spine as unknown as FingerTree<A>,
    nodes as unknown as A[],
    right.spine as unknown as FingerTree<A>
  ) as unknown as FingerTree<FTNode<A>>

  return {
    type: 'deep',
    prefix: left.prefix,
    spine: newSpine,
    suffix: right.suffix,
  }
}

export function concat<A>(left: FingerTree<A>, right: FingerTree<A>): FingerTree<A> {
  return concatWithMiddle(left, [], right)
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

export function toArray<A>(tree: FingerTree<A>): A[] {
  switch (tree.type) {
    case 'empty':
      return []
    case 'single':
      return [tree.value]
    case 'deep': {
      const prefix = digitToArray(tree.prefix)
      const suffix = digitToArray(tree.suffix)
      // The spine holds FTNode<A> values; flatten them recursively
      const spineNodes = toArray(tree.spine)
      const spineLeaves: A[] = []
      for (const node of spineNodes) {
        for (const leaf of nodeToArray(node)) {
          spineLeaves.push(leaf as A)
        }
      }
      return [...prefix, ...spineLeaves, ...suffix]
    }
  }
}

export function fromArray<A>(arr: A[]): FingerTree<A> {
  let t: FingerTree<A> = empty
  for (const v of arr) {
    t = pushBack(t, v)
  }
  return t
}
