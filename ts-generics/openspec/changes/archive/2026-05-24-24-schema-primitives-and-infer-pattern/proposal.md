## Why

The first concrete test of the `Schema<T>` design is implementing the simplest schemas — `string()`, `number()`, `boolean()`, `literal()` — and verifying that `Infer<typeof schema>` extracts the correct type end-to-end. This lesson makes the phantom type pattern real and tests whether the class-based design allows TypeScript to infer the generic parameter at construction.

## What Teaches

Implementing string, number, boolean, and literal schemas; wiring up `z.infer<typeof schema>` extraction end-to-end; the class vs plain-object representation tradeoff; TypeScript inference of generic class instances.

## Prereqs

- [23-schema-design-and-goals](../23-schema-design-and-goals/proposal.md)

## Success criterion

The test suite in `lessons/24-schema-primitives-and-infer-pattern/schema.test.ts` passes (new tests added, prior schema tests remain live).
