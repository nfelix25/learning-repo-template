// Lesson 14 — Variadic Tuple Types
// ─────────────────────────────────────────────────────────────────────────────
// Replace each stub with the correct implementation.
//
// Run `npm run verify` and `npm test` to check.
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Combine two tuple types while preserving the order and type of every position.
export type Concat<_A extends unknown[], _B extends unknown[]> = never;

// Goal: Combine the two runtime arrays in the same order promised by the return type.
export function concat<A extends unknown[], B extends unknown[]>(
  _a: readonly [...A],
  _b: readonly [...B]
): [...A, ...B] {
  throw new Error('TODO: implement concat');
}

// Goal: Return everything after the first element while preserving the remaining tuple type.
export function tail<T extends unknown[]>(
  _arr: readonly [unknown, ...T]
): T {
  throw new Error('TODO: implement tail');
}

// Goal: Bind the first argument now and return a function for the remaining arguments.
export function partialFirst<H, T extends unknown[], R>(
  _f: (head: H, ...tail: T) => R,
  _head: H
): (...tail: T) => R {
  throw new Error('TODO: implement partialFirst');
}
