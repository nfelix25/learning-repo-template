// ─── k-022: Template Literals + Mapped Types (Synthesis) ────────────────────
//
// Template literal types become most powerful inside mapped types.
// The `as` clause can rename keys using template literals, and the value type
// can reference both the original key and derived string types.
//
// This is the synthesis koan for Phases 3–5. It brings together:
// - Mapped type iteration ([K in keyof T])
// - Key remapping (as clause)
// - Template literal types (`${K}Changed`)
// - Intrinsic string types (Capitalize)
//
// The output types below represent real-world patterns you'll recognize from
// Vue's Composition API, Pinia, Zustand, and similar libraries.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Getters<T> — property access methods ──────────────────────────────
//
// `Getters<T>` maps each property to a getter method.
// { name: string } → { getName: () => string }

type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

type _1a = Expect<
  Equal<
    Getters<{ name: string; count: number }>,
    { getName: () => string; getCount: () => number }
  >
>;

// ── Part 2: Setters<T> — property mutation methods ───────────────────────────

type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

type _2a = Expect<
  Equal<
    Setters<{ name: string; count: number }>,
    { setName: (value: string) => void; setCount: (value: number) => void }
  >
>;

// ── Part 3: Store<T> — Getters and Setters combined ──────────────────────────
//
// `Store<T>` combines getters and setters into one object type.

type Store<T> = {
  [K in keyof (Getters<T> & Setters<T>)]: (Getters<T> & Setters<T>)[K];
};

type _3a = Expect<
  Equal<
    Store<{ name: string }>,
    { getName: () => string; setName: (value: string) => void }
  >
>;

// ── Part 4: Watchers<T> — change observation handlers ────────────────────────
//
// `Watchers<T>` creates handlers for observing property changes.
// Each property `key: T[K]` becomes `watchKey(handler: (oldVal: T[K], newVal: T[K]) => void): void`.

type Watchers<T> = {
  [K in keyof T & string as `watch${Capitalize<K>}`]: (
    handler: (oldVal: T[K], newVal: T[K]) => void,
  ) => void;
};

type _4a = Expect<
  Equal<
    Watchers<{ count: number }>,
    { watchCount: (handler: (oldVal: number, newVal: number) => void) => void }
  >
>;

// ── Part 5: EventHandlers<Events> — from event union to typed handlers ────────
//
// `EventHandlers<Events>` maps a union of event name strings to a type where
// each event name is prefixed with "on" and capitalized.
// Each handler receives an event string and returns void.

type EventHandlers<Events extends string> = {
  [E in Events as `on${Capitalize<E>}`]: (event: string) => void;
};

type _5a = Expect<
  Equal<
    EventHandlers<"click" | "focus" | "blur">,
    {
      onClick: (event: string) => void;
      onFocus: (event: string) => void;
      onBlur: (event: string) => void;
    }
  >
>;

// ── Part 6: DeepGetters<T> — recursive getter generation ─────────────────────
//
// `DeepGetters<T>` flattens nested objects into a single-level getter object.
// { user: { name: string } } → { getUserName: () => string }
//
// This one is hard. Hint: recurse when T[K] is an object (not a primitive),
// prepending the parent key to child keys.

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

type DeepGetters<T, Prefix extends string = ""> = UnionToIntersection<
  {
    [K in keyof T & string]: T[K] extends Primitive | readonly unknown[]
      ? {
          [P in `get${Prefix}${Capitalize<K>}`]: () => T[K];
        }
      : DeepGetters<T[K], `${Prefix}${Capitalize<K>}`>;
  }[keyof T & string]
>;

type _6a = Expect<
  Equal<
    DeepGetters<{ name: string; age: number }>,
    { getName: () => string; getAge: () => number }
  >
>;

type _6b = Expect<
  Equal<
    DeepGetters<{ user: { name: string; email: string } }>,
    { getUserName: () => string; getUserEmail: () => string }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
