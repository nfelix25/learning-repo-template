## ADDED Requirements

### Requirement: k-035 covers branded and nominal types
Koan 035 SHALL explain that TypeScript's structural type system treats `type UserId = string` and `type ProductId = string` as identical. Branding attaches a unique phantom property to make them nominally distinct. The koan SHALL cover both the intersection-based brand pattern and the unique symbol brand.

#### Scenario: Branded types are not mutually assignable
- **WHEN** the learner implements `UserId` and `ProductId` as branded strings
- **THEN** `tsc --noEmit` reports an error when a `ProductId` is passed where a `UserId` is expected

#### Scenario: Brand is stripped at the call site via a constructor function
- **WHEN** the learner implements a `brand<T>()` helper
- **THEN** runtime tests confirm a branded value equals its underlying primitive value

### Requirement: k-036 covers phantom types
Koan 036 SHALL explain phantom types: type parameters that exist only at the type level and carry no runtime representation, used to encode state machines and lifecycle stages in the type system.

#### Scenario: State machine encoded in phantom type prevents invalid transitions
- **WHEN** the learner implements a `Connection<State>` type with `Open` and `Closed` phantom states
- **THEN** `tsc --noEmit` reports an error when calling a method only valid on `Connection<Open>` with a `Connection<Closed>` value

#### Scenario: Phantom types have zero runtime cost
- **WHEN** the learner inspects the JavaScript output of phantom type code
- **THEN** the runtime representation is identical to the untagged version (no extra properties)

### Requirement: k-037 covers covariance and contravariance
Koan 037 SHALL explain that TypeScript uses structural subtyping, that function parameter types are contravariant (the input must be broader or equal), and that return types are covariant (the output must be narrower or equal). The narrative SHALL use concrete examples of why this matters for callback safety.

#### Scenario: Covariant return type: narrower is assignable to broader
- **WHEN** a function returning `string` is used where a function returning `string | number` is expected
- **THEN** type assertions confirm this is valid (string is a subtype of string | number)

#### Scenario: Contravariant parameter type: broader is assignable to narrower
- **WHEN** a function accepting `string | number` is used where a function accepting `string` is expected
- **THEN** type assertions confirm this is valid

#### Scenario: strictFunctionTypes enables bivariance detection
- **WHEN** a method (not arrow function) assignment violates variance
- **THEN** the koan comment explains why method syntax is exempt from strict function type checking and what the implication is

### Requirement: k-038 covers the builder pattern with type accumulation
Koan 038 SHALL implement a fluent builder where each method call narrows or extends the type, culminating in a terminal method that is only available when all required fields have been set.

#### Scenario: Builder accumulates field types via generic chaining
- **WHEN** the learner implements `builder().name("Alice").age(30).build()`
- **THEN** type assertions confirm `.build()` returns `{ name: string; age: number }` with both fields present

#### Scenario: build() is not available until required fields are set
- **WHEN** the learner calls `.build()` before setting all required fields
- **THEN** `tsc --noEmit` reports a type error (the method does not exist on the intermediate builder type)

### Requirement: k-039 covers type-safe event emitters
Koan 039 SHALL implement a generic event emitter where `.on(event, handler)` and `.emit(event, payload)` are both type-safe: the handler's parameter type must match the event's payload type.

#### Scenario: Handler receives correctly typed payload
- **WHEN** the learner implements `TypedEventEmitter<Events>`
- **THEN** type assertions confirm `.on("message", (msg) => ...)` infers `msg` as the correct payload type for "message"

#### Scenario: emit enforces correct payload type
- **WHEN** the learner calls `.emit("message", wrongType)`
- **THEN** `tsc --noEmit` reports a type error
