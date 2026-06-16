/**
 * Bloom Filter — solution implementation.
 *
 * Uses Uint8Array as a packed bit array and double hashing to derive
 * k independent positions from two base hashes (djb2 + sdbm variants).
 */

// ---------------------------------------------------------------------------
// Hash functions
// ---------------------------------------------------------------------------

/**
 * djb2 variant hash. Returns a value in [0, m).
 */
export function hash1(item: string, m: number): number {
  let hash = 5381;
  for (let i = 0; i < item.length; i++) {
    hash = ((hash << 5) + hash + item.charCodeAt(i)) >>> 0;
  }
  return hash % m;
}

/**
 * sdbm variant hash. Returns a value in [0, m).
 * hash = charCode + (hash << 6) + (hash << 16) - hash
 */
export function hash2(item: string, m: number): number {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    hash = (item.charCodeAt(i) + (hash << 6) + (hash << 16) - hash) >>> 0;
  }
  // Ensure non-zero to avoid degenerate double hashing
  return (hash % (m - 1)) + 1;
}

/**
 * Double hashing: hᵢ(x) = (hash1(x) + i × hash2(x)) mod m
 * Returns k positions, each in [0, m).
 */
export function getHashPositions(item: string, k: number, m: number): number[] {
  const h1 = hash1(item, m);
  const h2 = hash2(item, m);
  const positions: number[] = [];
  for (let i = 0; i < k; i++) {
    positions.push(((h1 + i * h2) >>> 0) % m);
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Bit array helpers
// ---------------------------------------------------------------------------

function setBit(arr: Uint8Array, i: number): void {
  const idx = Math.floor(i / 8);
  arr[idx] = (arr[idx] ?? 0) | (1 << (i % 8));
}

function getBit(arr: Uint8Array, i: number): number {
  const byte = arr[Math.floor(i / 8)];
  return byte !== undefined ? (byte >> (i % 8)) & 1 : 0;
}

// ---------------------------------------------------------------------------
// BloomFilter
// ---------------------------------------------------------------------------

export class BloomFilter {
  private bits: Uint8Array;
  readonly m: number;
  readonly k: number;

  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
    this.bits = new Uint8Array(Math.ceil(m / 8));
  }

  static fromExpected(expectedItems: number, fpRate: number): BloomFilter {
    const ln2 = Math.LN2;
    // m = -(n * ln(p)) / (ln(2))^2
    const m = Math.ceil((-expectedItems * Math.log(fpRate)) / (ln2 * ln2));
    // k = (m / n) * ln(2)
    const k = Math.max(1, Math.round((m / expectedItems) * ln2));
    return new BloomFilter(m, k);
  }

  add(item: string): void {
    for (const pos of getHashPositions(item, this.k, this.m)) {
      setBit(this.bits, pos);
    }
  }

  mightContain(item: string): boolean {
    for (const pos of getHashPositions(item, this.k, this.m)) {
      if (getBit(this.bits, pos) === 0) return false;
    }
    return true;
  }

  getBitCount(): number {
    return this.m;
  }

  getHashCount(): number {
    return this.k;
  }

  getBits(): Uint8Array {
    return this.bits;
  }
}
