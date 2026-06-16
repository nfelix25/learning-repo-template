## ADDED Requirements

### Requirement: BRAND symbol and brand intersection type
Koan 08 SHALL require the learner to define a unique `BRAND` symbol (using `declare const BRAND: unique symbol`) and a `Brand<T, B extends string>` type that intersects `T` with `{ readonly [BRAND]: { readonly [K in B]: K } }`. Using a unique symbol (rather than a string key like `__brand`) makes the brand property un-constructible from userland — you can't accidentally create a branded value without going through the schema.

#### Scenario: Brand intersection is not plain T
- **WHEN** `Brand<string, 'UserId'>` is inspected
- **THEN** it is NOT assignable from `string` alone

#### Scenario: Branded value is assignable to base type
- **WHEN** a `Brand<string, 'UserId'>` value is in scope
- **THEN** it IS assignable to `string`

### Requirement: ZodBranded interface
Koan 08 SHALL require the learner to define `ZodBranded<T extends ZodType, B extends string>` as an interface extending `ZodType` where the output is `Brand<T["_output"], B>` and the input is `T["_input"]` (unchanged — you still pass a plain value in, you get a branded value out).

#### Scenario: Branded string output
- **WHEN** `z.infer<ZodBranded<ZodString, 'UserId'>>` is evaluated
- **THEN** it resolves to `string & { readonly [BRAND]: { readonly UserId: 'UserId' } }` (or equivalent brand intersection)

#### Scenario: Branded value is not assignable to different brand
- **WHEN** `ZodBranded<ZodString, 'UserId'>` output and `ZodBranded<ZodString, 'PostId'>` output are compared
- **THEN** a `UserId` is NOT assignable to `PostId`

#### Scenario: Input remains unbranded
- **WHEN** the Input type of `ZodBranded<ZodString, 'UserId'>` is inspected
- **THEN** it resolves to `string` (callers pass plain strings)

### Requirement: Koan prose explanation
The koan 08 file SHALL open with a JSDoc prose block explaining: the difference between structural and nominal typing in TypeScript, why Zod uses a `unique symbol` as the brand key rather than a string property name, what problem branded types solve at compile time (preventing `userId` from being passed where `postId` is expected even though both are `string` at runtime), and why `Input` stays as `T["_input"]` (you can't call `.parse()` with a branded value — you produce branded values, you don't consume them as input).

#### Scenario: Prose present before stubs
- **WHEN** a developer opens `08-branded.ts`
- **THEN** the explanation appears before any `TODO` stubs
