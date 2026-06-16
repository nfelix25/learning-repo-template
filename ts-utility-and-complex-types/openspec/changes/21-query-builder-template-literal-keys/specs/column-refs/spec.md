## ADDED Requirements

### Requirement: TableColumn Utility Type
`TableColumn<S, T>` SHALL produce a union of all valid `"table.column"` qualified reference strings for table `T` in schema `S`.

#### Scenario: TableColumn Produces Qualified Column References
- **WHEN** `TableColumn<AppSchema, "users">` is evaluated
- **THEN** the type includes `"users.id" | "users.name" | "users.email" | "users.createdAt"`

#### Scenario: TableColumn Rejects Invalid References at Compile Time
- **WHEN** a string literal `"users.nonexistent"` is used where `TableColumn<AppSchema, "users">` is expected
- **THEN** TypeScript reports a type error

### Requirement: ParseTableColumn Utility Type
`ParseTableColumn<Ref>` SHALL parse a `"table.column"` string literal type into `{ table: ...; column: ... }`.

#### Scenario: ParseTableColumn Extracts Table and Column
- **WHEN** `ParseTableColumn<"users.name">` is evaluated
- **THEN** the type is `{ table: "users"; column: "name" }`

#### Scenario: ParseTableColumn on Invalid String Returns Never
- **WHEN** `ParseTableColumn<"nodot">` is evaluated
- **THEN** the type is `never`
