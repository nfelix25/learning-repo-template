# Sources: Lesson 11-explicit-resource-management

**Lesson created**: 2026-05-23
**Currency**: frontier

## Primary sources

- [TC39 Explicit Resource Management Proposal](https://tc39.es/proposal-explicit-resource-management/) — specification. Fetched 2026-05-23. Stage: 4.
- [TypeScript 5.2 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html) — official docs. Fetched 2026-05-23. Version checked: TypeScript 5.2.
- [Node.js Globals — using](https://nodejs.org/api/globals.html#using-in-nodejs) — official docs. Fetched 2026-05-23. Version checked: Node 20.4+.

## Notes

`DisposableStack` and `AsyncDisposableStack` are available as globals in Node 20.4+ and in TypeScript's type definitions from 5.2. Browsers vary — check `globalThis.DisposableStack` before relying on it without a polyfill. The TC39 proposal reached stage 4 in 2023; it's shipping but tooling support is still maturing.
