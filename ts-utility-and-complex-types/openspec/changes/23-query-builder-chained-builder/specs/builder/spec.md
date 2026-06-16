## ADDED Requirements

### Requirement: QueryBuilder Generic Type
`QueryBuilder<S, T, State>` SHALL be a generic class where `S` is the schema, `T` is the primary table, and `State` accumulates the query configuration through method calls.

### Requirement: select Method
`.select<Cols extends TableColumn<S, T>>(...cols: Cols[])` SHALL return a new `QueryBuilder` with `State["selectedCols"]` updated to `Cols`.

#### Scenario: select Narrows Builder State
- **WHEN** `.select("users.name", "users.email")` is called
- **THEN** the returned builder's type encodes `selectedCols: "users.name" | "users.email"`

#### Scenario: select Rejects Invalid Column References
- **WHEN** `.select("users.nonexistent")` is called
- **THEN** TypeScript reports a type error

### Requirement: where Method
`.where(clause: WhereClause<S, T>)` SHALL return a new `QueryBuilder` with the WHERE clause recorded in `State`.

### Requirement: limit Method
`.limit(n: number)` SHALL return a new `QueryBuilder` with the limit recorded in `State`.

### Requirement: orderBy Method
`.orderBy(col: TableColumn<S, T>, direction?: "ASC" | "DESC")` SHALL return a new `QueryBuilder` with the order recorded in `State`.

### Requirement: execute Method Requires Prior select
`.execute()` SHALL only be callable when `State["selectedCols"]` is not `never` (i.e., at least one column has been selected).

#### Scenario: execute Is Rejected Without select
- **WHEN** `.execute()` is called on a fresh `QueryBuilder` without a prior `.select()`
- **THEN** TypeScript reports a type error
