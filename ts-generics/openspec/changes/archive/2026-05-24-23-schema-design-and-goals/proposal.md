## Why

A schema validator that produces inferred TypeScript types (`z.infer<typeof schema>`) is one of the most sophisticated uses of TypeScript generics in the ecosystem. Understanding how Zod achieves this — and implementing a simplified version — is the best way to see `infer`, mapped types, and recursive types working together under real constraints.

## What Teaches

The `z.infer<typeof schema>` goal and how it works; designing `Schema<T>` as the core abstraction; API surface choices and their type-level implications; architectural overview of how Zod v4 achieves the same thing.

## Prereqs

- [19-result-type-design](../19-result-type-design/proposal.md)
- [07-infer](../07-infer/proposal.md)

## Success criterion

The test suite in `lessons/23-schema-design-and-goals/schema.test.ts` passes.
