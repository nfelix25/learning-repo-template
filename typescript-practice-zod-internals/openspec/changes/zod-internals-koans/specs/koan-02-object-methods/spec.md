## ADDED Requirements

### Requirement: ZodObject partial method type signature
Koan 02 SHALL require the learner to add a `.partial()` method signature to `ZodObject<T>` that returns a new `ZodObject` where every field in `T` has been wrapped in `ZodOptional`. The return type SHALL be expressed as a mapped type over `keyof T`, not hardcoded.

#### Scenario: partial makes all fields optional in the output
- **WHEN** `z.infer<ZodObject<{ name: ZodString; age: ZodNumber }>.partial()>` is evaluated
- **THEN** it resolves to `{ name?: string; age?: number }`

#### Scenario: partial wraps each value in ZodOptional
- **WHEN** the `.partial()` return type is inspected
- **THEN** its shape type is `{ [K in keyof T]: ZodOptional<T[K]> }`

### Requirement: ZodObject pick method type signature
Koan 02 SHALL require the learner to add a `.pick<K extends keyof T>(mask: { [P in K]: true })` method signature to `ZodObject<T>` that returns a new `ZodObject` containing only the keys in `K`. The mask parameter pattern (an object of `true` values keyed by `K`) matches Zod's actual API.

#### Scenario: pick narrows to selected keys
- **WHEN** `.pick({ name: true })` is called on `ZodObject<{ name: ZodString; age: ZodNumber }>`
- **THEN** the return type is `ZodObject<{ name: ZodString }>`

#### Scenario: pick excludes omitted keys
- **WHEN** `z.infer` is applied to the picked schema
- **THEN** the result type does not include the unpicked fields

### Requirement: ZodObject omit method type signature
Koan 02 SHALL require the learner to add a `.omit<K extends keyof T>(mask: { [P in K]: true })` method signature that returns a new `ZodObject` with the selected keys removed. The return shape SHALL use `Omit<T, K>`.

#### Scenario: omit removes selected keys
- **WHEN** `.omit({ age: true })` is called on `ZodObject<{ name: ZodString; age: ZodNumber }>`
- **THEN** the return type is `ZodObject<{ name: ZodString }>`

### Requirement: ZodObject extend method type signature
Koan 02 SHALL require the learner to add an `.extend<U extends ZodRawShape>(shape: U)` method signature that returns a new `ZodObject` whose shape is the intersection of `T` and `U`. When keys overlap, `U` wins (its types replace `T`'s types for those keys), matching Zod's behavior.

#### Scenario: extend adds new fields
- **WHEN** `.extend({ email: ZodString })` is called on `ZodObject<{ name: ZodString }>`
- **THEN** the result shape includes both `name: ZodString` and `email: ZodString`

#### Scenario: extend overrides overlapping keys
- **WHEN** `.extend({ name: ZodNumber })` is called on `ZodObject<{ name: ZodString }>`
- **THEN** the result shape has `name: ZodNumber`

### Requirement: ZodObject merge method type signature
Koan 02 SHALL require the learner to add a `.merge<U extends ZodObject<any>>(other: U)` method signature that returns a new `ZodObject` merging the two shapes. Unlike `.extend()`, `.merge()` takes a full `ZodObject` rather than a raw shape, reflecting the difference between accepting a raw shape literal vs. an already-constructed schema.

#### Scenario: merge combines two object schemas
- **WHEN** `ZodObject<{ a: ZodString }>` is merged with `ZodObject<{ b: ZodNumber }>`
- **THEN** the result is `ZodObject<{ a: ZodString; b: ZodNumber }>`

### Requirement: Koan prose explanation
The koan 02 file SHALL open with a JSDoc prose block explaining: why Zod returns a new `ZodObject` instance from each method rather than mutating, what the difference between `.extend()` and `.merge()` is at the type level and why both exist, and how the `{ [K in Pick<...>]: ... }` pattern differs from `Omit`/`Pick` utility types.

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `02-object-methods.ts`
- **THEN** the explanation appears before any `TODO` stubs
