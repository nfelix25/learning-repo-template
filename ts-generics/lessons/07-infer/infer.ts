// Lesson 07 — The infer Keyword
// ─────────────────────────────────────────────────────────────────────────────
// Replace each `never` stub (or identity stub) with the correct infer-based
// conditional type expression.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

// TODO: T extends (...args: any[]) => infer R ? R : never
export type MyReturnType<T> = T extends (...args: never[]) => infer R
  ? R
  : never;

// TODO: T extends (...args: infer P) => any ? P : never
export type MyParameters<T> = T extends (...args: infer A) => unknown
  ? A
  : never;

// TODO: T extends Promise<infer V> ? MyAwaited<V> : T
// (recursive — MyAwaited calls itself to handle Promise<Promise<T>>)
export type MyAwaited<T> =
  T extends PromiseLike<infer P>
    ? P extends PromiseLike<any>
      ? MyAwaited<P>
      : P
    : T;

// TODO: T extends (...args: any[]) => Promise<infer R> ? R : never
export type PromiseReturn<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

// TODO: T extends `on${infer E}` ? E : never
export type ExtractEventName<T extends string> = T extends `on${infer E}`
  ? E
  : never;
