## ADDED Requirements

### Requirement: Koan 01 — Identity and annihilation laws
The koan SHALL prove the four fundamental laws: `T | never = T` (never is identity for union), `T & unknown = T` (unknown is identity for intersection), `T | unknown = unknown` (unknown annihilates union), `T & never = never` (never annihilates intersection). Tests SHALL verify each law for a concrete type `T = string`.

#### Scenario: Identity laws verified
- **WHEN** learner completes the koan
- **THEN** all four law assertions pass for `T = string`

### Requirement: Koan 02 — Commutativity and associativity
The koan SHALL show that union and intersection are both commutative and associative at the type level. It SHALL include tests verifying `A | B = B | A`, `A & B = B & A`, and the associative groupings for both operators.

#### Scenario: Union is commutative
- **WHEN** learner evaluates `Equal<"a" | "b", "b" | "a">`
- **THEN** it resolves to `true`

#### Scenario: Intersection is associative
- **WHEN** learner evaluates the associative groupings of `A & B & C`
- **THEN** both groupings are equal

### Requirement: Koan 03 — Distributivity
The koan SHALL prove the distributive law: `A & (B | C) = (A & B) | (A & C)`. It SHALL use concrete types and ask the learner to expand the distributed form. A comment SHALL note this is the same distributive law from boolean algebra.

#### Scenario: Distribute intersection over union
- **WHEN** learner fills in the expanded form of `string & (number | boolean)`
- **THEN** `Equal<Answer, (string & number) | (string & boolean)>` passes and both sides simplify to `never`

#### Scenario: Dual: distribute union over intersection
- **WHEN** learner fills in the expanded form of `"a" | ("b" & "c")`
- **THEN** the result reflects the correct distributive expansion

### Requirement: Koan 04 — Complement: Exclude and Extract
The koan SHALL teach `Exclude<T, U>` as set difference (A \ B) and `Extract<T, U>` as the intersection-from-a-union perspective. It SHALL build these from scratch using conditional types before revealing the built-in names, so the learner understands what the utilities do.

#### Scenario: Exclude removes matching members
- **WHEN** learner evaluates `Exclude<"a" | "b" | "c", "a">`
- **THEN** result is `"b" | "c"`

#### Scenario: Extract keeps matching members
- **WHEN** learner evaluates `Extract<"a" | "b" | number, string>`
- **THEN** result is `"a" | "b"`

#### Scenario: Build Exclude from scratch
- **WHEN** learner implements `type MyExclude<T, U> = TODO`
- **THEN** `Equal<MyExclude<"a" | "b" | "c", "a">, "b" | "c">` passes

### Requirement: Koan 05 — Object subtyping: the counterintuitive reversal
The koan SHALL deeply explore why more fields = smaller set of possible values = subtype. It SHALL: contrast set-of-properties thinking with set-of-values thinking, show structural typing via duck typing, and distinguish assignability from excess property checking (a separate syntactic rule, not a type-system rule).

#### Scenario: More fields is a subtype
- **WHEN** learner assigns a value of type `{ name: string; age: number }` to `{ name: string }`
- **THEN** no type error occurs (it's assignable)

#### Scenario: Excess property check fires on object literals only
- **WHEN** learner assigns an object literal `{ name: "Alice", age: 30 }` directly to `{ name: string }`
- **THEN** TypeScript reports an excess property error

#### Scenario: Excess property check does not fire on variables
- **WHEN** the same object is first stored in a variable then assigned
- **THEN** no excess property error occurs

### Requirement: Koan 06 — Variance: covariance and contravariance
The koan SHALL teach function type variance. Return types are covariant (if `Dog extends Animal`, then `() => Dog` extends `() => Animal`). Parameter types are contravariant (if `Dog extends Animal`, then `(x: Animal) => void` extends `(x: Dog) => void`). Comments SHALL include the intuitive explanation: a function that handles any Animal certainly handles a Dog, but not vice versa.

#### Scenario: Return type covariance
- **WHEN** learner evaluates `Extends<() => "cat", () => string>`
- **THEN** it resolves to `true`

#### Scenario: Parameter type contravariance
- **WHEN** learner evaluates `Extends<(x: string) => void, (x: "cat") => void>`
- **THEN** it resolves to `true`

#### Scenario: Covariant position in parameter is not assignable
- **WHEN** learner evaluates `Extends<(x: "cat") => void, (x: string) => void>`
- **THEN** it resolves to `false`

### Requirement: Koan 07 — The any anomaly
The koan SHALL explicitly call out that `any` breaks the set model. `any` is simultaneously assignable to and from every type — it is both a subtype and supertype of everything, which is impossible for a real set. Comments SHALL explain it as a deliberate escape hatch and show why `Equal<any, string>` returns `false` under the strict `Equal` implementation.

#### Scenario: any extends everything
- **WHEN** learner evaluates `Extends<any, string>`
- **THEN** it resolves to `boolean` (not `true` or `false` — any makes conditionals non-deterministic)

#### Scenario: everything extends any
- **WHEN** learner evaluates `Extends<string, any>`
- **THEN** it resolves to `true`

#### Scenario: any is not strictly equal to anything
- **WHEN** learner evaluates `Equal<any, any>`
- **THEN** it resolves to `true` (self-equal only)

#### Scenario: any is not equal to other types
- **WHEN** learner evaluates `Equal<any, string>`
- **THEN** it resolves to `false`
