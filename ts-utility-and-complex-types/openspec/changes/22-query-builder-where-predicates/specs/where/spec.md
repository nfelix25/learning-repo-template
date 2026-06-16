## ADDED Requirements

### Requirement: OperatorsFor Utility Type
`OperatorsFor<DT>` SHALL map a column `dataType` discriminant to the valid operator union for that type.

#### Scenario: String Columns Allow Equality and LIKE
- **WHEN** `OperatorsFor<"string">` is evaluated
- **THEN** the type includes `"LIKE"` and `"="` and `"!="` and does NOT include `">"` or `"<"`

#### Scenario: Number Columns Allow Comparison Operators
- **WHEN** `OperatorsFor<"number">` is evaluated
- **THEN** the type includes `">"` | `">="` | `"<"` | `"<="` | `"="` | `"!="`

### Requirement: WhereCondition Type
`WhereCondition<S, T, Col>` SHALL describe a single predicate for column `Col` with a schema-valid operator and a value of the correct type.

#### Scenario: WhereCondition Rejects Wrong Operator for Column Type
- **WHEN** a condition `{ column: "users.name", operator: ">", value: "A" }` is used where `WhereCondition<AppSchema, "users", "users.name">` is expected
- **THEN** TypeScript reports a type error

### Requirement: WhereClause Recursive Type
`WhereClause<S, T>` SHALL be a union of `WhereCondition | { AND: WhereClause<S, T>[] } | { OR: WhereClause<S, T>[] }`.

#### Scenario: WhereClause Accepts Nested AND/OR
- **WHEN** a value `{ AND: [condition1, { OR: [condition2, condition3] }] }` is provided where `WhereClause<AppSchema, "users">` is expected
- **THEN** TypeScript accepts it without error
