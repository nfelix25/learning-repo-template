# Sources: Lesson 08-infer

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [TypeScript 2.8 Handbook Release Notes — Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) — official documentation. Fetched 2026-05-24. Version checked: TypeScript 2.8. Contains the covariant/contravariant infer position behavior with code examples (union for covariant, intersection for contravariant).
- [TypeScript Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) — official documentation. Fetched 2026-05-24. Covers basic `infer` usage, `ReturnType` pattern, and the overloaded-function last-signature caveat.

## Cross-references

- [GitHub PR #21496 — Type inference in conditional types](https://github.com/Microsoft/TypeScript/pull/21496) — original implementation PR by Anders Hejlsberg. Contains the design rationale for covariant/contravariant inference.
- [GitHub Issue #38039 — Inference for contravariant positions](https://github.com/microsoft/TypeScript/issues/38039) — community discussion on edge cases in contravariant position inference.

## Notes

The current handbook page covers only basic `infer` usage (array element extraction, `ReturnType`). The covariant→union / contravariant→intersection behavior — which is critical for understanding `infer` deeply — is documented exclusively in the TS 2.8 release notes. Cite both sources in `lesson.md`.
