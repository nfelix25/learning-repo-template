## Content manifest

### Outline

**Intro**: Production schemas need more than parse/reject. They need refinements — validations that don't change the type (`email()`, `minLength(3)`) — and transforms — post-parse conversions that change the type (`trim()` stays `string`, but `toDate()` converts `string` → `Date`). Adding transforms requires a new `_input` phantom field alongside `_output`, mirroring Zod v4's full design. This lesson adds these features and then examines where inference breaks down in complex schema graphs.

**Mechanic**:
- Refinements (`refine`): add a custom validation predicate that doesn't change the output type.
  ```
  schema.refine((value: T) => boolean, { message: string }): Schema<T>
  ```
  Returns a new `RefinedSchema<T>` wrapping the original. The output type is unchanged.
- Transforms (`transform`): change the output type after parsing.
  ```
  schema.transform<U>(fn: (value: T) => U): TransformSchema<T, U>
  ```
  `TransformSchema<T, U>` extends `Schema<U>` — the output type is now `U`, not `T`.
  The input type (before transform) is still `T`, which motivates the `_input` phantom field in full implementations.
- When TypeScript gives up:
  - Overly deep mapped type instantiations: the checker hits a recursion limit.
  - Circular inference in complex schema compositions: TypeScript may infer `unknown` or `never`.
  - Fix: intermediate named type aliases, explicit annotations on variables, `satisfies` to validate without widening.
- `--diagnostics` flag: `tsc --noEmit --diagnostics` reports type-checking time per file and total instantiation count. Useful for diagnosing perf cliffs.
- Zod v4 lessons: the distinction between `_input` and `_output` in Zod handles transforms; `z.input<typeof schema>` extracts the pre-transform type. This lesson shows why that design exists.

**Worked example**: Add `refine()` and `transform()` to the schema module. Implement `string().refine(s => s.includes("@"), { message: "must be email" })` and `string().transform(s => new Date(s))`. Verify that `Infer` extracts `Date` from the transformed schema.

**Pitfalls**: `transform` schemas have a semantic split between input and output types — important when using the schema for serialization vs parsing. Without an `_input` field, you can't express "accepts string, outputs Date" cleanly in the type system. TypeScript's `--diagnostics` flag measures compiler time, not runtime — a slow type check doesn't necessarily mean slow code.

**Exercise**: Add `refine()` and `transform()`. Write a `dateString` schema that accepts a string, refines it to validate ISO 8601 format, and transforms it to `Date`. Run `--diagnostics` on the full schema file and interpret the output.

### Build piece role

Round out the schema validator with transforms and refinements, then explore production-scale inference limits and the workarounds professionals reach for.

### Framing note

Capstone lesson. Connects everything. Frame as "what you will hit on the job and how experienced TypeScript authors work around it."
