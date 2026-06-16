/**
 * Cuckoo Filter — deletion-capable probabilistic approximate-membership set.
 *
 * Uses two hash tables of fixed-size buckets. Each bucket stores up to
 * `bucketSize` fingerprints. The XOR property of the two bucket indices
 * enables deletion and eviction without storing the original key.
 *
 * Method bodies throw 'TODO'. Implement them in solution.ts.
 */

export class CuckooFilter {
  private table1: Uint8Array[]; // table1[bucketIdx] = array of fingerprints (0 = empty)
  private table2: Uint8Array[];
  readonly capacity: number;      // number of buckets per table
  readonly bucketSize: number;    // fingerprints per bucket
  readonly fingerprintBits: number; // bits per fingerprint
  private _count: number;
  private static MAX_KICKS = 500;

  constructor(capacity: number, bucketSize?: number, fingerprintBits?: number) {
    throw new Error('TODO');
  }

  /**
   * Inserts item into the filter.
   * Returns false if the filter is full (MAX_KICKS exceeded during eviction).
   */
  insert(item: string): boolean {
    throw new Error('TODO');
  }

  /**
   * Returns true if item is probably in the set.
   * Returns false if item is definitely not in the set.
   */
  lookup(item: string): boolean {
    throw new Error('TODO');
  }

  /**
   * Removes item from the filter.
   * Returns true if found and removed, false if not found.
   */
  delete(item: string): boolean {
    throw new Error('TODO');
  }

  /** Number of fingerprints currently stored. */
  get count(): number {
    throw new Error('TODO');
  }

  /** count / (capacity × bucketSize × 2). */
  get loadFactor(): number {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Exported helpers (for testing)
// ---------------------------------------------------------------------------

/**
 * Computes a non-zero fingerprint of `bits` bits for item.
 * fingerprintBits must be ≤ 8 for Uint8Array storage.
 */
export function fingerprint(item: string, bits: number): number {
  throw new Error('TODO');
}

/**
 * Primary bucket index: hash(item) % capacity.
 */
export function bucketIndex1(item: string, capacity: number): number {
  throw new Error('TODO');
}

/**
 * Alternate bucket index using the XOR property:
 * i2 = (i1 XOR hash(fingerprint)) % capacity
 *
 * Given i2 + fingerprint you can recover i1:
 * i1 = (i2 XOR hash(fingerprint)) % capacity
 */
export function bucketIndex2(
  index1: number,
  fp: number,
  capacity: number,
): number {
  throw new Error('TODO');
}
