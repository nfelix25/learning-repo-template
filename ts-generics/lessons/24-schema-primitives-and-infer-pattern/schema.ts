// Lesson 24 — Schema Primitives and Infer Pattern
// Carries forward lesson 23, adds StringSchema, NumberSchema, BooleanSchema,
// LiteralSchema<T>, and the `s` factory object.

// ── ParseError ──────────────────────────────────────────────────────────────

export class ParseError extends Error {
  constructor(
    message: string,
    readonly path: (string | number)[] = []
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

// ── Schema<T> ────────────────────────────────────────────────────────────────

export abstract class Schema<T> {
  declare readonly _output: T;

  abstract parse(input: unknown): T;
}

// Extract the output type from a Schema — mirrors Zod's z.infer<typeof schema>
export type Infer<S extends Schema<unknown>> = S['_output'];

// ── Primitive Schemas ────────────────────────────────────────────────────────

export class StringSchema extends Schema<string> {
  parse(input: unknown): string {
    if (typeof input !== 'string') {
      throw new ParseError(`Expected string, got ${typeof input}`);
    }
    return input;
  }
}

export class NumberSchema extends Schema<number> {
  parse(input: unknown): number {
    if (typeof input !== 'number') {
      throw new ParseError(`Expected number, got ${typeof input}`);
    }
    return input;
  }
}

export class BooleanSchema extends Schema<boolean> {
  parse(input: unknown): boolean {
    if (typeof input !== 'boolean') {
      throw new ParseError(`Expected boolean, got ${typeof input}`);
    }
    return input;
  }
}

type Primitive = string | number | boolean;

export class LiteralSchema<T extends Primitive> extends Schema<T> {
  constructor(readonly literal: T) {
    super();
  }

  parse(input: unknown): T {
    if (input !== this.literal) {
      throw new ParseError(
        `Expected literal ${JSON.stringify(this.literal)}, got ${JSON.stringify(input)}`
      );
    }
    return input as T;
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export const s = {
  string: (): StringSchema => new StringSchema(),
  number: (): NumberSchema => new NumberSchema(),
  boolean: (): BooleanSchema => new BooleanSchema(),
  literal: <T extends Primitive>(value: T): LiteralSchema<T> => new LiteralSchema(value),
};
