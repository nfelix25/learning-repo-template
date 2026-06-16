import { describe, it, expect, expectTypeOf } from 'vitest';
import { s, ParseError } from './schema.js';
import type { Schema, Infer } from './schema.js';

describe('23 — Schema Design and Goals (carried forward)', () => {
  describe('Schema<T>', () => {
    it('preserves T in _output phantom field', () => {
      expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
      expectTypeOf<Schema<number>['_output']>().toEqualTypeOf<number>();
    });
  });

  describe('Infer<S>', () => {
    it('extracts string from Schema<string>', () => {
      expectTypeOf<Infer<Schema<string>>>().toEqualTypeOf<string>();
    });

    it('extracts complex types correctly', () => {
      expectTypeOf<Infer<Schema<{ id: number; name: string }>>>().toEqualTypeOf<{
        id: number;
        name: string;
      }>();
    });
  });
});

describe('24 — Schema Primitives and Infer Pattern', () => {
  describe('s.string()', () => {
    it('parses a string value', () => {
      expect(s.string().parse('hello')).toBe('hello');
    });

    it('throws ParseError for non-string', () => {
      expect(() => s.string().parse(42)).toThrow(ParseError);
      expect(() => s.string().parse(null)).toThrow(ParseError);
      expect(() => s.string().parse(undefined)).toThrow(ParseError);
    });

    it('infers string type', () => {
      expectTypeOf<Infer<ReturnType<typeof s.string>>>().toEqualTypeOf<string>();
    });
  });

  describe('s.number()', () => {
    it('parses a number value', () => {
      expect(s.number().parse(42)).toBe(42);
      expect(s.number().parse(3.14)).toBe(3.14);
    });

    it('throws ParseError for non-number', () => {
      expect(() => s.number().parse('42')).toThrow(ParseError);
      expect(() => s.number().parse(true)).toThrow(ParseError);
    });

    it('infers number type', () => {
      expectTypeOf<Infer<ReturnType<typeof s.number>>>().toEqualTypeOf<number>();
    });
  });

  describe('s.boolean()', () => {
    it('parses a boolean value', () => {
      expect(s.boolean().parse(true)).toBe(true);
      expect(s.boolean().parse(false)).toBe(false);
    });

    it('throws ParseError for non-boolean', () => {
      expect(() => s.boolean().parse(1)).toThrow(ParseError);
      expect(() => s.boolean().parse('true')).toThrow(ParseError);
    });

    it('infers boolean type', () => {
      expectTypeOf<Infer<ReturnType<typeof s.boolean>>>().toEqualTypeOf<boolean>();
    });
  });

  describe('s.literal()', () => {
    it('parses the exact literal value', () => {
      expect(s.literal('active').parse('active')).toBe('active');
      expect(s.literal(42).parse(42)).toBe(42);
      expect(s.literal(true).parse(true)).toBe(true);
    });

    it('throws ParseError for non-matching value', () => {
      expect(() => s.literal('active').parse('inactive')).toThrow(ParseError);
      expect(() => s.literal(42).parse(43)).toThrow(ParseError);
    });

    it('infers the exact literal type for string', () => {
      expectTypeOf<Infer<ReturnType<typeof s.literal<'active'>>>>().toEqualTypeOf<'active'>();
    });

    it('infers the exact literal type for number', () => {
      const schema = s.literal(0 as const);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<0>();
    });

    it('stores the literal value', () => {
      const schema = s.literal('draft');
      expect(schema.literal).toBe('draft');
    });
  });

  describe('ParseError', () => {
    it('has correct name', () => {
      const err = new ParseError('test');
      expect(err.name).toBe('ParseError');
      expect(err instanceof ParseError).toBe(true);
      expect(err instanceof Error).toBe(true);
    });

    it('stores path', () => {
      const err = new ParseError('test', ['users', 0, 'email']);
      expect(err.path).toEqual(['users', 0, 'email']);
    });

    it('defaults path to empty array', () => {
      const err = new ParseError('test');
      expect(err.path).toEqual([]);
    });
  });
});
