## ADDED Requirements

### Requirement: ZodEffects interface with three-parameter signature
Koan 06 SHALL require the learner to define `ZodEffects<T extends ZodType, Output, Input = T["_input"]>` as an interface extending `ZodType<Output, Input>`. This is a wrapper schema that applies a transformation: it takes a base schema `T` (whose output feeds the transform function), produces a new `Output` type, and preserves the original `Input` type from `T`. The third type parameter `Input` defaults to `T["_input"]` because the transform does not change what callers hand in.

#### Scenario: Transform changes output type
- **WHEN** `ZodEffects<ZodString, number>` represents `.transform(s => parseInt(s))`
- **THEN** `z.infer` resolves to `number`

#### Scenario: Transform preserves original input type
- **WHEN** the Input type of `ZodEffects<ZodString, number>` is inspected
- **THEN** it resolves to `string` (callers still pass a string)

#### Scenario: Transform can output same type
- **WHEN** `ZodEffects<ZodString, string>` represents `.transform(s => s.trim())`
- **THEN** `z.infer` resolves to `string` and the Input is also `string`

### Requirement: Chained ZodEffects
`ZodEffects` SHALL be composable — `ZodEffects<ZodEffects<ZodString, number>, Date>` SHALL correctly reflect a two-step transform where the Input is `string` (the original) and the Output is `Date` (the final).

#### Scenario: Chained transform has correct outer Output
- **WHEN** `z.infer<ZodEffects<ZodEffects<ZodString, number>, Date>>` is evaluated
- **THEN** it resolves to `Date`

#### Scenario: Chained transform preserves original Input
- **WHEN** the Input of `ZodEffects<ZodEffects<ZodString, number>, Date>` is inspected
- **THEN** it resolves to `string`

### Requirement: Koan prose explanation
The koan 06 file SHALL open with a JSDoc prose block explaining: why Zod uses a separate `ZodEffects` class rather than adding `.transform()` as a method that mutates the schema's type parameters in place, what the three type parameters represent and why `Input` defaults to `T["_input"]`, and how this koan brings together everything learned in koans 00–05 (phantom types, the Input/Output distinction, generic constraints).

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `06-effects-transform.ts`
- **THEN** the explanation appears before any `TODO` stubs
