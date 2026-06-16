## Why

TypeScript's control-flow analysis is powerful but doesn't cover every narrowing case. User-defined type guards and assertion functions let you encode narrowing logic explicitly — and they're a common source of subtle unsoundness when misimplemented.

## What Teaches

`is` predicates for user-defined type guards; `asserts` predicates for assertion functions; control-flow narrowing through `if`/`switch`/loops; discriminant narrowing vs. `is`-guard narrowing — when to use which; exhaustiveness checking with `never`.

## Prereqs

- `03-union-algebra`
- `05-conditional-type-mechanics`

## Success criterion

The test suite in `lessons/14-type-predicates-and-narrowing/type-predicates.test.ts` passes.
