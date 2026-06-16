## 1. Project Setup

- [x] 1.1 Initialize `package.json` with pnpm, add TypeScript 7, Vitest, and tsx dependencies
- [x] 1.2 Create `tsconfig.json` with strict, ES2025 target, ESNext module, bundler resolution
- [x] 1.3 Create `vitest.config.ts` configured to use tsx for TypeScript execution
- [x] 1.4 Create `src/utils/type-utils.ts` with `TODO`, `Expect`, and `Equal` type utilities
- [x] 1.5 Add `test` and `typecheck` scripts to package.json
- [x] 1.6 Verify `pnpm install && pnpm typecheck && pnpm test` all pass on a clean checkout

## 2. Phase 1 — Advanced Generics (k-001 to k-004)

- [x] 2.1 Write `k-001-generic-constraints.ts` — keyof, extends constraints, indexed access
- [x] 2.2 Write `k-002-generic-defaults.ts` — default type parameters, inference vs. annotation
- [x] 2.3 Write `k-003-const-type-parameters.ts` — const T, literal preservation, readonly tuple inference
- [x] 2.4 Write `k-004-noinfer.ts` — NoInfer<T>, inference site suppression, default-value problem

## 3. Phase 2 — Type Narrowing (k-005 to k-009)

- [x] 3.1 Write `k-005-typeof-instanceof-in.ts` — all three guards, typeof null trap, class hierarchies
- [x] 3.2 Write `k-006-discriminated-unions.ts` — literal discriminant, exhaustive switch, never check
- [x] 3.3 Write `k-007-type-predicates.ts` — `x is T` predicates, composed predicates
- [x] 3.4 Write `k-008-assertion-functions.ts` — `asserts x is T`, `asserts condition`, post-call narrowing
- [x] 3.5 Write `k-009-inferred-type-predicates.ts` — TS 5.5 inferred predicates, filter narrowing

## 4. Phase 3 — Mapped Types (k-010 to k-014)

- [x] 4.1 Write `k-010-mapped-types-basics.ts` — [K in keyof T], Readonly and Partial from scratch
- [x] 4.2 Write `k-011-mapped-type-modifiers.ts` — +/- readonly, +/- optional, Required from scratch
- [x] 4.3 Write `k-012-key-remapping.ts` — `as` clause, key renaming, getter-name generation
- [x] 4.4 Write `k-013-template-literal-keys.ts` — multi-key generation per source key, event handlers
- [x] 4.5 Write `k-014-filtering-with-never.ts` — OmitByValue, PickByValue, never-filtering pattern

## 5. Phase 4 — Conditional Types (k-015 to k-019)

- [x] 5.1 Write `k-015-conditional-types-basics.ts` — T extends U ? X : Y, nested conditionals
- [x] 5.2 Write `k-016-distributive-conditional-types.ts` — distribution over unions, [T] vs T, Exclude from scratch
- [x] 5.3 Write `k-017-infer-keyword.ts` — infer in conditional types, ReturnType, ElementType, Awaited
- [x] 5.4 Write `k-018-infer-extends-constraints.ts` — TS 5.4 infer X extends T, contrast with pre-5.4 pattern
- [x] 5.5 Write `k-019-recursive-conditional-types.ts` — Flatten, DeepAwaited, deferred evaluation

## 6. Phase 5 — Template Literal Types (k-020 to k-023)

- [x] 6.1 Write `k-020-template-literal-basics.ts` — `${A}${B}`, distribution, EventName patterns
- [x] 6.2 Write `k-021-intrinsic-string-types.ts` — Uppercase, Lowercase, Capitalize, Uncapitalize, CamelCase
- [x] 6.3 Write `k-022-template-literals-and-mapped-types.ts` — Getters<T>, on-event handler maps
- [x] 6.4 Write `k-023-template-literal-pattern-matching.ts` — infer inside template literals, ExtractPrefix, SplitPath

## 7. Phase 6 — Variadic Tuples (k-024 to k-027)

- [x] 7.1 Write `k-024-tuple-basics-and-labels.ts` — labeled tuples, optional elements, T[number], T["length"]
- [x] 7.2 Write `k-025-tuple-spreads.ts` — Prepend, Append, Concat with spread syntax
- [x] 7.3 Write `k-026-variadic-tuple-patterns.ts` — DropFirst, function parameter manipulation, partial application types
- [x] 7.4 Write `k-027-tuple-union-conversions.ts` — T[number] to union, UnionToTuple technique and caveats

