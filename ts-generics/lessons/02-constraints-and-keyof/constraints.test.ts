import { describe, it, expect, expectTypeOf } from 'vitest';
import { getProperty, longest, pluck } from './constraints.js';

describe('02 — Constraints and keyof', () => {
  // ── getProperty ─────────────────────────────────────────────────────────
  describe('getProperty', () => {
    it('returns the value at the given key', () => {
      const user = { name: 'Alice', age: 30 };
      expect(getProperty(user, 'name')).toBe('Alice');
      expect(getProperty(user, 'age')).toBe(30);
    });

    it('infers the property type from the key', () => {
      const user = { name: 'Alice', age: 30 };
      expectTypeOf(getProperty(user, 'name')).toEqualTypeOf<string>();
      expectTypeOf(getProperty(user, 'age')).toEqualTypeOf<number>();
    });

    it('works on deeply typed objects', () => {
      const config = { host: 'localhost', port: 8080, debug: true };
      expect(getProperty(config, 'port')).toBe(8080);
      expectTypeOf(getProperty(config, 'debug')).toEqualTypeOf<boolean>();
    });
  });

  // ── longest ─────────────────────────────────────────────────────────────
  describe('longest', () => {
    it('returns the longer string', () => {
      expect(longest('hello', 'hi')).toBe('hello');
      expect(longest('a', 'bb')).toBe('bb');
    });

    it('returns the longer array', () => {
      expect(longest([1, 2, 3], [4])).toEqual([1, 2, 3]);
    });

    it('preserves T, not the constraint type', () => {
      // Return type should be string, not { length: number }
      const result = longest('hello', 'hi');
      expectTypeOf(result).toEqualTypeOf<string>();

      // Arrays stay as number[], not { length: number }
      const arr = longest([1, 2], [3, 4, 5]);
      expectTypeOf(arr).toEqualTypeOf<number[]>();
    });
  });

  // ── pluck ────────────────────────────────────────────────────────────────
  describe('pluck', () => {
    it('extracts the named property from every element', () => {
      const users = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];
      expect(pluck(users, 'name')).toEqual(['Alice', 'Bob']);
      expect(pluck(users, 'age')).toEqual([30, 25]);
    });

    it('infers the element type from the property', () => {
      const items = [{ x: 1 }, { x: 2 }, { x: 3 }];
      expectTypeOf(pluck(items, 'x')).toEqualTypeOf<number[]>();
    });

    it('returns an empty array when given an empty array', () => {
      expect(pluck([], 'anything' as never)).toEqual([]);
    });
  });
});
