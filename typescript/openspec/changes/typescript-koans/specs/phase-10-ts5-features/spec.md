## ADDED Requirements

### Requirement: k-040 covers new TC39 decorators (TypeScript 5.0)
Koan 040 SHALL cover the new TC39 stage 3 decorator syntax (not the legacy `experimentalDecorators` syntax). The narrative SHALL explain that TS 5.0 implements the standardized spec: decorators are functions receiving the decorated value and a context object.

#### Scenario: Class decorator wraps a class
- **WHEN** the learner implements a `@sealed` class decorator
- **THEN** runtime tests confirm `Object.isSealed(instance)` is true

#### Scenario: Method decorator wraps method behavior
- **WHEN** the learner implements a `@log` method decorator
- **THEN** runtime tests confirm calls to the decorated method produce a log side-effect

### Requirement: k-041 covers decorator metadata (TypeScript 5.2)
Koan 041 SHALL cover the `context.metadata` object available in TS 5.2 decorators, allowing decorators to attach metadata to the class that is accessible via `Symbol.metadata`.

#### Scenario: Decorator attaches metadata to a class
- **WHEN** the learner implements a `@route("/users")` decorator
- **THEN** runtime tests confirm `MyClass[Symbol.metadata].route === "/users"`

#### Scenario: Multiple decorators accumulate metadata
- **WHEN** multiple `@role` decorators are applied to methods
- **THEN** runtime tests confirm all role metadata is present on the class

### Requirement: k-042 covers using and Symbol.dispose (TypeScript 5.2)
Koan 042 SHALL cover the Explicit Resource Management proposal: the `using` keyword, `Symbol.dispose`, and the `Disposable` interface. The narrative SHALL explain that `using` is a compile-time transform to a try/finally block.

#### Scenario: Disposable resource is cleaned up on scope exit
- **WHEN** the learner implements a `Disposable` resource and uses it with `using`
- **THEN** runtime tests confirm `dispose()` is called even when the scope exits via return (not exception)

#### Scenario: Disposable resource is cleaned up on exception
- **WHEN** the block throws before exiting normally
- **THEN** runtime tests confirm `dispose()` is called before the exception propagates

### Requirement: k-043 covers async disposal (TypeScript 5.2)
Koan 043 SHALL cover `Symbol.asyncDispose`, `AsyncDisposable`, `await using`, and `AsyncDisposableStack` for resources that require async cleanup.

#### Scenario: await using calls asyncDispose on exit
- **WHEN** the learner implements an `AsyncDisposable` resource
- **THEN** runtime tests confirm `asyncDispose()` is awaited on scope exit

### Requirement: k-044 covers getter/setter type flexibility (TypeScript 5.1)
Koan 044 SHALL cover the TS 5.1 relaxation allowing getter and setter to have different types when both have explicit type annotations.

#### Scenario: Getter returns a different type than setter accepts
- **WHEN** the learner writes a class with `get value(): string` and `set value(v: string | number)`
- **THEN** `tsc --noEmit` compiles without error and type assertions confirm the getter returns `string`

### Requirement: k-045 covers switch(true) narrowing (TypeScript 5.3)
Koan 045 SHALL cover the TS 5.3 feature that allows TypeScript to narrow types based on the condition in each `case` clause within `switch(true)`.

#### Scenario: switch(true) narrows in each case
- **WHEN** the learner implements a discriminator using `switch(true)` with type guard conditions
- **THEN** type assertions confirm each case body has the correctly narrowed type

### Requirement: k-046 covers Object.groupBy and Map.groupBy types (TypeScript 5.4)
Koan 046 SHALL cover the type signatures of `Object.groupBy` and `Map.groupBy`, noting that the return type uses `Partial<Record<>>` because TypeScript cannot prove all keys will be present.

#### Scenario: groupBy result has Partial record type
- **WHEN** the learner uses `Object.groupBy(array, fn)`
- **THEN** type assertions confirm the return type has optional (not required) values for each key

### Requirement: k-047 covers new Set methods (TypeScript 5.5)
Koan 047 SHALL cover the types for `Set.prototype.union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, and `isDisjointFrom`.

#### Scenario: Set.union returns a new Set with merged elements
- **WHEN** the learner calls `setA.union(setB)`
- **THEN** runtime tests and type assertions confirm the result is a `Set` containing all elements of both

#### Scenario: Set.intersection returns only shared elements
- **WHEN** the learner calls `setA.intersection(setB)`
- **THEN** runtime tests confirm the result contains only elements present in both sets

### Requirement: k-048 covers never-initialized variable detection (TypeScript 5.7)
Koan 048 SHALL explain that TS 5.7 reports an error when a variable is declared but never assigned before use, catching a class of bugs that previously only surfaced at runtime.

#### Scenario: Reading an uninitialized variable produces a compile error
- **WHEN** the learner examines a pre-written example with an uninitialized variable
- **THEN** `tsc --noEmit` reports an error (the koan task is to fix the initialization)
