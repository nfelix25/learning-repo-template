## ADDED Requirements

### Requirement: Discriminant key constraint type
Koan 07 SHALL require the learner to define a type that constrains which keys in a union member shape can serve as discriminants. A valid discriminant key `D` must exist in every member's shape AND must point to a `ZodLiteral` in every member. The learner SHALL express this constraint using a combination of `keyof` and a conditional check that each member's shape at key `D` extends `ZodLiteral<ZodLiteralValue>`.

#### Scenario: Literal key is a valid discriminant
- **WHEN** key `'type'` maps to `ZodLiteral<'circle'>` in every union member
- **THEN** `'type'` satisfies the discriminant constraint

#### Scenario: Non-literal key is not a valid discriminant
- **WHEN** key `'name'` maps to `ZodString` in a union member
- **THEN** `'name'` does NOT satisfy the discriminant constraint

### Requirement: ZodDiscriminatedUnion interface
Koan 07 SHALL require the learner to define `ZodDiscriminatedUnion<D extends string, T extends ZodObject<any>[]>` as an interface extending `ZodType` where the output is `T[number]["_output"]`. The discriminant key `D` is carried as a type parameter (not a value) and constrains what shapes are valid members.

#### Scenario: Infers union of member output types
- **WHEN** `z.infer<ZodDiscriminatedUnion<'type', [ZodObject<{type: ZodLiteral<'a'>}>, ZodObject<{type: ZodLiteral<'b'>}>]>>` is evaluated
- **THEN** it resolves to `{ type: 'a' } | { type: 'b' }`

#### Scenario: Discriminant key is accessible as type parameter
- **WHEN** a `ZodDiscriminatedUnion<'kind', [...]>` is in scope
- **THEN** the discriminant key `'kind'` is expressible as a type-level string literal

### Requirement: Koan prose explanation
The koan 07 file SHALL open with a JSDoc prose block explaining: what a discriminated union is at the TypeScript level (a union where one shared literal property narrows the type), why Zod models this as a separate schema type rather than a plain `ZodUnion`, and what the type-level constraint on `D` is trying to enforce (all members must have a literal at that key — without this, runtime narrowing would be ambiguous).

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `07-discriminated-union.ts`
- **THEN** the explanation appears before any `TODO` stubs
