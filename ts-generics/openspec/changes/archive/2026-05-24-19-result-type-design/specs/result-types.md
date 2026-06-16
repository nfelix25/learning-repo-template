## ADDED Requirements

### Requirement: Ok<T> Represents a Successful Result
`Ok<T>` SHALL be a readonly discriminated type with `_tag: "Ok"` and `value: T`.

#### Scenario: Ok type is discriminated
- **WHEN** a value has type `Ok<string>`
- **THEN** `result._tag === "Ok"` narrows TypeScript to `Ok<string>` and `result.value` is accessible as `string`.

### Requirement: Err<E> Represents a Failed Result
`Err<E>` SHALL be a readonly discriminated type with `_tag: "Err"` and `error: E`.

#### Scenario: Err type is discriminated
- **WHEN** a value has type `Err<Error>`
- **THEN** `result._tag === "Err"` narrows TypeScript to `Err<Error>` and `result.error` is accessible as `Error`.

### Requirement: Result<E, T> Is the Union of Ok and Err
`Result<E, T>` SHALL equal `Ok<T> | Err<E>`.

#### Scenario: Result accepts both Ok and Err
- **WHEN** a function is declared to return `Result<string, number>`
- **THEN** returning `ok(42)` and returning `err("not found")` are both valid without casts.

### Requirement: ok() Factory Returns Ok<T>
`ok<T>(value: T): Ok<T>` SHALL return an `Ok<T>`, not the wider `Result<never, T>`.

#### Scenario: ok preserves the specific subtype
- **WHEN** `const r = ok(42)`
- **THEN** `r` has type `Ok<number>`, not `Result<never, number>`.

### Requirement: err() Factory Returns Err<E>
`err<E>(error: E): Err<E>` SHALL return an `Err<E>`, not the wider `Result<E, never>`.

#### Scenario: err preserves the specific subtype
- **WHEN** `const r = err("not found")`
- **THEN** `r` has type `Err<string>`, not `Result<string, never>`.

### Requirement: isOk and isErr Are Type Predicates
`isOk(r: Result<E, T>): r is Ok<T>` and `isErr(r: Result<E, T>): r is Err<E>` SHALL narrow the union correctly after the check.

#### Scenario: isOk narrows to Ok<T>
- **WHEN** `isOk(result)` returns `true`
- **THEN** TypeScript narrows `result` to `Ok<T>` and `result.value` is accessible.

#### Scenario: isErr narrows to Err<E>
- **WHEN** `isErr(result)` returns `true`
- **THEN** TypeScript narrows `result` to `Err<E>` and `result.error` is accessible.
