import { describe, it, expect, expectTypeOf } from 'vitest';
import { identity, first, pair } from './generics.js';

describe('01 — Generic Fundamentals', () => {
  // ── identity ────────────────────────────────────────────────────────────
  describe('identity', () => {
    it('returns its argument unchanged', () => {
      expect(identity(42)).toBe(42);
      expect(identity('hello')).toBe('hello');
      expect(identity(true)).toBe(true);
    });

    it('infers the type from the argument', () => {
      const n = identity(42);
      expectTypeOf(n).toEqualTypeOf<number>();

      const s = identity('hello');
      expectTypeOf(s).toEqualTypeOf<string>();
    });

    it('preserves a literal type when explicitly annotated', () => {
      // Without annotation, TypeScript widens: identity(42) gives number, not 42
      // With annotation, the literal is preserved:
      const exact = identity<'exact'>('exact');
      expectTypeOf(exact).toEqualTypeOf<'exact'>();
    });
  });

  // ── first ───────────────────────────────────────────────────────────────
  describe('first', () => {
    it('returns the first element of a non-empty array', () => {
      expect(first([1, 2, 3])).toBe(1);
      expect(first(['a', 'b'])).toBe('a');
    });

    it('returns undefined for an empty array', () => {
      expect(first([])).toBeUndefined();
    });

    it('infers T | undefined as the element type', () => {
      const result = first(['x', 'y', 'z']);
      // noUncheckedIndexedAccess means arr[0] is T | undefined
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });
  });

  // ── pair ────────────────────────────────────────────────────────────────
  describe('pair', () => {
    it('creates a two-element array at runtime', () => {
      expect(pair('hello', 42)).toEqual(['hello', 42]);
    });

    it('infers a heterogeneous tuple type', () => {
      const p = pair('hello', 42);
      expectTypeOf(p).toEqualTypeOf<[string, number]>();
    });

    it('preserves distinct types for both elements', () => {
      const p = pair(true, [1, 2, 3]);
      expectTypeOf(p).toEqualTypeOf<[boolean, number[]]>();
    });
  });
});
