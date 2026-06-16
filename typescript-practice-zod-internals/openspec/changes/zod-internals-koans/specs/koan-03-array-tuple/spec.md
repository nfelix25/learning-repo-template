## ADDED Requirements

### Requirement: ZodArray interface
Koan 03 SHALL require the learner to define `ZodArray<T extends ZodType>` as an interface extending `ZodType` where the output type is `T["_output"][]`. This is the simplest composition pattern — wrapping one schema's output in an array.

#### Scenario: Array of strings
- **WHEN** `z.infer<ZodArray<ZodString>>` is evaluated
- **THEN** it resolves to `string[]`

#### Scenario: Array of objects
- **WHEN** `z.infer<ZodArray<ZodObject<{ id: ZodNumber }>>>` is evaluated
- **THEN** it resolves to `{ id: number }[]`

### Requirement: ZodTuple interface with variadic inference
Koan 03 SHALL require the learner to define `ZodTuple<T extends [ZodType, ...ZodType[]]>` as an interface extending `ZodType` where the output type maps over the tuple `T` to produce `{ [K in keyof T]: T[K] extends ZodType ? T[K]["_output"] : never }`. This mapped-type-over-tuple pattern is the key insight — TypeScript 4.0+ preserves tuple positions when you map over a tuple type, enabling per-position type inference.

#### Scenario: Two-element tuple
- **WHEN** `z.infer<ZodTuple<[ZodString, ZodNumber]>>` is evaluated
- **THEN** it resolves to `[string, number]`

#### Scenario: Three-element tuple preserves positions
- **WHEN** `z.infer<ZodTuple<[ZodBoolean, ZodString, ZodNumber]>>` is evaluated
- **THEN** it resolves to `[boolean, string, number]`

#### Scenario: Single-element tuple
- **WHEN** `z.infer<ZodTuple<[ZodString]>>` is evaluated
- **THEN** it resolves to `[string]`, not `string[]`

#### Scenario: Tuple with literal preserves literal type
- **WHEN** `z.infer<ZodTuple<[ZodLiteral<'start'>, ZodNumber]>>` is evaluated
- **THEN** it resolves to `['start', number]`

### Requirement: Koan prose explanation
The koan 03 file SHALL open with a JSDoc prose block explaining: why `ZodArray` is trivial (single indexed access) while `ZodTuple` requires a mapped type, what "homomorphic mapping over a tuple" means and why TypeScript preserves tuple positions in this case, and why the `T[K] extends ZodType ? ... : never` conditional is present (what it guards against).

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `03-array-tuple.ts`
- **THEN** the explanation appears before any `TODO` stubs
