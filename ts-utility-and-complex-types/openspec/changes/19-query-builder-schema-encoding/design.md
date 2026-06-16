## Content manifest

### Outline

**Intro**: The type-safe query builder needs a single source of truth: a type-level description of the database schema. Everything downstream — column projections, WHERE predicates, JOIN result types, and final result inference — depends on this foundation.

**Mechanic**: Define a `Column` descriptor type with `dataType` (a discriminated union: `"string" | "number" | "boolean" | "date"`), `nullable` (boolean literal), and `primaryKey` (boolean literal). A `TableSchema` is a record of column name → `Column`. A `DatabaseSchema` is a record of table name → `TableSchema`. The design choice to use literal types for `nullable` and `primaryKey` is intentional — downstream conditional types can branch on them.

**Worked example**: Define an `AppSchema` with `users` (id, name, email, createdAt) and `posts` (id, userId, title, body, publishedAt, deletedAt) tables. Show how the type captures nullability — `deletedAt` is nullable, `id` is not.

**Pitfalls**: Encoding column data types as strings rather than type-level representatives means downstream code needs a lookup table to map `"date"` → `Date`. This is intentional — it keeps the schema readable. The tradeoff is covered in lesson 20 when the lookup is first written.

**Exercise**: Add a `comments` table to `AppSchema`. Define `ExtractColumns<S, T extends keyof S>` that returns the column map for a given table.

### Build piece role

Foundation layer. Exports `Column`, `TableSchema`, `DatabaseSchema`, and `AppSchema`. All later build lessons import from this file.
