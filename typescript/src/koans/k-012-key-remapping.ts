// ─── k-012: Key Remapping in Mapped Types ────────────────────────────────────
//
// The `as` clause in mapped types lets you rename keys:
//
//   type Rename<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: T[K] }
//   // { name: string } → { getName: () => string }   (if you also change T[K])
//
// Two key powers:
//
// 1. RENAME: produce a new key name from the original via template literals.
//    `[K in keyof T as NewKey]` — NewKey can be any string type derived from K.
//
// 2. FILTER: map a key to `never` to exclude it from the output.
//    `[K in keyof T as T[K] extends string ? K : never]`
//    Keys that map to `never` are dropped from the result type.
//
// The `as` clause runs first; if it produces `never`, that key is skipped.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Getters — rename keys to getXxx ───────────────────────────────────
//
// `Getters<T>` produces an object where each property `name: T[K]` becomes
// a method `getName(): T[K]`. Use key remapping + template literals.

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type _1a = Expect<
  Equal<
    Getters<{ name: string; age: number }>,
    { getName: () => string; getAge: () => number }
  >
>;

type _1b = Expect<
  Equal<Getters<{ isActive: boolean }>, { getIsActive: () => boolean }>
>;

// ── Part 2: Setters — rename keys to setXxx ───────────────────────────────────
//
// `Setters<T>` produces an object where each property `name: T[K]` becomes
// a void method `setName(value: T[K]): void`.

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type _2a = Expect<
  Equal<
    Setters<{ name: string; count: number }>,
    { setName: (value: string) => void; setCount: (value: number) => void }
  >
>;

// ── Part 3: Filter by value type via as ────────────────────────────────────────
//
// `PickByValue<T, V>` keeps only properties whose value type extends V.
// Use the `as` clause to map non-matching keys to `never`.

type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type _3a = Expect<
  Equal<
    PickByValue<{ a: string; b: number; c: string; d: boolean }, string>,
    { a: string; c: string }
  >
>;

type _3b = Expect<
  Equal<
    PickByValue<{ x: string[]; y: number; z: object }, object>,
    { x: string[]; z: object }
  >
>;

// ── Part 4: OmitByValue — inverse of PickByValue ─────────────────────────────

type OmitByValue<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] };

type _4a = Expect<
  Equal<OmitByValue<{ a: string; b: number; c: string }, string>, { b: number }>
>;

// ── Part 5: EventMap — build from a union of event names ─────────────────────
//
// Given a union of event name strings, produce an event-handler map.
// Each `"click"` becomes `onClick: (event: Event) => void`.
// Capitalize the first letter and prepend "on".

type EventMap<Events extends string> = {
  [Event in Events as `on${Capitalize<string & Event>}`]: (
    event: Event,
  ) => void;
};

// type _5a = Expect<
//   Equal<
//     EventMap<"click" | "focus" | "blur">,
//     {
//       onClick: (event: Event) => void;
//       onFocus: (event: Event) => void;
//       onBlur: (event: Event) => void;
//     }
//   >
// >;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
