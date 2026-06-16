## Why

Every later build lesson depends on the schema type. The design decisions made here — how column types are encoded, how nullability is represented, how the table registry is structured — cascade into the SELECT, WHERE, JOIN, and result inference layers. Getting this right is the foundation.

## What Teaches

Encoding a database schema as a TypeScript type (table name → column descriptor map); column descriptor types (`name`, `dataType`, `nullable`, `primaryKey`); the `DatabaseSchema` registry type; how design choices in the schema type affect the ergonomics of downstream mapped and conditional types.

## Prereqs

- `01-mapped-type-anatomy`
- `03-union-algebra`

## Build piece role

Foundation layer. Defines `Schema`, `Column`, and a sample `AppSchema` with `users` and `posts` tables that all later build lessons reference.

## Success criterion

The test suite in `lessons/19-query-builder-schema-encoding/schema.test.ts` passes.
