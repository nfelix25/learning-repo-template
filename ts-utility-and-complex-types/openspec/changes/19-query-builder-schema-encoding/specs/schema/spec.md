## ADDED Requirements

### Requirement: Column Descriptor Type
`Column` SHALL describe a single database column with `dataType: "string" | "number" | "boolean" | "date"`, `nullable: boolean`, and `primaryKey: boolean`.

#### Scenario: Column Captures Data Type and Nullability
- **WHEN** a column is defined as `{ dataType: "string", nullable: false, primaryKey: false }`
- **THEN** it is assignable to `Column` and its `nullable` field is the literal type `false`

### Requirement: TableSchema Type
`TableSchema` SHALL be a record mapping column name strings to `Column` descriptors.

#### Scenario: TableSchema Accepts a Valid Table Definition
- **WHEN** a table schema maps `"id"` to a non-nullable number primary key and `"name"` to a non-nullable string
- **THEN** it is assignable to `TableSchema`

### Requirement: DatabaseSchema Type
`DatabaseSchema` SHALL be a record mapping table name strings to `TableSchema` values.

#### Scenario: DatabaseSchema Accepts Multiple Tables
- **WHEN** a schema maps `"users"` and `"posts"` to valid `TableSchema` values
- **THEN** it is assignable to `DatabaseSchema`

### Requirement: AppSchema Sample Schema
`AppSchema` SHALL be a `DatabaseSchema` constant exported for use by all later build lessons, containing at minimum `users` (id, name, email, createdAt) and `posts` (id, userId, title, body, publishedAt, deletedAt) tables. `deletedAt` SHALL be nullable; all other columns SHALL be non-nullable.

#### Scenario: AppSchema Is the Correct Type
- **WHEN** `AppSchema` is used as a `DatabaseSchema`
- **THEN** TypeScript accepts it without error

#### Scenario: AppSchema Nullable Column
- **WHEN** accessing `AppSchema["posts"]["deletedAt"]["nullable"]`
- **THEN** the type is `true`
