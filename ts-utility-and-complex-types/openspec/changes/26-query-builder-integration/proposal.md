## Why

With all pieces in place, this lesson steps back from implementation and examines the design decisions made across the build piece. What patterns generalize? What did the type system force you to change? How do you diagnose "type instantiation is excessively deep" in a system this complex? This is the carry-forward lesson.

## What Teaches

End-to-end type trace: join → select → where → execute; reviewing type-level design decisions made across the build; naming intermediate types to improve error message clarity; patterns to carry forward (state threading, schema-encoded types, template literal DSLs); diagnosing depth limit errors in production.

## Prereqs

- `25-query-builder-result-inference`

## Build piece role

Integration and reflection. No new type mechanics. Adds a complete end-to-end integration test and refactors one intermediate type to demonstrate improved error messages.

## Success criterion

The test suite in `lessons/26-query-builder-integration/integration.test.ts` passes.
