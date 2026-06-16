/**
 * SkipList — probabilistic sorted data structure.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 * SkipListNode is internal and not exported.
 */

export class SkipList {
  private head: SkipListNode;
  private level: number;      // current highest active level (0-based)
  readonly maxLevel: number;
  readonly probability: number;

  /**
   * @param maxLevel   - Maximum number of levels (default 16).
   * @param probability - Probability of advancing to the next level (default 0.5).
   */
  constructor(maxLevel?: number, probability?: number) {
    throw new Error('TODO');
  }

  /** Inserts `value` into the skip list. Duplicates are permitted. */
  insert(value: number): void {
    throw new Error('TODO');
  }

  /** Returns true if `value` exists in the list. */
  search(value: number): boolean {
    throw new Error('TODO');
  }

  /**
   * Removes one occurrence of `value` from the list.
   * Returns true if a node was removed, false if not found.
   */
  delete(value: number): boolean {
    throw new Error('TODO');
  }

  /** Returns all values in sorted (ascending) order via level-0 traversal. */
  toArray(): number[] {
    throw new Error('TODO');
  }

  /** Number of elements currently in the list. */
  get size(): number {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Internal node — not exported
// ---------------------------------------------------------------------------

class SkipListNode {
  value: number;
  forward: Array<SkipListNode | null>;

  constructor(value: number, level: number) {
    this.value = value;
    this.forward = new Array<SkipListNode | null>(level + 1).fill(null);
  }
}
