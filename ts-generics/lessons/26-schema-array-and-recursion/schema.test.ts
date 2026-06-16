import { describe, it, expect, expectTypeOf } from 'vitest';
import { s, object, optional, array, lazy, ParseError } from './schema.js';
import type { Schema, Infer } from './schema.js';

describe('23 — Schema Design and Goals (carried forward)', () => {
  it('preserves T in _output phantom field', () => {
    expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
    expectTypeOf<Infer<Schema<number>>>().toEqualTypeOf<number>();
  });
});

describe('24 — Schema Primitives (carried forward)', () => {
  it('s.string() parses strings', () => {
    expect(s.string().parse('hello')).toBe('hello');
    expect(() => s.string().parse(42)).toThrow(ParseError);
  });

  it('s.number() parses numbers', () => {
    expect(s.number().parse(42)).toBe(42);
  });

  it('s.literal() parses exact literals', () => {
    expect(s.literal('active').parse('active')).toBe('active');
    expect(() => s.literal('active').parse('inactive')).toThrow(ParseError);
  });
});

describe('25 — Schema Object Type (carried forward)', () => {
  it('object() parses matching objects', () => {
    const schema = object({ name: s.string(), age: s.number() });
    expect(schema.parse({ name: 'Alice', age: 30 })).toEqual({ name: 'Alice', age: 30 });
  });

  it('optional() accepts undefined', () => {
    expect(optional(s.string()).parse(undefined)).toBe(undefined);
    expect(optional(s.string()).parse('hi')).toBe('hi');
  });

  it('partial() makes all fields optional', () => {
    const schema = object({ name: s.string() }).partial();
    expect(schema.parse({})).toEqual({ name: undefined });
  });
});

describe('26 — Schema Array and Recursion', () => {
  describe('array()', () => {
    it('parses an array of strings', () => {
      expect(array(s.string()).parse(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('parses an array of numbers', () => {
      expect(array(s.number()).parse([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('parses an empty array', () => {
      expect(array(s.string()).parse([])).toEqual([]);
    });

    it('throws ParseError when input is not an array', () => {
      expect(() => array(s.string()).parse('not array')).toThrow(ParseError);
      expect(() => array(s.string()).parse(null)).toThrow(ParseError);
      expect(() => array(s.string()).parse(42)).toThrow(ParseError);
    });

    it('throws ParseError when an element fails validation', () => {
      expect(() => array(s.number()).parse([1, 'two', 3])).toThrow(ParseError);
    });

    it('includes the index in ParseError path', () => {
      try {
        array(s.number()).parse([1, 'two', 3]);
        expect.fail('should have thrown');
      } catch (e) {
        expect(e instanceof ParseError).toBe(true);
        if (e instanceof ParseError) {
          expect(e.path[0]).toBe(1); // index of 'two'
        }
      }
    });

    it('infers T[] output type', () => {
      const schema = array(s.string());
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string[]>();
    });

    it('infers number[] for array(s.number())', () => {
      expectTypeOf<Infer<ReturnType<typeof array<number>>>>().toEqualTypeOf<number[]>();
    });
  });

  describe('lazy() — recursive schemas', () => {
    it('defers schema creation until parse time', () => {
      const schema = lazy(() => s.string());
      expect(schema.parse('hello')).toBe('hello');
    });

    it('supports a self-referential tree schema', () => {
      interface TreeNode {
        value: string;
        children: TreeNode[];
      }

      const treeSchema: Schema<TreeNode> = object({
        value: s.string(),
        children: array(lazy(() => treeSchema)),
      });

      const parsed = treeSchema.parse({
        value: 'root',
        children: [
          { value: 'leaf', children: [] },
          { value: 'branch', children: [{ value: 'deep', children: [] }] },
        ],
      });

      expect(parsed.value).toBe('root');
      expect(parsed.children[0]?.value).toBe('leaf');
      expect(parsed.children[1]?.value).toBe('branch');
      expect(parsed.children[1]?.children[0]?.value).toBe('deep');
    });

    it('validates recursive structures and throws on invalid nodes', () => {
      interface TreeNode {
        value: string;
        children: TreeNode[];
      }

      const treeSchema: Schema<TreeNode> = object({
        value: s.string(),
        children: array(lazy(() => treeSchema)),
      });

      expect(() =>
        treeSchema.parse({
          value: 'root',
          children: [{ value: 42, children: [] }], // invalid: value should be string
        })
      ).toThrow(ParseError);
    });

    it('supports mutually recursive schemas', () => {
      interface Category {
        name: string;
        subcategories: Category[];
      }

      const categorySchema: Schema<Category> = object({
        name: s.string(),
        subcategories: array(lazy(() => categorySchema)),
      });

      const result = categorySchema.parse({
        name: 'electronics',
        subcategories: [{ name: 'phones', subcategories: [] }],
      });

      expect(result.name).toBe('electronics');
      expect(result.subcategories[0]?.name).toBe('phones');
    });
  });

  describe('array() with object elements', () => {
    it('parses arrays of objects', () => {
      const schema = array(object({ id: s.number(), name: s.string() }));
      const result = schema.parse([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });

    it('infers array of object type', () => {
      const schema = array(object({ id: s.number(), name: s.string() }));
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{ id: number; name: string }[]>();
    });
  });
});
