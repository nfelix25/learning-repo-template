import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — CONDITIONAL TYPES
// Koan 5 of 5: Re-implementing the standard utility types
// ═══════════════════════════════════════════════════════════════════════════
//
// TypeScript ships with ~30 built-in utility types. Most are simple one-liners
// once you understand conditional types and mapped types.
//
// Implementing them from scratch is the best way to demystify them.
// After this koan, you'll never need to look up what Partial<T> "does" —
// you'll know what it IS.
//
// ───────────────────────────────────────────────────────────────────────────
// MAPPED TYPE SYNTAX (preview of module 04)
// ───────────────────────────────────────────────────────────────────────────
//
// Several utilities use mapped types:
//
//   { [K in keyof T]: ... }
//
// This iterates over all keys K of T and applies a transformation.
// Think of it as Array.map but for the keys of an object type.
//
// You can:
//   Add `readonly`:    { readonly [K in keyof T]: T[K] }
//   Add `?`:          { [K in keyof T]?: T[K] }
//   Remove `readonly`: { -readonly [K in keyof T]: T[K] }
//   Remove `?`:        { [K in keyof T]-?: T[K] }
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS — implement each utility from scratch
// ───────────────────────────────────────────────────────────────────────────

// 1. MyPartial — make all properties optional.
type MyPartial<T> = T extends object ? { [K in keyof T]+?: T[K] } : T;

type _test1 = Expect<
  Equal<MyPartial<{ a: string; b: number }>, { a?: string; b?: number }>
>;

// 2. MyRequired — make all properties required (remove optionality).
type MyRequired<T> = T extends object ? { [K in keyof T]-?: T[K] } : never;

type _test2 = Expect<
  Equal<MyRequired<{ a?: string; b?: number }>, { a: string; b: number }>
>;

// 3. MyReadonly — make all properties readonly.
type MyReadonly<T> = T extends object ? { readonly [K in keyof T]: T[K] } : T;

type _test3 = Expect<
  Equal<
    MyReadonly<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;

// 4. MyRecord — create an object type from a union of keys and a value type.
type MyRecord<K extends string | number | symbol, V> = { [k in K]: V };

type _test4 = Expect<
  Equal<MyRecord<"a" | "b", number>, { a: number; b: number }>
>;

// 5. MyPick — keep only the specified keys.
type MyPick<T, K extends keyof T> = T extends object
  ? { [P in K]: T[P] }
  : never;

type _test5 = Expect<
  Equal<
    MyPick<{ a: string; b: number; c: boolean }, "a" | "b">,
    { a: string; b: number }
  >
>;

// 6. MyOmit — remove the specified keys.
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
//   Hint: Pick the keys that are NOT in K.
//   Use MyPick and Exclude.
type a = MyOmit<{ a: string; b: number; c: boolean }, "a">;

type _test6 = Expect<
  Equal<
    MyOmit<{ a: string; b: number; c: boolean }, "a">,
    { b: number; c: boolean }
  >
>;

// 7. MyReturnType — infer the return type of a function.
//   (You built this in the infer koan — but now as a formal utility.)
//   Note: the constraint uses `any[]` not `unknown[]`. Parameter types are
//   contravariant, so `(x: number) => void` does not extend `(...args: unknown[]) => void`.
//   `any` sidesteps this — it's the idiomatic "accept any function" constraint.
type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : T;

type _test7 = Expect<Equal<MyReturnType<() => string>, string>>;
type _test8 = Expect<Equal<MyReturnType<(x: number) => boolean[]>, boolean[]>>;

// 8. MyParameters — infer the parameter types as a tuple.
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;

type _test9 = Expect<
  Equal<MyParameters<(a: string, b: number) => void>, [string, number]>
>;

// 9. MyAwaited — deeply unwrap a Promise (TypeScript 4.5+ behavior).
//    Recursively unwrap until the innermost non-Promise type.
type MyAwaited<T> = T extends Promise<infer P> ? MyAwaited<P> : T;

type _test10 = Expect<Equal<MyAwaited<Promise<string>>, string>>;
type _test11 = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
type _test12 = Expect<Equal<MyAwaited<string>, string>>;

export {};
