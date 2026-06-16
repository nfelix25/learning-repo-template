## ADDED Requirements

### Requirement: Koan 01 — What is a type?
The first koan SHALL introduce the mental model: a type is a set of values. It SHALL show that `string` is the (infinite) set of all string values, `number` the set of all numbers, and a literal type like `"hello"` is a singleton set containing exactly one value. No blank to fill in — this is a pure reading koan that sets vocabulary for everything that follows.

#### Scenario: Reading koan
- **WHEN** learner opens `01-what-is-a-type.ts`
- **THEN** they can read the set-theoretic framing and verify the illustrative type assertions pass as-is

### Requirement: Koan 02 — The empty set (never)
The koan SHALL teach that `never` is the TypeScript name for the empty set ∅. It SHALL include: the logical interpretation (⊥, the bottom type), the fact that no value has type `never`, and the vacuous function `(x: never) => T`. Tests SHALL verify the identity laws: `never | T = T` and `never & T = never`.

#### Scenario: Fill in never
- **WHEN** learner fills `TODO` with `never`
- **THEN** all tests including identity law tests pass

#### Scenario: Identity law for union
- **WHEN** learner evaluates `Equal<never | string, string>`
- **THEN** it resolves to `true`

### Requirement: Koan 03 — The universal set (unknown)
The koan SHALL teach that `unknown` is the TypeScript name for the universal set 𝕌. It SHALL contrast `unknown` with `any`, explain that you cannot use an `unknown` value without narrowing, and show the dual identity laws: `unknown & T = T` and `unknown | T = unknown`.

#### Scenario: Fill in unknown
- **WHEN** learner fills `TODO` with `unknown`
- **THEN** all tests pass

#### Scenario: Universal set absorbs union
- **WHEN** learner evaluates `Equal<unknown | string, unknown>`
- **THEN** it resolves to `true`

### Requirement: Koan 04 — Literal types as singletons
The koan SHALL teach that literal types (`42`, `"hello"`, `true`) are singleton sets — sets containing exactly one value. It SHALL show type widening (a `let` variable widens `42` to `number`), `as const` preventing widening, and the relationship `42 extends number` (singleton ⊆ infinite set).

#### Scenario: Literal is a subset of its primitive
- **WHEN** learner evaluates `Extends<42, number>`
- **THEN** it resolves to `true`

#### Scenario: Primitive is not a subset of literal
- **WHEN** learner evaluates `Extends<number, 42>`
- **THEN** it resolves to `false`

### Requirement: Koan 05 — Union types (set union ∪)
The koan SHALL teach union as set union. It SHALL include: constructing a union from two literal sets, showing that `|` deduplicates (`"a" | "a" = "a"`), and demonstrating that a value of union type belongs to at least one member set.

#### Scenario: Union of disjoint sets
- **WHEN** learner fills in the union of `"cat"` and `"dog"`
- **THEN** `Equal<Answer, "cat" | "dog">` passes

#### Scenario: Union deduplicates
- **WHEN** learner evaluates `Equal<"a" | "a", "a">`
- **THEN** it resolves to `true`

### Requirement: Koan 06 — Intersection types (set intersection ∩)
The koan SHALL teach intersection as set intersection, with the crucial object-type nuance: `A & B` on object types means "values satisfying BOTH constraints" (which is a *larger* set of properties, not a smaller one). It SHALL show: `string & number = never`, `"cat" & string = "cat"`, and the object case.

#### Scenario: Incompatible intersection is never
- **WHEN** learner evaluates `Equal<string & number, never>`
- **THEN** it resolves to `true`

#### Scenario: Literal intersection with primitive yields literal
- **WHEN** learner evaluates `Equal<"cat" & string, "cat">`
- **THEN** it resolves to `true`

#### Scenario: Object intersection merges properties
- **WHEN** learner fills in `{ name: string } & { age: number }`
- **THEN** `Equal<Answer, { name: string; age: number }>` passes

### Requirement: Koan 07 — Assignability as subset (extends)
The koan SHALL teach that `A extends B` means "A is a subset of B" — that is, every value in A is also in B. It SHALL cover: `42 extends number`, the counterintuitive object case (`{ name: string; age: number } extends { name: string }` is `true` because more-specific = smaller set), and using `extends` in a type-level conditional to test subset membership.

#### Scenario: Narrower object extends broader
- **WHEN** learner evaluates `Extends<{ name: string; age: number }, { name: string }>`
- **THEN** it resolves to `true`

#### Scenario: Broader object does not extend narrower
- **WHEN** learner evaluates `Extends<{ name: string }, { name: string; age: number }>`
- **THEN** it resolves to `false`

#### Scenario: Literal extends its primitive
- **WHEN** learner evaluates `Extends<"hello", string>`
- **THEN** it resolves to `true`

### Requirement: Koan 08 — The subtype lattice
The final koan in module 01 SHALL introduce the full subtype lattice: `never` at the bottom, `unknown` at the top, all other types in between. It SHALL show that every type extends `unknown`, `never` extends every type, and `never` is at the bottom of the lattice. A diagram in the comments SHALL make this visual.

#### Scenario: Everything extends unknown
- **WHEN** learner evaluates `Extends<string, unknown>`
- **THEN** it resolves to `true`

#### Scenario: never extends everything
- **WHEN** learner evaluates `Extends<never, string>`
- **THEN** it resolves to `true`

#### Scenario: nothing extends never (except never itself)
- **WHEN** learner evaluates `Extends<string, never>`
- **THEN** it resolves to `false`
