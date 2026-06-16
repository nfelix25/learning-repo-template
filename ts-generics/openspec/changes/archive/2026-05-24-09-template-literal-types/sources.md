# Sources: Lesson 09-template-literal-types

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript Handbook: Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) — official documentation. Fetched 2026-05-23.
- [TypeScript 4.1 Release Notes — Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 4.1 (original introduction).

## Notes

The handbook and 4.1 release notes are consistent on the cross-product behavior and inference from template literal patterns. Note that intrinsic string manipulation types (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`) use JavaScript's non-locale-aware string methods — this is documented in both sources and is worth calling out as a gotcha for internationalized codebases.
