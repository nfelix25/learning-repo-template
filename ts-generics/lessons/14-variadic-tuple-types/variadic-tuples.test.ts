import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Concat } from './variadic-tuples.js';
import { concat, tail, partialFirst } from './variadic-tuples.js';

describe('14 — Variadic Tuple Types', () => {
  // ── Concat (type-level) ───────────────────────────────────────────────────
  describe('Concat (type)', () => {
    it('concatenates two non-empty tuple types', () => {
      expectTypeOf<Concat<[string, number], [boolean]>>().toEqualTypeOf<[string, number, boolean]>();
    });

    it('handles an empty first tuple', () => {
      expectTypeOf<Concat<[], [string]>>().toEqualTypeOf<[string]>();
    });

    it('handles an empty second tuple', () => {
      expectTypeOf<Concat<[number], []>>().toEqualTypeOf<[number]>();
    });

    it('handles two empty tuples', () => {
      expectTypeOf<Concat<[], []>>().toEqualTypeOf<[]>();
    });
  });

  // ── concat (runtime + type) ───────────────────────────────────────────────
  describe('concat', () => {
    it('combines two arrays at runtime', () => {
      expect(concat([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
      expect(concat(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c']);
      expect(concat([], [1])).toEqual([1]);
    });

    it('infers a heterogeneous tuple type from two typed arrays', () => {
      expectTypeOf(concat([1, 2], ['a'])).toEqualTypeOf<[number, number, string]>();
    });

    it('preserves the element types of both arguments', () => {
      const result = concat([true], [42, 'x']);
      expectTypeOf(result).toEqualTypeOf<[boolean, number, string]>();
    });
  });

  // ── tail ──────────────────────────────────────────────────────────────────
  describe('tail', () => {
    it('returns all elements after the first at runtime', () => {
      expect(tail([1, 2, 3])).toEqual([2, 3]);
      expect(tail(['a', 'b', 'c'])).toEqual(['b', 'c']);
      expect(tail([42])).toEqual([]);
    });

    it('preserves the tuple type of the remaining elements', () => {
      const result = tail([true, 42, 'x'] as [boolean, number, string]);
      expectTypeOf(result).toEqualTypeOf<[number, string]>();
    });

    it('returns an empty tuple type from a single-element tuple', () => {
      const result = tail([1] as [number]);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });
  });

  // ── partialFirst ──────────────────────────────────────────────────────────
  describe('partialFirst', () => {
    it('partially applies the first argument at runtime', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const add5 = partialFirst(add, 5);
      expect(add5(1, 2)).toBe(8);
      expect(add5(10, 20)).toBe(35);
    });

    it('works with a string first argument', () => {
      const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
      const hello = partialFirst(greet, 'Hello');
      expect(hello('Alice')).toBe('Hello, Alice!');
    });

    it('infers the correct type for the returned function', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const add5 = partialFirst(add, 5);
      expectTypeOf(add5).toEqualTypeOf<(b: number, c: number) => number>();
    });

    it('infers the return type of the original function', () => {
      const format = (prefix: string, value: number) => `${prefix}: ${value}`;
      const labeled = partialFirst(format, 'score');
      expectTypeOf(labeled).toEqualTypeOf<(value: number) => string>();
    });
  });
});
