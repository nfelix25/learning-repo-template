## Content manifest

### Outline

**Intro**: A WHERE clause that accepts any value for any column is not type-safe. The type system should enforce that `>` is only valid for `number` and `date` columns, `LIKE` is only valid for `string` columns, and `=` is valid for all. This requires conditional types branching on the column's data type.

**Mechanic**: `OperatorsFor<DT>` maps a data type discriminant to its valid operator union: `"string"` → `"=" | "!=" | "LIKE"`; `"number" | "date"` → `"=" | "!=" | ">" | ">=" | "<" | "<="`. `WhereCondition<S, T, Col>` combines `OperatorsFor` with the column's value type. `WhereClause<S, T>` is a recursive union: `WhereCondition | { AND: WhereClause[] } | { OR: WhereClause[] }`.

**Worked example**: Show that `WhereCondition<AppSchema, "users", "name">` accepts `{ operator: "LIKE"; value: string }` but rejects `{ operator: ">"; value: string }`. Show a `WhereClause` with nested `AND`/`OR`.

**Pitfalls**: The recursive `WhereClause` is the first place depth limits become real — a very deeply nested AND/OR tree will hit TS limits. For this build piece, keep nesting shallow. The `OperatorsFor` type must exhaustively cover all `dataType` values or the conditional chain falls through to `never`.

**Exercise**: Add `.where(clause: WhereClause<S, T>)` to the builder stub; write type-level tests asserting that a number column rejects `LIKE` and a string column rejects `>`.

### Build piece role

WHERE clause. Exports `OperatorsFor`, `WhereCondition`, and `WhereClause`. Used by the builder chain in lesson 23.
