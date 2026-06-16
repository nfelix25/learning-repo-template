## ADDED Requirements

### Requirement: README introduces the category concept
`src/01-objects-and-morphisms/README.md` SHALL introduce what a category is (objects, morphisms, identity, composition laws) and map these to TypeScript types and functions.

#### Scenario: README exists and covers the three laws
- **WHEN** a learner opens the README
- **THEN** they can read about objects as types, morphisms as functions, and the identity and composition laws before touching any koan file

### Requirement: Terminal and initial object koans exist
`src/01-objects-and-morphisms/01-terminal-and-initial.ts` SHALL contain type-level exercises on `never` (initial object) and `unknown`/`void` (terminal object), with Expect<Equal<...>> checks.

#### Scenario: Learner completes the `never` elimination exercise
- **WHEN** they replace `TODO` in `type Absurd<A> = TODO` to encode `never → A`
- **THEN** all associated `Expect<Equal<...>>` checks pass

#### Scenario: Learner completes the `unknown` as terminal exercise
- **WHEN** they replace `TODO` in a type that maps anything to `unknown`
- **THEN** associated checks pass

### Requirement: Identity morphism koans exist
`src/01-objects-and-morphisms/02-identity.ts` SHALL have exercises establishing that the identity function is the unique morphism from a type to itself with parametricity as evidence.

#### Scenario: Learner implements the identity function
- **WHEN** they write `const identity = <A>(a: A): A => todo()` and replace `todo()` with the correct body
- **THEN** the inline assert checks pass when run with `npx tsx`

#### Scenario: Learner reasons about uniqueness via parametricity
- **WHEN** they fill in type-level exercises showing what `<A>(a: A) => A` can possibly return
- **THEN** Expect<Equal<...>> checks pass

### Requirement: Composition koans exist
`src/01-objects-and-morphisms/03-composition.ts` SHALL have a value-level exercise to implement `compose`, type-level checks on its signature, and assertions verifying associativity.

#### Scenario: Learner implements compose
- **WHEN** they implement `const compose = <A, B, C>(f: (a: A) => B, g: (b: B) => C) => ...`
- **THEN** `npx tsx` runs the assert block without throwing

#### Scenario: Type-level check verifies compose signature
- **WHEN** the file is checked with `tsc --noEmit`
- **THEN** `Expect<Equal<typeof compose, ...>>` passes only for the correct signature
