import { describe, it, expect, expectTypeOf } from 'vitest';
import { isString, isNumber, isCircle, assert, hasProperty, type Shape } from './predicates.js';

describe('18 — Type Predicates and Narrowing', () => {
  // ── isString ─────────────────────────────────────────────────────────────
  describe('isString', () => {
    it('returns true for a string', () => {
      expect(isString('hello')).toBe(true);
    });

    it('returns false for a non-string', () => {
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });

    it('narrows the type to string in a conditional branch', () => {
      const x: unknown = 'world';
      if (isString(x)) {
        expectTypeOf(x).toEqualTypeOf<string>();
      }
    });
  });

  // ── isNumber ─────────────────────────────────────────────────────────────
  describe('isNumber', () => {
    it('returns true for a number', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(0)).toBe(true);
    });

    it('returns false for a non-number', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
    });

    it('narrows the type to number in a conditional branch', () => {
      const x: unknown = 99;
      if (isNumber(x)) {
        expectTypeOf(x).toEqualTypeOf<number>();
      }
    });
  });

  // ── isCircle ─────────────────────────────────────────────────────────────
  describe('isCircle', () => {
    it('returns true for a circle shape', () => {
      const shape: Shape = { kind: 'circle', radius: 5 };
      expect(isCircle(shape)).toBe(true);
    });

    it('returns false for a square shape', () => {
      const shape: Shape = { kind: 'square', side: 4 };
      expect(isCircle(shape)).toBe(false);
    });

    it('narrows to the circle variant in a conditional branch', () => {
      const shape: Shape = { kind: 'circle', radius: 10 };
      if (isCircle(shape)) {
        expectTypeOf(shape).toEqualTypeOf<{ kind: 'circle'; radius: number }>();
        expect(shape.radius).toBe(10);
      }
    });
  });

  // ── assert ───────────────────────────────────────────────────────────────
  describe('assert', () => {
    it('does not throw when condition is true', () => {
      expect(() => assert(true, 'should not throw')).not.toThrow();
    });

    it('throws with the provided message when condition is false', () => {
      expect(() => assert(false, 'boom')).toThrow('boom');
    });

    it('narrows the type after assertion', () => {
      const value: string | null = 'hello';
      assert(value !== null, 'value must not be null');
      // After assert, TypeScript knows value is string
      expectTypeOf(value).toEqualTypeOf<string>();
    });
  });

  // ── hasProperty ──────────────────────────────────────────────────────────
  describe('hasProperty', () => {
    it('returns true when the property exists', () => {
      expect(hasProperty({ a: 1 }, 'a')).toBe(true);
    });

    it('returns false when the property does not exist', () => {
      expect(hasProperty({ b: 2 }, 'a')).toBe(false);
    });

    it('returns false for non-object values', () => {
      expect(hasProperty(42, 'a')).toBe(false);
      expect(hasProperty(null, 'a')).toBe(false);
    });

    it('narrows to Record<K, unknown> in a conditional branch', () => {
      const value: unknown = { a: 'hello' };
      if (hasProperty(value, 'a')) {
        expectTypeOf(value).toEqualTypeOf<Record<'a', unknown>>();
        expect(value.a).toBe('hello');
      }
    });
  });
});
