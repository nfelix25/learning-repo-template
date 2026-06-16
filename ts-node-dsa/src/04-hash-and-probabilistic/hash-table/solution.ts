/**
 * Hash Table — solution implementation.
 *
 * Exports OpenAddressingHashTable<K,V>, ChainingHashTable<K,V>,
 * DELETED sentinel, and hashString utility.
 */

// ---------------------------------------------------------------------------
// Sentinel for tombstone deletion
// ---------------------------------------------------------------------------

export const DELETED: unique symbol = Symbol('DELETED');

// ---------------------------------------------------------------------------
// Hash utility — djb2
// ---------------------------------------------------------------------------

/**
 * djb2 hash: hash = 5381, then hash = ((hash << 5) + hash) + charCode.
 * Returns an index in [0, capacity).
 */
export function hashString(key: string, capacity: number): number {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash + key.charCodeAt(i)) >>> 0; // keep 32-bit unsigned
  }
  return hash % capacity;
}

// ---------------------------------------------------------------------------
// Strategy 1: Open Addressing with Linear Probing
// ---------------------------------------------------------------------------

export class OpenAddressingHashTable<K, V> {
  private keys: Array<K | null | typeof DELETED>;
  private values: Array<V | null>;
  private _size: number;
  capacity: number;
  private loadFactorThreshold: number;

  constructor(initialCapacity = 16, loadFactorThreshold = 0.7) {
    this.capacity = initialCapacity;
    this.loadFactorThreshold = loadFactorThreshold;
    this.keys = new Array<K | null | typeof DELETED>(this.capacity).fill(null);
    this.values = new Array<V | null>(this.capacity).fill(null);
    this._size = 0;
  }

  private hashKey(key: K): number {
    // For string keys use djb2; for other keys fall back to string coercion.
    return hashString(String(key), this.capacity);
  }

  set(key: K, value: V): void {
    // Rehash if inserting a new key would push load factor over threshold.
    // Check against (size + 1) to anticipate the upcoming insertion.
    if ((this._size + 1) / this.capacity > this.loadFactorThreshold) {
      this.rehash();
    }

    let index = this.hashKey(key);
    let firstDeleted = -1;

    for (let i = 0; i < this.capacity; i++) {
      const slot = (index + i) % this.capacity;
      const existing = this.keys[slot];

      if (existing === null) {
        // Empty slot — insert here (or at first tombstone if we saw one).
        const target = firstDeleted !== -1 ? firstDeleted : slot;
        this.keys[target] = key;
        this.values[target] = value;
        this._size++;
        return;
      }

      if (existing === DELETED) {
        if (firstDeleted === -1) firstDeleted = slot;
        continue;
      }

      if (existing === key) {
        // Update in-place.
        this.values[slot] = value;
        return;
      }
    }

    // All slots probed — insert at first tombstone (table is effectively full
    // but this shouldn't happen with a proper load factor threshold).
    if (firstDeleted !== -1) {
      this.keys[firstDeleted] = key;
      this.values[firstDeleted] = value;
      this._size++;
    }
  }

  get(key: K): V | undefined {
    let index = this.hashKey(key);

    for (let i = 0; i < this.capacity; i++) {
      const slot = (index + i) % this.capacity;
      const existing = this.keys[slot];

      if (existing === null) return undefined; // definitive miss
      if (existing === DELETED) continue;      // skip tombstone
      if (existing === key) return this.values[slot] ?? undefined;
    }

    return undefined;
  }

  delete(key: K): boolean {
    let index = this.hashKey(key);

    for (let i = 0; i < this.capacity; i++) {
      const slot = (index + i) % this.capacity;
      const existing = this.keys[slot];

      if (existing === null) return false;
      if (existing === DELETED) continue;
      if (existing === key) {
        this.keys[slot] = DELETED;
        this.values[slot] = null;
        this._size--;
        return true;
      }
    }

    return false;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  get size(): number {
    return this._size;
  }

  get loadFactor(): number {
    return this._size / this.capacity;
  }

  private rehash(): void {
    const oldKeys = this.keys;
    const oldValues = this.values;
    const oldCapacity = this.capacity;

    this.capacity = this.capacity * 2;
    this.keys = new Array<K | null | typeof DELETED>(this.capacity).fill(null);
    this.values = new Array<V | null>(this.capacity).fill(null);
    this._size = 0;

    for (let i = 0; i < oldCapacity; i++) {
      const k = oldKeys[i];
      const v = oldValues[i];
      if (k !== null && k !== DELETED && v !== null) {
        this.set(k as K, v as V);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Strategy 2: Separate Chaining
// ---------------------------------------------------------------------------

export class ChainingHashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private _size: number;
  readonly capacity: number;

  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this._size = 0;
  }

  private hashKey(key: K): number {
    return hashString(String(key), this.capacity);
  }

  set(key: K, value: V): void {
    const index = this.hashKey(key);
    const bucket = this.buckets[index];
    if (bucket === undefined) return;

    for (let i = 0; i < bucket.length; i++) {
      const pair = bucket[i];
      if (pair !== undefined && pair[0] === key) {
        pair[1] = value;
        return;
      }
    }

    bucket.push([key, value]);
    this._size++;
  }

  get(key: K): V | undefined {
    const index = this.hashKey(key);
    const bucket = this.buckets[index];
    if (bucket === undefined) return undefined;

    for (const pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }

  delete(key: K): boolean {
    const index = this.hashKey(key);
    const bucket = this.buckets[index];
    if (bucket === undefined) return false;

    for (let i = 0; i < bucket.length; i++) {
      const pair = bucket[i];
      if (pair !== undefined && pair[0] === key) {
        bucket.splice(i, 1);
        this._size--;
        return true;
      }
    }
    return false;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  get size(): number {
    return this._size;
  }
}
