/**
 * Hash Table — two collision-resolution strategies.
 *
 * Strategy 1: Open addressing with linear probing + tombstone deletion.
 * Strategy 2: Separate chaining with per-bucket arrays.
 *
 * Method bodies throw 'TODO'. Implement them in solution.ts.
 */

// Sentinel value for deleted slots in open-addressing table.
export const DELETED: unique symbol = Symbol('DELETED');

// ---------------------------------------------------------------------------
// Strategy 1: Open Addressing with Linear Probing
// ---------------------------------------------------------------------------

export class OpenAddressingHashTable<K, V> {
  private keys: Array<K | null | typeof DELETED>;
  private values: Array<V | null>;
  private _size: number;
  readonly capacity: number;
  private loadFactorThreshold: number;

  constructor(initialCapacity?: number, loadFactorThreshold?: number) {
    throw new Error('TODO');
  }

  /**
   * Inserts or updates the value for key.
   * Rehashes when load factor exceeds loadFactorThreshold.
   */
  set(key: K, value: V): void {
    throw new Error('TODO');
  }

  /** Returns the value for key, or undefined if not present. */
  get(key: K): V | undefined {
    throw new Error('TODO');
  }

  /**
   * Deletes the entry for key using tombstone marking.
   * Returns true if the key was present, false otherwise.
   */
  delete(key: K): boolean {
    throw new Error('TODO');
  }

  /** Returns true if key is present. */
  has(key: K): boolean {
    throw new Error('TODO');
  }

  /** Number of live entries (does not count tombstones). */
  get size(): number {
    throw new Error('TODO');
  }

  /** n / capacity. */
  get loadFactor(): number {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Strategy 2: Separate Chaining
// ---------------------------------------------------------------------------

export class ChainingHashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private _size: number;
  readonly capacity: number;

  constructor(initialCapacity?: number) {
    throw new Error('TODO');
  }

  /** Inserts or updates the value for key. */
  set(key: K, value: V): void {
    throw new Error('TODO');
  }

  /** Returns the value for key, or undefined if not present. */
  get(key: K): V | undefined {
    throw new Error('TODO');
  }

  /**
   * Deletes the entry for key from its bucket chain.
   * Returns true if found, false otherwise.
   */
  delete(key: K): boolean {
    throw new Error('TODO');
  }

  /** Returns true if key is present. */
  has(key: K): boolean {
    throw new Error('TODO');
  }

  /** Number of live entries. */
  get size(): number {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Hash utility
// ---------------------------------------------------------------------------

/**
 * djb2 hash function for strings.
 * Exported so tests can force hash collisions.
 */
export function hashString(key: string, capacity: number): number {
  throw new Error('TODO');
}
