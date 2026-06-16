# Sources: Lesson 14-variadic-tuple-types

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript 4.0 Release Notes — Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 4.0.

## Cross-references

- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) — official documentation.

## Notes

The 4.0 release notes contain the canonical `tail`, `concat`, and `partialCall` examples. The `partialCall` example is particularly illustrative — it shows how variadic spreads eliminate "death by a thousand overloads" for partial application. The notes also describe the unbounded spread behavior when `T` is `unknown[]` rather than a fixed-length tuple.
