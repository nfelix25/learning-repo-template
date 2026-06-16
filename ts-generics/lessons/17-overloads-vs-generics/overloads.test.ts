import { describe, it, expect, expectTypeOf } from 'vitest';
import { identity, process, coerce, first } from './overloads.js';

describe('17 — Overloads vs Generics', () => {
  // ── identity (generic) ───────────────────────────────────────────────────
  describe('identity', () => {
    it('infers number from a number argument', () => {
      const n = identity(42);
      expectTypeOf(n).toEqualTypeOf<number>();
    });

    it('infers string from a string argument', () => {
      const s = identity('hello');
      expectTypeOf(s).toEqualTypeOf<string>();
    });

    it('returns its argument unchanged at runtime', () => {
      expect(identity(42)).toBe(42);
      expect(identity('hello')).toBe('hello');
    });
  });

  // ── process (overloaded) ─────────────────────────────────────────────────
  describe('process', () => {
    it('process(string) has return type string[]', () => {
      expectTypeOf(process('hello')).toEqualTypeOf<string[]>();
    });

    it('process(number) has return type number[]', () => {
      expectTypeOf(process(42)).toEqualTypeOf<number[]>();
    });

    it('splits a string into characters at runtime', () => {
      expect(process('abc')).toEqual(['a', 'b', 'c']);
    });

    it('returns [x, x+1] for a number at runtime', () => {
      expect(process(5)).toEqual([5, 6]);
    });
  });

  // ── coerce (overloaded) ──────────────────────────────────────────────────
  describe('coerce', () => {
    it('coerce(string) has return type number', () => {
      expectTypeOf(coerce('42')).toEqualTypeOf<number>();
    });

    it('coerce(number) has return type string', () => {
      expectTypeOf(coerce(42)).toEqualTypeOf<string>();
    });

    it('parses a string to a number at runtime', () => {
      expect(coerce('42')).toBe(42);
    });

    it('converts a number to a string at runtime', () => {
      expect(coerce(42)).toBe('42');
    });
  });

  // ── first (generic) ──────────────────────────────────────────────────────
  describe('first', () => {
    it('first([1,2,3]) has type number | undefined', () => {
      const result = first([1, 2, 3]);
      expectTypeOf(result).toEqualTypeOf<number | undefined>();
    });

    it('first(["a","b"]) has type string | undefined', () => {
      const result = first(['a', 'b']);
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });

    it('returns the first element at runtime', () => {
      expect(first([10, 20, 30])).toBe(10);
    });

    it('returns undefined for an empty array', () => {
      expect(first([])).toBeUndefined();
    });
  });
});
