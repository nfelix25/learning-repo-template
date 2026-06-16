## ADDED Requirements

### Requirement: ZodOptional interface
Koan 05 SHALL require the learner to define `ZodOptional<T extends ZodType>` as an interface where the Output is `T["_output"] | undefined` and the Input is `T["_input"] | undefined`. Both sides gain `| undefined` symmetrically — an optional field can be absent on both the way in and the way out.

#### Scenario: Optional string output
- **WHEN** `z.infer<ZodOptional<ZodString>>` is evaluated
- **THEN** it resolves to `string | undefined`

#### Scenario: Optional wrapping preserves inner type
- **WHEN** `z.infer<ZodOptional<ZodNumber>>` is evaluated
- **THEN** it resolves to `number | undefined`, not `number | null | undefined`

### Requirement: ZodNullable interface
Koan 05 SHALL require the learner to define `ZodNullable<T extends ZodType>` as an interface where the Output is `T["_output"] | null` and the Input is `T["_input"] | null`.

#### Scenario: Nullable string output
- **WHEN** `z.infer<ZodNullable<ZodString>>` is evaluated
- **THEN** it resolves to `string | null`

#### Scenario: Nullable does not add undefined
- **WHEN** `z.infer<ZodNullable<ZodNumber>>` is evaluated
- **THEN** it resolves to `number | null`, not `number | null | undefined`

### Requirement: ZodDefault interface with asymmetric Input/Output
Koan 05 SHALL require the learner to define `ZodDefault<T extends ZodType>` as an interface where the Output is `T["_output"]` (the default fills the gap — output is always present) but the Input is `T["_input"] | undefined` (the caller may omit the value). This is the first koan where Input and Output are structurally different, requiring explicit use of both type parameters on `ZodType<Output, Input>`.

#### Scenario: Default output is never undefined
- **WHEN** the Output type of `ZodDefault<ZodString>` is inspected
- **THEN** it resolves to `string`, not `string | undefined`

#### Scenario: Default input allows undefined
- **WHEN** the Input type of `ZodDefault<ZodString>` is inspected
- **THEN** it resolves to `string | undefined`

#### Scenario: z.infer reflects the output
- **WHEN** `z.infer<ZodDefault<ZodNumber>>` is evaluated
- **THEN** it resolves to `number` (the default is applied, output is definite)

### Requirement: Koan prose explanation
The koan 05 file SHALL open with a JSDoc prose block explaining: why `ZodOptional` and `ZodNullable` are different types rather than a single parameterized wrapper, what the asymmetry in `ZodDefault` means for callers (you can omit the field, but `.parse()` always hands you back a defined value), and why this is the first koan where the two type parameters of `ZodType<Output, Input>` carry different types.

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `05-optional-nullable-default.ts`
- **THEN** the explanation appears before any `TODO` stubs
