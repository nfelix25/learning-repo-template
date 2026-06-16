# Sources: Lesson 13-variadic-tuple-types

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [Announcing TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.0. Variadic tuple types section: generic spreads in tuple syntax, rest elements at non-trailing positions (partial), labeled tuple elements, `tail` and `concat` examples.
- [Announcing TypeScript 4.2](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.2. Leading/middle rest elements section: one rest per tuple, valid and invalid examples, `[...string[], number]` pattern.

## Notes

TS 4.0 introduced the core variadic syntax. TS 4.2 completed it by allowing rest elements in leading and middle positions — not just trailing. Both version gates are relevant to this lesson. The typed `pipe` example exercises the most powerful form of variadic tuples and requires TS 4.0+ at minimum.
