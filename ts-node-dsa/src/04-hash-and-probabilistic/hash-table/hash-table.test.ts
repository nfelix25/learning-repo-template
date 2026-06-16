import { describe, it, expect, beforeEach } from 'vitest';
import {
  OpenAddressingHashTable,
  ChainingHashTable,
  hashString,
  DELETED,
} from './hash-table.js';

// ---------------------------------------------------------------------------
// OpenAddressingHashTable
// ---------------------------------------------------------------------------

describe('OpenAddressingHashTable', () => {
  describe('set/get', () => {
    it('set then get returns correct value', () => {
      const table = new OpenAddressingHashTable<string, number>();
      table.set('foo', 42);
      expect(table.get('foo')).toBe(42);
    });

    it('set same key twice: get returns second value', () => {
      const table = new OpenAddressingHashTable<string, number>();
      table.set('foo', 1);
      table.set('foo', 2);
      expect(table.get('foo')).toBe(2);
    });

    it('get missing key: returns undefined', () => {
      const table = new OpenAddressingHashTable<string, number>();
      expect(table.get('missing')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('delete existing key: has() returns false afterward', () => {
      const table = new OpenAddressingHashTable<string, number>();
      table.set('x', 10);
      table.delete('x');
      expect(table.has('x')).toBe(false);
    });

    it('delete missing key: returns false', () => {
      const table = new OpenAddressingHashTable<string, number>();
      expect(table.delete('ghost')).toBe(false);
    });

    it('tombstone correctness: items after deleted slot are still reachable', () => {
      // Use capacity=8 so we can control hash positions.
      // hashString("a", 8) and hashString("b", 8) must collide or "b" must be at "a"+1.
      // We find two keys that are consecutive in the probe chain by trial.
      const cap = 8;
      // Find two strings where hashString(a, cap) + 1 === hashString(b, cap) or they collide.
      // Strategy: find a key at slot 3 and another at slot 3 (collision) so "b" ends up at 4.
      // We'll brute-force from a known djb2 result. Instead, use a larger approach:
      // Insert many keys until two end up adjacent; then verify tombstone.
      const table = new OpenAddressingHashTable<string, number>(cap, 0.9);

      // Find two keys whose hashes are the same (collision) so the second probes to +1.
      let keyA: string | null = null;
      let keyB: string | null = null;
      outer: for (let i = 0; i < 500; i++) {
        for (let j = i + 1; j < 500; j++) {
          const a = `k${i}`;
          const b = `k${j}`;
          if (hashString(a, cap) === hashString(b, cap)) {
            keyA = a;
            keyB = b;
            break outer;
          }
        }
      }
      if (keyA === null || keyB === null) {
        // Fallback: just test that delete + re-get works generally
        table.set('alpha', 1);
        table.set('beta', 2);
        table.delete('alpha');
        expect(table.get('beta')).toBe(2);
        return;
      }

      table.set(keyA, 100);
      table.set(keyB, 200);
      table.delete(keyA);
      // keyB must still be reachable despite the tombstone at keyA's slot
      expect(table.get(keyB)).toBe(200);
    });
  });

  describe('collision resolution', () => {
    it('two keys with same hash: both retrievable', () => {
      const cap = 8;
      // Find two colliding keys
      let keyA: string | null = null;
      let keyB: string | null = null;
      outer: for (let i = 0; i < 500; i++) {
        for (let j = i + 1; j < 500; j++) {
          const a = `k${i}`;
          const b = `k${j}`;
          if (hashString(a, cap) === hashString(b, cap)) {
            keyA = a;
            keyB = b;
            break outer;
          }
        }
      }

      const table = new OpenAddressingHashTable<string, number>(cap, 0.9);
      if (keyA === null || keyB === null) {
        // No collision found in search space — just verify normal operation
        table.set('x', 1);
        table.set('y', 2);
        expect(table.get('x')).toBe(1);
        expect(table.get('y')).toBe(2);
        return;
      }

      table.set(keyA, 7);
      table.set(keyB, 8);
      expect(table.get(keyA)).toBe(7);
      expect(table.get(keyB)).toBe(8);
    });
  });

  describe('rehash', () => {
    it('load factor is tracked correctly as size / capacity', () => {
      const table = new OpenAddressingHashTable<string, number>(8, 0.9);
      table.set('a', 1);
      table.set('b', 2);
      // size=2, capacity=8 → loadFactor=0.25
      expect(table.loadFactor).toBeCloseTo(2 / table.capacity);
    });

    it('when load factor exceeds threshold: capacity doubles and all entries preserved', () => {
      const initialCap = 8;
      const table = new OpenAddressingHashTable<string, number>(initialCap, 0.5);
      const entries: Array<[string, number]> = [];
      // Insert enough to trigger rehash (> 50% of 8 = 4 items)
      for (let i = 0; i < 6; i++) {
        const key = `key${i}`;
        table.set(key, i * 10);
        entries.push([key, i * 10]);
      }
      // Capacity should have grown
      expect(table.capacity).toBeGreaterThan(initialCap);
      // All entries should still be accessible
      for (const [k, v] of entries) {
        expect(table.get(k)).toBe(v);
      }
    });
  });

  describe('size', () => {
    it('size reflects live entries, not tombstones', () => {
      const table = new OpenAddressingHashTable<string, number>();
      table.set('a', 1);
      table.set('b', 2);
      table.delete('a');
      expect(table.size).toBe(1);
    });

    it('updating existing key does not increase size', () => {
      const table = new OpenAddressingHashTable<string, number>();
      table.set('a', 1);
      table.set('a', 2);
      expect(table.size).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// ChainingHashTable
// ---------------------------------------------------------------------------

describe('ChainingHashTable', () => {
  describe('set/get', () => {
    it('set then get returns correct value', () => {
      const table = new ChainingHashTable<string, number>();
      table.set('hello', 99);
      expect(table.get('hello')).toBe(99);
    });

    it('set same key twice: get returns second value', () => {
      const table = new ChainingHashTable<string, number>();
      table.set('hello', 1);
      table.set('hello', 2);
      expect(table.get('hello')).toBe(2);
    });

    it('get missing key: returns undefined', () => {
      const table = new ChainingHashTable<string, number>();
      expect(table.get('nope')).toBeUndefined();
    });
  });

  describe('collisions', () => {
    it('multiple keys hashing to the same bucket: all retrievable', () => {
      const cap = 4;
      // Find at least two keys that collide
      let keyA: string | null = null;
      let keyB: string | null = null;
      let keyC: string | null = null;
      outer: for (let i = 0; i < 300; i++) {
        for (let j = i + 1; j < 300; j++) {
          for (let l = j + 1; l < 300; l++) {
            const a = `k${i}`;
            const b = `k${j}`;
            const c = `k${l}`;
            if (hashString(a, cap) === hashString(b, cap) && hashString(b, cap) === hashString(c, cap)) {
              keyA = a;
              keyB = b;
              keyC = c;
              break outer;
            }
          }
        }
      }

      const table = new ChainingHashTable<string, number>(cap);
      if (keyA === null || keyB === null || keyC === null) {
        // Fallback: just test normal chaining behavior
        table.set('x', 1);
        table.set('y', 2);
        table.set('z', 3);
        expect(table.get('x')).toBe(1);
        expect(table.get('y')).toBe(2);
        expect(table.get('z')).toBe(3);
        return;
      }

      table.set(keyA, 10);
      table.set(keyB, 20);
      table.set(keyC, 30);
      expect(table.get(keyA)).toBe(10);
      expect(table.get(keyB)).toBe(20);
      expect(table.get(keyC)).toBe(30);
    });
  });

  describe('delete', () => {
    it('delete removes the entry from the chain', () => {
      const table = new ChainingHashTable<string, number>();
      table.set('target', 55);
      table.delete('target');
      expect(table.has('target')).toBe(false);
    });

    it('delete missing key returns false', () => {
      const table = new ChainingHashTable<string, number>();
      expect(table.delete('ghost')).toBe(false);
    });

    it('delete from chain with multiple entries removes only the targeted key', () => {
      const cap = 4;
      // Find two colliding keys
      let keyA: string | null = null;
      let keyB: string | null = null;
      outer: for (let i = 0; i < 300; i++) {
        for (let j = i + 1; j < 300; j++) {
          const a = `k${i}`;
          const b = `k${j}`;
          if (hashString(a, cap) === hashString(b, cap)) {
            keyA = a;
            keyB = b;
            break outer;
          }
        }
      }

      const table = new ChainingHashTable<string, number>(cap);
      if (keyA === null || keyB === null) {
        table.set('p', 1);
        table.set('q', 2);
        table.delete('p');
        expect(table.has('p')).toBe(false);
        expect(table.get('q')).toBe(2);
        return;
      }

      table.set(keyA, 111);
      table.set(keyB, 222);
      table.delete(keyA);
      expect(table.has(keyA)).toBe(false);
      expect(table.get(keyB)).toBe(222);
    });
  });

  describe('size', () => {
    it('size increments on insert and decrements on delete', () => {
      const table = new ChainingHashTable<string, number>();
      table.set('a', 1);
      table.set('b', 2);
      expect(table.size).toBe(2);
      table.delete('a');
      expect(table.size).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// hashString
// ---------------------------------------------------------------------------

describe('hashString', () => {
  it('returns a value in [0, capacity)', () => {
    const cap = 16;
    for (const word of ['hello', 'world', 'foo', 'bar', 'baz']) {
      const h = hashString(word, cap);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(cap);
    }
  });

  it('same key + same capacity → same hash (deterministic)', () => {
    expect(hashString('hello', 32)).toBe(hashString('hello', 32));
  });
});
