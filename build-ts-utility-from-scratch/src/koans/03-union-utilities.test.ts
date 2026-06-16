import type { Equal, Expect } from "../assertions";

/**
 * Koan 03: Union utilities
 *
 * Goal: learn how conditional types filter unions.
 * Mental model: distribution maps a conditional over every union member, and
 * returning `never` removes that member from the final union.
 * Common trap: `never` is not just "nothing"; in a union it is erased, which is
 * exactly why filters work.
 * Stretch: solve `MyIsExactlyAssignable` without distribution by tuple-wrapping
 * both sides of the conditional.
 */

type MyExclude<T, U> = never;

type MyExtract<T, U> = never;

type MyNonNullable<T> = never;

type MyKindOf<T> = never;

type MyIsExactlyAssignable<T, U> = never;

type Event =
  | { kind: "created"; id: string }
  | { kind: "deleted"; id: string; hard: boolean }
  | { kind: "renamed"; from: string; to: string };

type cases = [
  Expect<Equal<MyExclude<"a" | "b" | "c", "a" | "c">, "b">>,
  Expect<Equal<MyExtract<"a" | "b" | "c", "a" | "c">, "a" | "c">>,
  Expect<Equal<MyNonNullable<string | null | undefined>, string>>,
  Expect<Equal<MyKindOf<Event>, "created" | "deleted" | "renamed">>,
  Expect<Equal<MyIsExactlyAssignable<string | number, string>, false>>,
  Expect<Equal<MyIsExactlyAssignable<string, string | number>, true>>
];
