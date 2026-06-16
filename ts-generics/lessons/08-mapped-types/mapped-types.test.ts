import { describe, it, expectTypeOf } from 'vitest';
import type { MyPartial, MyReadonly, MyPick, Mutable } from './mapped-types.js';

type Point = { x: number; y: number };
type ReadonlyPoint = { readonly x: number; readonly y: number };

describe('08 — Mapped Types', () => {
  // ── MyPartial ─────────────────────────────────────────────────────────────
  describe('MyPartial', () => {
    it('makes all properties optional', () => {
      expectTypeOf<MyPartial<Point>>().toEqualTypeOf<{ x?: number; y?: number }>();
    });

    it('works on a single-property object', () => {
      expectTypeOf<MyPartial<{ name: string }>>().toEqualTypeOf<{ name?: string }>();
    });
  });

  // ── MyReadonly ────────────────────────────────────────────────────────────
  describe('MyReadonly', () => {
    it('makes all properties readonly', () => {
      expectTypeOf<MyReadonly<Point>>().toEqualTypeOf<{ readonly x: number; readonly y: number }>();
    });

    it('works on heterogeneous object types', () => {
      expectTypeOf<MyReadonly<{ a: string; b: boolean }>>().toEqualTypeOf<{
        readonly a: string;
        readonly b: boolean;
      }>();
    });
  });

  // ── MyPick ────────────────────────────────────────────────────────────────
  describe('MyPick', () => {
    type ThreeKeys = { a: string; b: number; c: boolean };

    it('picks a subset of keys', () => {
      expectTypeOf<MyPick<ThreeKeys, 'a' | 'b'>>().toEqualTypeOf<{ a: string; b: number }>();
    });

    it('picks a single key', () => {
      expectTypeOf<MyPick<ThreeKeys, 'c'>>().toEqualTypeOf<{ c: boolean }>();
    });
  });

  // ── Mutable ───────────────────────────────────────────────────────────────
  describe('Mutable', () => {
    it('removes readonly from all properties', () => {
      expectTypeOf<Mutable<ReadonlyPoint>>().toEqualTypeOf<{ x: number; y: number }>();
    });

    it('leaves non-readonly properties unchanged', () => {
      expectTypeOf<Mutable<Point>>().toEqualTypeOf<{ x: number; y: number }>();
    });
  });
});
