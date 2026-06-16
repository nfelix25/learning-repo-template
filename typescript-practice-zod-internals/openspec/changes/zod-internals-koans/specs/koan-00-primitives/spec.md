## ADDED Requirements

### Requirement: ZodType phantom base interface
Koan 00 SHALL require the learner to define `ZodType<Output, Input = Output>` as an interface with two phantom properties: `readonly _output: Output` and `readonly _input: Input`. These properties SHALL use the definite assignment assertion (`!`) to signal they are never actually assigned at runtime — they exist only so TypeScript can read `T["_output"]` off any schema value via indexed access.

#### Scenario: _output is readable by indexed access
- **WHEN** a type `T extends ZodType<string>` is in scope
- **THEN** `T["_output"]` resolves to `string`

#### Scenario: Input defaults to Output
- **WHEN** `ZodType<string>` is written without a second type argument
- **THEN** `T["_input"]` also resolves to `string`

#### Scenario: Input can differ from Output
- **WHEN** `ZodType<number, string>` is declared
- **THEN** `T["_output"]` resolves to `number` and `T["_input"]` resolves to `string`

### Requirement: Primitive schema interfaces
Koan 00 SHALL require the learner to define `ZodString`, `ZodNumber`, `ZodBoolean`, `ZodNull`, and `ZodUndefined` as interfaces extending `ZodType` with the appropriate TypeScript primitive as their `Output` type.

#### Scenario: ZodString output is string
- **WHEN** `z.infer<ZodString>` is evaluated
- **THEN** it resolves to `string`

#### Scenario: ZodNumber output is number
- **WHEN** `z.infer<ZodNumber>` is evaluated
- **THEN** it resolves to `number`

#### Scenario: ZodBoolean output is boolean
- **WHEN** `z.infer<ZodBoolean>` is evaluated
- **THEN** it resolves to `boolean`

#### Scenario: ZodNull output is null
- **WHEN** `z.infer<ZodNull>` is evaluated
- **THEN** it resolves to `null`

#### Scenario: ZodUndefined output is undefined
- **WHEN** `z.infer<ZodUndefined>` is evaluated
- **THEN** it resolves to `undefined`

### Requirement: ZodLiteral generic interface
Koan 00 SHALL require the learner to define `ZodLiteral<T extends string | number | boolean>` as an interface extending `ZodType<T>`, preserving the literal type `T` (not widening it to `string | number | boolean`).

#### Scenario: String literal preserved
- **WHEN** `z.infer<ZodLiteral<'hello'>>` is evaluated
- **THEN** it resolves to `'hello'`, not `string`

#### Scenario: Numeric literal preserved
- **WHEN** `z.infer<ZodLiteral<42>>` is evaluated
- **THEN** it resolves to `42`, not `number`

### Requirement: z.infer namespace utility type
Koan 00 SHALL require the learner to define `z.infer<T extends ZodType<any, any>>` as a namespace-level type alias that extracts `T["_output"]` via indexed access. The file SHALL include a comment noting that this is the entirety of `z.infer`'s implementation — the phantom property does all the work.

#### Scenario: infer extracts output from any schema
- **WHEN** `z.infer<ZodString>` is evaluated
- **THEN** it resolves to `string`

#### Scenario: infer works on literal schemas
- **WHEN** `z.infer<ZodLiteral<true>>` is evaluated
- **THEN** it resolves to `true`

### Requirement: Koan prose explanation
The koan 00 file SHALL open with a JSDoc prose block explaining: what a phantom type is, why Zod chose phantom properties over a different encoding (e.g., a getter method), and what the `!` definite assignment assertion means in this context.

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `00-primitives.ts`
- **THEN** the explanation of the phantom type pattern appears before any `TODO` stubs

### Requirement: Primitives solution fallback file
`src/shared/primitives.solution.ts` SHALL export a complete, correct implementation of everything in koan 00 — `ZodType`, all primitive interfaces, `ZodLiteral`, and `z.infer` — so that koans 01–09 can import from it instead of from the learner's koan 00 file if needed.

#### Scenario: Solution file is importable
- **WHEN** a koan imports `{ ZodType, ZodString }` from `../shared/primitives.solution`
- **THEN** TypeScript resolves the types without error
