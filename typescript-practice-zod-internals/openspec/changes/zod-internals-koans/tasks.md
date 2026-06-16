## 1. Project Setup

- [x] 1.1 Create `package.json` with `typescript` as the only devDependency and a `typecheck` script running `tsc --noEmit`
- [x] 1.2 Create `tsconfig.json` with `strict: true`, `noEmit: true`, `target: "ES2022"`, `moduleResolution: "bundler"`, and `include: ["src/**/*.ts"]`
- [x] 1.3 Create `src/` directory structure: `src/shared/` and `src/koans/`

## 2. Shared: Test Utilities

- [x] 2.1 Create `src/shared/test-utils.ts` with prose explanation of the variance trick
- [x] 2.2 Implement `Expect<T extends true>` type in `test-utils.ts`
- [x] 2.3 Implement `Equal<X, Y>` type using the `(<T>() => T extends X ? 1 : 2) extends (...)` form
- [x] 2.4 Add self-verifying assertions in `test-utils.ts` confirming `Equal` handles `any`, union order, and identity

## 3. Shared: Primitives Solution (Fallback)

- [x] 3.1 Create `src/shared/primitives.solution.ts` with `ZodType<Output, Input = Output>` interface and phantom `_output!` / `_input!` properties
- [x] 3.2 Add `ZodString`, `ZodNumber`, `ZodBoolean`, `ZodNull`, `ZodUndefined` interfaces to solution file
- [x] 3.3 Add `ZodLiteral<T extends string | number | boolean>` interface to solution file
- [x] 3.4 Add `namespace z { export type infer<T extends ZodType<any, any>> = T["_output"] }` to solution file
- [x] 3.5 Verify solution file compiles cleanly with `tsc --noEmit`

## 4. Koan 00 — Phantom Base and Primitives

- [x] 4.1 Create `src/koans/00-primitives.ts` with full prose block explaining phantom types and the `!` definite assignment assertion
- [x] 4.2 Add `type TODO = never` stub and the `ZodType<Output, Input = Output>` interface stub with pattern comment
- [x] 4.3 Add stubs for `ZodString`, `ZodNumber`, `ZodBoolean`, `ZodNull`, `ZodUndefined` with TODO output types
- [x] 4.4 Add `ZodLiteral<T>` stub with TODO output type
- [x] 4.5 Add `namespace z { export type infer<T> = TODO }` stub with pattern comment
- [x] 4.6 Add type assertions for all primitive schemas and `z.infer`

## 5. Koan 01 — Object Shape

- [x] 5.1 Create `src/koans/01-object-shape.ts` with prose on raw shapes and the unwrapping mapped type
- [x] 5.2 Add `ZodRawShape` stub with pattern comment
- [x] 5.3 Add `ZodObjectOutput<T extends ZodRawShape>` mapped type stub
- [x] 5.4 Add `ZodObject<T extends ZodRawShape>` interface stub extending `ZodType<ZodObjectOutput<T>>` with `shape: T`
- [x] 5.5 Add assertions: single field, multiple fields, literal field, `z.infer` on full object schema

## 6. Koan 02 — Object Methods

- [x] 6.1 Create `src/koans/02-object-methods.ts` with prose on immutable schema transformations and the extend-vs-merge distinction
- [x] 6.2 Add `.partial()` method stub to `ZodObject<T>` with pattern comment
- [x] 6.3 Add `.pick<K>()` method stub with mask parameter pattern
- [x] 6.4 Add `.omit<K>()` method stub using `Omit<T, K>`
- [x] 6.5 Add `.extend<U>()` method stub
- [x] 6.6 Add `.merge<U>()` method stub accepting `ZodObject<any>`
- [x] 6.7 Add assertions for each method verifying output type changes

## 7. Koan 03 — Array and Tuple

- [x] 7.1 Create `src/koans/03-array-tuple.ts` with prose on homomorphic mapping over tuples
- [x] 7.2 Add `ZodArray<T extends ZodType>` stub with `T["_output"][]` output
- [x] 7.3 Add `ZodTuple<T extends [ZodType, ...ZodType[]]>` stub with variadic mapped type hint comment
- [x] 7.4 Add assertions for array of strings, array of objects, two-element tuple, three-element tuple, single-element tuple

## 8. Koan 04 — Union

- [x] 8.1 Create `src/koans/04-union.ts` with prose on `T[number]` distribution vs mapped types
- [x] 8.2 Add `ZodUnion<T extends Readonly<[ZodType, ...ZodType[]]>>` stub with `options: T` property
- [x] 8.3 Add pattern comment pointing to `T[number]["_output"]`
- [x] 8.4 Add assertions: two-member, three-member, literal union, single-member union

## 9. Koan 05 — Optional, Nullable, Default

- [x] 9.1 Create `src/koans/05-optional-nullable-default.ts` with prose on the Input/Output asymmetry in `ZodDefault`
- [x] 9.2 Add `ZodOptional<T extends ZodType>` stub (symmetric `| undefined` on both sides)
- [x] 9.3 Add `ZodNullable<T extends ZodType>` stub (`| null` on both sides)
- [x] 9.4 Add `ZodDefault<T extends ZodType>` stub with explicit comment on the asymmetry
- [x] 9.5 Add assertions for each wrapper, including the `ZodDefault` input/output asymmetry

## 10. Koan 06 — Effects and Transform

- [x] 10.1 Create `src/koans/06-effects-transform.ts` with prose on why `ZodEffects` is a separate class
- [x] 10.2 Add `ZodEffects<T extends ZodType, Output, Input = T["_input"]>` stub
- [x] 10.3 Add assertions: string→number transform, identity transform, chained `ZodEffects<ZodEffects<...>>`

## 11. Koan 07 — Discriminated Union

- [x] 11.1 Create `src/koans/07-discriminated-union.ts` with prose on discriminants and why Zod separates this from `ZodUnion`
- [x] 11.2 Add `ZodLiteralValue` type alias and `ZodDiscriminatedUnion<D extends string, T>` stub
- [x] 11.3 Add assertions: two-member discriminated union infers correct output union type

## 12. Koan 08 — Branded Types

- [x] 12.1 Create `src/koans/08-branded.ts` with prose on structural vs nominal typing and the unique symbol trick
- [x] 12.2 Add `declare const BRAND: unique symbol` and `Brand<T, B extends string>` type
- [x] 12.3 Add `ZodBranded<T extends ZodType, B extends string>` stub with correct Input/Output types
- [x] 12.4 Add assertions: branded output is not plain string, branded value is assignable to string, two different brands are not mutually assignable

## 13. Koan 09 — Lazy and Recursive

- [x] 13.1 Create `src/koans/09-lazy-recursive.ts` with prose on type alias vs interface eagerness
- [x] 13.2 Add `ZodLazy<T extends ZodType>` stub with getter signature
- [x] 13.3 Add a recursive schema example (e.g., a `Category` with `subcategories`) using `interface` + `ZodLazy`
- [x] 13.4 Add assertions: `ZodLazy` output matches inner schema, recursive type compiles

## 14. Final Verification

- [x] 14.1 Run `tsc --noEmit` on the full project and confirm zero errors in pre-built files
- [x] 14.2 Confirm all koan files have type errors (TODO stubs are active, assertions failing)
- [x] 14.3 Verify `primitives.solution.ts` can be swapped into koan imports as a fallback
