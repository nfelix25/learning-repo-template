import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  ok,
  err,
  isOk,
  isErr,
  type Ok,
  type Err,
  type Result,
} from './result.js';

describe('19 — Result Type Design', () => {
  // ── Factory types ────────────────────────────────────────────────────────
  describe('ok() type', () => {
    it('has type Ok<number>', () => {
      expectTypeOf(ok(42)).toEqualTypeOf<Ok<number>>();
    });

    it('has the correct runtime value', () => {
      expect(ok(42).value).toBe(42);
      expect(ok(42)._tag).toBe('Ok');
    });
  });

  describe('err() type', () => {
    it('has type Err<string>', () => {
      expectTypeOf(err('msg')).toEqualTypeOf<Err<string>>();
    });

    it('has the correct runtime error', () => {
      expect(err('msg').error).toBe('msg');
      expect(err('msg')._tag).toBe('Err');
    });
  });

  // ── isOk ────────────────────────────────────────────────────────────────
  describe('isOk()', () => {
    it('returns true for ok values', () => {
      expect(isOk(ok(1))).toBe(true);
    });

    it('returns false for err values', () => {
      expect(isOk(err('x'))).toBe(false);
    });

    it('narrows to Ok<number> after check', () => {
      const r: Result<string, number> = ok(1);
      if (isOk(r)) {
        expectTypeOf(r.value).toEqualTypeOf<number>();
        expect(r.value).toBe(1);
      }
    });
  });

  // ── isErr ────────────────────────────────────────────────────────────────
  describe('isErr()', () => {
    it('returns true for err values', () => {
      expect(isErr(err('x'))).toBe(true);
    });

    it('returns false for ok values', () => {
      expect(isErr(ok(1))).toBe(false);
    });

    it('narrows to Err<string> after check', () => {
      const r: Result<string, number> = err('x');
      if (isErr(r)) {
        expectTypeOf(r.error).toEqualTypeOf<string>();
        expect(r.error).toBe('x');
      }
    });
  });

  // ── Result union ─────────────────────────────────────────────────────────
  describe('Result<E, T> union', () => {
    it('accepts both ok() and err() without casts', () => {
      const okResult: Result<string, number> = ok(1);
      const errResult: Result<string, number> = err('e');
      expect(isOk(okResult)).toBe(true);
      expect(isErr(errResult)).toBe(true);
    });
  });

  // ── Discriminant narrowing ───────────────────────────────────────────────
  describe('discriminant narrowing via _tag', () => {
    it('allows accessing value when _tag is Ok', () => {
      const r: Result<string, number> = ok(42);
      if (r._tag === 'Ok') {
        expectTypeOf(r.value).toEqualTypeOf<number>();
        expect(r.value).toBe(42);
      }
    });

    it('allows accessing error when _tag is Err', () => {
      const r: Result<string, number> = err('oops');
      if (r._tag === 'Err') {
        expectTypeOf(r.error).toEqualTypeOf<string>();
        expect(r.error).toBe('oops');
      }
    });
  });
});
