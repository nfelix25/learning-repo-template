# Sources: Lesson 11-recursive-types

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [Announcing TypeScript 3.7](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/) — release note. Fetched 2026-05-24. Version checked: TypeScript 3.7. Contains the recursive type alias feature announcement with the `Json` and `VirtualNode` examples, and explains what was previously blocked.
- [Announcing TypeScript 4.1](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/) — release note. Fetched 2026-05-24. Version checked: TypeScript 4.1. Contains the recursive conditional types section with `ElementType` and `Awaited` examples, plus the critical depth-limit warning.

## Cross-references

- [TypeScript Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation. Current handbook coverage.

## Notes

Two distinct version gates: TS 3.7 (recursive aliases in object/array/tuple positions) and TS 4.1 (recursive conditional types). The TS 4.1 release notes explicitly warn that recursive conditional types "can do a lot of work" and may hit internal recursion depth limits. This warning should be cited directly in `lesson.md`. The tail recursion optimization behavior is not formally documented — it is an observable compiler behavior that the lesson should demonstrate empirically.
