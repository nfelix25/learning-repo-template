# Lesson 25 — Schema Object Type

> Architecture reference: Zod v4 (stable as of 2026-05-23).

## Motivation

Primitive schemas validate scalars. Real data is structured: users have names, ages, and nested addresses. `ObjectSchema<Shape>` bridges the gap — it takes a record of schemas and produces a schema for the corresponding object type.

The key challenge is making the *type* of the output mirror the *shape* of the schemas. If you pass `{ name: StringSchema, age: NumberSchema }`, the inferred output must be `{ name: string; age: number }` — automatically, without manual type annotation.

This is where TypeScript's mapped types and indexed access become genuinely load-bearing.

## Mechanic

### `OutputOf<Shape>` — the type-level map

```typescript
type ObjectShape = Record<string, Schema<unknown>>;

type OutputOf<Shape extends ObjectShape> = {
  [K in keyof Shape]: Shape[K]['_output'];
};
```

`OutputOf` iterates over every key `K` of `Shape` and looks up `Shape[K]['_output']` — the `_output` phantom field of that key's schema. Because `StringSchema extends Schema<string>`, `Shape['name']['_output']` resolves to `string`. The mapped type produces `{ name: string; age: number }` from `{ name: StringSchema; age: NumberSchema }` automatically.

### `ObjectSchema<Shape>`

```typescript
export class ObjectSchema<Shape extends ObjectShape> extends Schema<OutputOf<Shape>> {
  constructor(readonly shape: Shape) { super(); }

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
}
```

The parse loop iterates the *schema's* keys (not the input's keys), so extra input fields are silently ignored — a deliberate design choice (Zod calls this "strip mode"). Missing fields produce `undefined`, which will then fail the field's own schema unless it's an `OptionalSchema`.

**Error path propagation**: when a field's schema throws, the catch block prepends the field key to the error path: `new ParseError(e.message, [key, ...e.path])`. If the field itself is an object with nested errors, the path accumulates: `['address', 'street']`.

### `OptionalSchema<T>`

Optional fields need a wrapper schema that accepts `undefined`:

```typescript
export class OptionalSchema<T> extends Schema<T | undefined> {
  constructor(readonly inner: Schema<T>) { super(); }

  parse(input: unknown): T | undefined {
    if (input === undefined) return undefined;
    return this.inner.parse(input);
  }
}
```

`OptionalSchema<StringSchema>` extends `Schema<string | undefined>`, so `Infer<OptionalSchema<StringSchema>>` = `string | undefined`.

Note that `exactOptionalPropertyTypes: true` in tsconfig means `T | undefined` in the *value* type is distinct from an *optional property* `x?: T`. We use the former here — all fields in our object output type are present, some just have value `undefined`.

### `partial()`, `pick()`, `omit()`

These structural operations produce new schemas by transforming the `Shape`:

**`partial()`** wraps every field in `OptionalSchema`, producing `{ [K in keyof Shape]: OptionalSchema<Shape[K]['_output']> }`.

**`pick(keys)`** returns an `ObjectSchema<Pick<Shape, K>>` — only the listed keys.

**`omit(keys)`** returns an `ObjectSchema<Omit<Shape, K>>` — all keys except the listed ones.

These mirror TypeScript's utility types `Partial`, `Pick`, and `Omit` — but as runtime schema transformations that preserve full type safety.

## Worked Example

```typescript
const addressSchema = object({
  street: s.string(),
  city: s.string(),
  zip: s.string(),
});

const userSchema = object({
  id: s.number(),
  name: s.string(),
  address: addressSchema,
  nickname: optional(s.string()),
});

type User = Infer<typeof userSchema>;
// {
//   id: number;
//   name: string;
//   address: { street: string; city: string; zip: string };
//   nickname: string | undefined;
// }

// Partial for update payloads
const updateSchema = userSchema.omit(['id']).partial();
type UserUpdate = Infer<typeof updateSchema>;
// { name?: ... wait, actually all fields are T | undefined }
// { name: string | undefined; address: ...; nickname: string | undefined }
```

## Pitfalls

**`noUncheckedIndexedAccess`**: `obj[key]` returns `T | undefined` when the record is indexed. Check `key in obj` before reading to distinguish "missing key" from "key present with undefined value".

**`exactOptionalPropertyTypes`**: Our `OutputOf<Shape>` uses `[K in keyof Shape]: ...` without `?`. All output fields are *required*, some are just `T | undefined`. This is intentional — it makes the shape predictable.

**`Object.keys(this.shape)` vs `Object.keys(input)`**: Always iterate the *schema's* keys. Iterating the input's keys would expose you to prototype pollution and unexpected fields.

**The `as OutputOf<Shape>` cast**: The `result` object is built as `Record<string, unknown>` and cast at the end. This is safe because the loop processes exactly the keys in `Shape` with their corresponding schemas. TypeScript can't infer this from the loop, so the cast is necessary and justified.

## Exercise

1. Add a `strict()` method to `ObjectSchema` that throws if the input has keys not in the shape (Zod's "strict mode").
2. Add `extend<NewShape>(extra: NewShape)` that merges new fields into the schema, returning `ObjectSchema<Shape & NewShape>`.
3. Implement nested error paths: parse `{ user: { name: 42 } }` and verify the `ParseError.path` is `['user', 'name']`.
