## ADDED Requirements

### Requirement: ZodUnion interface with distributive output
Koan 04 SHALL require the learner to define `ZodUnion<T extends Readonly<[ZodType, ...ZodType[]]>>` as an interface extending `ZodType` where the output type is derived by distributing over the tuple: `T[number]["_output"]`. This uses numeric index access on a tuple type to produce a union of all element types, then accesses `_output` on each member.

#### Scenario: Two-member union
- **WHEN** `z.infer<ZodUnion<[ZodString, ZodNumber]>>` is evaluated
- **THEN** it resolves to `string | number`

#### Scenario: Three-member union
- **WHEN** `z.infer<ZodUnion<[ZodString, ZodNumber, ZodBoolean]>>` is evaluated
- **THEN** it resolves to `string | number | boolean`

#### Scenario: Union with literal types
- **WHEN** `z.infer<ZodUnion<[ZodLiteral<'a'>, ZodLiteral<'b'>]>>` is evaluated
- **THEN** it resolves to `'a' | 'b'`

#### Scenario: Single-member union is valid
- **WHEN** `z.infer<ZodUnion<[ZodString]>>` is evaluated
- **THEN** it resolves to `string`

### Requirement: Union options accessor
`ZodUnion<T>` SHALL expose a readonly `options` property typed as `T`, so the tuple of member schemas is accessible for downstream composition.

#### Scenario: options has correct type
- **WHEN** a `ZodUnion<[ZodString, ZodNumber]>` value is in scope
- **THEN** `.options` has type `[ZodString, ZodNumber]`

### Requirement: Koan prose explanation
The koan 04 file SHALL open with a JSDoc prose block explaining: the difference between `T[number]` (index into a tuple to get a union of all element types) and a mapped type over `keyof T`, why Zod uses a tuple constraint `[ZodType, ...ZodType[]]` rather than just `ZodType[]` (requiring at least one member), and what "distribution" means here vs. distributive conditional types.

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `04-union.ts`
- **THEN** the explanation appears before any `TODO` stubs
