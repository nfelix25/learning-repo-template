## ADDED Requirements

### Requirement: array() Creates an ArraySchema
`array<T>(element: Schema<T>): ArraySchema<T>` SHALL return a `Schema<T[]>` whose output type is `T[]`.

#### Scenario: array infers element type from schema
- **WHEN** `type T = Infer<typeof array(string())>`
- **THEN** `T` equals `string[]`.

#### Scenario: array parse validates all elements
- **WHEN** `array(number()).parse([1, 2, 3])` is called
- **THEN** the return value is `[1, 2, 3]` with type `number[]`.

#### Scenario: array parse rejects non-array input
- **WHEN** `array(string()).parse("not an array")` is called
- **THEN** a `ParseError` is thrown.

#### Scenario: array parse rejects arrays with invalid elements
- **WHEN** `array(number()).parse([1, "two", 3])` is called
- **THEN** a `ParseError` is thrown for the invalid element.

### Requirement: lazy() Enables Recursive Schemas
`lazy<T>(getter: () => Schema<T>): LazySchema<T>` SHALL defer schema construction to parse time, enabling recursive schemas.

#### Scenario: lazy wraps a recursive schema reference
- **WHEN** a `TreeNode` schema is defined as `object({ value: string(), children: array(lazy(() => treeSchema))})`
- **THEN** the inferred type of `treeSchema` is `Schema<{ value: string; children: TreeNode[] }>`.

#### Scenario: lazy schema parses recursive data correctly
- **WHEN** `treeSchema.parse({ value: "root", children: [{ value: "leaf", children: [] }] })` is called
- **THEN** the parse succeeds and returns the typed `TreeNode` value.
