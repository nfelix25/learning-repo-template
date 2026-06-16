## ADDED Requirements

### Requirement: map Transforms the Success Value
`map<E, T, U>(result: Result<E, T>, f: (value: T) => U): Result<E, U>` SHALL apply `f` to the value if the result is `Ok`, or pass through the `Err` unchanged.

#### Scenario: map on Ok applies the function
- **WHEN** `map(ok(5), x => x * 2)` is called
- **THEN** the return type is `Result<never, number>` and the value is `10`.

#### Scenario: map on Err passes through
- **WHEN** `map(err("oops"), x => x * 2)` is called
- **THEN** the return type is `Result<string, number>` and the error is `"oops"`.

#### Scenario: map infers U from the callback return type
- **WHEN** `map(ok("hello"), s => s.length)` is called
- **THEN** TypeScript infers the return type as `Result<never, number>` without explicit annotation.

### Requirement: flatMap Threads Result-Returning Functions
`flatMap<E, T, F, U>(result: Result<E, T>, f: (value: T) => Result<F, U>): Result<E | F, U>` SHALL apply `f` if the result is `Ok` and return the new Result, accumulating the error union.

#### Scenario: flatMap on Ok applies and flattens
- **WHEN** `flatMap(ok(5), x => x > 0 ? ok(x) : err("negative"))` is called
- **THEN** the return type is `Result<string, number>` and the value is `5`.

#### Scenario: flatMap on Err short-circuits
- **WHEN** `flatMap(err("first error"), x => ok(x * 2))` is called
- **THEN** the error `"first error"` is preserved and `f` is not called.

### Requirement: mapErr Transforms the Error Value
`mapErr<E, T, F>(result: Result<E, T>, f: (error: E) => F): Result<F, T>` SHALL apply `f` to the error if the result is `Err`, or pass through the `Ok` unchanged.

#### Scenario: mapErr on Err transforms the error
- **WHEN** `mapErr(err(404), code => new HttpError(code))` is called
- **THEN** the return type is `Result<HttpError, never>` and the error is an `HttpError` instance.

#### Scenario: mapErr on Ok passes through
- **WHEN** `mapErr(ok("value"), code => new HttpError(code))` is called
- **THEN** the value `"value"` is preserved and `f` is not called.
