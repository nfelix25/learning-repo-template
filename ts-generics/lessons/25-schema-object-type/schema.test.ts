import { describe, it, expect, expectTypeOf } from 'vitest';
import { s, object, optional, ParseError } from './schema.js';
import type { Schema, Infer } from './schema.js';

describe('23 — Schema Design and Goals (carried forward)', () => {
  describe('Schema<T>', () => {
    it('preserves T in _output phantom field', () => {
      expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
      expectTypeOf<Schema<number>['_output']>().toEqualTypeOf<number>();
    });

    it('extracts type with Infer', () => {
      expectTypeOf<Infer<Schema<string>>>().toEqualTypeOf<string>();
    });
  });
});

describe('24 — Schema Primitives (carried forward)', () => {
  it('s.string() parses strings', () => {
    expect(s.string().parse('hello')).toBe('hello');
    expect(() => s.string().parse(42)).toThrow(ParseError);
  });

  it('s.number() parses numbers', () => {
    expect(s.number().parse(42)).toBe(42);
    expect(() => s.number().parse('x')).toThrow(ParseError);
  });

  it('s.boolean() parses booleans', () => {
    expect(s.boolean().parse(true)).toBe(true);
    expect(() => s.boolean().parse(1)).toThrow(ParseError);
  });

  it('s.literal() parses exact values', () => {
    expect(s.literal('active').parse('active')).toBe('active');
    expect(() => s.literal('active').parse('inactive')).toThrow(ParseError);
  });
});

describe('25 — Schema Object Type', () => {
  describe('object()', () => {
    it('parses a matching object', () => {
      const schema = object({ name: s.string(), age: s.number() });
      const result = schema.parse({ name: 'Alice', age: 30 });
      expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('throws ParseError for non-object input', () => {
      const schema = object({ name: s.string() });
      expect(() => schema.parse('not an object')).toThrow(ParseError);
      expect(() => schema.parse(null)).toThrow(ParseError);
      expect(() => schema.parse(42)).toThrow(ParseError);
    });

    it('throws ParseError when a required field is missing', () => {
      const schema = object({ name: s.string(), age: s.number() });
      expect(() => schema.parse({})).toThrow(ParseError);
    });

    it('throws ParseError when a field has the wrong type', () => {
      const schema = object({ name: s.string(), age: s.number() });
      expect(() => schema.parse({ name: 'Alice', age: 'thirty' })).toThrow(ParseError);
    });

    it('infers the correct output type', () => {
      const schema = object({ name: s.string(), age: s.number() });
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{ name: string; age: number }>();
    });

    it('includes path in ParseError for nested failures', () => {
      const schema = object({ name: s.string() });
      try {
        schema.parse({ name: 42 });
        expect.fail('should have thrown');
      } catch (e) {
        expect(e instanceof ParseError).toBe(true);
        if (e instanceof ParseError) {
          expect(e.path).toContain('name');
        }
      }
    });
  });

  describe('optional()', () => {
    it('returns undefined when input is undefined', () => {
      expect(optional(s.string()).parse(undefined)).toBe(undefined);
    });

    it('parses the inner schema when input is defined', () => {
      expect(optional(s.string()).parse('hi')).toBe('hi');
    });

    it('throws when the inner schema fails', () => {
      expect(() => optional(s.string()).parse(42)).toThrow(ParseError);
    });

    it('infers T | undefined type', () => {
      const schema = optional(s.string());
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string | undefined>();
    });
  });

  describe('object() with optional fields', () => {
    it('parses object where optional field is missing', () => {
      const schema = object({ name: s.string(), nickname: optional(s.string()) });
      const result = schema.parse({ name: 'Alice' });
      expect(result.name).toBe('Alice');
      expect(result.nickname).toBe(undefined);
    });

    it('infers optional fields as T | undefined', () => {
      const schema = object({ name: s.string(), nickname: optional(s.string()) });
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{
        name: string;
        nickname: string | undefined;
      }>();
    });
  });

  describe('ObjectSchema.partial()', () => {
    it('makes all fields optional at runtime', () => {
      const schema = object({ name: s.string(), age: s.number() }).partial();
      expect(schema.parse({})).toEqual({ name: undefined, age: undefined });
      expect(schema.parse({ name: 'Alice' })).toEqual({ name: 'Alice', age: undefined });
    });

    it('infers all fields as T | undefined', () => {
      const schema = object({ name: s.string(), age: s.number() }).partial();
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{
        name: string | undefined;
        age: number | undefined;
      }>();
    });
  });

  describe('ObjectSchema.pick()', () => {
    it('parses only the picked fields', () => {
      const schema = object({ a: s.string(), b: s.number(), c: s.boolean() }).pick(['a']);
      const result = schema.parse({ a: 'hello', b: 99, c: true });
      expect(result).toEqual({ a: 'hello' });
    });

    it('infers only the picked field types', () => {
      const schema = object({ a: s.string(), b: s.number() }).pick(['a']);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{ a: string }>();
    });
  });

  describe('ObjectSchema.omit()', () => {
    it('parses without the omitted fields', () => {
      const schema = object({ a: s.string(), b: s.number() }).omit(['b']);
      const result = schema.parse({ a: 'hello', b: 99 });
      expect(result).toEqual({ a: 'hello' });
    });

    it('infers without the omitted field types', () => {
      const schema = object({ a: s.string(), b: s.number() }).omit(['b']);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{ a: string }>();
    });
  });
});
