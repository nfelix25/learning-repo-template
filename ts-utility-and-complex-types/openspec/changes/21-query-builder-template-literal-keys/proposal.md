## Why

To support JOINs safely, column references need to be qualified: `"users.id"` not just `"id"`. Template literal types can generate every valid `"table.column"` string from the schema and also parse them back — which is what makes the JOIN disambiguation system work.

## What Teaches

Generating `"table.column"` strings via template literal distribution over table × column unions; parsing `"table.column"` back to `{ table, column }` components using `infer` in template literal positions.

## Prereqs

- `10-template-literal-types`
- `19-query-builder-schema-encoding`

## Build piece role

Column reference DSL. Adds `TableColumn<S, T>` producing all valid `"table.column"` strings, and `ParseTableColumn<S>` parsing them back. These are used by `.select()` and the JOIN machinery.

## Success criterion

The test suite in `lessons/21-query-builder-template-literal-keys/column-refs.test.ts` passes.
