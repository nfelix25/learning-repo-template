import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  type UserId,
  type ProductId,
  type Email,
  asUserId,
  asProductId,
  asEmail,
} from './branded.js';

describe('15 — Branded Types', () => {
  // ── UserId and ProductId are distinct ───────────────────────────────────
  describe('UserId', () => {
    it('UserId extends string', () => {
      expectTypeOf<UserId>().toMatchTypeOf<string>();
    });

    it('asUserId returns a UserId', () => {
      expectTypeOf(asUserId('u1')).toEqualTypeOf<UserId>();
    });

    it('asUserId returns a value at runtime', () => {
      expect(asUserId('u1')).toBe('u1');
    });

    it('UserId is not assignable to ProductId', () => {
      // @ts-expect-error — UserId and ProductId are distinct branded types
      const _: ProductId = asUserId('x');
      void _;
    });

    it('plain string is not directly assignable to UserId', () => {
      const raw: string = 'u2';
      // @ts-expect-error — string is not assignable to UserId without a cast
      const _: UserId = raw;
      void _;
    });
  });

  // ── ProductId ────────────────────────────────────────────────────────────
  describe('ProductId', () => {
    it('ProductId extends string', () => {
      expectTypeOf<ProductId>().toMatchTypeOf<string>();
    });

    it('asProductId returns a ProductId', () => {
      expectTypeOf(asProductId('p1')).toEqualTypeOf<ProductId>();
    });

    it('asProductId returns a value at runtime', () => {
      expect(asProductId('p1')).toBe('p1');
    });

    it('ProductId is not assignable to UserId', () => {
      // @ts-expect-error — ProductId cannot be passed where UserId is expected
      const _: UserId = asProductId('p2');
      void _;
    });
  });

  // ── Cannot pass UserId where ProductId is expected in a function call ───
  describe('cross-brand assignment', () => {
    function processOrder(_userId: UserId, _productId: ProductId): string {
      return `${String(_userId)}:${String(_productId)}`;
    }

    it('rejects swapped arguments', () => {
      const uid = asUserId('u1');
      const pid = asProductId('p1');
      // @ts-expect-error — arguments are in the wrong order
      processOrder(pid, uid);
    });

    it('accepts correct argument order at runtime', () => {
      const uid = asUserId('u1');
      const pid = asProductId('p1');
      expect(processOrder(uid, pid)).toBe('u1:p1');
    });
  });

  // ── Email with unique symbol branding ───────────────────────────────────
  describe('Email', () => {
    it('Email extends string', () => {
      expectTypeOf<Email>().toMatchTypeOf<string>();
    });

    it('asEmail returns an Email', () => {
      expectTypeOf(asEmail('a@b.com')).toEqualTypeOf<Email>();
    });

    it('asEmail returns a value at runtime', () => {
      expect(asEmail('a@b.com')).toBe('a@b.com');
    });

    it('plain string is not directly assignable to Email', () => {
      const raw: string = 'test@example.com';
      // @ts-expect-error — string is not assignable to Email without a cast
      const _: Email = raw;
      void _;
    });
  });
});
