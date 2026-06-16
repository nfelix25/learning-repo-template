## Why

Two tools exist for "input type A → output type X, input type B → output type Y": function overloads and conditional generic return types. Choosing the wrong one produces confusing errors or unsound implementations. This lesson makes the tradeoff concrete.

## What Teaches

Overload resolution order and the last-signature catch-all; conditional return types in generic functions; why overloads produce better call-site error messages; when conditional return types in implementations become unreachable; the practical heuristic.

## Prereqs

- `05-conditional-type-mechanics`

## Success criterion

The test suite in `lessons/06-overloads-vs-conditionals/overloads.test.ts` passes.
