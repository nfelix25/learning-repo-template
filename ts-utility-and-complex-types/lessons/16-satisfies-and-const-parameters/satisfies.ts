// Lesson 16 — satisfies and const Type Parameters

// 1. Return the config object with literal types preserved.
//    Use a `const` type parameter so callers don't need `as const`.
export function makeConfig<const T extends Record<string, unknown>>(config: T): T {
  // TODO
  throw new Error('TODO')
}

// 2. Return a route map with each method/path preserved as literals.
export function makeRoutes<
  const T extends Record<string, { method: string; path: string }>
>(routes: T): T {
  // TODO
  throw new Error('TODO')
}

// 3. A color palette where each value is a string literal, validated against
//    Record<string, string> using `satisfies` so literals are not widened.
export const PALETTE = {
  // TODO: add at least two color entries (e.g. red: '#ff0000', blue: '#0000ff')
  //       and apply `satisfies Record<string, string>` so the values stay narrow
} // TODO — apply satisfies

// 4. Pick keys from an object type (reimplementation; same shape as Pick).
export type LiteralPick<T, K extends keyof T> = never // TODO
