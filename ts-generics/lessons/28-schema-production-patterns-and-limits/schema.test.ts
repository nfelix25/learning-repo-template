import { describe, it, expect, expectTypeOf } from 'vitest';
import { s, object, optional, array, lazy, union, intersection, ParseError } from './schema.js';
import type { Schema, Infer } from './schema.js';

describe('23-27 — Carried forward', () => {
  it('Schema<T> phantom field', () => {
    expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
  });

  it('s.string() / s.number() / s.boolean() / s.literal()', () => {
    expect(s.string().parse('hi')).toBe('hi');
    expect(s.number().parse(1)).toBe(1);
    expect(s.boolean().parse(false)).toBe(false);
    expect(s.literal('x').parse('x')).toBe('x');
  });

  it('object() parses objects', () => {
    const schema = object({ name: s.string(), age: s.number() });
    expect(schema.parse({ name: 'Alice', age: 30 })).toEqual({ name: 'Alice', age: 30 });
  });

  it('array() parses arrays', () => {
    expect(array(s.number()).parse([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('optional() accepts undefined', () => {
    expect(optional(s.string()).parse(undefined)).toBe(undefined);
  });

  it('lazy() supports recursive schemas', () => {
    interface TreeNode { value: string; children: TreeNode[] }
    const treeSchema: Schema<TreeNode> = object({
      value: s.string(),
      children: array(lazy(() => treeSchema)),
    });
    const parsed = treeSchema.parse({ value: 'root', children: [] });
    expect(parsed.value).toBe('root');
  });

  it('union() tries schemas in order', () => {
    expect(union([s.string(), s.number()]).parse(42)).toBe(42);
    expect(() => union([s.string(), s.number()]).parse(true)).toThrow(ParseError);
  });

  it('intersection() validates both schemas', () => {
    const schema = intersection(object({ a: s.string() }), object({ b: s.number() }));
    expect(schema.parse({ a: 'hello', b: 42 })).toEqual({ a: 'hello', b: 42 });
    expect(() => schema.parse({ a: 'hello' })).toThrow(ParseError);
  });
});

describe('28 — Schema Production Patterns and Limits', () => {
  describe('Schema.refine()', () => {
    it('passes when predicate returns true', () => {
      const schema = s.string().refine(str => str.includes('@'), { message: 'must be email' });
      expect(schema.parse('user@example.com')).toBe('user@example.com');
    });

    it('throws ParseError with given message when predicate returns false', () => {
      const schema = s.string().refine(str => str.includes('@'), { message: 'must be email' });
      try {
        schema.parse('notanemail');
        expect.fail('should have thrown');
      } catch (e) {
        expect(e instanceof ParseError).toBe(true);
        if (e instanceof ParseError) {
          expect(e.message).toBe('must be email');
        }
      }
    });

    it('still throws ParseError from the inner schema', () => {
      const schema = s.string().refine(str => str.length > 0, { message: 'empty' });
      expect(() => schema.parse(42)).toThrow(ParseError);
    });

    it('infers T (same type as the inner schema)', () => {
      const schema = s.string().refine(str => str.includes('@'), { message: 'must be email' });
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
    });

    it('works on number schema', () => {
      const positiveSchema = s.number().refine(n => n > 0, { message: 'must be positive' });
      expect(positiveSchema.parse(5)).toBe(5);
      expect(() => positiveSchema.parse(-1)).toThrow(ParseError);
      expect(() => positiveSchema.parse(0)).toThrow(ParseError);
    });

    it('supports chaining multiple refine calls', () => {
      const schema = s
        .string()
        .refine(s => s.length >= 8, { message: 'too short' })
        .refine(s => /[A-Z]/.test(s), { message: 'must have uppercase' });
      expect(schema.parse('Password1')).toBe('Password1');
      expect(() => schema.parse('short')).toThrow(ParseError);
      expect(() => schema.parse('alllowercase')).toThrow(ParseError);
    });
  });

  describe('Schema.transform()', () => {
    it('transforms string to number (length)', () => {
      const schema = s.string().transform(str => str.length);
      expect(schema.parse('hello')).toBe(5);
      expect(schema.parse('')).toBe(0);
    });

    it('infers U as the output type', () => {
      const schema = s.string().transform(str => str.length);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<number>();
    });

    it('transforms string to Date', () => {
      const schema = s.string().transform(str => new Date(str));
      const result = schema.parse('2024-01-15');
      expect(result instanceof Date).toBe(true);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<Date>();
    });

    it('transforms number to string', () => {
      const schema = s.number().transform(n => String(n));
      expect(schema.parse(42)).toBe('42');
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
    });

    it('still throws ParseError from the inner schema before transforming', () => {
      const schema = s.string().transform(str => str.length);
      expect(() => schema.parse(42)).toThrow(ParseError);
    });

    it('transforms to a complex object', () => {
      const schema = s.string().transform(str => ({ value: str, length: str.length }));
      expect(schema.parse('hi')).toEqual({ value: 'hi', length: 2 });
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{ value: string; length: number }>();
    });
  });

  describe('Chaining refine and transform', () => {
    it('refine then transform', () => {
      const schema = s
        .string()
        .refine(s => s.length > 0, { message: 'empty' })
        .transform(s => parseInt(s, 10));
      expect(schema.parse('42')).toBe(42);
      expect(() => schema.parse('')).toThrow(ParseError);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<number>();
    });

    it('transform then refine', () => {
      const schema = s
        .number()
        .transform(n => n * 2)
        .refine(n => n < 100, { message: 'too large after doubling' });
      expect(schema.parse(30)).toBe(60);
      expect(() => schema.parse(60)).toThrow(ParseError); // 60 * 2 = 120 >= 100
    });

    it('full pipeline: parse, refine, transform, refine', () => {
      const schema = s
        .string()
        .refine(s => s.startsWith('0x'), { message: 'must be hex string' })
        .transform(s => parseInt(s, 16))
        .refine(n => n >= 0, { message: 'must be non-negative' });
      expect(schema.parse('0xff')).toBe(255);
      expect(() => schema.parse('100')).toThrow(ParseError);
    });
  });

  describe('Integration: refine and transform with object schemas', () => {
    it('refines an object field via chained schema', () => {
      const emailSchema = s.string().refine(s => s.includes('@'), { message: 'invalid email' });
      const userSchema = object({ email: emailSchema, age: s.number() });
      expect(userSchema.parse({ email: 'a@b.com', age: 25 })).toEqual({
        email: 'a@b.com',
        age: 25,
      });
      expect(() => userSchema.parse({ email: 'notvalid', age: 25 })).toThrow(ParseError);
    });

    it('transforms an object into a derived type', () => {
      const schema = object({ firstName: s.string(), lastName: s.string() }).transform(
        obj => `${obj.firstName} ${obj.lastName}`
      );
      expect(schema.parse({ firstName: 'Alice', lastName: 'Smith' })).toBe('Alice Smith');
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
    });
  });
});
