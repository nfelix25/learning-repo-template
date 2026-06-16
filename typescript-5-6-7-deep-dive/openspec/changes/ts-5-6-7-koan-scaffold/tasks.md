## 1. Repo Infrastructure

- [x] 1.1 Create `package.json` with `typescript@^6` dev dependency, `"type": "module"`, and `"verify": "tsc --noEmit"` script
- [x] 1.2 Create root `tsconfig.json` with strict:true, noEmit:true, target:es2022, module:esnext, moduleResolution:bundler, lib:[esnext,dom], allowImportingTsExtensions:true — all settings explicit
- [x] 1.3 Create `src/utils.ts` with `Expect`, `Equal`, `NotEqual`, `IsAny`, `NotAny` type utilities (no runtime exports)
- [x] 1.4 Create `LEARNING.md` listing all 36 lessons by block with version tags and one-line descriptions
- [x] 1.5 Run `npm install` to generate package-lock.json

## 2. Block 1 — TS 5.0 Core (Lessons 01–03)

- [x] 2.1 Create `lessons/01-const-type-params/koan.ts` — `const` modifier on type parameters [TS 5.0], Shape A
- [x] 2.2 Create `lessons/02-satisfies/koan.ts` — `satisfies` operator [TS 4.9/5.x], Shape A, compare annotation vs satisfies vs assertion
- [x] 2.3 Create `lessons/03-verbatim-module-syntax/koan.ts` — `verbatimModuleSyntax` [TS 5.0], Shape A/B
- [x] 2.4 Create `lessons/03-verbatim-module-syntax/tsconfig.json` extending root with `"verbatimModuleSyntax": true`

## 3. Block 2 — Decorators (Lessons 04–10)

- [x] 3.1 Create `lessons/04-decorators-old-vs-new/koan.ts` — stage-3 vs experimental decorators [TS 5.0], conceptual foundation
- [x] 3.2 Create `lessons/05-class-decorators/koan.ts` — class decorators [TS 5.0], Shape B, @sealed and @logged
- [x] 3.3 Create `lessons/06-method-accessor-decorators/koan.ts` — method + accessor decorators [TS 5.0], Shape B, @memoize and @clamp
- [x] 3.4 Create `lessons/07-field-decorators/koan.ts` — field decorators [TS 5.0], Shape B, @nonEmpty
- [x] 3.5 Create `lessons/08-decorator-factories-composition/koan.ts` — factories and composition [TS 5.0], Shape B, @retry(n)
- [x] 3.6 Create `lessons/09-decorator-metadata/koan.ts` — Symbol.metadata [TS 5.2], Shape B, @required with metadata readback
- [x] 3.7 Create `lessons/10-decorator-patterns/koan.ts` — DI, validation, memoize patterns [TS 5.0/5.2], Shape B

## 4. Block 3 — Resource Management (Lessons 11–13)

- [x] 4.1 Create `lessons/11-using-declarations/koan.ts` — synchronous `using` [TS 5.2], Shape B, refactor try/finally
- [x] 4.2 Create `lessons/12-await-using/koan.ts` — `await using` + AsyncDisposable [TS 5.2], Shape B
- [x] 4.3 Create `lessons/13-disposable-protocol/koan.ts` — Disposable design + DisposableStack [TS 5.2], Shape A

## 5. Block 4 — Inference Improvements (Lessons 14–18)

- [x] 5.1 Create `lessons/14-no-infer/koan.ts` — `NoInfer<T>` [TS 5.4], Shape A
- [x] 5.2 Create `lessons/15-closure-narrowing/koan.ts` — preserved narrowing in closures [TS 5.4], Shape A
- [x] 5.3 Create `lessons/16-inferred-type-predicates/koan.ts` — inferred type predicates [TS 5.5], Shape A
- [x] 5.4 Create `lessons/17-switch-true-narrowing/koan.ts` — switch(true) + boolean narrowing [TS 5.3], Shape A
- [x] 5.5 Create `lessons/18-conditional-infer-narrowing/koan.ts` — granular infer in conditional types [TS 5.8], Shape A

## 6. Block 5 — Module System Evolution (Lessons 19–22)

