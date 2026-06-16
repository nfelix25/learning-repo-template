## Content manifest

### Outline

**Intro**: The final challenge: given the accumulated `QueryState` (which columns were selected, which tables are joined), compute the exact TypeScript type that `.execute()` returns. This requires threading template literal parsing, recursive schema lookup, and nullable handling all in one type.

**Mechanic**: `ExecuteResult<State, S>` maps over `State["selectedCols"]` (a union of `"table.column"` strings). For each qualified column reference, `ParseTableColumn` extracts the table and column names. A recursive lookup type navigates `S[table][column]` to get the `Column` descriptor. `ColumnType` then maps the descriptor to its TypeScript primitive type, respecting nullability and any LEFT JOIN nullable override. The result is a mapped type over the selected column union.

**Worked example**: Walk through `ExecuteResult` step by step for `select("users.name", "posts.publishedAt")` after a LEFT JOIN on posts. Show that `users.name` → `string`, `posts.publishedAt` → `Date | null` (nullable from LEFT JOIN).

**Pitfalls**: Template literal parsing via `infer` requires TS 4.1+. Recursive lookup through schema types can hit depth limits for very wide schemas. The nullable override from LEFT JOIN must be tracked in `QueryState` and applied during result type computation — the simplest approach is a separate `nullableTables` set in `QueryState`.

**Exercise**: Write type-level tests using `expectTypeOf` verifying the result shape for three different query configurations; add aliased column support where `"users.name AS userName"` appears as `userName` in the result type.

### Sources

See `sources.md`.

### Version note

TypeScript 4.1+ required for template literal `infer` and recursive conditional types.

### Build piece role

Result type inference. Exports `ExecuteResult<State, S>`. Wires `.execute()` to return `Promise<ExecuteResult<State, S>[]>`.
