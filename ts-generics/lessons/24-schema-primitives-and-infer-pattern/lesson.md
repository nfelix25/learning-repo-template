# Lesson 24 — Schema Primitives and Infer Pattern

> Architecture reference: Zod v4 (stable as of 2026-05-23).

## Motivation

`Schema<T>` gives us the *shape* of a validator, but no validators yet. The first concrete schemas are the primitives: `string`, `number`, `boolean`, and `literal`. These are the atoms from which all complex schemas are built.

Beyond runtime validation, this lesson introduces the `Infer<S>` pattern in practice. The idea: describe a schema *once*, and let TypeScript derive the output type automatically. You write `Infer<typeof mySchema>` instead of maintaining a parallel type definition.

## Mechanic

### Concrete schema subclasses

Each primitive schema extends `Schema<T>` and implements `parse`:

```typescript
export class StringSchema extends Schema<string> {
  parse(input: unknown): string {
    if (typeof input !== 'string') {
      throw new ParseError(`Expected string, got ${typeof input}`);
    }
    return input;
  }
}
```

The contract is:
- Accept `unknown` — never assume the caller passed the right type.
- Return `T` on success.
- Throw `ParseError` on failure.

TypeScript knows the return is `string` because `Schema<string>` fixes `T = string`, so `parse` must return `string`. The phantom `_output: string` field carries this type forward for `Infer`.

### `LiteralSchema<T extends Primitive>`

Literals are the most interesting primitive. A literal schema only accepts *one specific value*:

```typescript
export class LiteralSchema<T extends Primitive> extends Schema<T> {
  constructor(readonly literal: T) { super(); }

  parse(input: unknown): T {
    if (input !== this.literal) {
      throw new ParseError(`Expected literal ${JSON.stringify(this.literal)}`);
    }
    return input as T;
  }
}
```

The type parameter `T` is constrained to `Primitive = string | number | boolean`. When you call `s.literal('active')`, TypeScript infers `T = 'active'` — the *literal type*, not the wider `string`. So `Infer<typeof schema>` is `'active'`, not `string`.

This is crucial for discriminated unions: you can have a `status` field where the schema knows `'active' | 'inactive'`, not just `string`.

### The `s` factory

Individual schemas are created through a factory object:

```typescript
export const s = {
  string:  (): StringSchema         => new StringSchema(),
  number:  (): NumberSchema         => new NumberSchema(),
  boolean: (): BooleanSchema        => new BooleanSchema(),
  literal: <T extends Primitive>(v: T) => new LiteralSchema(v),
};
```

Factory functions follow the same pattern as Zod's `z.string()`, `z.number()`, etc. They're thin wrappers — their value is in the calling convention, not in any additional logic.

### `Infer<S>` in practice

```typescript
const statusSchema = s.literal('active');
type Status = Infer<typeof statusSchema>; // 'active'

const nameSchema = s.string();
type Name = Infer<typeof nameSchema>; // string
```

`Infer<S>` reads `S['_output']`. Because `_output` is typed as `T` in `Schema<T>`, and `LiteralSchema<'active'>` extends `Schema<'active'>`, the `_output` field has type `'active'`. The `declare` keyword ensures no runtime overhead.

## Worked Example

```typescript
// Schema for a HTTP method
const methodSchema = s.literal('GET' as const);

// Validate at the boundary
function handleRequest(rawMethod: unknown) {
  const method = methodSchema.parse(rawMethod); // typed as 'GET'
  console.log(method.toUpperCase());            // fine — method is string
}

// Build an object schema shape by hand (before lesson 25)
type UserInput = {
  name: Infer<typeof s.string()>;   // string
  age: Infer<typeof s.number()>;    // number
  active: Infer<typeof s.boolean()>; // boolean
};
```

## Pitfalls

**`typeof input !== 'string'` not `input instanceof String`.** Primitive values in JavaScript are not `String` objects. `typeof` is the right guard for primitive schemas.

**`NaN` passes `typeof input === 'number'`**. If you need to exclude `NaN`, add `Number.isNaN(input)` as a second check. The base `NumberSchema` here doesn't — add a refinement in lesson 28 if needed.

**Literal type inference requires a `const` literal or type annotation.** When calling `s.literal('active')`, TypeScript typically infers `T = string` unless the argument is in a context that demands a literal type. The factory function's constraint `T extends Primitive` combined with TypeScript's literal type inference usually works — but if you store the value in a `let` variable first, you may need `as const`.

**`input as T` in `LiteralSchema.parse`.** After checking `input === this.literal`, TypeScript can't narrow `unknown` to `T` automatically. The assertion is safe because the equality check guarantees it.

## Exercise

1. Implement a `NullSchema` that validates `null` and returns it typed as `null`. Add `s.null()` to the factory.
2. Implement an `UndefinedSchema` that validates `undefined`. Add `s.undefined()`.
3. Write a `NullishSchema<T>` that wraps another schema and accepts `null | undefined` in addition to `T`.
4. Use `Infer` to verify: `Infer<NullishSchema<StringSchema>>` = `string | null | undefined`.
