## 1. Project Scaffold

- [x] 1.1 Create `package.json` with `typescript` and `tsx` as dev dependencies, and a `check` script running `tsc --noEmit`
- [x] 1.2 Create `tsconfig.json` with strict mode, `noEmit: true`, targeting `src/**/*.ts`
- [x] 1.3 Create `src/utils.ts` exporting `Expect`, `Equal`, `TODO` (unique symbol), and `todo` function

## 2. Module 01 — Objects and Morphisms

- [x] 2.1 Create `src/01-objects-and-morphisms/README.md` introducing categories, objects, morphisms, identity, and composition laws
- [x] 2.2 Create `src/01-objects-and-morphisms/01-terminal-and-initial.ts` with type-level koans on `never` (initial) and `unknown`/`void` (terminal)
- [x] 2.3 Create `src/01-objects-and-morphisms/02-identity.ts` with type-level and value-level exercises on the identity morphism
- [x] 2.4 Create `src/01-objects-and-morphisms/03-composition.ts` with value-level `compose` exercise and type-level signature checks

## 3. Module 02 — Products and Coproducts

- [x] 3.1 Create `src/02-products-and-coproducts/README.md` explaining product and coproduct constructions
- [x] 3.2 Create `src/02-products-and-coproducts/01-product-types.ts` with `Fst`, `Snd`, and object property extraction koans
- [x] 3.3 Create `src/02-products-and-coproducts/02-sum-types.ts` with discriminated union, exhaustive narrowing, and union distribution koans
- [x] 3.4 Create `src/02-products-and-coproducts/03-distributivity.ts` with type-level proofs of intersection distributing over union
- [x] 3.5 Create `src/02-products-and-coproducts/04-isomorphisms.ts` with `swap` for products and coproducts

## 4. Module 03 — Parametricity

- [x] 4.1 Create `src/03-parametricity/README.md` explaining parametric polymorphism and free theorems
- [x] 4.2 Create `src/03-parametricity/01-polymorphic-functions.ts` with exercises reasoning about what polymorphic types can implement
- [x] 4.3 Create `src/03-parametricity/02-natural-transformations.ts` with `headOption` nat-transform exercise and naturality assert checks

## 5. Module 04 — Functors

- [x] 5.1 Create `src/04-functors/README.md` explaining functors and the two functor laws
- [x] 5.2 Create `src/04-functors/01-functor-laws.ts` with identity and composition law verification for `Array`
- [x] 5.3 Create `src/04-functors/02-option-functor.ts` defining `Option<T>` and having learner implement `mapOption`
- [x] 5.4 Create `src/04-functors/03-array-functor.ts` having learner implement `mapArray` without built-in `.map`
- [x] 5.5 Create `src/04-functors/04-function-functor.ts` introducing `Reader<R, A>` and having learner implement `mapReader`

## 6. Module 05 — Higher-Kinded Types

- [x] 6.1 Create `src/05-higher-kinded-types/README.md` explaining TS's HKT limitation and the interface-based encoding
- [x] 6.2 Create `src/05-higher-kinded-types/01-encoding-hkt.ts` with `URItoKind` interface, `Kind<F, A>` type, and registration exercises
- [x] 6.3 Create `src/05-higher-kinded-types/02-generic-functor.ts` with `Functor<F>` interface definition and Option/Array instances

## 7. Module 06 — Monads

- [x] 7.1 Create `src/06-monads/README.md` explaining monads via `of`/`flatMap` and the three monad laws
- [x] 7.2 Create `src/06-monads/01-monad-laws.ts` with all three law verifications for `Option`
- [x] 7.3 Create `src/06-monads/02-option-monad.ts` with `ofOption`, `flatMapOption`, and chained computation exercises
- [x] 7.4 Create `src/06-monads/03-array-monad.ts` with `flatMapArray` exercise and Cartesian product example

## 8. Module 07 — Adjunctions

- [x] 8.1 Create `src/07-adjunctions/README.md` explaining adjunctions via the curry/uncurry isomorphism
- [x] 8.2 Create `src/07-adjunctions/01-currying.ts` with value-level `curry`/`uncurry` and round-trip assert checks
- [x] 8.3 Create `src/07-adjunctions/02-products-and-exponentials.ts` with type-level `Curry` and `Uncurry` operators
