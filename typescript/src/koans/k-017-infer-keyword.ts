// ─── k-017: The infer Keyword ─────────────────────────────────────────────────
//
// Inside a conditional type's extends clause, `infer X` declares a new type
// variable X that captures whatever type TypeScript matches in that position:
//
//   type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
//
// TypeScript "fills in" R from the actual function type, then you use R in
// the true branch. `infer` is *only* valid inside a conditional type extends.
//
// Infer can appear multiple times in one conditional, and in any position:
// parameter types, element types, key types, even nested generics.
//
//   type UnpackArray<T> = T extends (infer E)[] ? E : never
//   type FirstArg<T>    = T extends (first: infer A, ...rest: any[]) => any ? A : never
//
// The variable captured by `infer` is in scope only in the true branch.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: MyReturnType — build ReturnType<T> without using it ──────────────

type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

type _1a = Expect<Equal<MyReturnType<() => string>, string>>;
type _1b = Expect<Equal<MyReturnType<(x: number) => number[]>, number[]>>;
type _1c = Expect<Equal<MyReturnType<() => void>, void>>;
type _1d = Expect<Equal<MyReturnType<() => Promise<string>>, Promise<string>>>;

// ── Part 2: ElementType — extract array/tuple element type ───────────────────

type ElementType<T extends readonly any[]> = T extends readonly (infer E)[]
  ? E
  : never;

type _2a = Expect<Equal<ElementType<string[]>, string>>;
type _2b = Expect<Equal<ElementType<number[]>, number>>;
type _2c = Expect<Equal<ElementType<readonly boolean[]>, boolean>>;
type _2d = Expect<Equal<ElementType<[string, number]>, string | number>>;

// ── Part 3: PromiseValue — extract the resolved type of a Promise ─────────────

type PromiseValue<T extends Promise<any>> =
  T extends Promise<infer S> ? S : never;

type _3a = Expect<Equal<PromiseValue<Promise<string>>, string>>;
type _3b = Expect<Equal<PromiseValue<Promise<number[]>>, number[]>>;
type _3c = Expect<
  Equal<PromiseValue<Promise<Promise<string>>>, Promise<string>>
>; // one level only

// ── Part 4: FirstParameter — extract the first argument type ─────────────────

type FirstParameter<T extends (first: any, ...rest: any[]) => any> = T extends (
  first: infer A,
  ...rest: any[]
) => void
  ? A
  : never;

type _4a = Expect<Equal<FirstParameter<(x: string) => void>, string>>;
type _4b = Expect<
  Equal<FirstParameter<(x: number, y: boolean) => void>, number>
>;

// ── Part 5: Infer from nested generic ────────────────────────────────────────
//
// Extract the value type V from a `Map<K, V>`.

type MapValue<T extends Map<any, any>> =
  T extends Map<any, infer A> ? A : never;

type _5a = Expect<Equal<MapValue<Map<string, number>>, number>>;
type _5b = Expect<Equal<MapValue<Map<symbol, boolean>>, boolean>>;

// ── Part 6: ConstructorArgs — infer constructor parameters ───────────────────
//
// Extract the tuple of constructor parameter types from a class.

type ConstructorArgs<T extends new (...args: any[]) => any> = T extends new (
  ...args: infer A
) => unknown
  ? A
  : never;

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

type _6a = Expect<
  Equal<ConstructorArgs<typeof Person>, [name: string, age: number]>
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
