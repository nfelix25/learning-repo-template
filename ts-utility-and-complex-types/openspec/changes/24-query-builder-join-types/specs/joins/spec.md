## ADDED Requirements

### Requirement: join Method
`.join<T2 extends keyof S>(table: T2, on: JoinCondition<S, T, T2>)` SHALL return a `QueryBuilder` with `T2` added to `State["joinedTables"]`, enabling column references from `T2` in subsequent `.select()` calls.

#### Scenario: join Expands Selectable Columns
- **WHEN** `.join("posts", { left: "users.id", right: "posts.userId" })` is called on a `users` builder
- **THEN** subsequent `.select()` may reference `"posts.title"` and `"posts.body"` without type errors

#### Scenario: join Rejects Invalid Join Condition
- **WHEN** `.join("posts", { left: "users.id", right: "posts.nonexistent" })` is called
- **THEN** TypeScript reports a type error

### Requirement: leftJoin Method
`.leftJoin<T2 extends keyof S>(table: T2, on: JoinCondition<S, T, T2>)` SHALL behave like `.join()` but record `T2` in `State["nullableTables"]`, causing all `T2` columns in the result type to be `| null`.

#### Scenario: leftJoin Marks Joined Table Columns Nullable
- **WHEN** `.leftJoin("posts", ...)` is called and `"posts.title"` is selected
- **THEN** the result type for `posts.title` is `string | null` even though `title` is non-nullable in the schema

### Requirement: Column Disambiguation After Join
After a join, `.select()` SHALL accept qualified references for both the primary table and all joined tables.

#### Scenario: Qualified References Required After Join
- **WHEN** `.select("name")` (unqualified) is called after a join
- **THEN** TypeScript reports a type error (only qualified `"table.column"` references are valid)
