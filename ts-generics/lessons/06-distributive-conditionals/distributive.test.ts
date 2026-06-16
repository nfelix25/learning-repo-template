import { describe, it, expectTypeOf } from 'vitest';
import type { ToMaybe, ToMaybeNonDist, IsUnion } from './distributive.js';

describe('06 — Distributive Conditional Types', () => {
  // ── ToMaybe (distributive) ───────────────────────────────────────────────
  describe('ToMaybe', () => {
    it('wraps a single type in { value: T } | null', () => {
      expectTypeOf<ToMaybe<string>>().toEqualTypeOf<{ value: string } | null>();
    });

    it('distributes over a union — each member wrapped separately', () => {
      // Distributive result: { value: string } | { value: number } | null
      // NOT { value: string | number } | null
      expectTypeOf<ToMaybe<string | number>>().toEqualTypeOf<
        { value: string } | { value: number } | null
      >();
    });

    it('distributes over never to produce never', () => {
      expectTypeOf<ToMaybe<never>>().toEqualTypeOf<never>();
    });
  });

  // ── ToMaybeNonDist (non-distributive) ─────────────────────────────────
  describe('ToMaybeNonDist', () => {
    it('wraps the whole union as a single value type', () => {
      // Non-distributive result: { value: string | number } | null
      // NOT { value: string } | { value: number } | null
      expectTypeOf<ToMaybeNonDist<string | number>>().toEqualTypeOf<
        { value: string | number } | null
      >();
    });

    it('behaves the same as distributive for single types', () => {
      expectTypeOf<ToMaybeNonDist<string>>().toEqualTypeOf<{ value: string } | null>();
    });
  });

  // ── IsUnion ──────────────────────────────────────────────────────────────
  describe('IsUnion', () => {
    it('returns false for a single type', () => {
      expectTypeOf<IsUnion<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsUnion<42>>().toEqualTypeOf<false>();
    });

    it('returns true for a union type', () => {
      expectTypeOf<IsUnion<string | number>>().toEqualTypeOf<true>();
      expectTypeOf<IsUnion<'a' | 'b'>>().toEqualTypeOf<true>();
    });

    it('returns never for never', () => {
      // Distributing over never produces never
      expectTypeOf<IsUnion<never>>().toEqualTypeOf<never>();
    });
  });
});
