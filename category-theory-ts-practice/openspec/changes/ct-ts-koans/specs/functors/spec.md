## ADDED Requirements

### Requirement: README explains functors
`src/04-functors/README.md` SHALL explain a functor as a structure-preserving map between categories, introduce the two functor laws (identity and composition), and map these to TypeScript generic types with a `map` method.

#### Scenario: README exists and states the functor laws precisely
- **WHEN** a learner opens the README
- **THEN** they see the identity law (`map(id) = id`) and composition law (`map(f ∘ g) = map(f) ∘ map(g)`) stated both in CT notation and as TypeScript assertions

### Requirement: Functor laws koans exist
`src/04-functors/01-functor-laws.ts` SHALL have type-level and value-level exercises verifying the two functor laws using `Array` as the concrete functor.

#### Scenario: Learner verifies identity law for Array
- **WHEN** they fill in the identity law check using assert
- **THEN** `npx tsx` confirms `arr.map(x => x)` deep-equals `arr` for sample inputs

#### Scenario: Learner verifies composition law for Array
- **WHEN** they fill in the composition law check
- **THEN** `npx tsx` confirms `arr.map(f).map(g)` deep-equals `arr.map(x => g(f(x)))` for sample functions and inputs

### Requirement: Option functor koans exist
`src/04-functors/02-option-functor.ts` SHALL define `Option<T>` as a discriminated union, then have the learner implement `map` for it and verify both functor laws.

#### Scenario: Learner implements map for Option
- **WHEN** they implement `mapOption: <A, B>(opt: Option<A>, f: (a: A) => B) => Option<B>`
- **THEN** assert checks verify `None` maps to `None` and `Some(x)` maps to `Some(f(x))`

#### Scenario: Option map satisfies functor laws
- **WHEN** assert blocks for identity and composition laws are run
- **THEN** both pass for `None` and `Some` cases

### Requirement: Array functor koans exist
`src/04-functors/03-array-functor.ts` SHALL have exercises re-implementing `map` from scratch (without calling built-in `.map`) and verifying the laws with recursion or iteration.

#### Scenario: Learner implements map for arrays without built-in
- **WHEN** they implement `mapArray: <A, B>(as: A[], f: (a: A) => B) => B[]`
- **THEN** assert checks verify correctness on empty, single-element, and multi-element arrays

### Requirement: Reader/function functor koans exist
`src/04-functors/04-function-functor.ts` SHALL introduce the Reader functor (`type Reader<R, A> = (r: R) => A`) and have the learner implement its `map` (post-composition).

#### Scenario: Learner implements map for Reader
- **WHEN** they implement `mapReader: <R, A, B>(ra: Reader<R, A>, f: (a: A) => B) => Reader<R, B>`
- **THEN** assert checks verify that `mapReader(ra, f)(r)` equals `f(ra(r))` for sample readers
