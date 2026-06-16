import type { Equal, Expect } from "../assertions";

/**
 * Koan 02: Object utilities
 *
 * Goal: rebuild the object utilities that turn key unions into object shapes.
 * Mental model: mapped types iterate over a key union, while modifiers such as
 * `readonly`, `?`, `-readonly`, and `-?` preserve or rewrite property metadata.
 * Common trap: `Omit<T, K>` is easier and safer as `Pick<T, Exclude<keyof T, K>>`
 * than by trying to delete keys after mapping.
 * Stretch: inspect how optional properties behave when `exactOptionalPropertyTypes`
 * is enabled.
 */

type User = {
  readonly id: string;
  name?: string;
  admin: boolean;
};

type MyPick<T, K extends keyof T> = never;

type MyOmit<T, K extends keyof any> = never;

type MyPartial<T> = never;

type MyRequired<T> = never;

type MyReadonly<T> = never;

type MyRecord<K extends keyof any, V> = never;

type cases = [
  Expect<
    Equal<MyPick<User, "id" | "admin">, { readonly id: string; admin: boolean }>
  >,
  Expect<Equal<MyOmit<User, "admin">, { readonly id: string; name?: string }>>,
  Expect<
    Equal<
      MyPartial<{ id: string; count: number }>,
      { id?: string; count?: number }
    >
  >,
  Expect<
    Equal<
      MyRequired<User>,
      { readonly id: string; name: string; admin: boolean }
    >
  >,
  Expect<
    Equal<
      MyReadonly<{ id: string; count: number }>,
      { readonly id: string; readonly count: number }
    >
  >,
  Expect<
    Equal<
      MyRecord<"draft" | "published", number>,
      { draft: number; published: number }
    >
  >,
];
