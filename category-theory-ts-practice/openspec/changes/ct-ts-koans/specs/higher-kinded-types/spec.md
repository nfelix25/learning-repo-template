## ADDED Requirements

### Requirement: README explains why HKT matters and TS's limitation
`src/05-higher-kinded-types/README.md` SHALL explain that TypeScript lacks native higher-kinded types (you cannot write `F<A>` where `F` is a type parameter), and introduce the interface-based encoding that works around this.

#### Scenario: README explains the problem before the solution
- **WHEN** a learner opens the README
- **THEN** they first see WHY we need HKT (to write a generic `Functor<F>` interface), then the encoding pattern

### Requirement: HKT encoding koans exist
`src/05-higher-kinded-types/01-encoding-hkt.ts` SHALL introduce the `URItoKind` interface + `Kind<F, A>` indirection pattern and have type-level exercises using it.

#### Scenario: Learner registers a new type constructor
- **WHEN** they fill in the module augmentation to add `Option` to the `URItoKind` map
- **THEN** `Kind<'Option', string>` resolves to `Option<string>` and Expect<Equal<...>> checks pass

#### Scenario: Learner uses Kind to abstract over the functor
- **WHEN** they fill in a type-level exercise using `Kind<F, A>` for a type parameter `F`
- **THEN** the checks pass showing the indirection works for both `'Array'` and `'Option'`

### Requirement: Generic Functor interface koans exist
`src/05-higher-kinded-types/02-generic-functor.ts` SHALL have exercises defining a `Functor<F>` interface using the HKT encoding and implementing it for `Option` and `Array`.

#### Scenario: Learner defines the Functor interface
- **WHEN** they fill in `interface Functor<F> { map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B> }`
- **THEN** tsc accepts the definition and Expect checks on the type structure pass

#### Scenario: Learner implements Functor instances
- **WHEN** they provide `const optionFunctor: Functor<'Option'> = { map: ... }` and `const arrayFunctor: Functor<'Array'> = { map: ... }`
- **THEN** tsc verifies structural conformance and assert checks verify correct behavior
