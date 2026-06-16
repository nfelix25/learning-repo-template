# TypeScript 5 / 6 / 7 Deep Dive

Version-specific features, koan style. Each lesson is a `.ts` file that compiles
clean when you complete the exercises, and fails with type errors when you don't.

**Run:** `npm run verify` — that's it. No test runner. `tsc --noEmit` is the harness.

**Shape A** — Add or fix types to make loose code precise.
**Shape B** — Refactor old patterns to use the new syntax/feature.

---

## Block 1 — TS 5.0 Core

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 01 | `lessons/01-const-type-params/` | TS 5.0 | A | Prevent literal type widening with `const` on type parameters |
| 02 | `lessons/02-satisfies/` | TS 4.9 | A | Validate shape while preserving literal types with `satisfies` |
| 03 | `lessons/03-verbatim-module-syntax/` | TS 5.0 | A/B | `import type` discipline and `--verbatimModuleSyntax` |

> Lesson 03 has a per-directory tsconfig. Run with: `tsc -p lessons/03-verbatim-module-syntax/tsconfig.json --noEmit`

---

## Block 2 — Decorators (Stage 3)

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 04 | `lessons/04-decorators-old-vs-new/` | TS 5.0 | — | Conceptual: experimental decorators vs TC39 stage-3 |
| 05 | `lessons/05-class-decorators/` | TS 5.0 | B | Class decorators: `@sealed`, `@logged`, context object |
| 06 | `lessons/06-method-accessor-decorators/` | TS 5.0 | B | Method `@memoize` and accessor `@clamp` decorators |
| 07 | `lessons/07-field-decorators/` | TS 5.0 | B | Field decorators and initializer replacement |
| 08 | `lessons/08-decorator-factories-composition/` | TS 5.0 | B | Parameterized factories and composition order |
| 09 | `lessons/09-decorator-metadata/` | TS 5.2 | B | `Symbol.metadata` — read/write metadata from decorators |
| 10 | `lessons/10-decorator-patterns/` | TS 5.0/5.2 | B | Production patterns: DI, validation, per-instance memoize |

---

## Block 3 — Explicit Resource Management

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 11 | `lessons/11-using-declarations/` | TS 5.2 | B | Synchronous `using` and the `Disposable` protocol |
| 12 | `lessons/12-await-using/` | TS 5.2 | B | Async `await using` and `AsyncDisposable` |
| 13 | `lessons/13-disposable-protocol/` | TS 5.2 | A | Designing with `DisposableStack` and adapting legacy APIs |

---

## Block 4 — Inference Improvements

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 14 | `lessons/14-no-infer/` | TS 5.4 | A | `NoInfer<T>` — prevent fallback params from widening T |
| 15 | `lessons/15-closure-narrowing/` | TS 5.4 | A | Preserved type narrowing in closures after last assignment |
| 16 | `lessons/16-inferred-type-predicates/` | TS 5.5 | A | Auto-inferred type predicates — fix the `.filter()` footgun |
| 17 | `lessons/17-switch-true-narrowing/` | TS 5.3 | A | `switch(true)` narrowing and boolean comparison guards |
| 18 | `lessons/18-conditional-infer-narrowing/` | TS 5.8 | A | Granular `infer` narrowing in conditional type branches |

---

## Block 5 — Module System Evolution

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 19 | `lessons/19-import-attributes/` | TS 5.3 | B | Import attributes `with {}` — migrating from `assert {}` |
| 20 | `lessons/20-isolated-declarations/` | TS 5.5 | A | `--isolatedDeclarations` — explicit exports for parallel emit |
| 21 | `lessons/21-import-defer/` | TS 5.9 | B | `import defer * as ns` — deferred module evaluation |
| 22 | `lessons/22-subpath-imports/` | TS 6.0 | B | `#/` prefix subpath imports vs `paths` aliases |

> Lesson 20 has a per-directory tsconfig. Run with: `tsc -p lessons/20-isolated-declarations/tsconfig.json --noEmit`

---

## Block 6 — Safety and Strictness Flags

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 23 | `lessons/23-regex-syntax-checking/` | TS 5.5 | A | Compile-time regex syntax validation |
| 24 | `lessons/24-iterator-narrowing/` | TS 5.6 | A | Stricter `IteratorResult` — check `.done` before `.value` |
| 25 | `lessons/25-no-unchecked-side-effect-imports/` | TS 5.6/6.0 | A | Catch typos in side-effect-only imports |
| 26 | `lessons/26-uninitialized-variables/` | TS 5.7 | A | Variables declared but never assigned before use |
| 27 | `lessons/27-erasable-syntax-only/` | TS 5.8 | A | Identify and refactor non-erasable syntax (enums, namespaces) |

> Lessons 25, 27 have per-directory tsconfigs for flag-specific error checking.

---

## Block 7 — TypeScript 6.0

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 28 | `lessons/28-ts60-default-changes/` | TS 6.0 | A | Breaking defaults: `strict`, `module`, `types: []`, and more |
| 29 | `lessons/29-this-less-inference/` | TS 6.0 | A | Better type inference for functions without `this` |
| 30 | `lessons/30-temporal-api/` | TS 6.0 | A | Built-in `Temporal` API types (stage-4 proposal) |
| 31 | `lessons/31-map-upsert/` | TS 6.0 | A | `Map.getOrInsert` and `Map.getOrInsertComputed` |
| 32 | `lessons/32-ts60-legacy-cleanup/` | TS 6.0 | B | Removed modules, flags, and syntax — migration patterns |

---

## Block 8 — TypeScript 7.0 Beta

| # | Lesson | Version | Shape | Description |
|---|--------|---------|-------|-------------|
| 33 | `lessons/33-ts70-go-rewrite/` | TS 7.0β | — | The Go rewrite: architecture, `tsgo`, `--checkers`, `--builders` |
| 34 | `lessons/34-isolated-declarations-scale/` | TS 7.0β | A | `isolatedDeclarations` as the key to parallel type-checking |
| 35 | `lessons/35-erasable-future-proof/` | TS 7.0β | A | `erasableSyntaxOnly` + native type-stripping in Node.js 22+ |
| 36 | `lessons/36-stable-type-ordering/` | TS 7.0β | A | `--stableTypeOrdering` as a TS 6→7 migration smoke test |

> Lessons 34, 35, 36 have per-directory tsconfigs for flag-specific behavior.

---

## How Koans Work

Each `koan.ts` file:
1. Opens with a rich comment block: version tag, problem, solution, how it works, edge cases
2. Contains exercises with `// TODO:` markers
3. Uses `Expect<Equal<Actual, Expected>>` lines as type-level assertions
4. Uses `// @ts-expect-error — reason` to mark lines that *should* type-error

**A lesson passes when `npm run verify` exits 0.**
Complete the TODOs until all assertions compile.
