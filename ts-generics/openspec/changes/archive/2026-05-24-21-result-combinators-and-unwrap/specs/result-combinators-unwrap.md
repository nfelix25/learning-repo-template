## ADDED Requirements

### Requirement: fold Exhaustively Matches Both Branches
`fold<E, T, U>(result: Result<E, T>, onErr: (e: E) => U, onOk: (t: T) => U): U` SHALL call `onErr` for `Err` and `onOk` for `Ok`, both returning `U`.

#### Scenario: fold on Ok calls onOk
- **WHEN** `fold(ok(42), e => 0, t => t * 2)` is called
- **THEN** the return value is `84`.

#### Scenario: fold on Err calls onErr
- **WHEN** `fold(err("bad"), e => -1, t => t * 2)` is called
- **THEN** the return value is `-1`.

### Requirement: unwrapOr Returns Value or Fallback
`unwrapOr<E, T>(result: Result<E, T>, fallback: T): T` SHALL return `value` for `Ok` and `fallback` for `Err`.

#### Scenario: unwrapOr on Ok returns value
- **WHEN** `unwrapOr(ok("hello"), "default")` is called
- **THEN** the return value is `"hello"`.

#### Scenario: unwrapOr on Err returns fallback
- **WHEN** `unwrapOr(err("oops"), "default")` is called
- **THEN** the return value is `"default"`.

### Requirement: unwrapOrElse Computes Fallback Lazily
`unwrapOrElse<E, T>(result: Result<E, T>, fallback: (e: E) => T): T` SHALL call `fallback` only for `Err`, passing the error value.

#### Scenario: unwrapOrElse on Err calls fallback with the error
- **WHEN** `unwrapOrElse(err(404), code => \`default for \${code}\`)` is called
- **THEN** the fallback is called with `404` and the return value is `"default for 404"`.

### Requirement: getOrThrow Throws on Err
`getOrThrow<E, T>(result: Result<E, T>): T` SHALL return `value` for `Ok` and throw the error value for `Err`.

#### Scenario: getOrThrow on Ok returns value
- **WHEN** `getOrThrow(ok(99))` is called
- **THEN** the return value is `99` with no exception thrown.

#### Scenario: getOrThrow on Err throws
- **WHEN** `getOrThrow(err(new Error("boom")))` is called
- **THEN** an `Error` with message `"boom"` is thrown.
