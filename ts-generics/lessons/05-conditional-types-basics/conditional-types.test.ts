import { describe, it, expectTypeOf } from 'vitest';
import type { IsString, IsFunction, MyNonNullable, MyAwaited } from './conditional-types.js';

// These tests are type-level only — expectTypeOf assertions are compile-time checks.
// `npm test` will pass with wrong stubs; `npm run verify` (typecheck) will catch failures.

describe('05 — Conditional Types Basics', () => {
  // ── IsString ─────────────────────────────────────────────────────────────
  describe('IsString', () => {
    it('is true for string and string literals', () => {
      expectTypeOf<IsString<string>>().toEqualTypeOf<true>();
      expectTypeOf<IsString<'hello'>>().toEqualTypeOf<true>();
    });

    it('is false for non-string types', () => {
      expectTypeOf<IsString<number>>().toEqualTypeOf<false>();
      expectTypeOf<IsString<boolean>>().toEqualTypeOf<false>();
      expectTypeOf<IsString<string[]>>().toEqualTypeOf<false>();
    });
  });

  // ── IsFunction ───────────────────────────────────────────────────────────
  describe('IsFunction', () => {
    it('is true for function types', () => {
      expectTypeOf<IsFunction<() => void>>().toEqualTypeOf<true>();
      expectTypeOf<IsFunction<(a: string) => number>>().toEqualTypeOf<true>();
    });

    it('is false for non-function types', () => {
      expectTypeOf<IsFunction<string>>().toEqualTypeOf<false>();
      expectTypeOf<IsFunction<{ call: () => void }>>().toEqualTypeOf<false>();
    });
  });

  // ── MyNonNullable ────────────────────────────────────────────────────────
  describe('MyNonNullable', () => {
    it('removes null and undefined from a union', () => {
      expectTypeOf<MyNonNullable<string | null | undefined>>().toEqualTypeOf<string>();
      expectTypeOf<MyNonNullable<number | null>>().toEqualTypeOf<number>();
    });

    it('leaves non-nullable types unchanged', () => {
      expectTypeOf<MyNonNullable<string>>().toEqualTypeOf<string>();
      expectTypeOf<MyNonNullable<number[]>>().toEqualTypeOf<number[]>();
    });
  });

  // ── MyAwaited ────────────────────────────────────────────────────────────
  describe('MyAwaited', () => {
    it('unwraps a Promise<T> to T', () => {
      expectTypeOf<MyAwaited<Promise<string>>>().toEqualTypeOf<string>();
      expectTypeOf<MyAwaited<Promise<number[]>>>().toEqualTypeOf<number[]>();
    });

    it('leaves non-Promise types unchanged', () => {
      expectTypeOf<MyAwaited<string>>().toEqualTypeOf<string>();
      expectTypeOf<MyAwaited<number>>().toEqualTypeOf<number>();
    });
  });
});
