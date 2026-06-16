# Lesson 28 — Schema Production Patterns and Limits

> Architecture reference: Zod v4 (stable as of 2026-05-23). Verified against TypeScript 4.9+ on 2026-05-23.

## Motivation

Primitive schemas validate structure. Real applications need to validate *semantics* too: an email isn't just a string, it's a string with `@`. An age isn't just a number, it's a non-negative integer. And sometimes you want to *transform* validated data into a derived type: parse a date string into a `Date` object, or compute a display name from first and last name fields.

Two methods on the `Schema<T>` base class cover these needs:

- **`refine(predicate, opts)`** — validates an additional semantic constraint after the base schema succeeds. Returns `RefinedSchema<T>` (same output type).
- **`transform(fn)`** — maps the validated output through a function, producing a new type. Returns `TransformSchema<T, U>`.

Because these are methods on the abstract `Schema<T>` class, they're available on *every* schema: primitives, objects, arrays, unions, and composed chains.

## Mechanic

### Adding methods to `Schema<T>`

The `Schema<T>` base class gains two concrete methods:

```typescript
export abstract class Schema<T> {
  declare readonly _output: T;
  abstract parse(input: unknown): T;

  refine(predicate: (value: T) => boolean, opts: { message: string }): RefinedSchema<T> {
    return new RefinedSchema(this, predicate, opts.message);
  }

  transform<U>(fn: (value: T) => U): TransformSchema<T, U> {
    return new TransformSchema(this, fn);
  }
}
```

Method bodies in TypeScript classes execute at *call time*, not *definition time*. So even though `RefinedSchema` and `TransformSchema` are declared after `Schema` in the file, the method bodies can reference them — by the time `refine()` or `transform()` is called, all classes are initialized. TypeScript's type checker also sees the full file, so the return types resolve correctly.

### `RefinedSchema<T>`

```typescript
export class RefinedSchema<T> extends Schema<T> {
  constructor(
    readonly inner: Schema<T>,
    readonly predicate: (value: T) => boolean,
    readonly message: string
  ) { super(); }

  parse(input: unknown): T {
    const value = this.inner.parse(input);
    if (!this.predicate(value)) {
      throw new ParseError(this.message);
    }
    return value;
  }
}
```

`RefinedSchema<T>` extends `Schema<T>` — the output type is unchanged. `parse` delegates to the inner schema first (structure), then checks the predicate (semantics). If either fails, `ParseError` is thrown. The error path is empty here; adding path support for refinements is a production consideration.

Because `RefinedSchema<T>` itself extends `Schema<T>`, it has `refine()` and `transform()` methods — chains work naturally.

### `TransformSchema<T, U>`

```typescript
export class TransformSchema<T, U> extends Schema<U> {
  constructor(
    readonly inner: Schema<T>,
    readonly fn: (value: T) => U
  ) { super(); }

  parse(input: unknown): U {
    const value = this.inner.parse(input);
    return this.fn(value);
  }
}
```

`TransformSchema<T, U>` extends `Schema<U>` — the *output* type changes to `U`. Validation runs first (on `T`), then the transform function produces `U`. The caller gets `U`; the original `T` is an implementation detail.

`Infer<TransformSchema<string, number>>` = `number` — the phantom `_output` field carries `U`.

## Worked Example

### Email validation with refine

```typescript
const emailSchema = s.string().refine(
  str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
  { message: 'Invalid email address' }
);

type Email = Infer<typeof emailSchema>; // string

emailSchema.parse('user@example.com'); // 'user@example.com'
emailSchema.parse('notanemail');       // throws ParseError: Invalid email address
```

### Date parsing with transform

```typescript
const dateSchema = s.string().transform(str => new Date(str));

type ParsedDate = Infer<typeof dateSchema>; // Date

const d = dateSchema.parse('2024-01-15'); // d: Date
console.log(d.getFullYear()); // 2024
```

### Validation pipeline

```typescript
const positiveIntSchema = s
  .number()
  .refine(n => Number.isInteger(n), { message: 'Must be integer' })
  .refine(n => n > 0, { message: 'Must be positive' });

// Compose with object
const productSchema = object({
  name: s.string().refine(s => s.length > 0, { message: 'Name required' }),
  price: positiveIntSchema,
  tags: array(s.string()),
});

type Product = Infer<typeof productSchema>;
// { name: string; price: number; tags: string[] }
```

## Limits and Production Considerations

**1. `refine` can't narrow types.** The predicate returns `boolean`, not a type guard. `s.string().refine(isEmail)` still has output type `string`, not `Email`. For branded types, wrap with a transform: `.refine(isEmail, ...).transform(s => s as Email)`.

**2. Errors from `refine` have no path.** Unlike object/array errors that track field/index paths, refinement errors start with an empty path. In production validators, add path information to `ParseError` by accepting it in the options.

**3. `transform` breaks `parse`/`safeParse` contract assumptions.** After a transform, you can no longer re-validate the output against the original schema. Keep raw-to-domain transforms in a dedicated layer if you need bidirectionality.

**4. Performance of deeply chained schemas.** Each `.refine()` and `.transform()` adds a wrapper object. Deep chains (10+ wrappers) are rarely a problem in practice, but for hot paths validate in a single pass.

**5. TypeScript inference depth limits.** Deeply nested generics can exhaust TypeScript's instantiation depth. The `Schema<T>` hierarchy is shallow enough to avoid this for normal use, but recursive union types with transforms can hit limits.

**6. `noUncheckedIndexedAccess` and transforms.** When transforming array elements, be careful: `items[0]` returns `T | undefined`. Use `.at(0)` with a guard, or `items[0] ?? defaultValue`.

## Exercise

1. Implement `pipe` as a standalone function: `pipe(schema, fn)` is equivalent to `schema.transform(fn)` but works without class methods. This is useful for functional composition patterns.
2. Add a `default(value: T)` method that returns a schema accepting `undefined` and returning `value` in that case. Hint: it's similar to `OptionalSchema` but with a fallback.
3. Implement a `coerce` namespace with `coerce.number()` that accepts strings and converts them: `'42'` → `42`. Use `transform` internally.
4. Use `refine` to implement a branded type: `type UserId = string & { readonly _brand: 'UserId' }`. Write `const userIdSchema = s.string().refine(isUUID, ...).transform(s => s as UserId)`.
