## Context

A net-new personal learning project. No existing codebase, no external stakeholders, no deployment concerns. The only "system" is a TypeScript project where `tsc --noEmit` is the entire test runner. Design decisions are about curriculum architecture and file conventions, not service topology.

## Goals / Non-Goals

**Goals:**
- A koan per concept: theory commentary + blank type alias + compile-time tests in a single `.ts` file
- Progressive difficulty — each module builds vocabulary introduced by the previous one
- Feedback loop is purely `tsc --noEmit`: red = unsolved, clean = solved
- Self-contained: cloning the repo and running `tsc` is the entire setup

**Non-Goals:**
- Runtime tests, test runners, or Jest/Vitest
- Teaching value-level TypeScript (classes, decorators, async patterns)
- Being a reference implementation — comments are the curriculum, not docs
- Supporting multiple TypeScript versions

## Decisions

### Blank placeholder convention
Use `type TODO = any` in `src/utils/index.ts`. Koans import and use `TODO` as their placeholder. The learner replaces `TODO` with their answer. Using `any` as the default means the blank is syntactically valid but semantically wrong — `Equal<TODO, never>` fails because `any` does not equal `never` under the strict `Equal` implementation.

**Alternatives considered:**
- `type __ = never`: Confusing because `never` is often the *correct* answer.
- Leaving a syntax error (literal `___`): Causes cascading errors that obscure which tests are actually failing.
- `unique symbol` placeholder: More complex than needed.

### Equal<A, B> implementation
Use the "deferred conditional" trick, not the naive `A extends B ? B extends A ? true : false` version:

```typescript
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
```

This handles the `any` edge case correctly (`Equal<any, string>` returns `false`, not `true`). The naive version would make `TODO`-based koans pass spuriously when `any` is involved.

**Alternatives considered:**
- Naive version: Fails for `any`, would give false positives on unfilled blanks.

### File naming: numbered directories
Modules are `src/01-sets/`, `src/02-algebra/`, etc. Koans within are `01-never.ts`, `02-unknown.ts`, etc. Numbering enforces visual ordering in any file explorer and makes `tsc --noEmit` errors easy to locate.

### tsconfig strictness
`"strict": true` plus `"exactOptionalPropertyTypes": true` and `"noUncheckedIndexedAccess": true`. The strictest practical settings — several koans specifically explore what strict mode enables.

### No module bundler
`"moduleResolution": "node"`, no build step. Everything lives under `src/`, shared utilities are imported with relative paths. The project has zero build complexity.

### Koan comment style
Each koan file opens with a block that gives:
1. The mathematical/theoretical concept (with notation)
2. The TypeScript analogy
3. Any surprising consequence worth flagging
4. The fill-in task

The goal: a learner who reads the comment, fills in the blank, and sees the tests pass should come away understanding *why*, not just *what*.

## Risks / Trade-offs

- [TypeScript version drift] → Pin `typescript` version in `package.json`. Some type-level behaviors changed between versions (especially around distributive conditionals and recursive types).
- [Church encoding koans may be too abstract] → Placed as the final section of module 04, clearly labeled as "going deeper". Can be skipped without breaking the progression.
- [Curry-Howard may feel disconnected from practical TS] → Each koan in module 05 explicitly connects back to a TypeScript pattern the learner already knows from earlier modules.
- [`any` breaking the Equal<> type check] → The "deferred conditional" Equal handles this. Module 02 has a koan specifically about why `any` breaks the model, which reinforces why the strict Equal matters.
