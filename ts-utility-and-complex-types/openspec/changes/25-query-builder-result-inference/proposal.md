## Why

The final type challenge: given everything accumulated in `QueryState`, compute exactly what `.execute()` returns — no wider, no narrower. This requires recursive schema lookup, template literal parsing, conditional nullable handling, and everything from the earlier build lessons in concert.

## What Teaches

Inferring the result row type from accumulated `QueryState`; mapping selected column references back to primitive types via recursive schema lookup; handling nullable columns; the full chain from schema to typed result using template literal `infer` + recursive conditional types (TS 4.1+).

## Prereqs

- `08-infer`
- `12-advanced-inference-patterns`
- `23-query-builder-chained-builder`
- `24-query-builder-join-types`

## Version note

Depends on TS 4.1+ for template literal `infer` and recursive conditional types. See `sources.md`.

## Build piece role

Result type inference. Closes the loop from schema to typed result. Adds `ExecuteResult<State, S>` and wires `.execute()` to return it.

## Success criterion

The test suite in `lessons/25-query-builder-result-inference/result.test.ts` passes.
