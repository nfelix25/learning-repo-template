## ADDED Requirements

### Requirement: string() Creates a StringSchema
`string(): StringSchema` SHALL return a `Schema<string>` whose `Infer` type is `string`.

#### Scenario: string schema infers correctly
- **WHEN** `type T = Infer<typeof string()>`
- **THEN** `T` equals `string`.

#### Scenario: string schema parse validates
- **WHEN** `string().parse("hello")` is called
- **THEN** the return value is `"hello"` with type `string`.

#### Scenario: string schema parse rejects non-string
- **WHEN** `string().parse(42)` is called
- **THEN** a `ParseError` is thrown.

### Requirement: number() Creates a NumberSchema
`number(): NumberSchema` SHALL return a `Schema<number>`.

#### Scenario: number schema infers correctly
- **WHEN** `type T = Infer<typeof number()>`
- **THEN** `T` equals `number`.

### Requirement: boolean() Creates a BooleanSchema
`boolean(): BooleanSchema` SHALL return a `Schema<boolean>`.

### Requirement: literal() Creates a LiteralSchema<T>
`literal<T extends string | number | boolean>(value: T): LiteralSchema<T>` SHALL return a `Schema<T>` that preserves the literal type.

#### Scenario: literal schema preserves literal type
- **WHEN** `type T = Infer<typeof literal("active")>`
- **THEN** `T` equals `"active"`, not `string`.

#### Scenario: literal schema parse validates exact value
- **WHEN** `literal("active").parse("inactive")` is called
- **THEN** a `ParseError` is thrown.

#### Scenario: literal schema parse accepts exact value
- **WHEN** `literal("active").parse("active")` is called
- **THEN** the return value is `"active"` with type `"active"`.
