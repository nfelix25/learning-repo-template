## ADDED Requirements

### Requirement: object() Creates an ObjectSchema
`object<Shape extends ObjectShape>(shape: Shape): ObjectSchema<Shape>` SHALL return a schema whose output type is `{ [K in keyof Shape]: Shape[K]["_output"] }`.

#### Scenario: object infers the output type from the shape
- **WHEN** `type T = Infer<typeof object({ name: string(), age: number() })>`
- **THEN** `T` equals `{ name: string; age: number }`.

#### Scenario: object parse validates each field
- **WHEN** `object({ name: string() }).parse({ name: "Alice" })` is called
- **THEN** the return value is `{ name: "Alice" }` with the correct inferred type.

#### Scenario: object parse rejects missing required field
- **WHEN** `object({ name: string() }).parse({})` is called
- **THEN** a `ParseError` is thrown.

### Requirement: optional() Wraps a Schema to Allow Undefined
`optional<T>(schema: Schema<T>): Schema<T | undefined>` SHALL return a schema that accepts `T` or `undefined`.

#### Scenario: optional infers T | undefined
- **WHEN** `type T = Infer<typeof optional(string())>`
- **THEN** `T` equals `string | undefined`.

### Requirement: ObjectSchema.partial() Makes All Fields Optional
`ObjectSchema<Shape>.partial(): ObjectSchema<{ [K in keyof Shape]: OptionalSchema<Shape[K]> }>` SHALL return a new schema with all fields wrapped in `optional()`.

#### Scenario: partial makes all fields optional in the output type
- **WHEN** `type T = Infer<typeof object({ name: string(), age: number() }).partial()>`
- **THEN** `T` equals `{ name?: string; age?: number }`.

### Requirement: ObjectSchema.pick() Selects a Subset of Fields
`ObjectSchema<Shape>.pick<K extends keyof Shape>(keys: readonly K[]): ObjectSchema<Pick<Shape, K>>` SHALL return a schema with only the selected fields.

### Requirement: ObjectSchema.omit() Removes Fields
`ObjectSchema<Shape>.omit<K extends keyof Shape>(keys: readonly K[]): ObjectSchema<Omit<Shape, K>>` SHALL return a schema with the specified fields removed.
