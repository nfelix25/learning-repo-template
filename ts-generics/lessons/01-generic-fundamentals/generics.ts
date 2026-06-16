// Lesson 01 — Generic Fundamentals
// ─────────────────────────────────────────────────────────────────────────────
// Each function below uses `unknown` instead of a generic type parameter.
// Your task: replace `unknown` with the right type parameter(s) so the
// type and runtime tests in generics.test.ts pass.
//
// Run `npm run verify` to check both types and runtime.
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Add a type parameter <T>.
// Replace the two `unknown` occurrences with T so that the return type
// matches the argument type.
// Signature target: identity<T>(value: T): T
export function identity<T>(_value: T): T {
  return _value;
}

// TODO: Add a type parameter <T>.
// Accept a readonly array of T and return T | undefined.
// Signature target: first<T>(arr: readonly T[]): T | undefined
export function first<T>(_arr: readonly T[]): T | undefined {
  return _arr[0];
}

// TODO: Add two type parameters <A, B>.
// Accept values of types A and B and return a tuple [A, B].
// Signature target: pair<A, B>(a: A, b: B): [A, B]
export function pair<A, B>(_a: A, _b: B): [A, B] {
  return [_a, _b];
}
