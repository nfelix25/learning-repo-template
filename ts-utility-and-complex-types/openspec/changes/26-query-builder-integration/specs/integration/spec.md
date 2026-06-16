## ADDED Requirements

### Requirement: End-to-End Integration Test
The integration test SHALL execute a complete query chain: `.join()` → `.select()` → `.where()` → `.limit()` → `.execute()`, and assert the exact result type using `expectTypeOf`.

#### Scenario: Full Query Chain Type-Checks Correctly
- **WHEN** a query joins `users` ← `posts`, selects `"users.name"`, `"posts.title"`, and `"posts.deletedAt"`, adds a WHERE clause on `"users.name"`, and calls `.execute()`
- **THEN** the result type is `Promise<{ "users.name": string; "posts.title": string; "posts.deletedAt": Date | null }[]>`

### Requirement: Named Intermediate Types Refactor
At least one intermediate computed type within `ExecuteResult` (e.g., the parse step, the lookup step, or the mapping step) SHALL be extracted into a named type alias.

#### Scenario: Error Messages Reference Named Types
- **WHEN** an invalid column reference is used in `.select()` after the refactor
- **THEN** the TypeScript error message references the named intermediate type rather than an inline expression, making the error more readable

### Requirement: Depth Limit Documentation
The integration lesson file SHALL document what to do when "type instantiation is excessively deep" occurs on complex queries: which type in the chain is most likely the culprit, and how to add an explicit depth guard or simplify the recursive step.
