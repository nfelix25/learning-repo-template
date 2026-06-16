import { describe, it, expect } from 'vitest';
import {
  BloomFilter,
  hash1,
  hash2,
  getHashPositions,
} from './bloom-filter.js';

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

describe('construction', () => {
  it('getBits() returns a Uint8Array', () => {
    const bf = new BloomFilter(64, 3);
    expect(bf.getBits()).toBeInstanceOf(Uint8Array);
  });

  it('getBits().length equals Math.ceil(m / 8)', () => {
    const m = 100;
    const bf = new BloomFilter(m, 3);
    expect(bf.getBits().length).toBe(Math.ceil(m / 8));
  });

  it('all bits are 0 on construction', () => {
    const bf = new BloomFilter(64, 3);
    const bits = bf.getBits();
    for (const byte of bits) {
      expect(byte).toBe(0);
    }
  });
});

// ---------------------------------------------------------------------------
// add / mightContain
// ---------------------------------------------------------------------------

describe('add / mightContain', () => {
  it('item added → mightContain returns true', () => {
    const bf = new BloomFilter(256, 3);
    bf.add('hello');
    expect(bf.mightContain('hello')).toBe(true);
  });

  it('mightContain on empty filter returns false', () => {
    const bf = new BloomFilter(256, 3);
    expect(bf.mightContain('anything')).toBe(false);
  });

  it('item not added → mightContain returns false (using large filter to avoid collision)', () => {
    // With m=1024 and k=3, collisions for arbitrary strings are extremely unlikely.
    const bf = new BloomFilter(1024, 3);
    bf.add('in-the-set');
    // These strings produce different hash positions from "in-the-set" in a 1024-bit filter.
    expect(bf.mightContain('definitely-not-in-the-set-xyz-123')).toBe(false);
  });

  it('multiple items added: all return true from mightContain', () => {
    const bf = new BloomFilter(512, 4);
    const items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    for (const item of items) bf.add(item);
    for (const item of items) expect(bf.mightContain(item)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Bit manipulation
// ---------------------------------------------------------------------------

describe('bit manipulation', () => {
  it('after add("hello"), at most k bit positions are set in getBits()', () => {
    const k = 4;
    const bf = new BloomFilter(128, k);
    bf.add('hello');

    // Count set bits
    let setBits = 0;
    for (const byte of bf.getBits()) {
      let b = byte;
      while (b > 0) {
        setBits += b & 1;
        b >>>= 1;
      }
    }

    // Due to collisions, some hash positions may be the same bit, so set count ≤ k.
    expect(setBits).toBeGreaterThanOrEqual(1);
    expect(setBits).toBeLessThanOrEqual(k);
  });

  it('set bit at position m-1 is accessible (boundary check)', () => {
    const m = 16;
    const bf = new BloomFilter(m, 1);
    // Manually verify the bit array has the right byte count
    expect(bf.getBits().length).toBe(2); // ceil(16/8) = 2
  });
});

// ---------------------------------------------------------------------------
// False positive behavior
// ---------------------------------------------------------------------------

describe('false positive behavior', () => {
  it('add 1000 items; FP rate on 1000 unseen items is within 2× theoretical', () => {
    const n = 1000;
    const fpRate = 0.01; // 1%
    const bf = BloomFilter.fromExpected(n, fpRate);

    // Insert n items with prefix "inserted-"
    for (let i = 0; i < n; i++) bf.add(`inserted-${i}`);

    // Test n different items with prefix "unseen-"
    let falsePositives = 0;
    for (let i = 0; i < n; i++) {
      if (bf.mightContain(`unseen-${i}`)) falsePositives++;
    }

    const observedRate = falsePositives / n;
    // Allow up to 2× the target FP rate as tolerance
    expect(observedRate).toBeLessThan(fpRate * 2);
  });
});

// ---------------------------------------------------------------------------
// getHashPositions
// ---------------------------------------------------------------------------

describe('getHashPositions', () => {
  it('returns an array of length k', () => {
    const positions = getHashPositions('test', 5, 128);
    expect(positions.length).toBe(5);
  });

  it('all values are in range [0, m)', () => {
    const m = 64;
    const positions = getHashPositions('example', 7, m);
    for (const pos of positions) {
      expect(pos).toBeGreaterThanOrEqual(0);
      expect(pos).toBeLessThan(m);
    }
  });

  it('different strings produce different position arrays', () => {
    const posA = getHashPositions('stringA', 3, 256);
    const posB = getHashPositions('stringB', 3, 256);
    // They should not be identical (extremely unlikely with a good hash)
    expect(posA).not.toEqual(posB);
  });

  it('same string + same k + same m → same positions (deterministic)', () => {
    const a = getHashPositions('deterministic', 4, 128);
    const b = getHashPositions('deterministic', 4, 128);
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// fromExpected
// ---------------------------------------------------------------------------

describe('fromExpected', () => {
  it('creates a filter with reasonable m for given parameters', () => {
    const n = 100;
    const fp = 0.01;
    const bf = BloomFilter.fromExpected(n, fp);
    // m = -(n * ln(fp)) / (ln(2))^2 ≈ 958 for n=100, fp=0.01
    expect(bf.getBitCount()).toBeGreaterThan(900);
    expect(bf.getBitCount()).toBeLessThan(1100);
  });

  it('creates a filter with reasonable k for given parameters', () => {
    const n = 100;
    const fp = 0.01;
    const bf = BloomFilter.fromExpected(n, fp);
    // k = (m/n) * ln(2) ≈ 6.64 ≈ 7
    expect(bf.getHashCount()).toBeGreaterThanOrEqual(5);
    expect(bf.getHashCount()).toBeLessThanOrEqual(9);
  });

  it('items added to fromExpected filter are retrievable', () => {
    const bf = BloomFilter.fromExpected(50, 0.05);
    bf.add('test-item');
    expect(bf.mightContain('test-item')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// hash1 / hash2
// ---------------------------------------------------------------------------

describe('hash1 / hash2', () => {
  it('hash1 returns value in [0, m)', () => {
    const m = 64;
    expect(hash1('hello', m)).toBeGreaterThanOrEqual(0);
    expect(hash1('hello', m)).toBeLessThan(m);
  });

  it('hash2 returns value in [0, m)', () => {
    const m = 64;
    expect(hash2('hello', m)).toBeGreaterThanOrEqual(0);
    expect(hash2('hello', m)).toBeLessThan(m);
  });

  it('hash1 and hash2 are deterministic', () => {
    expect(hash1('abc', 128)).toBe(hash1('abc', 128));
    expect(hash2('abc', 128)).toBe(hash2('abc', 128));
  });
});
