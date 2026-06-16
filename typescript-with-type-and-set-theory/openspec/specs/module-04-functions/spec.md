## ADDED Requirements

### Requirement: Koan 01 — Generics as type-level functions
The koan SHALL establish the lambda calculus analogy explicitly: `type Box<T> = { value: T }` is a type-level function `λT. { value: T }`. Type application `Box<string>` is function application. Comments SHALL use λ notation alongside TypeScript syntax.

#### Scenario: Generic as function application
- **WHEN** learner fills in `type Applied = Box<string>`
- **THEN** `Equal<Applied, { value: string }>` passes

#### Scenario: Generic identity function
- **WHEN** learner implements `type Identity<T> = TODO`
- **THEN** `Equal<Identity<string>, string>` and `Equal<Identity<42>, 42>` pass

### Requirement: Koan 02 — Generic constraints as domain restriction
The koan SHALL teach `<T extends U>` as restricting the domain of the type function to inputs that are subtypes of `U`. It SHALL show that `<T extends string>` means T must come from the set of string subtypes. Learner SHALL implement constrained generics.

#### Scenario: Constraint enforced
- **WHEN** learner implements `type Uppercase<T extends string> = TODO`
- **THEN** applying it to `number` is a type error

#### Scenario: keyof constraint
- **WHEN** learner implements `type GetProp<T, K extends keyof T> = TODO`
- **THEN** `Equal<GetProp<{ a: string }, "a">, string>` passes

### Requirement: Koan 03 — Mapped types as type-level map
The koan SHALL teach mapped types `{ [K in keyof T]: ... }` as mapping a function over the keys of a type. Comments SHALL draw the explicit analogy to `Array.prototype.map`. Learner SHALL implement Readonly, Partial, and a custom value-transforming mapped type.

#### Scenario: Mapped type transforms values
- **WHEN** learner implements `type Nullable<T> = TODO`
- **THEN** `Equal<Nullable<{ a: string; b: number }>, { a: string | null; b: number | null }>` passes

#### Scenario: Remapping keys
- **WHEN** learner implements `type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] }`
- **THEN** `Equal<Getters<{ name: string }>, { getName: () => string }>` passes

### Requirement: Koan 04 — Template literal types
The koan SHALL teach template literal types as string manipulation at the type level. It SHALL cover: basic interpolation, `Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`, and building an event-name utility type.

#### Scenario: String interpolation in types
- **WHEN** learner fills in a template literal type
- **THEN** `Equal<Answer, "on:click" | "on:focus">` passes for appropriate input

#### Scenario: Event handler naming
- **WHEN** learner implements `type EventName<T extends string> = \`on${Capitalize<T>}\``
- **THEN** `Equal<EventName<"click">, "onClick">` passes

### Requirement: Koan 05 — Church encoding (capstone)
The koan SHALL implement Church encoding of booleans and natural numbers entirely in TypeScript's type system. Comments SHALL explain Church encoding: represent data as functions, where the data IS the behavior. This is marked as advanced/optional in the file header. The implementation SHALL use generic type aliases as type-level functions.

Church booleans:
- `True<A, B> = A` (picks first argument)
- `False<A, B> = B` (picks second argument)
- `If<Cond, Then, Else> = Cond<Then, Else>`
- `And<P, Q>`, `Or<P, Q>`, `Not<P>`

Church naturals (abbreviated — zero, successor, addition):
- `Zero<F, X> = X`
- `One<F, X> = F<X>`
- `Two<F, X> = F<F<X>>`
- `Add<M, N>`

#### Scenario: Church boolean If
- **WHEN** learner implements Church `If` and fills in the blank
- **THEN** `Equal<If<ChurchTrue, "yes", "no">, "yes">` passes

#### Scenario: Church boolean And
- **WHEN** learner implements `And<ChurchTrue, ChurchFalse>`
- **THEN** result is `ChurchFalse`

#### Scenario: Church successor
- **WHEN** learner implements `Succ<Zero>`
- **THEN** it is equal to `One` in observable behavior

#### Scenario: Type-level addition
- **WHEN** learner implements `Add<Two, Three>`
- **THEN** the result applied to a successor function and initial value gives 5 applications
