// Lesson 11 — TypeScript's Inference Algorithm
// ─────────────────────────────────────────────────────────────────────────────
// Replace each stub with the correct implementation.
// The signatures are correct — only the bodies are stubs.
//
// Run `npm run verify` to check both types and runtime.
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Infer the type of the first item in a non-empty tuple, rejecting empty tuples.
export type Head<_T> = never;

// Goal: Infer the tuple that remains after removing the first item, rejecting empty tuples.
export type Tail<_T> = never;

// Goal: Infer the value inside a Promise, while leaving non-Promise types unchanged.
export type Awaited1<_T> = never;

// These functions have correct signatures — implement the bodies:

// Goal: Return the property selected by the key while preserving its precise type.
export function pick<T, K extends keyof T>(_obj: T, _key: K): T[K] {
  throw new Error('TODO: implement pick');
}

// Goal: Build a new function that passes the result of the first function into the second.
export function pipe2<A, B, C>(_f: (a: A) => B, _g: (b: B) => C): (a: A) => C {
  throw new Error('TODO: implement pipe2');
}

// Goal: Transform every item in the array using the callback and preserve the callback's result type.
export function mapFn<T, U>(_arr: T[], _fn: (item: T) => U): U[] {
  throw new Error('TODO: implement mapFn');
}
