## ADDED Requirements

### Requirement: README explains parametricity and free theorems
`src/03-parametricity/README.md` SHALL introduce parametric polymorphism — the idea that a function `<A>(a: A) => A` is so constrained by its type that we can deduce its behavior without seeing its body.

#### Scenario: README exists and covers the free theorem intuition
- **WHEN** a learner opens the README
- **THEN** they understand why the only total function of type `<A>(a: A) => A` is `identity`, and what this has to do with natural transformations

### Requirement: Polymorphic function koans cover what's possible
`src/03-parametricity/01-polymorphic-functions.ts` SHALL have type-level exercises reasoning about what a given polymorphic type signature can possibly implement — using `Expect<Equal<...>>` to pin down the type.

#### Scenario: Learner reasons about `<A>(a: A) => A`
- **WHEN** they fill in exercises identifying all total implementations of identity-shaped types
- **THEN** checks pass confirming the only option is to return the argument

#### Scenario: Learner reasons about `<A, B>(a: A, b: B) => A`
- **WHEN** they fill in exercises for projection-shaped types
- **THEN** checks verify the type uniquely determines the behavior (const-first vs const-second)

### Requirement: Natural transformation koans exist
`src/03-parametricity/02-natural-transformations.ts` SHALL have type-level and value-level exercises on natural transformations — polymorphic functions `<A>(fa: F<A>) => G<A>` — showing they must commute with `map`.

#### Scenario: Learner implements headOption as a natural transformation
- **WHEN** they implement `headOption: <A>(as: A[]) => Option<A>`
- **THEN** assert checks verify naturality: `headOption(as.map(f))` equals `headOption(as).map(f)` for sample inputs

#### Scenario: Type-level exercise identifies valid nat-transform shapes
- **WHEN** learner fills in the type for a natural transformation from Array to Option
- **THEN** Expect<Equal<...>> checks pass for the correct polymorphic type
