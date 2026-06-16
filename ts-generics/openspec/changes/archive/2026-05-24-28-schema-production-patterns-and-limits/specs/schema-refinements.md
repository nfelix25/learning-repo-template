## ADDED Requirements

### Requirement: refine() Adds Custom Validation Without Changing the Output Type
`Schema<T>.refine(predicate: (value: T) => boolean, options: { message: string }): Schema<T>` SHALL return a new schema with the same output type `T` that additionally enforces the predicate.

#### Scenario: refine preserves the output type
- **WHEN** `type T = Infer<typeof string().refine(s => s.includes("@"), { message: "email" })>`
- **THEN** `T` equals `string`.

#### Scenario: refine parse rejects values failing the predicate
- **WHEN** `string().refine(s => s.length > 3, { message: "too short" }).parse("hi")` is called
- **THEN** a `ParseError` is thrown with the message `"too short"`.

#### Scenario: refine parse accepts values passing the predicate
- **WHEN** `string().refine(s => s.length > 3, { message: "too short" }).parse("hello")` is called
- **THEN** the return value is `"hello"` with type `string`.

### Requirement: transform() Changes the Output Type After Parsing
`Schema<T>.transform<U>(fn: (value: T) => U): Schema<U>` SHALL return a new schema whose output type is `U`, applying `fn` to the parsed value.

#### Scenario: transform changes the inferred output type
- **WHEN** `type T = Infer<typeof string().transform(s => s.length)>`
- **THEN** `T` equals `number`.

#### Scenario: transform parse applies the function after validation
- **WHEN** `string().transform(s => s.toUpperCase()).parse("hello")` is called
- **THEN** the return value is `"HELLO"` with type `string`.

#### Scenario: transform can change the type entirely
- **WHEN** `string().transform(s => new Date(s)).parse("2026-05-23")` is called
- **THEN** the return value has type `Date`.

### Requirement: refine and transform are composable
`refine` and `transform` SHALL be chainable in any order.

#### Scenario: refine then transform works correctly
- **WHEN** `string().refine(s => s.length > 0, { message: "empty" }).transform(s => parseInt(s, 10)).parse("42")` is called
- **THEN** the return value is `42` with type `number`.
