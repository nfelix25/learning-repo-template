/**
 * Bloom Filter — space-efficient probabilistic set.
 *
 * Uses a Uint8Array as a packed bit array and double hashing to derive
 * k independent hash positions from two base hash functions.
 *
 * Method bodies throw 'TODO'. Implement them in solution.ts.
 */

export class BloomFilter {
  private bits: Uint8Array;
  readonly m: number; // total bit count
  readonly k: number; // number of hash functions

  constructor(m: number, k: number) {
    throw new Error('TODO');
  }

  /**
   * Convenience factory: compute optimal m and k for n expected items
   * at the target false-positive rate.
   *
   * m = -(n * ln(fpRate)) / (ln(2))²
   * k = (m / n) * ln(2)
   */
  static fromExpected(expectedItems: number, fpRate: number): BloomFilter {
    throw new Error('TODO');
  }

  /** Set the k bit positions for item. */
  add(item: string): void {
    throw new Error('TODO');
  }

  /**
   * Returns true if ALL k bit positions are set (probably present).
   * Returns false if ANY bit position is 0 (definitely absent).
   */
  mightContain(item: string): boolean {
    throw new Error('TODO');
  }

  /** Total number of bits (m). */
  getBitCount(): number {
    throw new Error('TODO');
  }

  /** Number of hash functions (k). */
  getHashCount(): number {
    throw new Error('TODO');
  }

  /** The underlying bit array (for testing internal state). */
  getBits(): Uint8Array {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Hash functions (exported for testing)
// ---------------------------------------------------------------------------

/** djb2 variant: returns a value in [0, m). */
export function hash1(item: string, m: number): number {
  throw new Error('TODO');
}

/** sdbm variant: returns a value in [0, m). */
export function hash2(item: string, m: number): number {
  throw new Error('TODO');
}

/**
 * Double hashing: hᵢ(x) = (hash1(x) + i × hash2(x)) mod m
 * Returns an array of k positions, each in [0, m).
 */
export function getHashPositions(item: string, k: number, m: number): number[] {
  throw new Error('TODO');
}
