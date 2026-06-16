# Sources: Lesson 18-react-type-patterns

**Lesson created**: 2026-05-24
**Currency**: versioned

## Primary sources

- [forwardRef — React](https://react.dev/reference/react/forwardRef) — official documentation. Fetched 2026-05-24. Contains the deprecation notice for React 19 and the ref-as-prop replacement pattern.
- [Using TypeScript — React](https://react.dev/learn/typescript) — official documentation. Fetched 2026-05-24. Covers component prop typing, discriminated unions in React context, hooks typing, and common `@types/react` utility types.
- [React v19 Release Blog](https://react.dev/blog/2024/12/05/react-19) — release note. Fetched 2026-05-24. Documents the `forwardRef` deprecation, ref-as-prop introduction, and TypeScript breaking changes.

## Notes

**Critical version split**: React 19 (December 2024) deprecated `forwardRef`. The `@types/react` v18 and v19 packages have meaningfully different type signatures for `forwardRef`. The lesson must cover both patterns clearly labeled by React version, since many production codebases are still on React 18. The `types-react-codemod` package exists to automate the migration but is out of scope for this lesson. The official React docs do not provide detailed TypeScript patterns for polymorphic `as`-prop or HOC typing — those sections of the lesson draw on the type-level patterns from earlier koan lessons.
