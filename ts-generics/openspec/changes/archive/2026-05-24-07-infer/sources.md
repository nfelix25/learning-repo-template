# Sources: Lesson 07-infer

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript Handbook: Conditional Types — Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation. Fetched 2026-05-23.
- [TypeScript 2.8 Release Notes — Type inference in conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 2.8 (original `infer` introduction).
- [TypeScript 4.7 Release Notes — extends constraints on infer type variables](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 4.7.

## Notes

The 2.8 release notes explicitly document the covariant/contravariant merging behavior: co-variant positions yield union, contra-variant positions yield intersection. This is an important and non-obvious rule covered in the source. The 4.7 release notes cover `infer S extends string` constraints that eliminate boilerplate nested conditionals.
