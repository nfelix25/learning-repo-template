## ADDED Requirements

### Requirement: README explains monads as monoids in endofunctors
`src/06-monads/README.md` SHALL explain monads through the two operations (`of`/`pure` and `flatMap`/`chain`), state the three monad laws (left identity, right identity, associativity), and connect them to sequencing computations.

#### Scenario: README exists and states all three laws
- **WHEN** a learner opens the README
- **THEN** they see each monad law expressed in TypeScript pseudocode alongside the mathematical statement

### Requirement: Monad laws koans exist
`src/06-monads/01-monad-laws.ts` SHALL have type-level and value-level exercises verifying the three monad laws using `Option` as the concrete monad.

#### Scenario: Learner verifies left identity law
- **WHEN** they fill in `assert.deepEqual(flatMap(of(a), f), f(a))` with correct implementations
- **THEN** `npx tsx` confirms the law holds for sample values and functions

#### Scenario: Learner verifies right identity law
- **WHEN** they fill in `assert.deepEqual(flatMap(ma, of), ma)`
- **THEN** `npx tsx` confirms the law holds for `None` and `Some` cases

#### Scenario: Learner verifies associativity law
- **WHEN** they fill in the associativity check `flatMap(flatMap(ma, f), g)` equals `flatMap(ma, a => flatMap(f(a), g))`
- **THEN** `npx tsx` confirms it holds

### Requirement: Option monad koans exist
`src/06-monads/02-option-monad.ts` SHALL have the learner implement `of` and `flatMap` for `Option`, then use them to chain computations that may fail.

#### Scenario: Learner implements of and flatMap for Option
- **WHEN** they implement `ofOption: <A>(a: A) => Option<A>` and `flatMapOption: <A, B>(opt: Option<A>, f: (a: A) => Option<B>) => Option<B>`
- **THEN** assert checks verify both operations against `None` and `Some` cases

#### Scenario: Learner chains Option computations
- **WHEN** they use `flatMap` to chain two partial functions (e.g., safe division, safe head)
- **THEN** assert checks verify the chained computation short-circuits on `None`

### Requirement: Array monad koans exist
`src/06-monads/03-array-monad.ts` SHALL have the learner implement `of` (singleton) and `flatMap` (concatMap) for arrays, connecting to the list monad's role in nondeterminism.

#### Scenario: Learner implements flatMap for arrays without built-in flatMap
- **WHEN** they implement `flatMapArray: <A, B>(as: A[], f: (a: A) => B[]) => B[]`
- **THEN** assert checks verify it flattens one level and applies `f` to each element

#### Scenario: Learner uses array monad for a Cartesian product
- **WHEN** they express the Cartesian product of two arrays using `flatMap` and `of`
- **THEN** assert checks verify the result matches the expected pairs