- [x] 6.1 Create `lessons/19-import-attributes/koan.ts` — import attributes with {} [TS 5.3], Shape B, update assert→with
- [x] 6.2 Create `lessons/20-isolated-declarations/koan.ts` — isolatedDeclarations [TS 5.5], Shape A
- [x] 6.3 Create `lessons/20-isolated-declarations/tsconfig.json` extending root with `"isolatedDeclarations": true`
- [x] 6.4 Create `lessons/21-import-defer/koan.ts` — import defer [TS 5.9], Shape B
- [x] 6.5 Create `lessons/22-subpath-imports/koan.ts` — #/ subpath imports [TS 6.0], Shape B

## 7. Block 6 — Safety Flags (Lessons 23–27)

- [x] 7.1 Create `lessons/23-regex-syntax-checking/koan.ts` — compile-time regex validation [TS 5.5], Shape A
- [x] 7.2 Create `lessons/24-iterator-narrowing/koan.ts` — iterator narrowing strictness [TS 5.6], Shape A
- [x] 7.3 Create `lessons/25-no-unchecked-side-effect-imports/koan.ts` — noUncheckedSideEffectImports [TS 5.6/6.0], Shape A
- [x] 7.4 Create `lessons/25-no-unchecked-side-effect-imports/tsconfig.json` extending root with `"noUncheckedSideEffectImports": true`
- [x] 7.5 Create `lessons/26-uninitialized-variables/koan.ts` — checked uninitialized variables [TS 5.7], Shape A
- [x] 7.6 Create `lessons/27-erasable-syntax-only/koan.ts` — erasableSyntaxOnly [TS 5.8], Shape A
- [x] 7.7 Create `lessons/27-erasable-syntax-only/tsconfig.json` extending root with `"erasableSyntaxOnly": true`

## 8. Block 7 — TypeScript 6.0 (Lessons 28–32)

- [x] 8.1 Create `lessons/28-ts60-default-changes/koan.ts` — TS 6.0 default config revolution, Shape A
- [x] 8.2 Create `lessons/29-this-less-inference/koan.ts` — this-less function inference [TS 6.0], Shape A
- [x] 8.3 Create `lessons/30-temporal-api/koan.ts` — Temporal API types [TS 6.0], Shape A
- [x] 8.4 Create `lessons/31-map-upsert/koan.ts` — Map/WeakMap getOrInsert [TS 6.0], Shape A
- [x] 8.5 Create `lessons/32-ts60-legacy-cleanup/koan.ts` — removed options and syntax [TS 6.0], Shape B

## 9. Block 8 — TypeScript 7.0 Beta (Lessons 33–36)

- [x] 9.1 Create `lessons/33-ts70-go-rewrite/koan.ts` — Go rewrite architecture + stableTypeOrdering intro [TS 7.0β]
- [x] 9.2 Create `lessons/34-isolated-declarations-scale/koan.ts` — isolatedDeclarations as parallel-arch enabler [TS 7.0β], Shape A
- [x] 9.3 Create `lessons/34-isolated-declarations-scale/tsconfig.json` extending root with `"isolatedDeclarations": true`
- [x] 9.4 Create `lessons/35-erasable-future-proof/koan.ts` — erasableSyntaxOnly + native stripping + IsErasable utility [TS 7.0β], Shape A
- [x] 9.5 Create `lessons/35-erasable-future-proof/tsconfig.json` extending root with `"erasableSyntaxOnly": true`
- [x] 9.6 Create `lessons/36-stable-type-ordering/koan.ts` — stableTypeOrdering + TS 6→7 migration [TS 7.0β], Shape A
- [x] 9.7 Create `lessons/36-stable-type-ordering/tsconfig.json` extending root with `"stableTypeOrdering": true`

## 10. Verification

- [x] 10.1 Run `npm run verify` and confirm all koan stubs produce expected type errors (exercises not yet solved)
- [x] 10.2 Solve lesson 01 as a smoke test and confirm it compiles clean after completion
- [x] 10.3 Verify all per-lesson tsconfigs extend root correctly and their flags apply only to their lesson directory
