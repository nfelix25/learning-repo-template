## ADDED Requirements

### Requirement: ZodRawShape constraint type
Koan 01 SHALL require the learner to define `ZodRawShape` as a type alias constraining an object where every value is a `ZodType`. This type is the upper bound for `ZodObject`'s generic parameter — it is what makes it possible to index into the shape and read `_output` off each field.

#### Scenario: ZodRawShape accepts object of schemas
- **WHEN** `{ name: ZodString; age: ZodNumber }` is checked against `ZodRawShape`
- **THEN** TypeScript accepts the assignment

#### Scenario: ZodRawShape rejects non-schema values
- **WHEN** `{ name: string }` is checked against `ZodRawShape`
- **THEN** TypeScript reports a type error (string is not a ZodType)

### Requirement: ZodObjectOutput mapped type
Koan 01 SHALL require the learner to define `ZodObjectOutput<T extends ZodRawShape>` as a mapped type that iterates over `keyof T` and for each key `K`, produces `T[K]["_output"]`. This is the core unwrapping operation — it transforms a shape of schemas into a plain object type.

#### Scenario: Unwraps single field
- **WHEN** `ZodObjectOutput<{ name: ZodString }>` is evaluated
- **THEN** it resolves to `{ name: string }`

#### Scenario: Unwraps multiple fields with different types
- **WHEN** `ZodObjectOutput<{ name: ZodString; age: ZodNumber; active: ZodBoolean }>` is evaluated
- **THEN** it resolves to `{ name: string; age: number; active: boolean }`

#### Scenario: Unwraps nested literal
- **WHEN** `ZodObjectOutput<{ status: ZodLiteral<'active'> }>` is evaluated
- **THEN** it resolves to `{ status: 'active' }`

### Requirement: ZodObject interface
Koan 01 SHALL require the learner to define `ZodObject<T extends ZodRawShape>` as an interface extending `ZodType<ZodObjectOutput<T>>`. It SHALL expose a readonly `shape` property typed as `T` so downstream code can inspect the raw schema shape. The `z.infer` utility SHALL correctly extract the output type via the phantom property.

#### Scenario: infer extracts correct object type
- **WHEN** `z.infer<ZodObject<{ id: ZodNumber; label: ZodString }>>` is evaluated
- **THEN** it resolves to `{ id: number; label: string }`

#### Scenario: shape property is accessible
- **WHEN** a `ZodObject<T>` value is in scope
- **THEN** `.shape` has type `T`

### Requirement: Koan prose explanation
The koan 01 file SHALL open with a JSDoc prose block explaining: what a "raw shape" is and why it needs a generic constraint, why the mapped type uses indexed access on `_output` rather than a conditional type, and the significance of homomorphic mapped types (preserving optionality from the source).

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `01-object-shape.ts`
- **THEN** the explanation appears before any `TODO` stubs
