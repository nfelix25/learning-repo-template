// Lesson 05 — Conditional Types Basics
// ─────────────────────────────────────────────────────────────────────────────
// Replace each `never` stub with the correct conditional type expression.
// These are pure type aliases — there is no function body to implement.
//
// Hint for MyAwaited: use `infer R` to capture the Promise's type argument:
//   T extends Promise<infer R> ? R : T
// `infer` is covered in depth in Lesson 07; here you just need this one pattern.
//
// Run `npm run verify` to check. (npm test alone passes even with wrong stubs —
// these are type-level checks that only tsc catches.)
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Rename _T to T and implement: T extends string ? true : false
export type IsString<T> = T extends string ? true : false;

// TODO: Rename T to T and implement: T extends (...args: never[]) => unknown ? true : false
export type IsFunction<T> = T extends (...args: never[]) => unknown
  ? true
  : false;

// TODO: T extends null | undefined ? never : T
export type MyNonNullable<T> = T extends null | undefined ? never : T;

// TODO: T extends Promise<infer R> ? R : T
export type MyAwaited<T> = T extends Promise<infer P> ? P : T;
