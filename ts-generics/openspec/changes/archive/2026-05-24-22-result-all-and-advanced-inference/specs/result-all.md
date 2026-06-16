## ADDED Requirements

### Requirement: all Collects a Tuple of Results
`all<T extends Result<unknown, unknown>[]>(results: [...T]): Result<ResultError<T[number]>, ResultValues<T>>` SHALL return `Ok` with a tuple of all values if every Result is `Ok`, or `Err` with the first error encountered if any Result is `Err`.

#### Scenario: all with all Ok returns Ok tuple
- **WHEN** `all([ok(1), ok("two"), ok(true)])` is called
- **THEN** the return type is `Result<never, [number, string, boolean]>` and the value is `[1, "two", true]`.

#### Scenario: all with one Err returns Err
- **WHEN** `all([ok(1), err("boom"), ok(3)])` is called
- **THEN** an `Err` is returned with error `"boom"`.

#### Scenario: all preserves positional types in the tuple
- **WHEN** `all([ok(42), ok("hello")])` is called
- **THEN** TypeScript infers the success type as `[number, string]`, not `(number | string)[]`.

#### Scenario: all with an empty array returns Ok of empty tuple
- **WHEN** `all([])` is called
- **THEN** the return type is `Result<never, []>` and the value is `[]`.

### Requirement: ResultValues<T> Extracts Success Types as a Tuple
`ResultValues<T extends Result<unknown, unknown>[]>` SHALL produce a tuple type where each position contains the success type of the corresponding Result in `T`.

#### Scenario: ResultValues maps position to value type
- **WHEN** `ResultValues<[Result<E1, string>, Result<E2, number>]>` is evaluated
- **THEN** the result is `[string, number]`.

### Requirement: ResultError<T> Extracts the Error Union
`ResultError<T extends Result<unknown, unknown>[]>` SHALL produce the union of all error types in the tuple.

#### Scenario: ResultError unions all error types
- **WHEN** `ResultError<[Result<string, T1>, Result<number, T2>]>` is evaluated
- **THEN** the result is `string | number`.
