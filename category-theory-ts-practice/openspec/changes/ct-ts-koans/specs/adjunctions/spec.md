## ADDED Requirements

### Requirement: README explains adjunctions via curry/uncurry
`src/07-adjunctions/README.md` SHALL introduce adjunctions through the most accessible example: the currying adjunction. It SHALL explain that `Hom(A × B, C) ≅ Hom(A, B → C)` is a natural isomorphism, connecting product types and function types.

#### Scenario: README exists and explains the curry/uncurry isomorphism
- **WHEN** a learner opens the README
- **THEN** they understand that `curry` and `uncurry` are inverses and that this isomorphism is natural (commutes with morphisms on either side)

### Requirement: Currying koans exist
`src/07-adjunctions/01-currying.ts` SHALL have type-level exercises on the isomorphism between `(a: A, b: B) => C` and `(a: A) => (b: B) => C`, and value-level exercises implementing `curry` and `uncurry`.

#### Scenario: Learner implements curry
- **WHEN** they implement `curry: <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C`
- **THEN** assert checks verify `curry(f)(a)(b)` equals `f(a, b)` for sample inputs

#### Scenario: Learner implements uncurry
- **WHEN** they implement `uncurry: <A, B, C>(f: (a: A) => (b: B) => C) => (a: A, b: B) => C`
- **THEN** assert checks verify `uncurry(curry(f))` round-trips correctly

#### Scenario: Type-level checks verify the isomorphism
- **WHEN** type-level exercises encode `Curry<(a: A, b: B) => C>` and `Uncurry<(a: A) => (b: B) => C>`
- **THEN** Expect<Equal<...>> checks confirm they produce the expected types

### Requirement: Products and exponentials koans exist
`src/07-adjunctions/02-products-and-exponentials.ts` SHALL have type-level exercises exploring the relationship between product types (×) and function types (→), including type-level `Curry` and `Uncurry` operators.

#### Scenario: Learner implements type-level Curry
- **WHEN** they fill in `type Curry<F> = TODO` for a function type `(a: A, b: B) => C`
- **THEN** Expect<Equal<Curry<(a: string, b: number) => boolean>, (a: string) => (b: number) => boolean>> passes

#### Scenario: Learner reasons about the universal property
- **WHEN** they complete exercises showing that any `(a: A, b: B) => C` factors uniquely through currying
- **THEN** type checks pass confirming the round-trip identities at the type level
