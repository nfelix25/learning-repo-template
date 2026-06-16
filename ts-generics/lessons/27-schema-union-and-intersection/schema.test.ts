import { describe, it, expect, expectTypeOf } from 'vitest';
import { s, object, optional, array, lazy, union, intersection, ParseError } from './schema.js';
import type { Schema, Infer } from './schema.js';

describe('23-26 — Carried forward', () => {
  it('Schema<T> phantom field works', () => {
    expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
  });

  it('s.string() parses strings', () => {
    expect(s.string().parse('hello')).toBe('hello');
    expect(() => s.string().parse(42)).toThrow(ParseError);
  });

  it('object() parses matching objects', () => {
    const schema = object({ name: s.string(), age: s.number() });
    expect(schema.parse({ name: 'Alice', age: 30 })).toEqual({ name: 'Alice', age: 30 });
  });

  it('array() parses arrays', () => {
    expect(array(s.number()).parse([1, 2, 3])).toEqual([1, 2, 3]);
    expect(() => array(s.string()).parse('not array')).toThrow(ParseError);
  });

  it('lazy() supports recursive schemas', () => {
    interface TreeNode { value: string; children: TreeNode[] }
    const treeSchema: Schema<TreeNode> = object({
      value: s.string(),
      children: array(lazy(() => treeSchema)),
    });
    const parsed = treeSchema.parse({ value: 'root', children: [{ value: 'leaf', children: [] }] });
    expect(parsed.value).toBe('root');
    expect(parsed.children[0]?.value).toBe('leaf');
  });

  it('optional() works', () => {
    expect(optional(s.string()).parse(undefined)).toBe(undefined);
  });
});

describe('27 — Schema Union and Intersection', () => {
  describe('union()', () => {
    it('parses the first matching schema', () => {
      const schema = union([s.string(), s.number()]);
      expect(schema.parse('hello')).toBe('hello');
      expect(schema.parse(42)).toBe(42);
    });

    it('throws ParseError when no schema matches', () => {
      const schema = union([s.string(), s.number()]);
      expect(() => schema.parse(true)).toThrow(ParseError);
      expect(() => schema.parse(null)).toThrow(ParseError);
    });

    it('throws ParseError with descriptive message', () => {
      const schema = union([s.string(), s.number()]);
      try {
        schema.parse(true);
        expect.fail('should have thrown');
      } catch (e) {
        expect(e instanceof ParseError).toBe(true);
        if (e instanceof ParseError) {
          expect(e.message).toContain('union');
        }
      }
    });

    it('infers the union of output types', () => {
      const schema = union([s.string(), s.number()]);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string | number>();
    });

    it('infers union of literal types', () => {
      const schema = union([s.literal('a'), s.literal('b'), s.literal('c')]);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<'a' | 'b' | 'c'>();
    });

    it('infers union of object types', () => {
      const circleSchema = object({ kind: s.literal('circle'), radius: s.number() });
      const rectSchema = object({ kind: s.literal('rect'), width: s.number(), height: s.number() });
      const shapeSchema = union([circleSchema, rectSchema]);
      type Shape = Infer<typeof shapeSchema>;
      expectTypeOf<Shape>().toEqualTypeOf<
        | { kind: 'circle'; radius: number }
        | { kind: 'rect'; width: number; height: number }
      >();
    });

    it('handles union of three schemas', () => {
      const schema = union([s.string(), s.number(), s.boolean()]);
      expect(schema.parse('x')).toBe('x');
      expect(schema.parse(1)).toBe(1);
      expect(schema.parse(true)).toBe(true);
      expect(() => schema.parse(null)).toThrow(ParseError);
    });

    it('parses discriminated union objects correctly', () => {
      const circleSchema = object({ kind: s.literal('circle'), radius: s.number() });
      const rectSchema = object({ kind: s.literal('rect'), width: s.number(), height: s.number() });
      const shapeSchema = union([circleSchema, rectSchema]);

      const circle = shapeSchema.parse({ kind: 'circle', radius: 5 });
      expect(circle).toEqual({ kind: 'circle', radius: 5 });

      const rect = shapeSchema.parse({ kind: 'rect', width: 10, height: 20 });
      expect(rect).toEqual({ kind: 'rect', width: 10, height: 20 });
    });
  });

  describe('intersection()', () => {
    it('parses a value that satisfies both schemas', () => {
      const schemaA = object({ a: s.string() });
      const schemaB = object({ b: s.number() });
      const schema = intersection(schemaA, schemaB);
      const result = schema.parse({ a: 'hello', b: 42 });
      expect(result.a).toBe('hello');
    });

    it('throws ParseError when first schema fails', () => {
      const schemaA = object({ a: s.string() });
      const schemaB = object({ b: s.number() });
      const schema = intersection(schemaA, schemaB);
      expect(() => schema.parse({ b: 42 })).toThrow(ParseError);
    });

    it('throws ParseError when second schema fails', () => {
      const schemaA = object({ a: s.string() });
      const schemaB = object({ b: s.number() });
      const schema = intersection(schemaA, schemaB);
      expect(() => schema.parse({ a: 'hello' })).toThrow(ParseError);
    });

    it('infers A & B output type', () => {
      const schemaA = object({ a: s.string() });
      const schemaB = object({ b: s.number() });
      const schema = intersection(schemaA, schemaB);
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<
        { a: string } & { b: number }
      >();
    });

    it('composes intersection of three schemas via nesting', () => {
      const base = object({ id: s.number() });
      const named = object({ name: s.string() });
      const active = object({ active: s.boolean() });
      const schema = intersection(intersection(base, named), active);
      const result = schema.parse({ id: 1, name: 'Alice', active: true });
      expect(result).toEqual({ id: 1, name: 'Alice', active: true });
    });
  });
});
