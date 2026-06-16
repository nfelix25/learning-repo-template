import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  ok,
  err,
  isOk,
  isErr,
  map,
  flatMap,
  mapErr,
  fold,
  unwrapOr,
  unwrapOrElse,
  getOrThrow,
  type Ok,
  type Err,
  type Result,
} from './result.js';

// ── Lesson 19 tests (carried forward) ───────────────────────────────────────

describe('19 — Result Type Design (carried forward)', () => {
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

  describe('Result<E, T> union', () => {
    it('accepts both ok() and err() without casts', () => {
      const okResult: Result<string, number> = ok(1);
      const errResult: Result<string, number> = err('e');
      expect(isOk(okResult)).toBe(true);
      expect(isErr(errResult)).toBe(true);
    });
  });

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

// ── Lesson 20 tests (carried forward) ───────────────────────────────────────

describe('20 — Result map and flatMap (carried forward)', () => {
  describe('map()', () => {
    it('transforms the value when Ok', () => {
      const result = map(ok(5), x => x * 2);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe(10);
    });

    it('has type Result<never, number> for map(ok(5), x => x * 2)', () => {
      const result = map(ok(5), x => x * 2);
      if (result._tag === 'Ok') expectTypeOf(result.value).toEqualTypeOf<number>();
    });

    it('preserves the error when Err', () => {
      const result = map(err('oops') as Result<string, number>, x => x * 2);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) expect(result.error).toBe('oops');
    });

    it('infers the mapped type correctly', () => {
      const result = map(ok('hi'), s => s.length);
      if (result._tag === 'Ok') expectTypeOf(result.value).toEqualTypeOf<number>();
    });
  });

  describe('flatMap()', () => {
    it('applies f to the value when Ok', () => {
      const result = flatMap(
        ok(5) as Result<string, number>,
        x => (x > 0 ? ok(x) : err('negative'))
      );
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe(5);
    });

    it('has type Result<string, number> for the positive branch', () => {
      const result = flatMap(
        ok(5) as Result<string, number>,
        x => (x > 0 ? ok(x) : err('negative'))
      );
      expectTypeOf(result).toEqualTypeOf<Result<string, number>>();
    });

    it('preserves the first error when Err', () => {
      const result = flatMap(
        err('first') as Result<string, number>,
        x => ok(x * 2)
      );
      expect(isErr(result)).toBe(true);
      if (isErr(result)) expect(result.error).toBe('first');
    });
  });

  describe('mapErr()', () => {
    it('transforms the error when Err', () => {
      const result = mapErr(
        err(404) as Result<number, string>,
        code => new Error(String(code))
      );
      expect(isErr(result)).toBe(true);
      if (isErr(result)) expect(result.error).toBeInstanceOf(Error);
    });

    it('preserves the value when Ok', () => {
      const result = mapErr(
        ok('v') as Result<number, string>,
        _ => new Error()
      );
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe('v');
    });
  });
});

// ── Lesson 21 tests ──────────────────────────────────────────────────────────

describe('21 — Result Combinators and Unwrap', () => {
  // ── fold ─────────────────────────────────────────────────────────────────
  describe('fold()', () => {
    it('applies onOk when Ok', () => {
      expect(fold(ok(42), () => 0, t => t * 2)).toBe(84);
    });

    it('applies onErr when Err', () => {
      expect(fold(err('bad') as Result<string, number>, () => -1, t => t * 2)).toBe(-1);
    });

    it('produces a single unified type', () => {
      const result = fold(ok(42) as Result<string, number>, () => 0, t => t);
      expectTypeOf(result).toEqualTypeOf<number>();
    });
  });

  // ── unwrapOr ─────────────────────────────────────────────────────────────
  describe('unwrapOr()', () => {
    it('returns the value when Ok', () => {
      expect(unwrapOr(ok('hello'), 'default')).toBe('hello');
    });

    it('returns the fallback when Err', () => {
      expect(unwrapOr(err('oops') as Result<string, string>, 'default')).toBe('default');
    });
  });

  // ── unwrapOrElse ─────────────────────────────────────────────────────────
  describe('unwrapOrElse()', () => {
    it('calls fallback with the error when Err', () => {
      const result = unwrapOrElse(
        err(404) as Result<number, string>,
        code => `error ${code}`
      );
      expect(result).toBe('error 404');
    });

    it('returns the value when Ok', () => {
      expect(unwrapOrElse(ok('hi') as Result<number, string>, _ => 'fallback')).toBe('hi');
    });
  });

  // ── getOrThrow ────────────────────────────────────────────────────────────
  describe('getOrThrow()', () => {
    it('returns the value when Ok', () => {
      expect(getOrThrow(ok(99))).toBe(99);
    });

    it('throws the error when Err', () => {
      const boom = new Error('boom');
      expect(() => getOrThrow(err(boom) as Result<Error, number>)).toThrow('boom');
    });
  });
});
