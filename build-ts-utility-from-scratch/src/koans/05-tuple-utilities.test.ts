import type { Equal, Expect } from "../assertions";

/**
 * Koan 05: Tuple utilities
 *
 * Goal: treat tuples as ordered type-level data.
 * Mental model: variadic tuple inference is destructuring for types.
 * Common trap: arrays and tuples are both `readonly unknown[]`-like, but tuples
 * preserve position and length while arrays do not.
 * Stretch: make each utility accept readonly tuples without widening literals.
 */

type MyHead<T extends readonly unknown[]> = never;

type MyTail<T extends readonly unknown[]> = never;

type MyLength<T extends readonly unknown[]> = never;

type MyElement<T extends readonly unknown[]> = never;

type MyPush<T extends readonly unknown[], V> = never;

type MyZip<A extends readonly unknown[], B extends readonly unknown[]> = never;

type cases = [
  Expect<Equal<MyHead<readonly ["id", "name", "admin"]>, "id">>,
  Expect<Equal<MyTail<readonly ["id", "name", "admin"]>, readonly ["name", "admin"]>>,
  Expect<Equal<MyLength<readonly [1, 2, 3]>, 3>>,
  Expect<Equal<MyElement<readonly ["a", "b", "c"]>, "a" | "b" | "c">>,
  Expect<Equal<MyPush<readonly [1, 2], 3>, readonly [1, 2, 3]>>,
  Expect<Equal<MyZip<readonly ["id", "name"], readonly [string, boolean]>, readonly [["id", string], ["name", boolean]]>>
];
