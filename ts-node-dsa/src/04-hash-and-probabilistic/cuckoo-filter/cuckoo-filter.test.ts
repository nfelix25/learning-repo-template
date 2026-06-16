import { describe, it, expect } from 'vitest';
import {
  CuckooFilter,
  fingerprint,
  bucketIndex1,
  bucketIndex2,
} from './cuckoo-filter.js';

// ---------------------------------------------------------------------------
// insert + lookup
// ---------------------------------------------------------------------------

describe('insert + lookup', () => {
  it('insert then lookup: returns true', () => {
    const cf = new CuckooFilter(64);
    cf.insert('hello');
    expect(cf.lookup('hello')).toBe(true);
  });

  it('lookup for non-inserted item (large filter, no collision): returns false', () => {
    // With capacity=256 and 8-bit fingerprints, collisions for arbitrary strings
    // are very unlikely.
    const cf = new CuckooFilter(256);
    cf.insert('only-this-item');
    expect(cf.lookup('definitely-not-inserted-xyz-999')).toBe(false);
  });

  it('insert multiple items: all retrievable', () => {
    const cf = new CuckooFilter(128);
    const items = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
    for (const item of items) cf.insert(item);
    for (const item of items) expect(cf.lookup(item)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

describe('delete', () => {
  it('insert then delete then lookup: returns false', () => {
    const cf = new CuckooFilter(64);
    cf.insert('to-delete');
    cf.delete('to-delete');
    expect(cf.lookup('to-delete')).toBe(false);
  });

  it('delete non-existing item: returns false', () => {
    const cf = new CuckooFilter(64);
    expect(cf.delete('never-inserted')).toBe(false);
  });

  it('insert after delete reuses the freed slot', () => {
    const cf = new CuckooFilter(64);
    cf.insert('item');
    const countBefore = cf.count;
    cf.delete('item');
    expect(cf.count).toBe(countBefore - 1);
    cf.insert('item');
    expect(cf.lookup('item')).toBe(true);
    expect(cf.count).toBe(countBefore);
  });

  it('delete returns true when item is found', () => {
    const cf = new CuckooFilter(64);
    cf.insert('present');
    expect(cf.delete('present')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// count
// ---------------------------------------------------------------------------

describe('count', () => {
  it('count increments on insert and decrements on delete', () => {
    const cf = new CuckooFilter(64);
    expect(cf.count).toBe(0);
    cf.insert('a');
    cf.insert('b');
    expect(cf.count).toBe(2);
    cf.delete('a');
    expect(cf.count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Full filter
// ---------------------------------------------------------------------------

describe('full filter', () => {
  it('filling beyond capacity: insert eventually returns false', () => {
    // Small filter: capacity=4 buckets, bucketSize=2 → max 4*2*2=16 fingerprints total
    const cf = new CuckooFilter(4, 2, 8);
    let insertFailed = false;
    for (let i = 0; i < 1000; i++) {
      if (!cf.insert(`item-${i}`)) {
        insertFailed = true;
        break;
      }
    }
    expect(insertFailed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// XOR property
// ---------------------------------------------------------------------------

describe('XOR property', () => {
  it('bucketIndex2(i1, fp, cap) XOR fp_hash(fp) XOR i1 relates correctly', () => {
    // The XOR property: i2 = (i1 XOR hash(fp)) % cap
    // Therefore: bucketIndex2(i1, fp, cap) should equal bucketIndex2(i2, fp, cap)
    // where i2 is itself (i.e., the alternate of the alternate is the original).
    const cap = 32;
    const bits = 8;
    const item = 'test-item';
    const fp = fingerprint(item, bits);
    const i1 = bucketIndex1(item, cap);
    const i2 = bucketIndex2(i1, fp, cap);

    // The alternate of i2 (using the same fp) should recover i1
    const i1Recovered = bucketIndex2(i2, fp, cap);
    expect(i1Recovered).toBe(i1);
  });

  it('bucketIndex1 and bucketIndex2 are in range [0, capacity)', () => {
    const cap = 16;
    const bits = 8;
    const item = 'example';
    const fp = fingerprint(item, bits);
    const i1 = bucketIndex1(item, cap);
    const i2 = bucketIndex2(i1, fp, cap);

    expect(i1).toBeGreaterThanOrEqual(0);
    expect(i1).toBeLessThan(cap);
    expect(i2).toBeGreaterThanOrEqual(0);
    expect(i2).toBeLessThan(cap);
  });
});

// ---------------------------------------------------------------------------
// Collision resilience
// ---------------------------------------------------------------------------

describe('collision resilience', () => {
  it('insert 100 items, lookup all: all return true', () => {
    const cf = new CuckooFilter(128);
    const items: string[] = [];
    for (let i = 0; i < 100; i++) {
      items.push(`collision-test-item-${i}`);
    }
    for (const item of items) {
      const inserted = cf.insert(item);
      // With capacity=128 and bucketSize=4, 100 items is well within limits
      expect(inserted).toBe(true);
    }
    for (const item of items) {
      expect(cf.lookup(item)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// fingerprint helper
// ---------------------------------------------------------------------------

describe('fingerprint', () => {
  it('fingerprint is in range [1, 2^bits - 1] (non-zero)', () => {
    const bits = 8;
    for (const item of ['a', 'b', 'hello', 'world', '']) {
      const fp = fingerprint(item, bits);
      expect(fp).toBeGreaterThanOrEqual(1);
      expect(fp).toBeLessThanOrEqual((1 << bits) - 1);
    }
  });

  it('fingerprint is deterministic', () => {
    expect(fingerprint('test', 8)).toBe(fingerprint('test', 8));
  });
});
