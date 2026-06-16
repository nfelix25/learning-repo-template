# Lesson 27 — Schema Union and Intersection

> Architecture reference: Zod v4 (stable as of 2026-05-23).

## Motivation

The TypeScript type system has two core ways to combine types: union (`A | B`) and intersection (`A & B`). A schema library needs both.

**Union schemas** are essential for discriminated unions — the pattern where a `kind` or `type` field determines which shape the rest of the object takes. They're also used for fields that accept multiple primitive types.

**Intersection schemas** combine the constraints of two schemas: the input must satisfy *both*. This is used to merge object types, add required properties to an existing schema, or compose mixins.

## Mechanic

### `UnionOutput<Schemas>` — the type-level union

```typescript
type UnionOutput<Schemas extends Schema<unknown>[]> = Schemas[number]['_output'];
```

`Schemas[number]` is an indexed access that produces the union of all array element types. For `[StringSchema, NumberSchema]`, `Schemas[number]` is `StringSchema | NumberSchema`. Then `['_output']` distributes over the union: `string | number`.

This is a precise, automatic derivation of the output union type from the tuple of schemas.

### `UnionSchema<Schemas>`

```typescript
export class UnionSchema<Schemas extends Schema<unknown>[]> extends Schema<UnionOutput<Schemas>> {
  parse(input: unknown): UnionOutput<Schemas> {
    for (const schema of this.schemas) {
      try {
        return schema.parse(input) as UnionOutput<Schemas>;
      } catch (e) {
        if (e instanceof ParseError) { /* try next */ }
        else throw e; // propagate non-parse errors
      }
    }
    throw new ParseError('None of the union schemas matched');
  }
}
```

The parser tries each schema in order. The first one that succeeds wins. This is "first-match" semantics — identical to Zod's behavior. If all fail, the error message summarizes the failures.

**Important**: only `ParseError` is caught; unexpected errors (programming mistakes, `TypeError`, etc.) are re-thrown immediately. This prevents the union from silently swallowing bugs.

### `IntersectionSchema<A, B>`

```typescript
export class IntersectionSchema<A, B> extends Schema<A & B> {
  parse(input: unknown): A & B {
    const a = this.schemaA.parse(input);
    this.schemaB.parse(input);
    return a as A & B;
  }
}
```

Both schemas parse the same input. The result of schema A is returned (schema B's result is discarded — its job is validation only). The cast to `A & B` is safe because both schemas validated the same value; schema A's output already has the A properties, and we know the B properties are valid (since B validated them).

**Why not merge the outputs?** For object schemas, the values returned by schema A and schema B are separate objects constructed from the same input. A full merge (`{ ...a, ...b }`) would require `a` and `b` to be objects — breaking for non-object schemas. This simple implementation is correct for the common case where both schemas read from the same underlying fields.

## Worked Example

### Discriminated union

```typescript
const circleSchema = object({ kind: s.literal('circle'), radius: s.number() });
const rectSchema   = object({ kind: s.literal('rect'), width: s.number(), height: s.number() });
const shapeSchema  = union([circleSchema, rectSchema]);

type Shape = Infer<typeof shapeSchema>;
// { kind: 'circle'; radius: number } | { kind: 'rect'; width: number; height: number }

function area(shape: Shape): number {
  if (shape.kind === 'circle') return Math.PI * shape.radius ** 2;
  return shape.width * shape.height;
}

// At the API boundary:
const raw: unknown = JSON.parse(body);
const shape = shapeSchema.parse(raw); // typed as Shape
console.log(area(shape));
```

### Intersection for mixins

```typescript
const timestampedSchema = object({ createdAt: s.string(), updatedAt: s.string() });
const userBaseSchema    = object({ id: s.number(), name: s.string() });
const userSchema        = intersection(userBaseSchema, timestampedSchema);

type User = Infer<typeof userSchema>;
// { id: number; name: string } & { createdAt: string; updatedAt: string }
```

### Union of primitives for flexible fields

```typescript
const idSchema = union([s.string(), s.number()]);
type Id = Infer<typeof idSchema>; // string | number

idSchema.parse('abc-123'); // string
idSchema.parse(42);        // number
idSchema.parse(true);      // throws ParseError
```

## Pitfalls

**Union order matters for ambiguous inputs**: The first matching schema wins. `union([s.number(), s.literal(0)])` will always match `0` as `number` first. Put more specific schemas first.

**Intersection of incompatible schemas produces `never`**: `intersection(s.string(), s.number())` has type `string & number` = `never`. Both schemas would fail on any input, so `parse` always throws. TypeScript doesn't prevent this.

**`IntersectionSchema` returns schema A's output, not a merge**: For object intersections, both schemas validate the same raw input. The runtime result comes from schema A. If you need the merged object, use `object(...)` with all fields directly.

**`Schemas[number]` requires a tuple, not a wide array**: When calling `union([a, b])`, TypeScript usually infers a tuple `[A, B]`. If you have a `Schema<unknown>[]` variable, the inferred output type is `Schema<unknown>[number]['_output']` = `unknown`. Pass schema literals directly for precise types.

## Exercise

1. Implement a `NullableSchema<T>` as a shorthand for `union([innerSchema, s.null()])`. Then `Infer<NullableSchema<StringSchema>>` = `string | null`.
2. Add a `discriminatedUnion(discriminant: string, schemas: ObjectSchema[])` that checks the discriminant field first before trying each schema — faster and with better error messages than the naïve union.
3. Implement intersection merge for objects: instead of returning only schema A's output, merge both objects' parsed results. Hint: you need to detect that both outputs are plain objects.
