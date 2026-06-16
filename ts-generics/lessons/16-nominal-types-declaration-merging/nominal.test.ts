import { describe, it, expect, expectTypeOf } from 'vitest';
import { type SessionId, asSessionId, Nominal } from './nominal.js';

describe('16 — Nominal Types and Declaration Merging', () => {
  // ── SessionId via interface branding ────────────────────────────────────
  describe('SessionId', () => {
    it('asSessionId returns string & SessionId', () => {
      expectTypeOf(asSessionId('s1')).toEqualTypeOf<string & SessionId>();
    });

    it('asSessionId returns a value at runtime', () => {
      expect(asSessionId('s1')).toBe('s1');
    });

    it('string & SessionId extends string', () => {
      expectTypeOf<string & SessionId>().toMatchTypeOf<string>();
    });

    it('plain string is not assignable to string & SessionId', () => {
      const raw: string = 'plain';
      // @ts-expect-error — plain string cannot satisfy the SessionId interface brand
      const _: string & SessionId = raw;
      void _;
    });
  });

  // ── Nominal.CustomerId ───────────────────────────────────────────────────
  describe('Nominal.CustomerId', () => {
    it('asCustomerId returns Nominal.CustomerId', () => {
      expectTypeOf(Nominal.asCustomerId('c1')).toEqualTypeOf<Nominal.CustomerId>();
    });

    it('asCustomerId returns a value at runtime', () => {
      expect(Nominal.asCustomerId('c1')).toBe('c1');
    });

    it('Nominal.CustomerId extends string', () => {
      expectTypeOf<Nominal.CustomerId>().toMatchTypeOf<string>();
    });

    it('plain string is not assignable to CustomerId', () => {
      const raw: string = 'plain';
      // @ts-expect-error — plain string cannot be assigned to Nominal.CustomerId
      const _: Nominal.CustomerId = raw;
      void _;
    });
  });

  // ── Cross-type incompatibility ───────────────────────────────────────────
  describe('cross-type assignment', () => {
    it('SessionId and CustomerId are not interchangeable', () => {
      const session = asSessionId('s1');
      // @ts-expect-error — string & SessionId is not assignable to Nominal.CustomerId
      const _: Nominal.CustomerId = session;
      void _;
    });
  });
});
