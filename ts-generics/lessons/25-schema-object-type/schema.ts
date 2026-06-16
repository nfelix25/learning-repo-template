// Lesson 25 — Schema Object Type
// Carries forward lessons 23-24, adds ObjectSchema<Shape>, OptionalSchema<T>,
// and structural methods: partial(), pick(), omit().

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

export const s = {
  string: (): StringSchema => new StringSchema(),
  number: (): NumberSchema => new NumberSchema(),
  boolean: (): BooleanSchema => new BooleanSchema(),
  literal: <T extends Primitive>(value: T): LiteralSchema<T> => new LiteralSchema(value),
};

// ── Optional Schema ──────────────────────────────────────────────────────────

export class OptionalSchema<T> extends Schema<T | undefined> {
  constructor(readonly inner: Schema<T>) {
    super();
  }

  parse(input: unknown): T | undefined {
    if (input === undefined) return undefined;
    return this.inner.parse(input);
  }
}

// ── Object Schema ────────────────────────────────────────────────────────────

type ObjectShape = Record<string, Schema<unknown>>;

// Map each shape key to its schema's output type
type OutputOf<Shape extends ObjectShape> = {
  [K in keyof Shape]: Shape[K]['_output'];
};

export class ObjectSchema<Shape extends ObjectShape> extends Schema<OutputOf<Shape>> {
  constructor(readonly shape: Shape) {
    super();
  }

  parse(input: unknown): OutputOf<Shape> {
    if (typeof input !== 'object' || input === null) {
      throw new ParseError('Expected object');
    }
    const result: Record<string, unknown> = {};
    const obj = input as Record<string, unknown>;

    for (const key of Object.keys(this.shape) as (keyof Shape & string)[]) {
      const fieldSchema = this.shape[key];
      if (fieldSchema === undefined) continue;
      const fieldValue = key in obj ? obj[key] : undefined;
      try {
        result[key] = fieldSchema.parse(fieldValue);
      } catch (e) {
        if (e instanceof ParseError) {
          throw new ParseError(e.message, [key, ...e.path]);
        }
        throw e;
      }
    }

    return result as OutputOf<Shape>;
  }

  partial(): ObjectSchema<{ [K in keyof Shape]: OptionalSchema<Shape[K]['_output']> }> {
    const partialShape = {} as Record<string, Schema<unknown>>;
    for (const key of Object.keys(this.shape)) {
      const schema = this.shape[key];
      if (schema !== undefined) {
        partialShape[key] = new OptionalSchema(schema);
      }
    }
    return new ObjectSchema(
      partialShape as { [K in keyof Shape]: OptionalSchema<Shape[K]['_output']> }
    );
  }

  pick<K extends keyof Shape>(keys: readonly K[]): ObjectSchema<Pick<Shape, K>> {
    const picked = {} as Pick<Shape, K>;
    for (const key of keys) {
      picked[key] = this.shape[key] as Shape[K];
    }
    return new ObjectSchema(picked);
  }

  omit<K extends keyof Shape>(keys: readonly K[]): ObjectSchema<Omit<Shape, K>> {
    const omitted = { ...this.shape } as Record<string, Schema<unknown>>;
    for (const key of keys) {
      delete omitted[key as string];
    }
    return new ObjectSchema(omitted as Omit<Shape, K>);
  }
}

// ── Factory functions ────────────────────────────────────────────────────────

export function object<Shape extends ObjectShape>(shape: Shape): ObjectSchema<Shape> {
  return new ObjectSchema(shape);
}

export function optional<T>(schema: Schema<T>): OptionalSchema<T> {
  return new OptionalSchema(schema);
}
