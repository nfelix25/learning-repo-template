## ADDED Requirements

### Requirement: ZodLazy interface with getter-based deferral
Koan 09 SHALL require the learner to define `ZodLazy<T extends ZodType>` as an interface extending `ZodType<T["_output"], T["_input"]>` that holds a `schema` getter returning `T`. The getter (rather than a plain property) is the mechanism for deferral — TypeScript evaluates the return type lazily when the getter is accessed, which breaks infinite recursion at the type level.

#### Scenario: ZodLazy output matches inner schema output
- **WHEN** `z.infer<ZodLazy<ZodString>>` is evaluated
- **THEN** it resolves to `string`

#### Scenario: schema getter returns the inner schema type
- **WHEN** a `ZodLazy<ZodObject<{ id: ZodNumber }>>` is in scope
- **THEN** `.schema` has type `ZodObject<{ id: ZodNumber }>`

### Requirement: Recursive type alias via interface
Koan 09 SHALL require the learner to demonstrate how a recursive JSON-like type can be expressed using `ZodLazy` with an `interface` rather than a `type` alias. The koan SHALL include a worked example showing why `type Category = ZodObject<{ subcategories: ZodArray<Category> }>` fails (circular type alias) while using an interface with `ZodLazy` succeeds.

#### Scenario: Recursive tree type compiles
- **WHEN** a recursive schema is defined using `ZodLazy` and an interface
- **THEN** TypeScript accepts the definition without a "Type alias circularly references itself" error

#### Scenario: Inferred recursive type is correct at the first level
- **WHEN** `z.infer` is applied to a recursive category schema
- **THEN** the top-level output type has the expected properties

### Requirement: Koan prose explanation
The koan 09 file SHALL open with a JSDoc prose block explaining: why `type` aliases fail for recursive schemas (TypeScript expands them eagerly and hits infinite recursion) while `interface` declarations succeed (TypeScript treats interface members lazily), what role `ZodLazy`'s getter plays in deferring schema resolution, and how this pattern mirrors how TypeScript itself handles recursive type structures like `JSON`.

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `09-lazy-recursive.ts`
- **THEN** the explanation appears before any `TODO` stubs
