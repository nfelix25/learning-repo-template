# Sources: Lesson 12-advanced-inference-patterns

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [Announcing TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.0. Contains the variadic tuple types section: generic spreads, rest elements in non-trailing positions, labeled tuple elements, and the `concat`/`tail` examples.
- [Announcing TypeScript 4.2](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.2. Contains the leading/middle rest elements section: one rest per tuple, no optional after rest, `[...string[], number]` examples.

## Notes

Variadic tuple types shipped in TS 4.0 with rest elements in non-trailing positions partially supported. TypeScript 4.2 completed the feature by allowing rest elements at leading and middle positions subject to the one-rest-per-tuple constraint. Both release notes should be cited when discussing rest element positions.
