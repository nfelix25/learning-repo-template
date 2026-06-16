## ADDED Requirements

### Requirement: ExecuteResult Utility Type
`ExecuteResult<State, S>` SHALL compute the TypeScript type of a single result row from the accumulated `QueryState`, by mapping each selected `"table.column"` reference to its schema-derived primitive type with correct nullable handling.

#### Scenario: ExecuteResult Maps Selected Columns to Primitive Types
- **WHEN** `State["selectedCols"]` is `"users.name" | "users.email"` and neither column is nullable
- **THEN** `ExecuteResult<State, AppSchema>` is `{ "users.name": string; "users.email": string }` (or equivalent with column names as keys)

#### Scenario: ExecuteResult Preserves Schema Nullability
- **WHEN** `State["selectedCols"]` includes `"posts.deletedAt"` (which is nullable in the schema)
- **THEN** the corresponding key in `ExecuteResult` is `Date | null`

#### Scenario: ExecuteResult Applies LEFT JOIN Nullability
- **WHEN** `"posts"` is in `State["nullableTables"]` and `"posts.title"` is selected
- **THEN** the corresponding key in `ExecuteResult` is `string | null` even though `title` is non-nullable in the schema

### Requirement: execute Returns Typed Promise
`.execute()` SHALL return `Promise<ExecuteResult<State, S>[]>`.

#### Scenario: execute Return Type Matches Selected Columns
- **WHEN** a builder selects `"users.name"` and `"users.email"` and `.execute()` is called
- **THEN** the return type is `Promise<{ "users.name": string; "users.email": string }[]>` (or equivalent)
