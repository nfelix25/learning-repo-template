## ADDED Requirements

### Requirement: Schema<T> Is the Core Abstraction
`Schema<T>` SHALL be a generic type (class or interface) with a phantom `_output: T` field and a `parse(input: unknown): T` method.

#### Scenario: Schema preserves T in the type system
- **WHEN** a value has type `Schema<string>`
- **THEN** `schema._output` has type `string` (even though it has no runtime value).

#### Scenario: Schema.parse is typed to return T
- **WHEN** a `Schema<number>` is used
- **THEN** `schema.parse(x)` has return type `number`.

### Requirement: Infer<S> Extracts the Output Type
`type Infer<S extends Schema<unknown>> = S["_output"]` SHALL extract the output type `T` from any `Schema<T>`.

#### Scenario: Infer extracts string from Schema<string>
- **WHEN** `Infer<Schema<string>>` is evaluated
- **THEN** the resulting type is `string`.

#### Scenario: Infer extracts complex types correctly
- **WHEN** `Infer<Schema<{ id: number; name: string }>>` is evaluated
- **THEN** the resulting type is `{ id: number; name: string }`.

### Requirement: ParseError Represents Validation Failure
`ParseError` SHALL be a named type (class or interface) with at least a `message: string` field, usable as the error type in `Result<ParseError, T>`.

#### Scenario: ParseError is structurally compatible with Error
- **WHEN** `ParseError` is used in `Result<ParseError, string>`
- **THEN** it is accepted by the Result module's error channel.
