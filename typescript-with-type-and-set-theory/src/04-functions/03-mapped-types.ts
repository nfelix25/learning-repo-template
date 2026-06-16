import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — GENERICS AS TYPE FUNCTIONS
// Koan 3 of 5: Mapped types — type-level map
// ═══════════════════════════════════════════════════════════════════════════
//
// A MAPPED TYPE iterates over a union of keys and applies a transformation
// to each key-value pair:
//
//   { [K in Keys]: ValueType }
//
// This is exactly Array.prototype.map, but for the key-value pairs of a type.
//
//   type Nullable<T> = { [K in keyof T]: T[K] | null }
//
//   Nullable<{ a: string; b: number }>
//   →  { a: string | null; b: number | null }
//
// ───────────────────────────────────────────────────────────────────────────
// MODIFIERS
// ───────────────────────────────────────────────────────────────────────────
//
//   Add readonly:    { readonly [K in keyof T]: T[K] }
//   Add optional:    { [K in keyof T]?: T[K] }
//   Remove readonly: { -readonly [K in keyof T]: T[K] }
//   Remove optional: { [K in keyof T]-?: T[K] }
//
//   The `-` prefix REMOVES a modifier. This is how Required<T> removes `?`.
//
// ───────────────────────────────────────────────────────────────────────────
// KEY REMAPPING (the `as` clause)
// ───────────────────────────────────────────────────────────────────────────
//
//   { [K in keyof T as NewKey]: T[K] }
//
//   The `as NewKey` clause lets you transform the key itself.
//   If NewKey evaluates to `never`, that key is excluded entirely.
//
//   type Getters<T> = {
//     [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
//   }
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Nullable — add `| null` to every value.
type Nullable<T> = { [K in keyof T]: T[K] | null };

type _test1 = Expect<
  Equal<
    Nullable<{ a: string; b: number }>,
    { a: string | null; b: number | null }
  >
>;

// 2. Mutable — remove `readonly` from every property.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type _test2 = Expect<
  Equal<
    Mutable<{ readonly a: string; readonly b: number }>,
    { a: string; b: number }
  >
>;

// 3. Key remapping: Prefix every key with "get" + capitalize.
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

type _test3 = Expect<
  Equal<
    Getters<{ name: string; age: number }>,
    { getName: () => string; getAge: () => number }
  >
>;
//   No blank here — study the syntax and verify it passes.

// 4. Key remapping: Build Setters similarly.
type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

type _test4 = Expect<
  Equal<
    Setters<{ name: string; age: number }>,
    { setName: (value: string) => void; setAge: (value: number) => void }
  >
>;

// 5. Filtering keys via `as never`.
//    When the remapped key is `never`, that entry is dropped.
//    Build PickByValue using key remapping:
type PickByValue<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };

type _test5 = Expect<
  Equal<
    PickByValue<{ a: string; b: number; c: string }, string>,
    { a: string; c: string }
  >
>;

// 6. Mapped type over a union (not just keyof T).
//    You can map over any union, not just object keys:
type BooleanRecord<T extends string> = { [K in T]: boolean };

type _test6 = Expect<
  Equal<
    BooleanRecord<"read" | "write" | "execute">,
    { read: boolean; write: boolean; execute: boolean }
  >
>;

interface TypeFn {
  type: unknown;
  arg: unknown;
}

type Apply<Fn extends TypeFn, X> = (Fn & { arg: X })["type"];

interface MapToNullable extends TypeFn {
  type: this["arg"] extends infer T ? { [K in keyof T]: T[K] | null } : never;
}

type IsPlainObject<T> = T extends object
  ? T extends Function
    ? false
    : T extends readonly unknown[]
      ? false
      : true
  : false;

// 7. CHALLENGE: Deeply map — apply a transformation to every leaf value.
//    (Combines mapped types with conditional recursion from module 03)
type DeepNullable<T> = {
  [K in keyof T]: IsPlainObject<T[K]> extends true
    ? DeepNullable<T[K]>
    : T[K] | null;
};

type _test7 = Expect<
  Equal<
    DeepNullable<{ a: string; b: { c: number } }>,
    { a: string | null; b: { c: number | null } }
  >
>;

// ───────────────────────────────────────────────────────────────────────────
// MORE CHALLENGES
// ───────────────────────────────────────────────────────────────────────────

// 8. ReadonlyMapped — add readonly to every property.
type ReadonlyMapped<T> = {
  readonly [K in keyof T]: ReadonlyMapped<T[K]>;
};

type _test8 = Expect<
  Equal<
    ReadonlyMapped<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;

// 9. OptionalMapped — make every property optional.
type OptionalMapped<T> = {
  [K in keyof T]+?: OptionalMapped<T[K]>;
};

type _test9 = Expect<
  Equal<
    OptionalMapped<{ a: string; b: { c: number } }>,
    { a?: string; b?: { c?: number } }
  >
>;

// 10. RequiredMapped — remove optional from every property.
type RequiredMapped<T> = {
  [K in keyof T]-?: RequiredMapped<T[K]>;
};

type _test10 = Expect<
  Equal<
    RequiredMapped<{ a?: string; b?: { c?: number } }>,
    { a: string; b: { c: number } }
  >
>;

