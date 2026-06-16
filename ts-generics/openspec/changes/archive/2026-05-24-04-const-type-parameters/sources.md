# Sources: Lesson 04-const-type-parameters

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript 5.0 Release Notes — const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 5.0.

## Cross-references

- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) — official documentation.

## Notes

The release notes confirm the critical gotcha: mutable constraints (`T extends string[]`) silently negate the `const` modifier. The fix is always `readonly` constraints (`T extends readonly string[]`). Variables declared before the call site are unaffected by `const` type params — literal narrowing only applies to inline expressions.
