import type { Equal, Expect } from "../assertions";

/**
 * Koan 01: Foundations
 *
 * Goal: rebuild the small primitives that most utility types are composed from.
 * Mental model: type-level programming is mostly projection, iteration, branching,
 * and pattern matching over structural shapes.
 * Common trap: `T extends U ? X : Y` distributes over unions only when `T` is a
 * naked type parameter.
 * Stretch: after solving these, rewrite one solution in a deliberately
 * non-distributive form and compare the result.
 */

type User = {
  id: string;
  name: string;
  admin: boolean;
};

type MyKeys<T> = never;

type MyValue<T, K extends keyof T> = never;

type MyBooleanMap<T> = never;

type MyIsString<T> = never;

type MyArrayElement<T> = never;

type cases = [
  Expect<Equal<MyKeys<User>, "id" | "name" | "admin">>,
  Expect<Equal<MyValue<User, "name">, string>>,
  Expect<
    Equal<MyBooleanMap<User>, { id: boolean; name: boolean; admin: boolean }>
  >,
  Expect<Equal<MyIsString<string>, true>>,
  Expect<Equal<MyIsString<number>, false>>,
  Expect<Equal<MyIsString<string | number>, true | false>>,
  Expect<Equal<MyArrayElement<string[]>, string>>,
  Expect<Equal<MyArrayElement<readonly [1, 2, 3]>, 1 | 2 | 3>>,
];
