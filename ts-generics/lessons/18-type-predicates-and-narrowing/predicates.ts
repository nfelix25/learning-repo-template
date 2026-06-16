// Lesson 18 — Type Predicates and Narrowing
// ─────────────────────────────────────────────────────────────────────────────
// Replace each `false` stub with a real type predicate implementation.
//
// Run `npm run verify` and `npm test` to check.
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Recognize string values at runtime so TypeScript can narrow the input.
export function isString(_value: unknown): _value is string {
  return false; // stub — always returns false
}

// Goal: Recognize number values at runtime so TypeScript can narrow the input.
export function isNumber(_value: unknown): _value is number {
  return false; // stub
}

// Discriminated union
export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

// Goal: Recognize the circle variant of the shape union.
export function isCircle(_value: Shape): _value is { kind: 'circle'; radius: number } {
  return false; // stub
}

// Assertion function: throws if condition is not met
// Goal: Stop execution with the provided message when the condition is not satisfied.
export function assert(_condition: boolean, _message: string): asserts _condition {
  // stub — does nothing
}

// Generic predicate using constraint
// Goal: Recognize object-like values that contain the requested property key.
export function hasProperty<K extends string>(
  _value: unknown,
  _key: K
): _value is Record<K, unknown> {
  return false; // stub
}
