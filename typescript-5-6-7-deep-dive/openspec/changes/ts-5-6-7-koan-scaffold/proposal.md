## Why

A professional web developer needs a focused, self-contained learning repo for every significant TypeScript feature introduced in versions 5.x, 6.0, and 7.0 beta. Existing repos cover general generics and utility types but lack the version-specific lens needed to speak confidently about *when* each feature arrived and *why* it was added.

## What Changes

- Introduces a new standalone TypeScript learning repo with 36 koan-style lesson files
- Each lesson is a `.ts` file that passes when `tsc --noEmit` compiles clean and fails (type errors) when exercises are incomplete
- Shared `src/utils.ts` provides `Expect<>`, `Equal<>`, `NotEqual<>` type-level test utilities
- No test runner — `tsc --noEmit` is the only verification step
- All learning content (motivation, before/after, edge cases, version tag) lives in inline comments — no external docs needed
- Lessons span two shapes: Shape A (fix/add types to loose code) and Shape B (refactor old patterns to new syntax)
- Flag-specific lessons (isolatedDeclarations, erasableSyntaxOnly) get per-directory `tsconfig.json` extensions

## Capabilities

### New Capabilities

- `repo-infrastructure`: package.json, root tsconfig.json, src/utils.ts, verify script, LEARNING.md index
- `block-1-ts50-core`: Lessons 01–03 — const type params, satisfies, verbatimModuleSyntax
- `block-2-decorators`: Lessons 04–10 — full stage-3 decorator system (class, method, accessor, field, factories, composition, metadata, patterns)
- `block-3-resource-management`: Lessons 11–13 — using, await using, Disposable protocol
- `block-4-inference`: Lessons 14–18 — NoInfer, closure narrowing, inferred predicates, switch(true), conditional infer
- `block-5-modules`: Lessons 19–22 — import attributes, isolatedDeclarations, import defer, subpath imports
- `block-6-safety-flags`: Lessons 23–27 — regex checking, iterator narrowing, noUncheckedSideEffectImports, uninitialized vars, erasableSyntaxOnly
- `block-7-ts60`: Lessons 28–32 — default config changes, this-less inference, Temporal types, Map upsert, legacy cleanup
- `block-8-ts70`: Lessons 33–36 — Go rewrite context, isolatedDeclarations at scale, erasableSyntaxOnly + native strip, stableTypeOrdering

### Modified Capabilities

## Impact

- New repo from scratch — no existing code affected
- Dev dependency: `typescript@^6`
- No runtime dependencies
- Requires Node.js 20+ for native ESM + `using` keyword support
