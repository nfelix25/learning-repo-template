## Content manifest

### Outline

**Intro**: `object({ name: string(), age: number() })` should produce a `Schema<{ name: string, age: number }>`. The output type is derived from the shape parameter using a mapped type — the same pattern as `Partial<T>`, but applied to a record of schemas rather than a record of values.

**Mechanic**:
- Shape type: `type ObjectShape = Record<string, Schema<unknown>>`.
- `ObjectSchema<Shape extends ObjectShape>` extends `Schema<OutputOf<Shape>>`.
- Output type extraction:
  ```
  type OutputOf<Shape extends ObjectShape> = {
    [K in keyof Shape]: Shape[K]["_output"]
  }
  ```
  This is a homomorphic mapped type — it copies optional modifiers from the shape.
- Optional fields: `optional<T>(schema: Schema<T>): Schema<T | undefined>` — wrapping a schema makes its output type `T | undefined`. The mapped type then naturally makes that key optional in practice.
- `partial()` method on `ObjectSchema`: returns a new `ObjectSchema` with all fields wrapped in `optional()`.
- `pick<K extends keyof Shape>(keys: K[]): ObjectSchema<Pick<Shape, K>>` and `omit<K extends keyof Shape>(keys: K[]): ObjectSchema<Omit<Shape, K>>`.
- Validation: iterate over the shape's keys, parse each value against the corresponding schema, collect errors.

**Worked example**: Implement `ObjectSchema<Shape>` and verify that `Infer<typeof object({ name: string(), age: number() })>` equals `{ name: string; age: number }`. Show `partial()` producing `{ name?: string; age?: number }`.

**Pitfalls**: The mapped type `{ [K in keyof Shape]: Shape[K]["_output"] }` copies optional modifiers from the shape — but the shape's keys are never optional (every key in `Shape` has a `Schema<T>` value). Optional output fields require explicit marking via `optional()` wrapping. Excess property checking applies to shape definitions — passing extra keys not in `ObjectShape` constraint is an error.

**Exercise**: Implement `ObjectSchema<Shape>`, `optional<T>()`, `partial()`, `pick()`, and `omit()`. Write end-to-end tests verifying type inference for all methods.

### Build piece role

Implement `z.object()` with mapped type inference for the full output shape, including optional field handling.
