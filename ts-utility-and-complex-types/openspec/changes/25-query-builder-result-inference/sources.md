# Sources: Lesson 25-query-builder-result-inference

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [Announcing TypeScript 4.1](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.1. Contains both the template literal types section (with `infer` in template positions) and the recursive conditional types section. Both features are required by `ExecuteResult`.
- [TypeScript Handbook — Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) — official documentation. Fetched 2026-05-24. Full coverage of template literal syntax, union distribution, intrinsic string types, and `infer` in template positions with the `PropEventSource` example.
- [TypeScript Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation. Fetched 2026-05-24. Covers `infer` basics and the recursive conditional type pattern.

## Notes

Both template literal `infer` and recursive conditional types require TypeScript 4.1+. TypeScript 4.1 was released November 2020 — any modern TypeScript project will have these features. The TS 4.1 release notes explicitly warn that recursive conditional types "can do a lot of work" and may hit depth limits. `ExecuteResult` is recursive over the selected column union — for very wide selections (many columns), consider a non-recursive mapped type approach as an alternative.
