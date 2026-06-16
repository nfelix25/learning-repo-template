# Lesson 23 — Schema Design and Goals

> Architecture reference: Zod v4 (stable as of 2026-05-23).

## Motivation

You've built `Result<E, T>` — a type that makes success and failure explicit. Now the question is: *how do you produce well-typed values from untyped runtime data?*

Every real application has a boundary where TypeScript's type information stops: a JSON API response, a form submission, a database row, a config file. On one side of that boundary is `unknown`. On the other side is the precise type your code expects. Something has to bridge that gap.

**Schema validators** are that bridge. The design goal is simple:

- Describe the shape of valid data as a *schema* value.
- Call `.parse(input)` to validate and return a precisely-typed result, or throw if the data is invalid.
- Let TypeScript *infer* the output type from the schema, so you never write the same type twice.

Zod pioneered this pattern in the TypeScript ecosystem. By the end of this build piece you'll have built the core of it yourself.

## Mechanic

### The `Schema<T>` abstract class

The central abstraction is `Schema<T>`: an object that knows how to validate an `unknown` value and return a `T`.

```typescript
export abstract class Schema<T> {
  declare readonly _output: T;
  abstract parse(input: unknown): T;
}
```

Three things to notice:

**`abstract class`, not interface.** Using an abstract class lets us declare `parse` as abstract (subclasses must implement it) while still adding concrete methods later (like `refine` and `transform` in lesson 28). An interface can't have concrete methods.

**`abstract parse(input: unknown): T`**. The contract: accept anything, return `T` or throw `ParseError`. The `unknown` parameter forces subclasses to do real validation — they can't assume the input shape.

**`declare readonly _output: T`**. This is the phantom field. `declare` tells TypeScript "this field exists in the type system" but emits *no runtime code*. It's never assigned, never read at runtime. Its only purpose is to carry `T` in a position where it can be read back by `Infer<S>`.

### The `Infer<S>` type

```typescript
export type Infer<S extends Schema<unknown>> = S['_output'];
```

This mirrors Zod's `z.infer<typeof schema>`. Given a schema value, extract its output type without writing it twice:

```typescript
const userSchema = object({
  name: s.string(),
  age: s.number(),
});

type User = Infer<typeof userSchema>;
// User = { name: string; age: number }
```

The phantom field `_output` is what makes this work. TypeScript looks up the `_output` property type of `S` — which is `T` — and that's the inferred output.

### Why `declare` and not an assignment?

If you wrote `readonly _output: T = undefined as unknown as T`, you'd have a runtime field that's wastefully initialized on every instance. More importantly, it would be visible and mutable in ways that could confuse users.

`declare` is the right tool here: it's a type-only annotation. The TypeScript compiler erases it entirely. The class instances stay lean; the type information stays precise.

### `ParseError`

```typescript
export class ParseError extends Error {
  constructor(
    message: string,
    readonly path: (string | number)[] = []
  ) {
    super(message);
    this.name = 'ParseError';
  }
}
```

`path` tracks *where* in a nested structure the error occurred: `['users', 0, 'email']` means "the `email` field of the first element of the `users` array". This is essential for useful error messages in production validators.

## Worked Example

```typescript
import { Schema, Infer, ParseError } from './schema.js';

// A concrete schema that validates even numbers
class EvenNumberSchema extends Schema<number> {
  parse(input: unknown): number {
    if (typeof input !== 'number') {
      throw new ParseError('Expected number');
    }
    if (input % 2 !== 0) {
      throw new ParseError(`Expected even number, got ${input}`);
    }
    return input;
  }
}

const evenSchema = new EvenNumberSchema();

// Type extraction — no type annotation needed
type EvenOutput = Infer<typeof evenSchema>; // number

// Runtime validation
evenSchema.parse(4);   // 4
evenSchema.parse(3);   // throws ParseError: Expected even number, got 3
evenSchema.parse('4'); // throws ParseError: Expected number
```

The type system knows the output is `number`. The runtime rejects anything that isn't a valid even number. Neither side knows about the other's concerns.

## Pitfalls

**Don't use `interface` for `Schema`.** Interfaces can't have concrete method implementations. Since we'll add `refine()` and `transform()` as concrete methods in lesson 28, we need an abstract class.

**Don't make `_output` a real runtime field.** Phantom fields exist only in the type system. Use `declare` — never assign to `_output`.

**`ParseError` must extend `Error`.** Using a plain object `{ message: string }` won't work with `instanceof` checks in `catch` blocks. Extending `Error` also gives you a stack trace.

**Don't forget `this.name = 'ParseError'`**. Without it, the error name in stack traces shows as `'Error'` instead of `'ParseError'`, making debugging harder.

## Exercise

Implement a `DateStringSchema` that validates ISO 8601 date strings (e.g. `'2024-01-15'`) and returns them typed as `string`. Then:

1. Use `Infer<typeof dateStringSchema>` to extract the type — it should be `string`.
2. Add a `path` to the `ParseError` that indicates this is a "date" field.
3. Write a `safeParse` method that catches `ParseError` and returns `{ success: true; data: T } | { success: false; error: ParseError }`.
