// Lesson 06 — Distributive Conditional Types
// ─────────────────────────────────────────────────────────────────────────────
// All three stubs return `never`. Replace each with the correct conditional type.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

// TODO: T extends unknown ? { value: T } | null : never
// (distributive — T is naked, so it distributes over unions)
export type ToMaybe<T> = T extends unknown ? { value: T } | null : never;

// TODO: [T] extends [unknown] ? { value: T } | null : never
// (non-distributive — [T] is a tuple, so no distribution triggers)
export type ToMaybeNonDist<T> = [T] extends [unknown]
  ? { value: T } | null
  : never;

// TODO: U extends U ? ([T] extends [U] ? false : true) : never
// Signature: IsUnion<T, U = T>
// The outer `U extends U` distributes; [T] extends [U] compares the full type to each member.
// If T is a union, the full [T] won't be assignable to any single [U] member → true.
// If T is a single type, [T] extends [U] is true → false.
export type IsUnion<T, U = T> = U extends U
  ? [T] extends [U]
    ? false
    : true
  : never;
