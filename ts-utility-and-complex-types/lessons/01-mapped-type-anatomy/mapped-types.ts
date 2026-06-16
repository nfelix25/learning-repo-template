// Lesson 01 — Mapped Type Anatomy
// Fill in each TODO. Tests in mapped-types.test.ts will pass when complete.

// 1. Remove `readonly` from all properties.
export type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // TODO

// 2. Make only the specified keys optional; leave all other keys as-is.
export type Optional<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? K : never]+?: T[K];
} & { [Key in keyof T as Key extends K ? never : K]: T[K] }; // TODO

// 3. Make all properties both `readonly` AND required (remove `?`).
export type ReadonlyRequired<T> = { +readonly [K in keyof T]-?: T[K] }; // TODO

// 4. Keep only keys whose value type extends `V`.
export type FilterByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
}; // TODO

// 5. Produce { getFoo(): T['foo'], getBar(): T['bar'], ... } for each key.
//    Hint: use key remapping with `as` and `Capitalize`.
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
}; // TODO

// ─── Type test helpers ───────────────────────────────────────────────────────
type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// ─── Additional exercises ────────────────────────────────────────────────────

// 6. Make every property value nullable (T[K] | null).
export type Nullable<T> = { [K in keyof T]: T[K] | null }; // TODO

// 7. Strip null and undefined from every property value.
export type NonNullableValues<T> = { [K in keyof T]: T[K] & {} }; // TODO

// 8. Replace every property value with a fixed type U.
export type MapValues<T, U> = { [K in keyof T]: U }; // TODO

// 9. Produce { setFoo(v: T['foo']): void, ... } for each key.
//    Hint: same key-remapping trick as Getters.
export type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (newValue: T[K]) => void;
}; // TODO

