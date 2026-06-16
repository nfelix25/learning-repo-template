import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — CONDITIONAL TYPES
// Koan 3 of 5: infer — pattern matching on type structure
// ═══════════════════════════════════════════════════════════════════════════
//
// `infer R` introduces a fresh type variable R within the extends clause
// of a conditional type. TypeScript "captures" whatever type occupies
// that position and binds it to R.
//
//   type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
//
// Read as: "If T matches the pattern '(...) => R' for some R, yield R."
//
// This is PATTERN MATCHING at the type level — like a regex that captures
// a group, but for type structures.
//
// ───────────────────────────────────────────────────────────────────────────
// HOW infer WORKS
// ───────────────────────────────────────────────────────────────────────────
//
//   type UnwrapArray<T> = T extends Array<infer Item> ? Item : T
//
//   T = string[]    → matches Array<string>  → Item = string  → returns string
//   T = number      → doesn't match Array<?>              → returns number
//
// infer can appear in:
//   - Function parameter positions:  T extends (x: infer P) => any
//   - Return position:               T extends () => infer R
//   - Generic argument positions:    T extends Promise<infer U>
//   - Tuple positions:               T extends [infer Head, ...infer Tail]
//   - Template literal positions:    T extends `${infer Prefix}World`
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Build MyReturnType — infer the return type of a function.
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type _test1 = Expect<Equal<MyReturnType<() => number>, number>>;
type _test2 = Expect<Equal<MyReturnType<(a: string) => boolean>, boolean>>;
type _test3 = Expect<Equal<MyReturnType<() => never>, never>>;

// 2. Build FirstParam — infer the type of the first parameter.
type FirstParam<T> = T extends (arg1: infer A, ...args: any[]) => any
  ? A
  : never;

type _test4 = Expect<Equal<FirstParam<(a: string, b: number) => void>, string>>;
type _test5 = Expect<Equal<FirstParam<(x: boolean) => void>, boolean>>;

// 3. Build ElementType — infer the element type of an array.
type ElementType<T> = T extends readonly (infer E)[] ? E : never;

type _test6 = Expect<Equal<ElementType<string[]>, string>>;
type _test7 = Expect<Equal<ElementType<readonly number[]>, number>>;
type _test8 = Expect<Equal<ElementType<boolean[][]>, boolean[]>>;
//   Note: ElementType<boolean[][]> should give boolean[] (one level only).

// 4. Build UnwrapPromise — infer the resolved value type of a Promise.
type UnwrapPromise<T> = T extends Promise<infer P> ? P : T;

type _test9 = Expect<Equal<UnwrapPromise<Promise<string>>, string>>;
type _test10 = Expect<Equal<UnwrapPromise<Promise<number[]>>, number[]>>;
type _test11 = Expect<Equal<UnwrapPromise<string>, string>>;
//   If T is not a Promise, return T unchanged.

// 5. Build Head and Tail for tuples.
type Head<T extends readonly unknown[]> = T extends [infer H, ...rest: any]
  ? H
  : never;
type Tail<T extends readonly unknown[]> = T extends [head: any, ...infer Rest]
  ? Rest
  : never;

type _test12 = Expect<Equal<Head<[string, number, boolean]>, string>>;
type _test13 = Expect<
  Equal<Tail<[string, number, boolean]>, [number, boolean]>
>;
type _test14 = Expect<Equal<Tail<[string]>, []>>;

// 6. Build TemplatePrefixedWith — extract what follows a prefix.
type StripPrefix<
  T extends string,
  Prefix extends string,
> = T extends `${Prefix}${infer S}` ? S : never;
//   Hint: T extends `${Prefix}${infer Rest}` ? Rest : never

type _test15 = Expect<Equal<StripPrefix<"onCLICK", "on">, "CLICK">>;
type _test16 = Expect<Equal<StripPrefix<"getData", "get">, "Data">>;
type _test17 = Expect<Equal<StripPrefix<"noMatch", "get">, never>>;

export {};
