/**
 * SkipList — solution implementation.
 *
 * Probabilistic sorted structure with O(log n) expected search/insert/delete.
 * Duplicates are permitted (see theory.md).
 *
 * Note: noUncheckedIndexedAccess requires `!` assertions on all array index reads
 * where we know the index is valid (after a length / bounds check).
 */

// ---------------------------------------------------------------------------
// Internal node
// ---------------------------------------------------------------------------

class SkipListNode {
  value: number;
  // forward[i] is the next node at level i, or null if this is the last node at that level.
  // Declared as (SkipListNode | null)[] — accesses use the `!` assertion when we've
  // confirmed the index is within the node's level range.
  forward: (SkipListNode | null)[];

  constructor(value: number, level: number) {
    this.value = value;
    const len = level + 1;
    this.forward = new Array<SkipListNode | null>(len).fill(null);
  }
}

// ---------------------------------------------------------------------------
// SkipList
// ---------------------------------------------------------------------------

export class SkipList {
  private head: SkipListNode;
  private level: number;       // highest active level (0-based)
  private _size: number;
  readonly maxLevel: number;
  readonly probability: number;

  constructor(maxLevel = 16, probability = 0.5) {
    this.maxLevel = maxLevel;
    this.probability = probability;
    this.level = 0;
    this._size = 0;
    // Sentinel head: value -Infinity, spans all levels
    this.head = new SkipListNode(-Infinity, maxLevel - 1);
  }

  // Returns a random level in [0, maxLevel-1]
  private randomLevel(): number {
    let lvl = 0;
    while (Math.random() < this.probability && lvl < this.maxLevel - 1) {
      lvl++;
    }
    return lvl;
  }

  insert(value: number): void {
    // update[lvl] = rightmost node at level `lvl` that comes before the insertion point
    const update: SkipListNode[] = Array.from({ length: this.maxLevel }, () => this.head);
    let curr = this.head;

    for (let lvl = this.level; lvl >= 0; lvl--) {
      // Safe: curr.forward has length >= this.level+1 because head spans maxLevel
      let fwd = curr.forward[lvl] as SkipListNode | null;
      while (fwd !== null && fwd.value < value) {
        curr = fwd;
        fwd = curr.forward[lvl] as SkipListNode | null;
      }
      update[lvl] = curr;
    }

    const newLevel = this.randomLevel();

    if (newLevel > this.level) {
      for (let lvl = this.level + 1; lvl <= newLevel; lvl++) {
        update[lvl] = this.head;
      }
      this.level = newLevel;
    }

    const newNode = new SkipListNode(value, newLevel);

    for (let lvl = 0; lvl <= newLevel; lvl++) {
      const predecessor = update[lvl] as SkipListNode;
      newNode.forward[lvl] = predecessor.forward[lvl] as SkipListNode | null;
      predecessor.forward[lvl] = newNode;
    }

    this._size++;
  }

  search(value: number): boolean {
    let curr = this.head;
    for (let lvl = this.level; lvl >= 0; lvl--) {
      let fwd = curr.forward[lvl] as SkipListNode | null;
      while (fwd !== null && fwd.value < value) {
        curr = fwd;
        fwd = curr.forward[lvl] as SkipListNode | null;
      }
    }
    const candidate = curr.forward[0] as SkipListNode | null;
    return candidate !== null && candidate.value === value;
  }

  delete(value: number): boolean {
    const update: SkipListNode[] = Array.from({ length: this.maxLevel }, () => this.head);
    let curr = this.head;

    for (let lvl = this.level; lvl >= 0; lvl--) {
      let fwd = curr.forward[lvl] as SkipListNode | null;
      while (fwd !== null && fwd.value < value) {
        curr = fwd;
        fwd = curr.forward[lvl] as SkipListNode | null;
      }
      update[lvl] = curr;
    }

    const target = curr.forward[0] as SkipListNode | null;
    if (target === null || target.value !== value) return false;

    for (let lvl = 0; lvl <= this.level; lvl++) {
      const predecessor = update[lvl] as SkipListNode;
      if (predecessor.forward[lvl] !== target) break;
      predecessor.forward[lvl] = target.forward[lvl] as SkipListNode | null;
    }

    // Shrink level if top levels are now empty
    while (this.level > 0 && this.head.forward[this.level] === null) {
      this.level--;
    }

    this._size--;
    return true;
  }

  toArray(): number[] {
    const result: number[] = [];
    let curr = this.head.forward[0] as SkipListNode | null;
    while (curr !== null) {
      result.push(curr.value);
      curr = curr.forward[0] as SkipListNode | null;
    }
    return result;
  }

  get size(): number {
    return this._size;
  }
}
