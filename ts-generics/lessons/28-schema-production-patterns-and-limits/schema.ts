// Lesson 28 — Schema Production Patterns and Limits
// Carries forward lessons 23-27, adds RefinedSchema<T>, TransformSchema<T, U>,
// and refine()/transform() as methods on the Schema base class.

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

// ── RefinedSchema and TransformSchema — declared before Schema so methods
//    can reference them by name (method bodies run at call time, not definition
//    time, so forward references in method bodies are fine — but TypeScript's
//    type checker needs the declarations to be visible). We use `declare class`
//    trick via interface merging won't work here, so instead we structure the
//    file so that Schema's method body references are resolved at call time.
//    All class declarations in the same module are in scope for each other.
// ─────────────────────────────────────────────────────────────────────────────

// ── Schema<T> ────────────────────────────────────────────────────────────────

export abstract class Schema<T> {
  declare readonly _output: T;

  abstract parse(input: unknown): T;

  refine(
    predicate: (value: T) => boolean,
    opts: { message: string }
  ): Schema<T> {
    return new RefinedSchema(this, predicate, opts.message);
  }

  transform<U>(fn: (value: T) => U): Schema<U> {
    return new TransformSchema(this, fn);
  }
}

export type Infer<S extends Schema<unknown>> = S['_output'];

// ── RefinedSchema<T> ─────────────────────────────────────────────────────────

export class RefinedSchema<T> extends Schema<T> {
  constructor(
    readonly inner: Schema<T>,
    readonly predicate: (value: T) => boolean,
    readonly message: string
  ) {
    super();
  }

  parse(input: unknown): T {
    const value = this.inner.parse(input);
    if (!this.predicate(value)) {
      throw new ParseError(this.message);
    }
    return value;
  }
}

// ── TransformSchema<T, U> ────────────────────────────────────────────────────

export class TransformSchema<T, U> extends Schema<U> {
  constructor(
    readonly inner: Schema<T>,
    readonly fn: (value: T) => U
  ) {
    super();
  }

  parse(input: unknown): U {
    const value = this.inner.parse(input);
    return this.fn(value);
  }
}

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

export function object<Shape extends ObjectShape>(shape: Shape): ObjectSchema<Shape> {
  return new ObjectSchema(shape);
}

export function optional<T>(schema: Schema<T>): OptionalSchema<T> {
  return new OptionalSchema(schema);
}

// ── Array Schema ─────────────────────────────────────────────────────────────

export class ArraySchema<T> extends Schema<T[]> {
  constructor(readonly element: Schema<T>) {
    super();
  }

  parse(input: unknown): T[] {
    if (!Array.isArray(input)) {
      throw new ParseError(`Expected array, got ${typeof input}`);
    }
    return input.map((item, i) => {
      try {
        return this.element.parse(item);
      } catch (e) {
        if (e instanceof ParseError) {
          throw new ParseError(e.message, [i, ...e.path]);
        }
        throw e;
      }
    });
  }
}

// ── Lazy Schema ──────────────────────────────────────────────────────────────

export class LazySchema<T> extends Schema<T> {
  constructor(readonly getter: () => Schema<T>) {
    super();
  }

  parse(input: unknown): T {
    return this.getter().parse(input);
  }
}

export function array<T>(element: Schema<T>): ArraySchema<T> {
  return new ArraySchema(element);
}

export function lazy<T>(getter: () => Schema<T>): LazySchema<T> {
  return new LazySchema(getter);
}

// ── Union Schema ─────────────────────────────────────────────────────────────

type UnionOutput<Schemas extends Schema<unknown>[]> = Schemas[number]['_output'];

export class UnionSchema<Schemas extends Schema<unknown>[]> extends Schema<UnionOutput<Schemas>> {
  constructor(readonly schemas: Schemas) {
    super();
  }

  parse(input: unknown): UnionOutput<Schemas> {
    const errors: ParseError[] = [];
    for (const schema of this.schemas) {
      try {
        return schema.parse(input) as UnionOutput<Schemas>;
      } catch (e) {
        if (e instanceof ParseError) {
          errors.push(e);
        } else {
          throw e;
        }
      }
    }
    throw new ParseError(
      `None of the union schemas matched: ${errors.map(e => e.message).join('; ')}`
    );
  }
}

// ── Intersection Schema ───────────────────────────────────────────────────────

export class IntersectionSchema<A, B> extends Schema<A & B> {
  constructor(
    readonly schemaA: Schema<A>,
    readonly schemaB: Schema<B>
  ) {
    super();
  }

  parse(input: unknown): A & B {
    const a = this.schemaA.parse(input);
    const b = this.schemaB.parse(input);
    return { ...(a as object), ...(b as object) } as A & B;
  }
}

export function union<Schemas extends Schema<unknown>[]>(schemas: Schemas): UnionSchema<Schemas> {
  return new UnionSchema(schemas);
}

export function intersection<A, B>(a: Schema<A>, b: Schema<B>): IntersectionSchema<A, B> {
  return new IntersectionSchema(a, b);
}