// 10. Prefix every key with P and capitalise the original key name.
//     e.g. PrefixKeys<{ foo: string }, 'on'> → { onFoo: string }
export type PrefixKeys<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<K & string>}`]: T[K];
}; // TODO

// 11. Swap keys and values. Values must be valid property keys.
//     e.g. Flip<{ a: 'x'; b: 'y' }> → { x: 'a'; y: 'b' }
export type Flip<T extends Record<keyof T, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
}; // TODO

// 12. Remove keys whose value type extends V (inverse of FilterByValue).
export type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
}; // TODO
export type IsFunction<T> = T extends (...args: any[]) => any | (() => void)
  ? true
  : false;
// 13. Produce a union of all keys whose value extends a function type.
//     Result is a string-literal union, not an object type.
//     Hint: map each key to itself-or-never, then index with [keyof T].
export type FunctionKeys<T> = {
  [K in keyof T]: IsFunction<T[K]> extends true ? K : never;
}[keyof T]; // TODO

// 14. Keep only required (non-optional) keys.
//     Hint: {} extends Pick<T, K> is true only when K is optional.
export type PickRequired<T> = {
  [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K];
}; // TODO

// 15. Keep only optional keys (and preserve the `?` modifier).
export type PickOptional<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K];
}; // TODO

// 16. Recursively apply `readonly` to every nested object.
//     Primitives (non-object values) are left as-is.
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
}; // TODO

// 17. Recursively make every property optional.
export type DeepPartial<T> = {
  [K in keyof T]+?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}; // TODO

// 18. For every function-valued property, wrap its return type in Promise.
//     Non-function properties pass through unchanged.
export type PromisifyAll<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<R>
    : T[K];
}; // TODO

// 19. Merge B into A with B's keys taking precedence (like { ...a, ...b }).
//     Result must be a flat object type, not an intersection.

export type Spread<A, B> = Omit<A, keyof B> & B extends infer T
  ? { [K in keyof T]: T[K] } & {}
  : never;

// 20. Make only the K keys readonly; leave all other keys unchanged.
export type ReadonlyPick<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
} & {
  readonly [Key in K]: T[Key];
} extends infer T
  ? { [K in keyof T]: T[K] }
  : never; // TODO

// ─── Creative exercises ──────────────────────────────────────────────────────

// 21. Explode T into a union of single-key objects — one per key.
//     e.g. Unionize<{ a: string; b: number }> → { a: string } | { b: number }

export type Unionize<T> = { [K in keyof T]: Pick<T, K> }[keyof T]; // TODO

// 22. From { foo: string; bar: number }, produce
//     { onFooChange: (v: string) => void; onBarChange: (v: number) => void }.

export type Callbacks<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (v: T[K]) => void;
}; // TODO

// 23. Rename specific keys according to a mapping object M.
//     e.g. RemapKeys<{ foo: string; bar: number }, { foo: 'baz' }>
//          → { baz: string; bar: number }

export type RemapKeys<T, M extends { [K in keyof T]?: string }> = {
  [K in keyof T as M[K] extends string ? M[K] : K]: T[K];
}; // TODO

// 24. Map each property value to its TypeScript type name as a string literal.
//     Cover: 'string' | 'number' | 'boolean' | 'function' | 'object'.

export type ToString<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : IsFunction<T> extends true
        ? "function"
        : T extends object
          ? "object"
          : never;

export type Schema<T> = { [K in keyof T]: ToString<T[K]> };

type t = Schema<{ a: string; b: number; c: boolean; d: () => void }>;

// 25. Given an object whose keys follow the `on${Event}` convention, produce a
//     new object with the prefix stripped and the first letter lowercased.

export type EventMap<T> = {
  [K in keyof T as K extends `on${infer Event}`
    ? Uncapitalize<Event>
    : never]: T[K];
}; // TODO

// ─── Inline type tests ───────────────────────────────────────────────────────

// 6. Nullable
type _6a = Expect<
  Equal<
    Nullable<{ a: string; b: number }>,
    { a: string | null; b: number | null }
  >
>;
type _6b = Expect<Equal<Nullable<{}>, {}>>;

// 7. NonNullableValues
type _7a = Expect<
  Equal<
    NonNullableValues<{ a: string | null; b: number | undefined; c: boolean }>,
    { a: string; b: number; c: boolean }
  >
>;
type _7b = Expect<Equal<NonNullableValues<{ x: string }>, { x: string }>>;

// 8. MapValues
type _8a = Expect<
  Equal<
    MapValues<{ a: string; b: number }, boolean>,
    { a: boolean; b: boolean }
  >
>;
type _8b = Expect<Equal<MapValues<{ x: string }, never>, { x: never }>>;

// 9. Setters
type _9a = Expect<
  Equal<
    Setters<{ name: string; age: number }>,
    { setName: (v: string) => void; setAge: (v: number) => void }
  >
>;

// 10. PrefixKeys
type _10a = Expect<
  Equal<
    PrefixKeys<{ foo: string; bar: number }, "on">,
    { onFoo: string; onBar: number }
  >
>;
type _10b = Expect<Equal<PrefixKeys<{ x: boolean }, "is">, { isX: boolean }>>;

// 11. Flip
type _11a = Expect<Equal<Flip<{ a: "x"; b: "y" }>, { x: "a"; y: "b" }>>;
type _11b = Expect<Equal<Flip<{ a: 1; b: 2 }>, { 1: "a"; 2: "b" }>>;

// 12. OmitByValue
type _12a = Expect<
  Equal<OmitByValue<{ a: string; b: number; c: string }, string>, { b: number }>
>;
// string | number does not extend number, so x survives
type _12b = Expect<
  Equal<
    OmitByValue<{ x: string | number; y: number }, number>,
    { x: string | number }
  >
>;

// 13. FunctionKeys
type _13a = Expect<
  Equal<
    FunctionKeys<{
      name: string;
      onClick: () => void;
      onChange: (v: string) => void;
    }>,
    "onClick" | "onChange"
  >
>;
type _13b = Expect<Equal<FunctionKeys<{ a: string; b: number }>, never>>;

// 14. PickRequired
type _14a = Expect<
  Equal<
    PickRequired<{ a: string; b?: number; c: boolean }>,
    { a: string; c: boolean }
  >
>;
type _14b = Expect<Equal<PickRequired<{ a?: string; b?: number }>, {}>>;

// 15. PickOptional
type _15a = Expect<
  Equal<
    PickOptional<{ a: string; b?: number; c?: boolean }>,
    { b?: number; c?: boolean }
  >
>;
type _15b = Expect<Equal<PickOptional<{ a: string; b: number }>, {}>>;

// 16. DeepReadonly
type _16a = Expect<
  Equal<
    DeepReadonly<{ a: string; nested: { b: number } }>,
    { readonly a: string; readonly nested: { readonly b: number } }
  >
>;
type _16b = Expect<Equal<DeepReadonly<{ x: number }>, { readonly x: number }>>;

// 17. DeepPartial
type _17a = Expect<
  Equal<
    DeepPartial<{ a: string; nested: { b: number } }>,
    { a?: string; nested?: { b?: number } }
  >
>;
type _17b = Expect<Equal<DeepPartial<{ x?: string }>, { x?: string }>>;

// 18. PromisifyAll
type _18a = Expect<
  Equal<
    PromisifyAll<{
      fetch: () => string;
      save: (id: number) => boolean;
      data: number;
    }>,
    {
      fetch: () => Promise<string>;
      save: (id: number) => Promise<boolean>;
      data: number;
    }
  >
>;

// 19. Spread — B wins on overlap; result is a flat object type
type _19a = Expect<
  Equal<
    Spread<{ a: string; b: number }, { b: boolean; c: string }>,
    { a: string; b: boolean; c: string }
  >
>;
type _19b = Expect<Equal<Spread<{ a: string }, {}>, { a: string }>>;

// 20. ReadonlyPick — readonly only on listed keys
type _20a = Expect<
  Equal<
    ReadonlyPick<{ a: string; b: number; c: boolean }, "a" | "b">,
    { readonly a: string; readonly b: number; c: boolean }
  >
>;
type _20b = Expect<
  Equal<
    ReadonlyPick<{ x: string; y: number }, "x" | "y">,
    { readonly x: string; readonly y: number }
  >
>;

// ─── Inline type tests ───────────────────────────────────────────────────────

// 21. Unionize
type _21a = Expect<
  Equal<Unionize<{ a: string; b: number }>, { a: string } | { b: number }>
>;
// Edge: single key — union collapses to that one object
type _21b = Expect<Equal<Unionize<{ x: boolean }>, { x: boolean }>>;

// 22. Callbacks
type _22a = Expect<
  Equal<
    Callbacks<{ name: string; count: number }>,
    { onNameChange: (v: string) => void; onCountChange: (v: number) => void }
  >
>;

// 23. RemapKeys
type _23a = Expect<
  Equal<
    RemapKeys<{ foo: string; bar: number; baz: boolean }, { foo: "qux" }>,
    { qux: string; bar: number; baz: boolean }
  >
>;
// Edge: empty M — all keys pass through unchanged
type _23b = Expect<
  Equal<RemapKeys<{ a: string; b: number }, {}>, { a: string; b: number }>
>;

// 24. Schema
type _24a = Expect<
  Equal<
    Schema<{ a: string; b: number; c: boolean; d: () => void }>,
    { a: "string"; b: "number"; c: "boolean"; d: "function" }
  >
>;
// Edge: nested object value → 'object'
type _24b = Expect<Equal<Schema<{ x: { y: number } }>, { x: "object" }>>;

// 25. EventMap
type _25a = Expect<
  Equal<
    EventMap<{
      onClick: () => void;
      onHover: (x: number) => void;
      data: string;
    }>,
    { click: () => void; hover: (x: number) => void }
  >
>;
// Edge: no on-prefixed keys → empty object
type _25b = Expect<Equal<EventMap<{ name: string; count: number }>, {}>>;
