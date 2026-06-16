import { describe, it, expectTypeOf } from 'vitest';
import type { Json, DeepPartial, DeepReadonly, FlattenArray } from './recursive.js';

describe('13 — Recursive Types', () => {
  // ── Json ─────────────────────────────────────────────────────────────────
  describe('Json', () => {
    it('accepts primitive types', () => {
      expectTypeOf<string>().toMatchTypeOf<Json>();
      expectTypeOf<number>().toMatchTypeOf<Json>();
      expectTypeOf<boolean>().toMatchTypeOf<Json>();
      expectTypeOf<null>().toMatchTypeOf<Json>();
    });

    it('accepts arrays of Json values', () => {
      expectTypeOf<string[]>().toMatchTypeOf<Json>();
      expectTypeOf<number[]>().toMatchTypeOf<Json>();
    });

    it('accepts object types with Json values', () => {
      expectTypeOf<{ a: string }>().toMatchTypeOf<Json>();
      expectTypeOf<{ a: string; b: number }>().toMatchTypeOf<Json>();
    });

    it('accepts nested Json structures', () => {
      expectTypeOf<{ a: string[]; b: { c: null } }>().toMatchTypeOf<Json>();
    });
  });

  // ── DeepPartial ───────────────────────────────────────────────────────────
  describe('DeepPartial', () => {
    it('makes all properties optional at every depth', () => {
      type Input = { a: string; b: { c: number } };
      type Expected = { a?: string; b?: { c?: number } };
      expectTypeOf<DeepPartial<Input>>().toEqualTypeOf<Expected>();
    });

    it('leaves primitive types unchanged', () => {
      expectTypeOf<DeepPartial<string>>().toEqualTypeOf<string>();
      expectTypeOf<DeepPartial<number>>().toEqualTypeOf<number>();
    });

    it('handles flat objects', () => {
      type Input = { x: string; y: number };
      type Expected = { x?: string; y?: number };
      expectTypeOf<DeepPartial<Input>>().toEqualTypeOf<Expected>();
    });
  });

  // ── DeepReadonly ──────────────────────────────────────────────────────────
  describe('DeepReadonly', () => {
    it('makes all properties readonly at every depth', () => {
      type Input = { a: string; b: { c: number } };
      type Expected = { readonly a: string; readonly b: { readonly c: number } };
      expectTypeOf<DeepReadonly<Input>>().toEqualTypeOf<Expected>();
    });

    it('leaves primitive types unchanged', () => {
      expectTypeOf<DeepReadonly<string>>().toEqualTypeOf<string>();
      expectTypeOf<DeepReadonly<number>>().toEqualTypeOf<number>();
    });

    it('handles flat objects', () => {
      type Input = { x: string; y: number };
      type Expected = { readonly x: string; readonly y: number };
      expectTypeOf<DeepReadonly<Input>>().toEqualTypeOf<Expected>();
    });
  });

  // ── FlattenArray ──────────────────────────────────────────────────────────
  describe('FlattenArray', () => {
    it('flattens a doubly-nested array to the element type', () => {
      expectTypeOf<FlattenArray<string[][]>>().toEqualTypeOf<string>();
    });

    it('flattens a triply-nested array to the element type', () => {
      expectTypeOf<FlattenArray<string[][][]>>().toEqualTypeOf<string>();
    });

    it('leaves a non-array type unchanged', () => {
      expectTypeOf<FlattenArray<string>>().toEqualTypeOf<string>();
      expectTypeOf<FlattenArray<number>>().toEqualTypeOf<number>();
    });

    it('flattens a singly-nested array to the element type', () => {
      expectTypeOf<FlattenArray<number[]>>().toEqualTypeOf<number>();
    });
  });
});
