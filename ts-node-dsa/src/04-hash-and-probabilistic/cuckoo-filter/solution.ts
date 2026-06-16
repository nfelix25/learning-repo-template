/**
 * Cuckoo Filter — solution implementation.
 *
 * Two hash tables of Uint8Array buckets. Each bucket holds up to `bucketSize`
 * 8-bit fingerprints (0 = empty slot). The XOR property of the two bucket
 * indices enables deletion and eviction without the original item.
 */

// ---------------------------------------------------------------------------
// Internal hash utility (djb2, same as hash-table module)
// ---------------------------------------------------------------------------

function djb2(item: string): number {
  let hash = 5381;
  for (let i = 0; i < item.length; i++) {
    hash = ((hash << 5) + hash + item.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ---------------------------------------------------------------------------
// Exported helpers
// ---------------------------------------------------------------------------

/**
 * Computes a non-zero fingerprint of `bits` bits for item.
 * Uses djb2 of a slightly modified string to differ from bucketIndex1.
 */
export function fingerprint(item: string, bits: number): number {
  const mask = (1 << bits) - 1;
  // Use a different seed so fingerprint and bucket index 1 are not identical
  let hash = 0x9747b28c;
  for (let i = 0; i < item.length; i++) {
    hash = ((hash << 5) + hash + item.charCodeAt(i)) >>> 0;
  }
  const fp = hash & mask;
  // Ensure non-zero
  return fp === 0 ? 1 : fp;
}

/** Primary bucket index: djb2(item) % capacity. */
export function bucketIndex1(item: string, capacity: number): number {
  return djb2(item) % capacity;
}

/**
 * Alternate bucket index: (i1 XOR djb2_of_fp) % capacity.
 * XOR property: bucketIndex2(bucketIndex2(i1, fp, cap), fp, cap) === i1.
 */
export function bucketIndex2(
  index1: number,
  fp: number,
  capacity: number,
): number {
  // Hash the fingerprint value itself (not the item string)
  const fpHash = djb2(String(fp));
  return (index1 ^ fpHash) % capacity;
}

// ---------------------------------------------------------------------------
// CuckooFilter
// ---------------------------------------------------------------------------

export class CuckooFilter {
  private table1: Uint8Array[];
  private table2: Uint8Array[];
  readonly capacity: number;
  readonly bucketSize: number;
  readonly fingerprintBits: number;
  private _count: number;
  private static MAX_KICKS = 500;

  constructor(capacity: number, bucketSize = 4, fingerprintBits = 8) {
    this.capacity = capacity;
    this.bucketSize = bucketSize;
    this.fingerprintBits = fingerprintBits;
    this._count = 0;
    this.table1 = Array.from({ length: capacity }, () =>
      new Uint8Array(bucketSize),
    );
    this.table2 = Array.from({ length: capacity }, () =>
      new Uint8Array(bucketSize),
    );
  }

  // -------------------------------------------------------------------------
  // Bucket helpers
  // -------------------------------------------------------------------------

  private bucketInsert(bucket: Uint8Array, fp: number): boolean {
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i] === 0) {
        bucket[i] = fp;
        return true;
      }
    }
    return false;
  }

  private bucketContains(bucket: Uint8Array, fp: number): boolean {
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i] === fp) return true;
    }
    return false;
  }

  private bucketDelete(bucket: Uint8Array, fp: number): boolean {
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i] === fp) {
        bucket[i] = 0;
        return true;
      }
    }
    return false;
  }

  /** Evict and return a random fingerprint from the bucket, then store `fp` there. */
  private bucketEvict(bucket: Uint8Array, fp: number): number {
    const slot = Math.floor(Math.random() * bucket.length);
    const evicted = bucket[slot] ?? 1;
    bucket[slot] = fp;
    return evicted;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  insert(item: string): boolean {
    const fp = fingerprint(item, this.fingerprintBits);
    const i1 = bucketIndex1(item, this.capacity);
    const i2 = bucketIndex2(i1, fp, this.capacity);

    const b1 = this.table1[i1];
    const b2 = this.table2[i2];

    if (b1 !== undefined && this.bucketInsert(b1, fp)) {
      this._count++;
      return true;
    }
    if (b2 !== undefined && this.bucketInsert(b2, fp)) {
      this._count++;
      return true;
    }

    // Both candidate buckets are full — start eviction.
    // Pick one of the two candidate buckets randomly to start evicting from.
    let currentIndex = Math.random() < 0.5 ? i1 : i2;
    let currentTable: 1 | 2 = currentIndex === i1 ? 1 : 2;
    let currentFp = fp;

    for (let kick = 0; kick < CuckooFilter.MAX_KICKS; kick++) {
      const bucket =
        currentTable === 1
          ? this.table1[currentIndex]
          : this.table2[currentIndex];
      if (bucket === undefined) break;

      const evicted = this.bucketEvict(bucket, currentFp);
      currentFp = evicted;

      // Compute the alternate bucket for the evicted fingerprint.
      // The evicted fingerprint was in table1[currentIndex] or table2[currentIndex].
      // Its alternate is in the other table's corresponding slot.
      if (currentTable === 1) {
        const altIndex = bucketIndex2(currentIndex, currentFp, this.capacity);
        const altBucket = this.table2[altIndex];
        if (altBucket !== undefined && this.bucketInsert(altBucket, currentFp)) {
          this._count++;
          return true;
        }
        currentIndex = altIndex;
        currentTable = 2;
      } else {
        const altIndex = bucketIndex2(currentIndex, currentFp, this.capacity);
        const altBucket = this.table1[altIndex];
        if (altBucket !== undefined && this.bucketInsert(altBucket, currentFp)) {
          this._count++;
          return true;
        }
        currentIndex = altIndex;
        currentTable = 1;
      }
    }

    // MAX_KICKS exceeded: filter is full
    return false;
  }

  lookup(item: string): boolean {
    const fp = fingerprint(item, this.fingerprintBits);
    const i1 = bucketIndex1(item, this.capacity);
    const i2 = bucketIndex2(i1, fp, this.capacity);

    const b1 = this.table1[i1];
    const b2 = this.table2[i2];

    return (
      (b1 !== undefined && this.bucketContains(b1, fp)) ||
      (b2 !== undefined && this.bucketContains(b2, fp))
    );
  }

  delete(item: string): boolean {
    const fp = fingerprint(item, this.fingerprintBits);
    const i1 = bucketIndex1(item, this.capacity);
    const i2 = bucketIndex2(i1, fp, this.capacity);

    const b1 = this.table1[i1];
    if (b1 !== undefined && this.bucketDelete(b1, fp)) {
      this._count--;
      return true;
    }

    const b2 = this.table2[i2];
    if (b2 !== undefined && this.bucketDelete(b2, fp)) {
      this._count--;
      return true;
    }

    return false;
  }

  get count(): number {
    return this._count;
  }

  get loadFactor(): number {
    const totalSlots = this.capacity * this.bucketSize * 2;
    return this._count / totalSlots;
  }
}