## 8. Phase 7 — Recursive Types (k-028 to k-031)

- [x] 8.1 Write `k-028-recursive-type-aliases.ts` — TreeNode, LinkedList, deferred evaluation rules
- [x] 8.2 Write `k-029-deep-partial-readonly.ts` — DeepPartial, DeepReadonly, primitive passthrough
- [x] 8.3 Write `k-030-path-types.ts` — Paths<T> dot-notation union, ValueAtPath<T, P>
- [x] 8.4 Write `k-031-json-type.ts` — JSONValue recursive type, type-safe parsing skeleton

## 9. Phase 8 — Type-Level Programming (k-032 to k-034)

- [x] 9.1 Write `k-032-rebuilding-utility-types.ts` — Pick, Omit, Exclude, Extract, NonNullable, Required, Readonly from scratch
- [x] 9.2 Write `k-033-function-type-manipulation.ts` — Parameters, ReturnType, ConstructorParameters, InstanceType, PromisifyAll
- [x] 9.3 Write `k-034-type-level-string-manipulation.ts` — TrimLeft, TrimRight, Trim, Replace, Join

## 10. Phase 9 — Advanced Patterns (k-035 to k-039)

- [x] 10.1 Write `k-035-branded-nominal-types.ts` — intersection brand, unique symbol brand, brand constructor
- [x] 10.2 Write `k-036-phantom-types.ts` — phantom state encoding, state machine types, zero runtime cost
- [x] 10.3 Write `k-037-covariance-contravariance.ts` — return type covariance, parameter contravariance, method bivariance
- [x] 10.4 Write `k-038-builder-pattern.ts` — type-accumulating fluent builder, terminal method gating
- [x] 10.5 Write `k-039-type-safe-event-emitters.ts` — TypedEventEmitter<Events>, on/emit type safety

## 11. Phase 10 — TypeScript 5.x Features (k-040 to k-048)

- [x] 11.1 Write `k-040-new-decorators.ts` — TC39 decorator syntax, class decorator, method decorator
- [x] 11.2 Write `k-041-decorator-metadata.ts` — context.metadata, Symbol.metadata, metadata accumulation
- [x] 11.3 Write `k-042-using-symbol-dispose.ts` — using keyword, Symbol.dispose, Disposable interface, cleanup on exit and exception
- [x] 11.4 Write `k-043-async-disposal.ts` — Symbol.asyncDispose, AsyncDisposable, await using, AsyncDisposableStack
- [x] 11.5 Write `k-044-getter-setter-flexibility.ts` — TS 5.1 different get/set types, explicit annotation requirement
- [x] 11.6 Write `k-045-switch-true-narrowing.ts` — switch(true) with type guard cases, per-branch narrowing
- [x] 11.7 Write `k-046-groupby-types.ts` — Object.groupBy, Map.groupBy, Partial<Record<>> return type
- [x] 11.8 Write `k-047-set-methods.ts` — union, intersection, difference, symmetricDifference, subset/superset checks
- [x] 11.9 Write `k-048-never-initialized-variables.ts` — TS 5.7 uninitialized variable detection, fixing initialization

## 12. Phase 11 — TypeScript 6.x Features (k-049 to k-054)

- [x] 12.1 Write `k-049-strict-mode-unpacked.ts` — each strict flag with before/after example, useUnknownInCatchVariables
- [x] 12.2 Write `k-050-temporal-api.ts` — PlainDate, ZonedDateTime, Duration, arithmetic, no-import required
- [x] 12.3 Write `k-051-regexp-escape.ts` — RegExp.escape(), contrast with manual escaping, user-input search
- [x] 12.4 Write `k-052-map-upsert-methods.ts` — getOrInsert, getOrInsertComputed, existing and absent key behavior
- [x] 12.5 Write `k-053-control-flow-improvements.ts` — complex boolean narrowing, TS 6.0 inference improvements
- [x] 12.6 Write `k-054-nouncheckedsideeffectimports.ts` — TS 6.0 default behavior, unresolvable import errors

## 13. Phase 12 — TypeScript 7 Epilogue (k-055)

- [x] 13.1 Write `k-055-ts7-epilogue.ts` — Go compiler context, --builders flag, TS6 vs TS7 distinction, full suite verification
