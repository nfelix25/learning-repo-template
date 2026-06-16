import { describe, it, expectTypeOf } from 'vitest';
import type { Getters, EventNames, ExtractRouteParam } from './template-literals.js';

describe('09 — Template Literal Types', () => {
  // ── Getters ───────────────────────────────────────────────────────────────
  describe('Getters', () => {
    type Person = { name: string; age: number };

    it('maps each key to a getter method', () => {
      expectTypeOf<Getters<Person>>().toEqualTypeOf<{
        getName: () => string;
        getAge: () => number;
      }>();
    });

    it('capitalizes the key in the method name', () => {
      expectTypeOf<Getters<{ id: number }>>().toEqualTypeOf<{ getId: () => number }>();
    });
  });

  // ── EventNames ────────────────────────────────────────────────────────────
  describe('EventNames', () => {
    it('produces a union of Changed event names', () => {
      expectTypeOf<EventNames<{ name: string; age: number }>>().toEqualTypeOf<
        'nameChanged' | 'ageChanged'
      >();
    });

    it('works for a single key', () => {
      expectTypeOf<EventNames<{ id: number }>>().toEqualTypeOf<'idChanged'>();
    });
  });

  // ── ExtractRouteParam ─────────────────────────────────────────────────────
  describe('ExtractRouteParam', () => {
    it('extracts a trailing route parameter', () => {
      expectTypeOf<ExtractRouteParam<'/users/:id'>>().toEqualTypeOf<'id'>();
    });

    it('extracts a parameter after a path prefix', () => {
      expectTypeOf<ExtractRouteParam<'/posts/:slug'>>().toEqualTypeOf<'slug'>();
    });

    it('returns never for routes without a parameter', () => {
      expectTypeOf<ExtractRouteParam<'/users'>>().toEqualTypeOf<never>();
    });
  });
});
