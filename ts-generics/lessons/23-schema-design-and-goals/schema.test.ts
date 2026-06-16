import { describe, it, expectTypeOf } from 'vitest';
import type { Schema, Infer, ParseError } from './schema.js';

describe('23 — Schema Design and Goals', () => {
  describe('Schema<T>', () => {
    it('preserves T in _output phantom field', () => {
      expectTypeOf<Schema<string>['_output']>().toEqualTypeOf<string>();
      expectTypeOf<Schema<number>['_output']>().toEqualTypeOf<number>();
      expectTypeOf<Schema<boolean>['_output']>().toEqualTypeOf<boolean>();
    });

    it('preserves complex types in _output', () => {
      expectTypeOf<Schema<{ id: number; name: string }>['_output']>().toEqualTypeOf<{
        id: number;
        name: string;
      }>();
    });
  });

  describe('Infer<S>', () => {
    it('extracts string from Schema<string>', () => {
      expectTypeOf<Infer<Schema<string>>>().toEqualTypeOf<string>();
    });

    it('extracts number from Schema<number>', () => {
      expectTypeOf<Infer<Schema<number>>>().toEqualTypeOf<number>();
    });

    it('extracts complex types correctly', () => {
      expectTypeOf<Infer<Schema<{ id: number; name: string }>>>().toEqualTypeOf<{
        id: number;
        name: string;
      }>();
    });

    it('extracts array types correctly', () => {
      expectTypeOf<Infer<Schema<string[]>>>().toEqualTypeOf<string[]>();
    });
  });

  describe('ParseError', () => {
    it('has message field of type string', () => {
      expectTypeOf<ParseError['message']>().toEqualTypeOf<string>();
    });

    it('has path field of type (string | number)[]', () => {
      expectTypeOf<ParseError['path']>().toEqualTypeOf<(string | number)[]>();
    });
  });
});
