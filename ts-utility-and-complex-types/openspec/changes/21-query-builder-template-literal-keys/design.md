## Content manifest

### Outline

**Intro**: Unqualified column names like `"id"` become ambiguous after a JOIN. The solution is to use `"table.column"` qualified references. Template literal types can both generate every valid qualified reference from the schema and parse them back — enabling the JOIN disambiguation system.

**Mechanic**: `TableColumn<S, T>` generates all valid `"table.column"` strings by distributing template literal concatenation over the table name × column name union. `ParseTableColumn<Ref>` uses `infer` in a template position to split `"table.column"` back into `{ table: "...", column: "..." }`. The `ParseTableColumn` type is the key primitive — it's used by `ExecuteResult` in lesson 25 to walk from a qualified column reference back to its schema type.

**Worked example**: Show `TableColumn<AppSchema, "users">` producing `"users.id" | "users.name" | "users.email" | "users.createdAt"`. Show `ParseTableColumn<"users.name">` producing `{ table: "users"; column: "name" }`.

**Pitfalls**: Template literal distribution over large schemas creates O(tables × columns) union members — can be expensive for large schemas. `ParseTableColumn` with `infer` is greedy in the table slot — column names containing `.` would break parsing. (Assume column names have no dots for this build piece.)

**Exercise**: Update `.select()` from lesson 20 to accept `TableColumn<S, T>` qualified strings instead of bare column names; verify that `"nonexistent.column"` is rejected.

### Build piece role

Column reference DSL. Exports `TableColumn` and `ParseTableColumn`. These are consumed by the JOIN machinery (lesson 24) and result inference (lesson 25).
