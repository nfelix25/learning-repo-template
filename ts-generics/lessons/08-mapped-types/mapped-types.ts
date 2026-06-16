// Lesson 08 — Mapped Types
// ─────────────────────────────────────────────────────────────────────────────
// Replace each `never` stub with the correct mapped type expression.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Create an object type with the same keys as T, but make every property optional.
export type MyPartial<T> = { [K in keyof T]+?: T[K] };

// Goal: Create an object type with the same keys and values as T, but prevent property reassignment.
export type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Goal: Create an object type that keeps only the selected keys from T.
export type MyPick<T, K extends keyof T> = { [Key in K]: T[Key] };

// Goal: Create an object type with the same shape as T, but remove readonly from every property.
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Goal: Create an object type with the same keys as T, but make every property required.
export type MyRequired<T> = { [K in keyof T]-?: T[K] };

// Goal: Create an object type from a union of keys where every key has the same value type.
export type MyRecord<K extends PropertyKey, V> = { [Key in K]: V };

// Goal: Create an object type that keeps every key from T except the selected keys.
export type MyOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
};

// Goal: Create an object type with the same keys as T, but allow each value to also be null.
export type Nullable<T> = { [K in keyof T]: T[K] | null };

// Goal: Create an object type with the same keys as T, but wrap each value in a container object.
export type Boxed<T> = { [K in keyof T]: { value: T[K] } };

// Goal: Create an object type with the same keys as T, but turn each value into a zero-argument function result.
export type ToMethods<T> = { [K in keyof T]: () => T[K] };

// Goal: Create an object type with the same keys as T, but turn each value into an array of that value type.
export type ToArrays<T> = { [K in keyof T]: T[K][] };

// Goal: Create an object type with the same keys as T, but wrap each value in a Promise.
export type ToPromises<T> = { [K in keyof T]: Promise<T[K]> };

// Goal: Create an object type with the same keys as T, but remove null and undefined from every value.
export type NonNullableProps<T> = {
  [K in keyof T]: T[K] & {};
  // T[K] extends null | undefined does not distribute since T[K] is not a naked type parameter, so we can use an intersection with an empty object to filter out null and undefined.

  // T & {} works because, in TypeScript, {} means any non - nullish value
};

// Goal: Create an object type that keeps only properties whose values match the selected value type.
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// Goal: Create an object type that removes properties whose values match the selected value type.
export type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type Expect<T extends true> = T;

type ExampleUser = {
  readonly id?: string;
  name: string;
  age: number;
};

export type MappedTypeExamples = [
  Expect<
    Equal<
      MyRequired<ExampleUser>,
      { readonly id: string; name: string; age: number }
    >
  >,
  Expect<Equal<MyRecord<"x" | "y", number>, { x: number; y: number }>>,
  Expect<
    Equal<MyOmit<ExampleUser, "age">, { readonly id?: string; name: string }>
  >,
  Expect<
    Equal<
      Nullable<{ name: string; age: number }>,
      { name: string | null; age: number | null }
    >
  >,
  Expect<
    Equal<
      Boxed<{ id: string; count: number }>,
      { id: { value: string }; count: { value: number } }
    >
  >,
  Expect<
    Equal<
      ToMethods<{ id: string; count: number }>,
      { id: () => string; count: () => number }
    >
  >,
  Expect<
    Equal<
      ToArrays<{ id: string; count: number }>,
      { id: string[]; count: number[] }
    >
  >,
  Expect<
    Equal<
      ToPromises<{ id: string; count: number }>,
      { id: Promise<string>; count: Promise<number> }
    >
  >,
  Expect<
    Equal<
      NonNullableProps<{ name: string | null; age: number | undefined }>,
      { name: string; age: number }
    >
  >,
  Expect<
    Equal<
      PickByValue<{ name: string; age: number; email: string }, string>,
      { name: string; email: string }
    >
  >,
  Expect<
    Equal<
      OmitByValue<{ name: string; age: number; active: boolean }, string>,
      { age: number; active: boolean }
    >
  >,
];
