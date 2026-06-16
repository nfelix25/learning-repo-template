## ADDED Requirements

### Requirement: ColumnNames Utility Type
`ColumnNames<S, T>` SHALL produce a union of all column name string literals for table `T` in schema `S`.

#### Scenario: ColumnNames Returns All Column Names
- **WHEN** `ColumnNames<AppSchema, "users">` is evaluated
- **THEN** the type is `"id" | "name" | "email" | "createdAt"` (or equivalent union)

### Requirement: ColumnType Utility Type
`ColumnType<S, T, Col>` SHALL produce the TypeScript primitive type for column `Col` in table `T`, including `| null` when the column's `nullable` is `true`.

#### Scenario: ColumnType for Non-Nullable String Column
- **WHEN** `ColumnType<AppSchema, "users", "name">` is evaluated
- **THEN** the type is `string`

#### Scenario: ColumnType for Nullable Date Column
- **WHEN** `ColumnType<AppSchema, "posts", "deletedAt">` is evaluated
- **THEN** the type is `Date | null`

### Requirement: SelectResult Utility Type
`SelectResult<S, T, Cols>` SHALL produce an object type mapping each selected column name in `Cols` to its `ColumnType`.

#### Scenario: SelectResult Maps Selected Columns to Their Types
- **WHEN** `SelectResult<AppSchema, "users", "name" | "email">` is evaluated
- **THEN** the type is `{ name: string; email: string }`

#### Scenario: SelectResult Includes Nullable Columns Correctly
- **WHEN** `SelectResult<AppSchema, "posts", "title" | "deletedAt">` is evaluated
- **THEN** the type is `{ title: string; deletedAt: Date | null }`
