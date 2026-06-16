# Sources: Lesson 13-recursive-types

**Lesson created**: 2026-05-23
**Currency**: versioned

## Primary sources

- [TypeScript 3.7 Release Notes — Recursive Type Aliases](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) — release note. Fetched 2026-05-23. Version checked: TypeScript 3.7.

## Cross-references

- [TypeScript Handbook: Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation (reference for `infer` in recursive contexts).

## Notes

The 3.7 release notes confirm that truly circular types (`type Foo = Foo`) are still rejected — only structurally-indirect recursion via a wrapping type constructor is allowed. They also include the VirtualNode tree example showing tuple recursion. The depth limit error ("Type instantiation is excessively deep") is an implementation constraint not documented in release notes — it is a known practical issue that should be flagged in lesson content with the intermediate-alias escape hatch.
