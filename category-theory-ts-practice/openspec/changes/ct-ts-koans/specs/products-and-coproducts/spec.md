## ADDED Requirements

### Requirement: README explains products and coproducts
`src/02-products-and-coproducts/README.md` SHALL explain product types (with projection morphisms) and coproduct types (with injection morphisms) as categorical constructions, mapping them to TypeScript tuples/objects and union types.

#### Scenario: README exists and defines the universal property
- **WHEN** a learner opens the README
- **THEN** they understand why tuples are products (projection functions `fst`, `snd`) and why unions are coproducts (injection via type widening, elimination via narrowing)

### Requirement: Product type koans cover projections and construction
`src/02-products-and-coproducts/01-product-types.ts` SHALL have type-level exercises on tuple projection (`Fst`, `Snd`), object property extraction, and pairing/unpairing morphisms.

#### Scenario: Learner implements Fst and Snd
- **WHEN** they replace `TODO` in `type Fst<P extends [unknown, unknown]> = TODO`
- **THEN** associated Expect<Equal<...>> checks pass for several concrete pairs

#### Scenario: Learner extracts object property types
- **WHEN** they implement `type Lookup<O, K extends keyof O> = TODO`
- **THEN** checks pass for string, number, and nested property types

### Requirement: Sum type koans cover injection and elimination
`src/02-products-and-coproducts/02-sum-types.ts` SHALL have exercises on discriminated unions, exhaustive narrowing, and the relationship between union and `never`.

#### Scenario: Learner implements exhaustive case analysis
- **WHEN** they fill in a function that handles all branches of a discriminated union
- **THEN** TypeScript confirms exhaustiveness (the default branch has type `never`) and assert checks pass

#### Scenario: Learner works with union distribution
- **WHEN** they implement `type ToArray<T> = TODO` that distributes over a union
- **THEN** checks verify `ToArray<string | number>` equals `string[] | number[]`

### Requirement: Distributivity koans exist
`src/02-products-and-coproducts/03-distributivity.ts` SHALL have type-level exercises proving `A & (B | C) = (A & B) | (A & C)` and the tuple equivalent.

#### Scenario: Learner proves intersection distributes over union
- **WHEN** they fill in `type Distribute<A, B, C> = TODO` to represent `A & (B | C)`
- **THEN** checks verify it equals `(A & B) | (A & C)` for concrete types

### Requirement: Isomorphism koans exist
`src/02-products-and-coproducts/04-isomorphisms.ts` SHALL have type-level and value-level exercises establishing type isomorphisms (e.g., `[A, B]` ≅ `[B, A]`, `A | B` ≅ `B | A`).

#### Scenario: Learner implements swap for product and coproduct
- **WHEN** they implement `swap: <A, B>(pair: [A, B]) => [B, A]`
- **THEN** assert checks verify round-trip identity and tsc verifies the type
