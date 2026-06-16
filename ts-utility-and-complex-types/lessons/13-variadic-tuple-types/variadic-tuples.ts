// Lesson 13 — Variadic Tuple Types

// 1. Prepend T to tuple Arr.
export type Prepend<T, Arr extends unknown[]> = never // TODO

// 2. Append T to the end of tuple Arr.
export type Append<Arr extends unknown[], T> = never // TODO

// 3. Concatenate two tuples.
export type Concat<A extends unknown[], B extends unknown[]> = never // TODO

// 4. Runtime concat: combine two tuples and preserve the exact type.
export function concat<A extends unknown[], B extends unknown[]>(
  a: [...A],
  b: [...B]
): Concat<A, B> {
  // TODO
  throw new Error('TODO')
}

// 5. Remove the first element of a tuple using spread syntax.
export type Drop1<T extends unknown[]> = never // TODO
