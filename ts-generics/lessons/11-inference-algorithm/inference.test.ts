import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Head, Tail, Awaited1 } from './inference.js';
import { pick, pipe2, mapFn } from './inference.js';

describe('11 — Inference Algorithm', () => {
  // ── Head ─────────────────────────────────────────────────────────────────
  describe('Head', () => {
    it('extracts the first element type from a non-empty tuple', () => {
      expectTypeOf<Head<[string, number, boolean]>>().toEqualTypeOf<string>();
      expectTypeOf<Head<[number]>>().toEqualTypeOf<number>();
    });

    it('returns never for an empty tuple', () => {
      expectTypeOf<Head<[]>>().toEqualTypeOf<never>();
    });
  });

  // ── Tail ─────────────────────────────────────────────────────────────────
  describe('Tail', () => {
    it('extracts all elements after the first', () => {
      expectTypeOf<Tail<[string, number, boolean]>>().toEqualTypeOf<[number, boolean]>();
    });

    it('returns an empty tuple for a single-element tuple', () => {
      expectTypeOf<Tail<[string]>>().toEqualTypeOf<[]>();
    });

    it('returns never for an empty tuple', () => {
      expectTypeOf<Tail<[]>>().toEqualTypeOf<never>();
    });
  });

  // ── Awaited1 ─────────────────────────────────────────────────────────────
  describe('Awaited1', () => {
    it('unwraps one level of Promise', () => {
      expectTypeOf<Awaited1<Promise<string>>>().toEqualTypeOf<string>();
      expectTypeOf<Awaited1<Promise<number>>>().toEqualTypeOf<number>();
    });

    it('returns non-Promise types unchanged', () => {
      expectTypeOf<Awaited1<number>>().toEqualTypeOf<number>();
      expectTypeOf<Awaited1<string>>().toEqualTypeOf<string>();
    });
  });

  // ── pick ─────────────────────────────────────────────────────────────────
  describe('pick', () => {
    it('returns the correct value at runtime', () => {
      expect(pick({ a: 1, b: 2 }, 'a')).toBe(1);
      expect(pick({ a: 1, b: 2 }, 'b')).toBe(2);
      expect(pick({ x: 'hello', y: true }, 'x')).toBe('hello');
    });

    it('infers the precise return type from the key', () => {
      expectTypeOf(pick({ a: 1, b: 'x' }, 'b')).toEqualTypeOf<string>();
      expectTypeOf(pick({ a: 1, b: 'x' }, 'a')).toEqualTypeOf<number>();
    });
  });

  // ── pipe2 ─────────────────────────────────────────────────────────────────
  describe('pipe2', () => {
    it('composes two functions at runtime', () => {
      const double = (n: number) => n * 2;
      const toString = (n: number) => String(n);
      const doubleToString = pipe2(double, toString);
      expect(doubleToString(5)).toBe('10');
      expect(doubleToString(0)).toBe('0');
    });

    it('infers the correct return type from the second function', () => {
      const composed = pipe2((n: number) => n * 2, (n: number) => String(n));
      expectTypeOf(composed).toEqualTypeOf<(a: number) => string>();
    });

    it('threads types through from input to output', () => {
      const composed = pipe2((s: string) => s.length, (n: number) => n > 0);
      expectTypeOf(composed).toEqualTypeOf<(a: string) => boolean>();
    });
  });

  // ── mapFn ─────────────────────────────────────────────────────────────────
  describe('mapFn', () => {
    it('applies the callback to each element at runtime', () => {
      expect(mapFn([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
      expect(mapFn(['a', 'b', 'c'], (s) => s.toUpperCase())).toEqual(['A', 'B', 'C']);
    });

    it('infers the result type from the callback return', () => {
      const result = mapFn([1, 2, 3], (n) => String(n));
      expectTypeOf(result).toEqualTypeOf<string[]>();
    });

    it('handles transformations between unrelated types', () => {
      const result = mapFn(['hello', 'world'], (s) => s.length);
      expectTypeOf(result).toEqualTypeOf<number[]>();
    });
  });
});