// 11. MutableRequired — remove both readonly and optional modifiers.
type MutableRequired<T> = { -readonly [K in keyof T]-?: MutableRequired<T[K]> };

type _test11 = Expect<
  Equal<
    MutableRequired<{ readonly a?: string; readonly b?: number }>,
    { a: string; b: number }
  >
>;

// 12. BoxValues — wrap each value in a small object.
type BoxValues<T> = { [K in keyof T]: { value: T[K] } };

type _test12 = Expect<
  Equal<
    BoxValues<{ name: string; count: number }>,
    { name: { value: string }; count: { value: number } }
  >
>;

// 13. PromiseValues — wrap each value in Promise.
type PromiseValues<T> = { [K in keyof T]: Promise<T[K]> };

type _test13 = Expect<
  Equal<
    PromiseValues<{ user: string; visits: number }>,
    { user: Promise<string>; visits: Promise<number> }
  >
>;

// 14. FunctionValues — turn each value into a nullary function returning it.
type FunctionValues<T> = { [K in keyof T]: () => T[K] };

type _test14 = Expect<
  Equal<
    FunctionValues<{ ready: boolean; count: number }>,
    { ready: () => boolean; count: () => number }
  >
>;

// 15. ValueOrArray — each property accepts either one value or an array.
type ValueOrArray<T> = { [K in keyof T]: T[K] | T[K][] };

type _test15 = Expect<
  Equal<
    ValueOrArray<{ tag: string; score: number }>,
    { tag: string | string[]; score: number | number[] }
  >
>;

// 16. PrefixKeys — remap keys with a string prefix and capitalization.
type PrefixKeys<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${Capitalize<K & string>}`]: T[K];
};

type _test16 = Expect<
  Equal<
    PrefixKeys<{ name: string; age: number }, "user">,
    { userName: string; userAge: number }
  >
>;

// 17. SuffixKeys — remap keys with a string suffix.
type SuffixKeys<T, Suffix extends string> = {
  [K in keyof T as `${K & string}${Suffix}`]: T[K];
};

type _test17 = Expect<
  Equal<
    SuffixKeys<{ width: number; height: number }, "Px">,
    { widthPx: number; heightPx: number }
  >
>;

// 18. PickKeys — keep only a constrained subset of keys.
type PickKeys<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? Key : never]: T[Key];
};

type _test18 = Expect<
  Equal<
    PickKeys<{ id: string; name: string; age: number }, "id" | "age">,
    { id: string; age: number }
  >
>;

// 19. DropKeys — drop a constrained subset of keys.
type DropKeys<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
};

type _test19 = Expect<
  Equal<
    DropKeys<{ id: string; name: string; age: number }, "age">,
    { id: string; name: string }
  >
>;

// 20. PickByKeyPrefix — keep keys whose names start with Prefix.
type PickByKeyPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K];
};

type _test20 = Expect<
  Equal<
    PickByKeyPrefix<
      { userName: string; userAge: number; postTitle: string },
      "user"
    >,
    { userName: string; userAge: number }
  >
>;

// 21. DropByKeyPrefix — drop keys whose names start with Prefix.
type DropByKeyPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};

type _test21 = Expect<
  Equal<
    DropByKeyPrefix<
      { userName: string; userAge: number; postTitle: string },
      "user"
    >,
    { postTitle: string }
  >
>;

// 22. OmitByValue — drop keys whose value type extends V.
type OmitByValue<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] };

type _test22 = Expect<
  Equal<
    OmitByValue<{ a: string; b: number; c: boolean }, string | boolean>,
    { b: number }
  >
>;

// 23. PickReadonlyByValue — keep matching values and make them readonly.
type PickReadonlyByValue<T, V> = {
  readonly [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type _test23 = Expect<
  Equal<
    PickReadonlyByValue<{ name: string; age: number; city: string }, string>,
    { readonly name: string; readonly city: string }
  >
>;

// 24. PickOptionalByValue — keep matching values and make them optional.
type PickOptionalByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]+?: T[K];
};

type _test24 = Expect<
  Equal<
    PickOptionalByValue<{ name: string; age: number; visits: 0 }, number>,
    { age?: number; visits?: 0 }
  >
>;

// 25. FlagMap — map a union of names into boolean flags.
type FlagMap<T extends string> = { [K in T as `is${Capitalize<K>}`]: boolean };

type _test25 = Expect<
  Equal<FlagMap<"read" | "write">, { isRead: boolean; isWrite: boolean }>
>;

// 26. ChangeCallbacks — create one callback property per source key.
type ChangeCallbacks<T> = {
  [K in keyof T as `${K & string}Changed`]: (value: T[K]) => void;
};

type _test26 = Expect<
  Equal<
    ChangeCallbacks<{ name: string; age: number }>,
    {
      nameChanged: (value: string) => void;
      ageChanged: (value: number) => void;
    }
  >
>;

// 27. DeepReadonlyMapped — recursively add readonly to object properties.
type DeepReadonlyMapped<T> = {
  readonly [K in keyof T]: T[K] extends Record<PropertyKey, unknown>
    ? DeepReadonlyMapped<T[K]>
    : T[K];
};

type _test27 = Expect<
  Equal<
    DeepReadonlyMapped<{ a: string; nested: { b: number } }>,
    { readonly a: string; readonly nested: { readonly b: number } }
  >
>;

export {};
