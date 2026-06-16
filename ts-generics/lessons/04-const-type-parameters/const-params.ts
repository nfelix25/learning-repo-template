// Lesson 04 — const Type Parameters
// ─────────────────────────────────────────────────────────────────────────────
// Both functions below are missing the `const` modifier on their type parameter.
// Without it, inline tuple literals are widened to their base array type.
//
// Your task:
//   1. Add `const` before T in each signature
//   2. Implement makeConfig (tupleOf just returns its argument)
//
// Requires TypeScript 5.0+. Run `npm run verify` to check your work.
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Add `const` before T to prevent literal widening.
// The constraint must be `readonly` — a mutable constraint silently disables `const`.
// Signature target: tupleOf<const T extends readonly unknown[]>(items: T): T
export function tupleOf<const T extends readonly unknown[]>(items: T): T {
  return items;
}

// TODO: Add `const` before T and implement the function body.
// Return an object whose keys are the tuple elements (each mapped to `undefined`).
// Signature target: makeConfig<const T extends readonly string[]>(keys: T): Record<T[number], unknown>
export function makeConfig<const T extends readonly string[]>(
  _keys: T,
): Record<T[number], unknown> {
  return Object.fromEntries(_keys.map((k) => [k, undefined])) as Record<
    T[number],
    unknown
  >;
}
