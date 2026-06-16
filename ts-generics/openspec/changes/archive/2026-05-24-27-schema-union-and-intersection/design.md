## Content manifest

### Outline

**Intro**: `union([string(), number()])` should parse strings and numbers and produce `Schema<string | number>`. `intersection(object({ a: string() }), object({ b: number() }))` should produce `Schema<{ a: string } & { b: number }>`. Both require type-level extraction — using `infer` and distribution for union, mapped types for intersection.

**Mechanic**:
- Union output type extraction:
  ```
  type UnionOutput<Schemas extends Schema<unknown>[]> =
    Schemas[number]["_output"]
  ```
  `Schemas[number]` distributes over the array elements (it's an index access producing a union), then `["_output"]` extracts each element's output type — producing the union of output types.
- `UnionSchema<Schemas extends Schema<unknown>[]>` extends `Schema<UnionOutput<Schemas>>`:
  - `parse`: try each schema in order, return the first that succeeds. Throws if all fail.
  - Type inference: `union([string(), number()])` → `UnionSchema<[StringSchema, NumberSchema]>` → `Schema<string | number>`.
- Intersection output type: `type IntersectionOutput<A, B> = A & B`.
- `IntersectionSchema<A, B>` extends `Schema<A & B>`:
  - `parse`: parse with schema A first, then validate the result against schema B (or re-parse with B — depends on whether schemas are composable).
  - Output type is the intersection of the two schemas' output types.
- Discriminated unions: if all schemas in the union have a `literal()` field at the same key, TypeScript can infer the discriminant automatically — but implementing discriminated union optimization is optional for this lesson.

**Worked example**: Implement `UnionSchema<Schemas>` and `IntersectionSchema<A, B>`. Verify `Infer<typeof union([string(), number()])>` = `string | number`. Verify `Infer<typeof intersection(object({ a: string() }), object({ b: number() }))>` = `{ a: string } & { b: number }`.

**Pitfalls**: `Schemas[number]` distributes over the array but loses positional information — fine for union types, but not for collecting values (which is why `Result.all` needed variadic tuples). Intersection of schemas with overlapping keys requires careful parse order — validate the full input against both schemas.

**Exercise**: Implement `union()` and `intersection()`. Write a discriminated union schema for `{ type: "success"; data: string } | { type: "error"; message: string }` using `union` + `object` + `literal`. Verify type narrowing works after a runtime check.

### Build piece role

Implement union and intersection schemas, applying conditional type inference from lesson 06 in a concrete library context.
