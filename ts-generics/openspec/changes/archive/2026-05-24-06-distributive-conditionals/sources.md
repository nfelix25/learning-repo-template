# Sources: Lesson 06-distributive-conditionals

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript Handbook: Conditional Types — Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation. Fetched 2026-05-23.
- [TypeScript 2.8 Release Notes — Distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 2.8.

## Notes

The handbook covers distribution and suppression. The 2.8 release notes include the original examples showing how `Diff<T, U>` and `Filter<T, U>` work via distribution. Both sources confirm the `[T] extends [U]` suppression pattern.
