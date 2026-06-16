## ADDED Requirements

### Requirement: Koan 01 — The correspondence
The koan SHALL introduce the Curry-Howard correspondence as a reading koan (no blank). It SHALL map: types ↔ propositions, values ↔ proofs, function types ↔ implication, `never` ↔ falsum (⊥), `unknown` ↔ verum (⊤). It SHALL state the core claim: if you can construct a value of type T, you have proved proposition T.

#### Scenario: Reading koan establishes vocabulary
- **WHEN** learner reads the koan
- **THEN** they can match each TypeScript construct to its logical counterpart

### Requirement: Koan 02 — Implication as function type
The koan SHALL show that a proof of `A → B` is a function from `A` to `B`. It SHALL ask the learner to implement type-safe proofs: given `A`, derive `B`, with the type signature doing all the work. Comments SHALL use logical notation `A ⊢ B` alongside TypeScript.

#### Scenario: Prove A → A (identity)
- **WHEN** learner implements `function id<A>(a: A): A`
- **THEN** the type checks and embodies the proof of `A → A`

#### Scenario: Prove A → B → A (constant combinator)
- **WHEN** learner implements the constant function
- **THEN** its type `<A, B>(a: A) => (b: B) => A` encodes the tautology A → (B → A)

#### Scenario: Prove (A → B) → (B → C) → (A → C) (composition)
- **WHEN** learner implements function composition
- **THEN** its type encodes transitivity of implication

### Requirement: Koan 03 — Conjunction as product type
The koan SHALL show that a proof of `A ∧ B` is a pair `[proofOfA, proofOfB]`. It SHALL connect this to TypeScript tuples and object intersection. Learner SHALL implement `fst` and `snd` projections (proofs of `A ∧ B → A` and `A ∧ B → B`).

#### Scenario: Construct a conjunction
- **WHEN** learner implements `function pair<A, B>(a: A, b: B): [A, B]`
- **THEN** this is a proof of `A → B → (A ∧ B)`

#### Scenario: Eliminate left conjunct
- **WHEN** learner implements `function fst<A, B>(pair: [A, B]): A`
- **THEN** this is a proof of `A ∧ B → A`

### Requirement: Koan 04 — Disjunction as union type
The koan SHALL show that a proof of `A ∨ B` is either a proof of `A` or a proof of `B`, and that eliminating a disjunction requires handling both cases. It SHALL connect to TypeScript discriminated unions and exhaustive `switch` statements.

#### Scenario: Introduce left disjunct
- **WHEN** learner implements `function inl<A, B>(a: A): A | B`
- **THEN** this is a proof of `A → (A ∨ B)`

#### Scenario: Eliminate a disjunction
- **WHEN** learner implements a function handling `"cat" | "dog"` exhaustively
- **THEN** TypeScript ensures both cases are covered — the type system enforces the proof obligation

### Requirement: Koan 05 — Negation and ex falso
The koan SHALL define negation as `¬A = A → never`. It SHALL show `ex falso quodlibet` (from a contradiction, anything follows): a function of type `(x: never) => T` is vacuously true. It SHALL attempt double negation elimination and show why it cannot be proven constructively.

#### Scenario: Negation as function to never
- **WHEN** learner defines `type Not<A> = (a: A) => never`
- **THEN** this is the logical negation ¬A

#### Scenario: Ex falso quodlibet
- **WHEN** learner implements `function absurd<T>(x: never): T`
- **THEN** this is the valid proof that from ⊥ anything follows

#### Scenario: Double negation cannot be eliminated
- **WHEN** learner attempts to implement `function dne<A>(proof: Not<Not<A>>): A`
- **THEN** TypeScript cannot provide a value of type `A` — this is not constructively provable

### Requirement: Koan 06 — Universal quantification as generics
The koan SHALL show that `<T>(x: T) => f(x)` is a proof of `∀T. P(T)` — a function that works for all types is a proof of a universal statement. It SHALL contrast this with existential types (approximated via opaque types or closures).

#### Scenario: Generic function as universal proof
- **WHEN** learner implements `function identity<T>(x: T): T`
- **THEN** its type `<T>(x: T) => T` encodes `∀T. T → T`

#### Scenario: What TS cannot express
- **WHEN** learner tries to encode `∃T. T` (there exists a type T with a value)
- **THEN** the koan explains the limitation and shows the closest TypeScript approximation

### Requirement: Koan 07 — What constructive logic cannot prove
The final koan SHALL survey the limits of constructive logic as embodied in TypeScript's type system. It SHALL cover: excluded middle (`A | ¬A` cannot be derived), law of double negation elimination, Peirce's law. Comments SHALL note that TypeScript's type system is an intuitionistic / constructive logic, and why that's actually useful.

#### Scenario: Excluded middle is not provable
- **WHEN** learner attempts to implement `function excludedMiddle<A>(): A | Not<A>`
- **THEN** there is no implementation possible — the type cannot be satisfied generically

#### Scenario: Classical tautologies that fail constructively
- **WHEN** learner reviews the list of classical tautologies
- **THEN** they can identify which are provable in TypeScript and which are not
