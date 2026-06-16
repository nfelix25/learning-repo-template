## ADDED Requirements

### Requirement: union() Creates a UnionSchema
`union<Schemas extends Schema<unknown>[]>(schemas: Schemas): UnionSchema<Schemas>` SHALL return a schema whose output type is the union of all schemas' output types.

#### Scenario: union infers the output type union
- **WHEN** `type T = Infer<typeof union([string(), number()])>`
- **THEN** `T` equals `string | number`.

#### Scenario: union parse succeeds for any member type
- **WHEN** `union([string(), number()]).parse(42)` is called
- **THEN** the return value is `42` with type `string | number`.

#### Scenario: union parse rejects values matching no member
- **WHEN** `union([string(), number()]).parse(true)` is called
- **THEN** a `ParseError` is thrown.

#### Scenario: union parse tries schemas in order
- **WHEN** `union([literal("a"), string()]).parse("a")` is called
- **THEN** the first matching schema (`literal("a")`) succeeds and the return type reflects this.

### Requirement: intersection() Creates an IntersectionSchema
`intersection<A, B>(a: Schema<A>, b: Schema<B>): IntersectionSchema<A, B>` SHALL return a `Schema<A & B>`.

#### Scenario: intersection infers A & B
- **WHEN** `type T = Infer<typeof intersection(object({ a: string() }), object({ b: number() }))>`
- **THEN** `T` equals `{ a: string } & { b: number }`.

#### Scenario: intersection parse validates both schemas
- **WHEN** `intersection(object({ a: string() }), object({ b: number() })).parse({ a: "x", b: 1 })` is called
- **THEN** parse succeeds and returns the intersected value.

#### Scenario: intersection parse rejects values failing either schema
- **WHEN** `intersection(object({ a: string() }), object({ b: number() })).parse({ a: "x" })` is called
- **THEN** a `ParseError` is thrown because `b` is missing.
