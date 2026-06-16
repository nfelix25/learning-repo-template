// Lesson 02 — Utility Type Internals

import { DeepMerge } from "@vitest/utils";
import { UnionToIntersection } from "expect-type";

// Reconstruct each utility type from first principles.
type User = { id: number; name: string; email: string; role: "admin" | "user" };
// 1. Equivalent to Partial<T> — all keys become optional.
export type MyPartial<T> = { [K in keyof T]+?: T[K] }; // TODO

// 2. Equivalent to Pick<T, K> — keep only the listed keys.
export type MyPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
}; // TODO

// 3. Stricter Omit — remove the listed keys (K must be keys of T).
export type MyOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
}; // TODO

// 4. Equivalent to Exclude<T, U> — remove union members assignable to U.
export type MyExclude<T, U> = T extends U ? never : T; // TODO

// 5. Equivalent to ReturnType<T> — extract the return type of a function type.
export type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never; // TODO

// ─── Type test helpers ───────────────────────────────────────────────────────
type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// ════════════════════════════════════════════════════════════════════════════
// Group 1 — Remaining built-in utility types
// ════════════════════════════════════════════════════════════════════════════

// 6. Remove `?` from every key — the `-?` modifier is the inverse of `+?`.
//    e.g. MyRequired<{ a?: string; b?: number }> → { a: string; b: number }
export type MyRequired<T> = { [K in keyof T]-?: T[K] }; // TODO

type _6a = Expect<
  Equal<MyRequired<{ a?: string; b?: number }>, { a: string; b: number }>
>;
type _6b = Expect<Equal<MyRequired<{ a: string }>, { a: string }>>; // already required → unchanged

// 7. Add `readonly` to every key.
//    e.g. MyReadonly<{ a: string }> → { readonly a: string }
export type MyReadonly<T> = { +readonly [K in keyof T]: T[K] }; // TODO

type _7a = Expect<
  Equal<
    MyReadonly<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;
type _7b = Expect<Equal<MyReadonly<{}>, {}>>;

// 8. Map a union of keys K to a single value type V.
//    `keyof any` is the widest valid key constraint: string | number | symbol.
//    e.g. MyRecord<'a' | 'b', number> → { a: number; b: number }
export type MyRecord<K extends keyof any, V> = { [_ in K]: V }; // TODO

type _8a = Expect<Equal<MyRecord<"a" | "b", number>, { a: number; b: number }>>;
type _8b = Expect<Equal<MyRecord<string, boolean>, Record<string, boolean>>>;

// 9. Keep union members that extend U — the distributive complement of Exclude.
//    e.g. MyExtract<string | number | boolean, string | number> → string | number
export type MyExtract<T, U> = T extends U ? T : never;

type _9a = Expect<
  Equal<
    MyExtract<
      never | undefined | string | number | boolean,
      string | number | undefined
    >,
    string | number | undefined
  >
>;
type _9b = Expect<Equal<MyExtract<string, number>, never>>; // no overlap → never

// 10. Remove null and undefined from a union type.
//     e.g. MyNonNullable<string | null | undefined> → string
export type MyNonNullable<T> = T extends null | undefined ? never : T; // TODO

type _10a = Expect<Equal<MyNonNullable<string | null | undefined>, string>>;
type _10b = Expect<Equal<MyNonNullable<null | undefined>, never>>; // nothing survives

// 11. Extract the parameter types of a function as a tuple.
//     e.g. MyParameters<(a: string, b: number) => void> → [string, number]
//     Hint:
export type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...agrs: infer A
) => any
  ? A
  : never; // TODO

type _11a = Expect<
  Equal<MyParameters<(a: string, b: number) => void>, [string, number]>
>;
type _11b = Expect<Equal<MyParameters<() => void>, []>>; // zero-arg → empty tuple

// 12. Extract the constructor's parameter types as a tuple.
//     Hint:
//     e.g. MyConstructorParameters<typeof Error> → [message?: string]
declare class Pet {
  constructor(name: string, age: number);
}
export type MyConstructorParameters<
  T extends abstract new (...args: any[]) => any,
> = T extends abstract new (...args: infer A) => any ? A : never; // TODO

type _12a = Expect<
  Equal<MyConstructorParameters<typeof Pet>, [string, number]>
>;

// 13. Extract the instance type returned by a constructor.
//     Hint:
//     e.g. MyInstanceType<typeof Pet> → Pet
export type MyInstanceType<T extends abstract new (...args: any[]) => any> =
  T extends abstract new (...args: never[]) => infer Type ? Type : never; // TODO

type _13a = Expect<Equal<MyInstanceType<typeof Pet>, Pet>>;

// 14. Recursively unwrap a Promise chain until reaching a non-Promise value.
//     e.g. MyAwaited<Promise<Promise<string>>> → string
//     Hint:
export type MyAwaited<T> = T extends PromiseLike<infer A> ? MyAwaited<A> : T; // TODO

type _14a = Expect<Equal<MyAwaited<Promise<string>>, string>>;
type _14b = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
type _14c = Expect<Equal<MyAwaited<string>, string>>; // non-Promise passes through

// 15. Extract the type of the explicit `this` parameter from a function.
//     e.g. MyThisParameterType<(this: Date, x: number) => void> → Date
//     Hint:
export type MyThisParameterType<T extends (...args: any[]) => any> = T extends (
  this: infer This,
  ...args: never
) => any
  ? This
  : never; // TODO

type _15a = Expect<
  Equal<MyThisParameterType<(this: Date, x: number) => void>, Date>
>;
type _15b = Expect<Equal<MyThisParameterType<() => void>, unknown>>; // no `this` → unknown

// ════════════════════════════════════════════════════════════════════════════
// Group 2 — Extended utility patterns
// ════════════════════════════════════════════════════════════════════════════

// 16. Remove the `this` parameter from a function, producing a plain function.
//     e.g. MyOmitThisParameter<(this: Window, x: number) => void> → (x: number) => void
//     Hint:
export type MyOmitThisParameter<T> = T extends (
  this: any,
  ...rest: infer A
) => infer R
  ? (...args: A) => R
  : never; // TODO

type _16a = Expect<
  Equal<
    MyOmitThisParameter<(this: typeof globalThis, x: number) => void>,
    (x: number) => void
  >
>;
type _16b = Expect<
  Equal<MyOmitThisParameter<(x: string) => boolean>, (x: string) => boolean>
>;

// 17. Make only the K keys optional; leave all other keys exactly as-is.
//     e.g. MyPartialBy<{ a: string; b: number; c: boolean }, 'b' | 'c'> → { a: string; b?: number; c?: boolean }
//     Hint:
export type MyPartialBy<T, K extends keyof T> = { [Key in K]+?: T[Key] } & {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
} extends infer T
  ? { [K in keyof T]: T[K] }
  : never; // TODO

type _17a = Expect<
  Equal<MyPartialBy<{ a: string; b: number }, "b">, { a: string; b?: number }>
>;
type _17b = Expect<
  Equal<
    MyPartialBy<{ a: string; b: number; c: boolean }, "b" | "c">,
    { a: string; b?: number; c?: boolean }
  >
>;

// 18. Make only the K keys required; leave all other keys unchanged.
//     e.g. MyRequiredBy<{ a?: string; b?: number }, 'a'> → { a: string; b?: number }
export type MyRequiredBy<T, K extends keyof T> = { [Key in K]-?: T[Key] } & {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
} extends infer T
  ? { [K in keyof T]: T[K] }
  : never; // TODO

type _18a = Expect<
  Equal<
    MyRequiredBy<{ a?: string; b?: number }, "a">,
    { a: string; b?: number }
  >
>;
type _18b = Expect<
  Equal<
    MyRequiredBy<{ a?: string; b?: number }, "a" | "b">,
    { a: string; b: number }
  >
>;

// 19. Apply `readonly` to only the K keys; all other keys remain mutable.
//     e.g. MyReadonlyBy<{ a: string; b: number }, 'a'> → { readonly a: string; b: number }
export type MyReadonlyBy<T, K extends keyof T> = {
  +readonly [Key in K]: T[Key];
} & {
  -readonly [Key in keyof T as Key extends K ? never : Key]: T[Key];
} extends infer U
  ? { [K in keyof U]: U[K] }
  : never; // TODO

type _19a = Expect<
  Equal<
    MyReadonlyBy<{ a: string; readonly b: number }, "a">,
    { readonly a: string; b: number }
  >
>;
type _19b = Expect<
  Equal<
    MyReadonlyBy<{ a: string; b: number }, "a" | "b">,
    { readonly a: string; readonly b: number }
  >
>;

// 20. Keep only keys whose value type extends V — Pick based on value shape, not key name.
//     e.g. MyPickByValue<{ a: string; b: number; c: string }, string> → { a: string; c: string }
export type MyPickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
}; // TODO

type _20a = Expect<
  Equal<
    MyPickByValue<{ a: string; b: number; c: string }, string>,
    { a: string; c: string }
  >
>;
type _20b = Expect<Equal<MyPickByValue<{ a: string }, number>, {}>>; // no match → empty object

// 21. Remove keys whose value extends V — the inverse of MyPickByValue.
//     e.g. MyOmitByValue<{ a: string; b: number; c: string }, string> → { b: number }
export type MyOmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
}; // TODO

type _21a = Expect<
  Equal<
    MyOmitByValue<{ a: string; b: number; c: string }, string>,
    { b: number }
  >
>;
// string | number does not extend number, so x survives
type _21b = Expect<
  Equal<
    MyOmitByValue<{ x: string | number; y: number }, number>,
    { x: string | number }
  >
>;

// 22. Strip null and undefined from every property value in an object.
//     e.g. MyNonNullableValues<{ a: string | null; b: number | undefined }> → { a: string; b: number }
export type MyNonNullableValues<T> = {
  [K in keyof T]: T[K] extends infer T // infer inline to get naked type for distributing
    ? T extends null | undefined
      ? never
      : T
    : T[K];
}; // TODO

type _22a = Expect<
  Equal<
    MyNonNullableValues<{
      a: string | null;
      b: number | undefined;
      c: boolean;
    }>,
    { a: string; b: number; c: boolean }
  >
>;
type _22b = Expect<Equal<MyNonNullableValues<{ x: string }>, { x: string }>>; // already clean

// 23. Produce a union of all value types — the indexed access T[keyof T].
//     e.g. MyValues<{ a: string; b: number }> → string | number
export type MyValues<T> = T[keyof T]; // TODO

type _23a = Expect<Equal<MyValues<{ a: string; b: number }>, string | number>>;
type _23b = Expect<Equal<MyValues<{}>, never>>; // empty object → never

// 24. Produce a union of [key, value] pairs — one per property.
//     e.g. MyEntries<{ a: string; b: number }> → ['a', string] | ['b', number]
//     Hint:
export type MyEntries<T> = { [K in keyof T]: [K, T[K]] }[keyof T]; // TODO

type _24a = Expect<
  Equal<MyEntries<{ a: string; b: number }>, ["a", string] | ["b", number]>
>;
type _24b = Expect<Equal<MyEntries<{}>, never>>;

// 25. Produce a union of the names of all optional keys (not the values — the key literals).
//     e.g. MyOptionalKeys<{ a: string; b?: number; c?: boolean }> → 'b' | 'c'
//     Hint:
export type MyOptionalKeys<T> = keyof {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: {} extends Pick<T, K>
    ? K
    : never;
}; // TODO

type _25a = Expect<
  Equal<MyOptionalKeys<{ a: string; b?: number; c?: boolean }>, "b" | "c">
>;
type _25b = Expect<Equal<MyOptionalKeys<{ a: string; b: number }>, never>>; // all required → never

// ════════════════════════════════════════════════════════════════════════════
// Group 3 — Type-level predicates
// ════════════════════════════════════════════════════════════════════════════

// 26. Resolve to `true` if T is `never`, `false` otherwise.
//     Wrapping in a tuple [T] prevents distribution over the empty union.
//     e.g. MyIsNever<never> → true, MyIsNever<string> → false
export type MyIsNever<T> = [T] extends [never] ? true : false; // Remember that never does not distribute but rather resolves to never (not true or false)

type _26a = Expect<Equal<MyIsNever<never>, true>>;
type _26b = Expect<Equal<MyIsNever<string>, false>>;
type _26c = Expect<Equal<MyIsNever<string | never>, false>>; // string | never = string

// 27. Detect `any` — the only type for which `0 extends (1 & T)` is true.
//     e.g. MyIsAny<any> → true, MyIsAny<unknown> → false
export type MyIsAny<T> = 0 extends 1 & T ? true : false; // TODO

type _27a = Expect<Equal<MyIsAny<any>, true>>;
type _27b = Expect<Equal<MyIsAny<unknown>, false>>;
type _27c = Expect<Equal<MyIsAny<never>, false>>;

// 28. Detect if T is a union (has more than one member) using a second default
//     parameter `_T extends T = T` that captures T before distribution.
//     Inside `T extends any`, T has become a single member while _T is still
//     the full union — if they differ, T must have been a union.
//     e.g. MyIsUnion<string | number> → true, MyIsUnion<string> → false
export type MyIsUnion<T, _T extends T = T> = T extends any
  ? [_T] extends [T]
    ? false
    : true
  : never; // TODO

type _28a = Expect<Equal<MyIsUnion<string | number>, true>>;
type _28b = Expect<Equal<MyIsUnion<string>, false>>;
type _28c = Expect<Equal<MyIsUnion<boolean>, true>>; // boolean = true | false internally

// 29. Structural type equality — reconstruct the same trick used by Expect<Equal<...>> above.
//     e.g. MyEquals<string, string> → true, MyEquals<string, number> → false
export type MyEquals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 // Correct type for MyEqual<any, string>
    ? true
    : false; // TODO

type _29a = Expect<MyEquals<string, string>>;
type _29b = Expect<Equal<MyEquals<string, number>, false>>;
type _29c = Expect<MyEquals<{ readonly a: string }, { readonly a: string }>>;
type _29d = Expect<MyEquals<string | number, string | number>>;
type _29e = Expect<MyEquals<any, any>>;

// 30. Resolve to `true` if key K is readonly in T.
//     Hint:
//     using MyEquals.
//     e.g. MyIsReadonlyKey<{ readonly a: string; b: number }, 'a'> → true
export type MyIsReadonlyKey<T, K extends keyof T> =
  MyEquals<
    {
      [Key in keyof T as Key extends K ? Key : never]: T[K];
    },
    {
      readonly [Key in keyof T as Key extends K ? Key : never]: T[K];
    }
  > extends true
    ? true
    : false; // TODO

type _30a = Expect<
  Equal<MyIsReadonlyKey<{ readonly a: string; b: number }, "a">, true>
>;
type _30b = Expect<
  Equal<MyIsReadonlyKey<{ readonly a: string; b: number }, "b">, false>
>;

// 31. Distinguish a fixed-length tuple from a variable-length array.
//     Hint:
//     for a concrete tuple like `[string, number]` (length is the literal `2`).
//     e.g. MyIsTuple<[1, 2]> → true, MyIsTuple<number[]> → false
export type MyIsTuple<T extends readonly unknown[]> = number extends T["length"]
  ? false
  : true; // TODO

type _31a = Expect<Equal<MyIsTuple<[string, number]>, true>>;
type _31b = Expect<Equal<MyIsTuple<string[]>, false>>;
type _31c = Expect<Equal<MyIsTuple<[]>, true>>; // empty tuple is still a tuple
type _31d = Expect<Equal<MyIsTuple<readonly [1, 2]>, true>>;

// 32. Check whether K is a key of T at the type level.
//     e.g. MyHasProperty<{ a: string }, 'a'> → true, MyHasProperty<{ a: string }, 'b'> → false
export type MyHasProperty<T, K extends PropertyKey> = K extends keyof T
  ? true
  : false; // TODO

type _32a = Expect<Equal<MyHasProperty<{ a: string; b: number }, "a">, true>>;
type _32b = Expect<Equal<MyHasProperty<{ a: string }, "b">, false>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 4 — Tuple utilities
// ════════════════════════════════════════════════════════════════════════════

// 33. Extract the type of the first element of a non-empty tuple.
//     e.g. MyHead<[string, number, boolean]> → string
export type MyHead<T extends [any, ...any[]]> = T extends [
  infer Head,
  ...rest: any[],
]
  ? Head
  : never; // TODO

type _33a = Expect<Equal<MyHead<[string, number, boolean]>, string>>;
type _33b = Expect<Equal<MyHead<[boolean]>, boolean>>; // single element

// 34. Extract all elements after the first as a new tuple.
//     e.g. MyTail<[string, number, boolean]> → [number, boolean]
//     Hint:
export type MyTail<T extends [any, ...any[]]> = T extends [
  first: any,
  ...infer Tail,
]
  ? Tail
  : never; // TODO

type _34a = Expect<Equal<MyTail<[string, number, boolean]>, [number, boolean]>>;
type _34b = Expect<Equal<MyTail<[string]>, []>>; // single-element tail is empty

// 35. Extract the type of the last element.
//     e.g. MyLast<[string, number, boolean]> → boolean
//     Hint:
export type MyLast<T extends any[]> = T extends [...rest: any[], infer Last]
  ? Last
  : never; // TODO

type _35a = Expect<Equal<MyLast<[string, number, boolean]>, boolean>>;
type _35b = Expect<Equal<MyLast<[string]>, string>>;

// 36. Extract all elements except the last — the dual of MyTail.
//     e.g. MyInit<[string, number, boolean]> → [string, number]
//     Hint:
export type MyInit<T extends any[]> = T extends [...infer Init, last: any]
  ? Init
  : never; // TODO

type _36a = Expect<Equal<MyInit<[string, number, boolean]>, [string, number]>>;
type _36b = Expect<Equal<MyInit<[string]>, []>>;

// 37. Produce the tuple length as a number literal type.
//     e.g. MyLength<[string, number, boolean]> → 3
//     Hint:
export type MyLength<T extends readonly any[]> = T["length"]; // TODO

type _37a = Expect<Equal<MyLength<[string, number, boolean]>, 3>>;
type _37b = Expect<Equal<MyLength<[]>, 0>>;
type _37c = Expect<Equal<MyLength<[string]>, 1>>;

// 38. Concatenate two tuples into one.
//     e.g. MyConcat<[string, number], [boolean, null]> → [string, number, boolean, null]
//     Hint:
export type MyConcat<A extends readonly any[], B extends readonly any[]> = [
  ...first: A,
  ...last: B,
]; // TODO

type _38a = Expect<
  Equal<
    MyConcat<[string, number], [boolean, null]>,
    [string, number, boolean, null]
  >
>;
type _38b = Expect<Equal<MyConcat<[], [string]>, [string]>>;
type _38c = Expect<
  Equal<
    MyConcat<[string, number], [boolean, object]>,
    [string, number, boolean, object]
  >
>;

// 39. Append a new element type to the end of a tuple.
//     e.g. MyPush<[string, number], boolean> → [string, number, boolean]
export type MyPush<T extends readonly any[], V> = [...init: T, V]; // TODO

type _39a = Expect<
  Equal<MyPush<[string, number], boolean>, [string, number, boolean]>
>;
type _39b = Expect<Equal<MyPush<[], string>, [string]>>;

// 40. Prepend a new element type to the front of a tuple.
//     e.g. MyUnshift<[number, boolean], string> → [string, number, boolean]
export type MyUnshift<T extends readonly any[], V> = [V, ...rest: T]; // TODO

type _40a = Expect<
  Equal<MyUnshift<[number, boolean], string>, [string, number, boolean]>
>;
type _40b = Expect<Equal<MyUnshift<[], string>, [string]>>;

// 41. Pair up elements from two same-length tuples into [A[i], B[i]] tuples.
//     e.g. MyZip<[string, number], [boolean, null]> → [[string, boolean], [number, null]]
//     Hint:
export type MyZip<A extends any[], B extends any[]> = A extends [
  infer Afirst,
  ...infer Arest,
]
  ? B extends [infer Bfirst, ...infer Brest]
    ? [[Afirst, Bfirst], ...MyZip<Arest, Brest>]
    : []
  : []; // TODO

type _41a = Expect<
  Equal<
    MyZip<[string, number], [boolean, null]>,
    [[string, boolean], [number, null]]
  >
>;
type _41b = Expect<Equal<MyZip<[], []>, []>>;
type _41c = Expect<Equal<MyZip<[string], [number]>, [[string, number]]>>;

// 42. Flatten one level of nested tuples — spread each inner tuple into the result.
//     e.g. MyFlatten<[[string, number], [boolean, null]]> → [string, number, boolean, null]
//     Hint:
export type MyFlatten<T extends any[][]> = T extends [
  infer First,
  ...infer Rest extends any[][],
]
  ? First extends readonly unknown[]
    ? [...First, ...MyFlatten<Rest>]
    : [First, ...MyFlatten<Rest>]
  : []; // TODO

type _42a = Expect<
  Equal<
    MyFlatten<[[string, number], [boolean, null]]>,
    [string, number, boolean, null]
  >
>;
type _42b = Expect<Equal<MyFlatten<[[]]>, []>>;
type _42c = Expect<Equal<MyFlatten<[]>, []>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 5 — Recursive, advanced, and string utilities
// ════════════════════════════════════════════════════════════════════════════

// 43. Recursively apply `readonly` to every nested plain object.
//     Primitives and functions pass through unchanged.
//     e.g. MyDeepReadonly<{ a: { b: string } }> → { readonly a: { readonly b: string } }
export type MyDeepReadonly<T> = T extends (...args: never) => unknown
  ? T
  : T extends object
    ? {
        readonly [K in keyof T]: MyDeepReadonly<T[K]>;
      }
    : T; // TODO

type _43a = Expect<
  Equal<
    MyDeepReadonly<{ a: string; nested: { b: number; c: () => void } }>,
    {
      readonly a: string;
      readonly nested: { readonly b: number; readonly c: () => void };
    }
  >
>;
type _43b = Expect<
  Equal<MyDeepReadonly<{ x: number }>, { readonly x: number }>
>;

// 44. Recursively remove `?` from all keys at every nesting level.
//     e.g. MyDeepRequired<{ a?: { b?: string } }> → { a: { b: string } }
export type MyDeepRequired<T> = { [K in keyof T]-?: MyDeepRequired<T[K]> }; // TODO

type _44a = Expect<
  Equal<
    MyDeepRequired<string | { a?: string; nested?: { b?: number } }>,
    string | { a: string; nested: { b: number } }
  >
>;
type _44b = Expect<Equal<MyDeepRequired<{ x: string }>, { x: string }>>; // already required

// 45. Convert a union to an intersection using function contravariance.
//     In a contravariant position (function parameter), `A | B` must satisfy both
//     `(x: A) => void` and `(x: B) => void`, which TypeScript resolves as `(x: A & B) => void`.
//     e.g. MyUnionToIntersection<{ a: string } | { b: number }> → { a: string } & { b: number }
//     Hint:
export type MyUnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never; // TODO
/*
 * U extends unknown ? (arg: U) => void : never
 * distributes over the union:
 * (arg: { a: string }) => void
 * |
 * (arg: { b: number }) => void
 *
 * extends (arg: infer I) => void ? I : never
 *
 * infers one parameter type that can satisfy the whole union of functions.
 * Function parameter positions are contravariant, so the inferred type becomes the intersection:
 *
 * { a: string } & { b: number }
 * */

type _45a = Expect<
  Equal<
    MyUnionToIntersection<{ a: string } | { b: number }>,
    { a: string } & { b: number }
  >
>;
type _45b = Expect<
  Equal<MyUnionToIntersection<string | number>, string & number>
>; // = never

// 46. A type that only matches arrays with at least one element — no empty arrays allowed.
//     e.g. [1, 2] satisfies MyNonEmptyArray<number>, but [] does not.
//     Hint:
export type MyNonEmptyArray<T> = [first: T, ...rest: T[]];

type _46a = Expect<Equal<MyNonEmptyArray<string>, [string, ...string[]]>>;
type _46b = Expect<
  Equal<[] extends MyNonEmptyArray<string> ? false : true, true>
>; // [] is rejected

// 47. Remove leading whitespace characters from a string literal type.
//     e.g. MyTrimLeft<'  hello'> → 'hello'
//     Hint:
export type MyTrimLeft<S extends string> = S extends ` ${infer S}`
  ? MyTrimLeft<S>
  : S; // TODO

type _47a = Expect<Equal<MyTrimLeft<"  hello">, "hello">>;
type _47b = Expect<Equal<MyTrimLeft<"hello">, "hello">>;
type _47c = Expect<Equal<MyTrimLeft<"   ">, "">>;

// 48. Remove leading and trailing whitespace from a string literal.
//     e.g. MyTrim<'  hello  '> → 'hello'
//     Hint:
export type MyTrimRight<S extends string> = S extends `${infer S} `
  ? MyTrimRight<S>
  : S; // TODO
export type MyTrim<S extends string> = MyTrimLeft<MyTrimRight<S>>; // TODO

type _48_a = Expect<Equal<MyTrimRight<"hello   ">, "hello">>;
type _48_b = Expect<Equal<MyTrimRight<"hello">, "hello">>;
type _48_c = Expect<Equal<MyTrimRight<"   ">, "">>;

type _48a = Expect<Equal<MyTrim<"  hello  ">, "hello">>;
type _48b = Expect<Equal<MyTrim<"hello">, "hello">>;
type _48c = Expect<Equal<MyTrim<"  ">, "">>;

// 49. Replace the first occurrence of `From` with `To` in string literal S.
//     e.g. MyReplace<'hello world', 'world', 'TS'> → 'hello TS'
//     Hint:
//     Note: when `From` is empty, every position matches — think carefully about that edge.
export type MyReplaceFirst<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Pre}${From}${infer Post}` ? `${Pre}${To}${Post}` : S; // TODO

export type MyReplace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Pre}${From}${infer Post}`
  ? MyReplace<`${Pre}${To}${Post}`, From, To>
  : S; // TODO

type _49a = Expect<
  Equal<MyReplaceFirst<"hello world", "world", "TS">, "hello TS">
>;
type _49b = Expect<Equal<MyReplaceFirst<"no match", "x", "y">, "no match">>;
type _49c = Expect<Equal<MyReplaceFirst<"aaa", "a", "b">, "baa">>; // only the first occurrence

type _49_a = Expect<
  Equal<MyReplace<"world hello world", "world", "TS">, "TS hello TS">
>;
type _49_b = Expect<Equal<MyReplace<"no match", "x", "y">, "no match">>;
type _49_c = Expect<Equal<MyReplace<"aaa", "a", "b">, "bbb">>;

// 50. Join a tuple of string literals with a delimiter.
//     e.g. MyJoin<['a', 'b', 'c'], '-'> → 'a-b-c'

export type MyJoin<T extends string[], D extends string> = T extends readonly []
  ? ""
  : T extends readonly [infer First extends string]
    ? First
    : T extends readonly [
          infer First extends string,
          ...infer Rest extends string[],
        ]
      ? `${First}${D}${MyJoin<Rest, D>}`
      : string;

type _50a = Expect<Equal<MyJoin<["a", "b", "c"], "-">, "a-b-c">>;
type _50b = Expect<Equal<MyJoin<["hello"], ".">, "hello">>;
type _50c = Expect<Equal<MyJoin<[], ".">, "">>;

// ════════════════════════════════════════════════════════════════════════════
// Group 6 — Number arithmetic via tuples
// ════════════════════════════════════════════════════════════════════════════

// 51. Build a typed tuple of exactly N elements, each typed as T.
//     This is the primitive every number-arithmetic type below depends on.
//     e.g. BuildTuple<3, string> → [string, string, string]
//     Hint:
//     otherwise push T onto Acc and recurse.
export type BuildTuple<
  N extends number,
  T = unknown,
  Acc extends unknown[] = [],
> = Acc["length"] extends N ? Acc : BuildTuple<N, T, [...Acc, T]>; // TODO

type _51a = Expect<Equal<BuildTuple<3, string>, [string, string, string]>>;
type _51b = Expect<Equal<BuildTuple<0>, []>>;
type _51c = Expect<Equal<BuildTuple<2, number>, [number, number]>>;

// 52. Add two number literals by building two tuples and reading the combined length.
//     e.g. MyAdd<3, 4> → 7
//     Hint:
export type MyAdd<A extends number, B extends number> = [
  ...BuildTuple<A>,
  ...BuildTuple<B>,
]["length"];

type _52a = Expect<Equal<MyAdd<3, 4>, 7>>;
type _52b = Expect<Equal<MyAdd<0, 5>, 5>>;
type _52c = Expect<Equal<MyAdd<10, 10>, 20>>;

// 53. Subtract B from A (assume A >= B).
//     e.g. MySubtract<7, 3> → 4

export type MySubtract<A extends number, B extends number> = B extends 0
  ? A
  : [...BuildTuple<A>] extends infer Atup
    ? [...BuildTuple<B>] extends infer Btup
      ? Atup extends [unknown, ...infer Atail]
        ? Btup extends [unknown, ...infer Btail]
          ? MySubtract<Atail["length"], Btail["length"]>
          : never
        : never
      : never
    : never; // TODO

// Updated to subtract the smaller from the bigger, regardless of A or B
type MySubtractCorrect<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
    ? Rest["length"]
    : BuildTuple<B> extends [...BuildTuple<A>, ...infer Rest]
      ? Rest["length"]
      : 0;

type _53a = Expect<Equal<MySubtract<7, 3>, 4>>;
type _53b = Expect<Equal<MySubtract<5, 0>, 5>>;
type _53c = Expect<Equal<MySubtract<3, 3>, 0>>;

type _53_a = Expect<Equal<MySubtractCorrect<7, 3>, 4>>;
type _53_b = Expect<Equal<MySubtractCorrect<5, 0>, 5>>;
type _53_c = Expect<Equal<MySubtractCorrect<3, 3>, 0>>;

type _53__a = Expect<Equal<MySubtractCorrect<3, 7>, 4>>;
type _53__b = Expect<Equal<MySubtractCorrect<0, 5>, 5>>;
type _53__c = Expect<Equal<MySubtractCorrect<3, 3>, 0>>;

// 54. Return true if A > B, false otherwise.
//     e.g. GreaterThan<5, 3> → true, GreaterThan<2, 4> → false

export type GreaterOf<
  A extends number,
  B extends number,
  Acc extends readonly unknown[] = [],
> = A extends B
  ? never
  : Acc["length"] extends A
    ? B
    : Acc["length"] extends B
      ? A
      : GreaterOf<A, B, [unknown, ...Acc]>;

export type GreaterThan<A extends number, B extends number> =
  GreaterOf<A, B> extends infer Greater
    ? MyIsNever<Greater> extends true
      ? false
      : Greater extends A
        ? true
        : false
    : never; // TODO

type _54a = Expect<Equal<GreaterThan<5, 3>, true>>;
type _54b = Expect<Equal<GreaterThan<3, 5>, false>>;
type _54c = Expect<Equal<GreaterThan<3, 3>, false>>; // equal → not greater than

// 55. Clamp N to the inclusive range [Min, Max].
//     e.g. Clamp<10, 2, 8> → 8, Clamp<1, 2, 8> → 2, Clamp<5, 2, 8> → 5

export type Clamp<N extends number, Min extends number, Max extends number> =
  GreaterOf<N, Min> extends N ? (GreaterOf<N, Max> extends N ? Max : N) : Min; // TODO

type _55a = Expect<Equal<Clamp<10, 2, 8>, 8>>;
type _55b = Expect<Equal<Clamp<1, 2, 8>, 2>>;
type _55c = Expect<Equal<Clamp<5, 2, 8>, 5>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 7 — Function overload introspection
// ════════════════════════════════════════════════════════════════════════════

// TypeScript stores overloaded functions as an intersection of call signatures.
// When you use `infer R` in a conditional type against an intersection of functions,
// TypeScript resolves to the LAST overload's signature — the most specific one.
declare function overloaded(x: string): string;
declare function overloaded(x: number): number;

// 56. Extract the return type of the last (most specific) overload.
//     e.g. MyLastOverloadReturn<typeof overloaded> → number (the last declared overload)

export type MyLastOverloadReturn<T extends (...args: any[]) => any> =
  T extends (...args: never) => infer R ? R : never; // TODO

type _56a = Expect<Equal<MyLastOverloadReturn<typeof overloaded>, number>>;
// Single-signature function: the only overload is the last.
type _56b = Expect<
  Equal<MyLastOverloadReturn<(x: string) => boolean>, boolean>
>;

// 57. Extract the parameter tuple of the last overload.

export type MyLastOverloadParams<T extends (...args: any[]) => any> =
  T extends (...args: infer A) => unknown ? A : never; // TODO

type _57a = Expect<Equal<MyLastOverloadParams<typeof overloaded>, [x: number]>>;
type _57b = Expect<Equal<MyLastOverloadParams<() => void>, []>>;

// 58. Extract ALL overload signatures as a union of function types.
//     TypeScript intersects overloads; this peels them apart one layer at a time.
//     e.g. OverloadUnion<typeof overloaded> → ((x: string) => string) | ((x: number) => number)

// export type OverloadUnion<T, Depth extends unknown[] = []> = ; // TODO

// export type OverloadUnion<
//   T,
//   Depth extends unknown[] = [],
// > = Depth["length"] extends 10
//   ? never
//   : T extends {
//         (...args: infer A): infer R;
//       }
//     ?
//         | ((...args: A) => R)
//         | OverloadUnion<MyExclude<T, (...args: A) => R>, [...Depth, unknown]>
//     : never;

export type OverloadUnion<T> = T extends {
  (...agrs: infer A1): infer R1;
  (...agrs: infer A2): infer R2;
}
  ? ((...args: A1) => R1) | ((...args: A2) => R2)
  : never;

type _58a = Expect<
  Equal<
    OverloadUnion<typeof overloaded>,
    ((x: string) => string) | ((x: number) => number)
  >
>;

// ════════════════════════════════════════════════════════════════════════════
// Group 8 — Tuple ↔ Union conversion
// ════════════════════════════════════════════════════════════════════════════

// 59. Convert a tuple to a union of its element types.
//     e.g. TupleToUnion<[string, number, boolean]> → string | number | boolean

export type TupleToUnion<T extends readonly unknown[]> = T[number]; // TODO

type _59a = Expect<
  Equal<TupleToUnion<[string, number, boolean]>, string | number | boolean>
>;
type _59b = Expect<Equal<TupleToUnion<[]>, never>>;
type _59c = Expect<Equal<TupleToUnion<[string]>, string>>;

// 60. Convert a tuple to an intersection of its element types.
//     e.g. TupleToIntersection<[{ a: string }, { b: number }]> → { a: string } & { b: number }

export type TupleToIntersection<T extends readonly unknown[]> =
  TupleToUnion<T> extends infer U
    ? (U extends unknown ? (args: U) => void : never) extends (
        args: infer V,
      ) => void
      ? V
      : never
    : never; // TODO

type _60a = Expect<
  Equal<
    TupleToIntersection<[{ a: string }, { b: number }]>,
    { a: string } & { b: number }
  >
>;
type _60b = Expect<Equal<TupleToIntersection<[string]>, string>>;

// 61. Extract the last member of a union.
//     TypeScript resolves `infer R` on an intersection of `() => U` functions to
//     the last return type — the same trick that powers MyLastOverloadReturn.
//     e.g. LastInUnion<'a' | 'b' | 'c'> → one specific member (order is TS-internal)

export type LastInUnion<U> =
  UnionToIntersection<U extends unknown ? () => U : never> extends () => infer T
    ? T
    : never; // TODO

type _61a = Expect<Equal<LastInUnion<"solo">, "solo">>; // single member is trivially "last"
// Round-trip: last member must itself be in the original union.
type _61b = Expect<
  Equal<
    LastInUnion<string | number> extends string | number ? true : false,
    true
  >
>;
type _61c = Expect<Equal<LastInUnion<string | number | object>, object>>;

// 62. Convert a union to a tuple by repeatedly peeling off the last member.
//     e.g. UnionToTuple<'a' | 'b' | 'c'> → a tuple containing exactly those three members

export type UnionToTuple<U, Last = LastInUnion<U>> =
  MyIsNever<U> extends true ? [] : [...UnionToTuple<Exclude<U, Last>>, Last]; // TODO

// Test round-trip correctness rather than a specific ordering.
type _62a = Expect<
  Equal<TupleToUnion<UnionToTuple<"a" | "b" | "c">>, "a" | "b" | "c">
>;
type _62b = Expect<Equal<UnionToTuple<never>, []>>;
type _62c = Expect<Equal<MyLength<UnionToTuple<"a" | "b" | "c">>, 3>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 9 — Deep merge
// ════════════════════════════════════════════════════════════════════════════

// 63. Recursively merge B into A. When both A and B have an object at the same key,
//     merge their sub-objects; otherwise B's value wins (like Spread but at every depth).
//     e.g. MyDeepMerge<{ a: { x: number; y: string } }, { a: { y: boolean; z: null } }>
//          → { a: { x: number; y: boolean; z: null } }

export type IsPlainObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : T extends (...args: never) => unknown
      ? false
      : true
  : false;

export type MyDeepMerge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? IsPlainObject<B[K]> extends true
        ? IsPlainObject<A[K]> extends true
          ? MyDeepMerge<A[K], B[K]>
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
      ? A[K]
      : never;
};

type _63a = Expect<
  Equal<
    MyDeepMerge<{ a: string; b: number }, { b: boolean; c: null }>,
    { a: string; b: boolean; c: null }
  >
>;
type _63b = Expect<
  Equal<
    MyDeepMerge<
      { n: { x: number; y: string } },
      { n: { y: boolean; z: null } }
    >,
    { n: { x: number; y: boolean; z: null } }
  >
>;

// 64. Symmetric difference: keys that exist in A but not B, plus keys in B but not A.
//     Shared keys disappear from the result entirely.
//     e.g. MyDiff<{ a: string; b: number }, { b: boolean; c: null }> → { a: string; c: null }

export type MyDiff<A, B> = {
  [K in Exclude<keyof A | keyof B, keyof A & keyof B>]: K extends keyof A
    ? A[K]
    : K extends keyof B
      ? B[K]
      : never;
}; // TODO

type _64a = Expect<
  Equal<
    MyDiff<{ a: string; b: number }, { b: boolean; c: null }>,
    { a: string; c: null }
  >
>;
type _64b = Expect<Equal<MyDiff<{ a: string }, { a: number }>, {}>>; // only shared key → empty

// 65. Keep only keys present in both A and B, using A's value types.
//     e.g. MyIntersect<{ a: string; b: number }, { b: boolean; c: null }> → { b: number }

export type MyIntersect<A, B> = {
  [K in keyof A as K extends keyof B ? K : never]: A[K];
}; // TODO

type _65a = Expect<
  Equal<
    MyIntersect<
      { a: string; b: number; c: boolean },
      { b: boolean; c: null; d: string }
    >,
    { b: number; c: boolean }
  >
>;
type _65b = Expect<Equal<MyIntersect<{ a: string }, { b: number }>, {}>>; // no shared keys → empty

// 66. Merge a tuple of objects left-to-right — each successive object overwrites earlier keys,
//     exactly like Object.assign({}, ...tuple) at the type level.
//     e.g. FoldSpread<[{ a: string }, { b: number }, { a: boolean }]> → { a: boolean; b: number }

export type FoldSpread<
  T extends readonly object[],
  Acc extends object = {},
> = T extends [infer Head, ...infer Tail extends readonly object[]]
  ? FoldSpread<Tail, MyDeepMerge<Acc, Head>>
  : Acc; // TODO

type _66a = Expect<
  Equal<
    FoldSpread<[{ a: string }, { b: number }, { a: boolean }]>,
    { a: boolean; b: number }
  >
>;
type _66b = Expect<Equal<FoldSpread<[{ a: string }]>, { a: string }>>;
type _66c = Expect<Equal<FoldSpread<[]>, {}>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 10 — infer with constraints (TypeScript 4.7+)
// ════════════════════════════════════════════════════════════════════════════

// TypeScript 4.7 added `infer X extends T` — a constraint on the inferred type.
// Without it you'd need a second conditional: `... extends infer R ? R extends string ? R : never : never`.
// With it: `... extends infer R extends string ? R : never` — one step, same result.

// 67. Convert a numeric string literal to its number-literal counterpart.
//     e.g. ParseInt<'42'> → 42, ParseInt<'hello'> → never

export type ParseInt<S extends string> = S extends `${infer N extends number}`
  ? N
  : never; // TODO

type _67a = Expect<Equal<ParseInt<"42">, 42>>;
type _67b = Expect<Equal<ParseInt<"0">, 0>>;
type _67c = Expect<Equal<ParseInt<"hello">, never>>;

// 68. Convert 'true' or 'false' string literals to their boolean-literal counterparts.
//     e.g. ParseBool<'true'> → true, ParseBool<'false'> → false, ParseBool<'yes'> → never

export type ParseBool<S extends string> = S extends `${infer B extends boolean}`
  ? B
  : never; // TODO

type _68a = Expect<Equal<ParseBool<"true">, true>>;
type _68b = Expect<Equal<ParseBool<"false">, false>>;
type _68c = Expect<Equal<ParseBool<"yes">, never>>;

// 69. Extract a function's return type only when it extends string — never otherwise.
//     Without 4.7: two conditionals. With 4.7: one.
//     e.g. StringReturnType<() => 'hello'> → 'hello', StringReturnType<() => number> → never

export type StringReturnType<T extends (...args: any[]) => any> = T extends ((
  ...args: never
) => infer R extends string)
  ? R
  : never; // TODO

type _69a = Expect<Equal<StringReturnType<() => "hello">, "hello">>;
type _69b = Expect<Equal<StringReturnType<() => string>, string>>;
type _69c = Expect<Equal<StringReturnType<() => number>, never>>;

// 70. Remap string keys that are numeric literals to their number-literal key equivalents.
//     Non-numeric string keys are dropped.
//     e.g. NumericKeys<{ '0': string; '1': number; name: boolean }> → { 0: string; 1: number }

export type NumericKeys<T> = {
  [K in keyof T as K extends `${infer N extends number}` ? N : never]: T[K];
}; // TODO

type _70a = Expect<
  Equal<
    NumericKeys<{ "0": string; "1": number; name: boolean }>,
    { 0: string; 1: number }
  >
>;
type _70b = Expect<Equal<NumericKeys<{ name: string }>, {}>>;
type _70c = Expect<Equal<NumericKeys<["hello", 42]>, { 0: "hello"; 1: 42 }>>;

// 71. Extract the first element of a tuple only when it extends type C — never otherwise.
//     This combines infer with a constraint in a single step.
//     e.g. ConstrainedHead<[42, string], number> → 42
//          ConstrainedHead<['hello', number], number> → never

export type ConstrainedHead<T extends any[], C> = T extends [
  infer Head extends C,
  ...rest: unknown[],
]
  ? Head
  : never; // TODO

type _71a = Expect<Equal<ConstrainedHead<[42, string], number>, 42>>;
type _71b = Expect<Equal<ConstrainedHead<["hello", number], number>, never>>;
type _71c = Expect<Equal<ConstrainedHead<["a", "b"], string>, "a">>;

// ════════════════════════════════════════════════════════════════════════════
// Group 11 — Variance-aware wrappers
// ════════════════════════════════════════════════════════════════════════════

// Variance describes how subtyping flows through a type constructor F<T>:
//   Covariant     F<Sub> extends F<Super> when Sub extends Super  (same direction)
//   Contravariant F<Super> extends F<Sub> when Sub extends Super  (reversed)
//   Invariant     neither direction unless the types are identical
// The position of T in the definition determines which rule applies.

// 72. A covariant wrapper — T appears only in a read (output) position.
//     Produce: { readonly value: T }
//     Because value is read-only output, Box<'literal'> extends Box<string>.
export type Box<T> = { readonly value: T }; // TODO

type _72a = Expect<Equal<Box<string>, { readonly value: string }>>;
// Covariance: narrower T → narrower Box, which extends the wider Box.
type _72b = Expect<
  Equal<Box<"literal"> extends Box<string> ? true : false, true>
>;
type _72c = Expect<
  Equal<Box<string> extends Box<"literal"> ? true : false, false>
>;

// 73. A contravariant wrapper — T appears only in a write (input / parameter) position.
//     Produce: { accept: (value: T) => void }
//     Because accept consumes T, Consumer<string | number> extends Consumer<string>.
export type Consumer<T> = { accept: (value: T) => void }; // TODO

type _73a = Expect<
  Equal<Consumer<string>, { accept: (value: string) => void }>
>;
// Contravariance: wider T → extends the narrower Consumer (direction reversed).
type _73b = Expect<
  Equal<Consumer<string | number> extends Consumer<string> ? true : false, true>
>;
type _73c = Expect<
  Equal<
    Consumer<string> extends Consumer<string | number> ? true : false,
    false
  >
>;

// 74. An invariant wrapper — T appears in both read and write positions.
//     Produce: { get: () => T; set: (value: T) => void }
//     Only Invariant<X> extends Invariant<X> for the exact same X.
export type Invariant<T> = { get: () => T; set: (v: T) => void }; // TODO

type _74a = Expect<
  Equal<Invariant<string>, { get: () => string; set: (value: string) => void }>
>;
// Invariance: neither narrower nor wider is assignable.
type _74b = Expect<
  Equal<Invariant<"literal"> extends Invariant<string> ? true : false, false>
>;
type _74c = Expect<
  Equal<Invariant<string> extends Invariant<"literal"> ? true : false, false>
>;
type _74d = Expect<
  Equal<Invariant<string> extends Invariant<string> ? true : false, true>
>;

// 75. True if A is a *proper* subtype of B: A extends B but B does not extend A.
//     e.g. StrictExtends<'hello', string> → true  (literal ⊂ string)
//          StrictExtends<string, string> → false  (equal, not strict)
//          StrictExtends<string, 'hello'> → false (string ⊄ literal)
export type StrictExtends<A, B> = A extends B
  ? B extends A
    ? false
    : true
  : false; // TODO

type _75a = Expect<Equal<StrictExtends<"hello", string>, true>>;
type _75b = Expect<Equal<StrictExtends<string, string>, false>>;
type _75c = Expect<Equal<StrictExtends<string, "hello">, false>>;
type _75d = Expect<Equal<StrictExtends<42, number>, true>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 9 — Extended number arithmetic accumulators
// ════════════════════════════════════════════════════════════════════════════

// 76. Multiply two number literals using repeated addition.
//     e.g. Multiply<3, 4> → 12, Multiply<0, 5> → 0

export type Multiply<
  A extends number,
  B extends number,
  Acc extends unknown[] = [],
> = A extends 0
  ? Acc["length"]
  : BuildTuple<A> extends [unknown, ...infer Rest]
    ? Multiply<Rest["length"], B, [...Acc, ...BuildTuple<B>]>
    : never; // TODO

type _76a = Expect<Equal<Multiply<3, 4>, 12>>;
type _76b = Expect<Equal<Multiply<0, 5>, 0>>;
type _76c = Expect<Equal<Multiply<6, 1>, 6>>;

// 77. Integer-divide A by B (assume B > 0, A ≥ 0).
//     e.g. Divide<10, 3> → 3, Divide<9, 3> → 3

export type Divide<
  A extends number,
  B extends number,
  Count extends unknown[] = [],
> =
  GreaterOf<A, B> extends A
    ? Divide<MySubtract<A, B>, B, [unknown, ...Count]>
    : Count["length"]; // TODO

type _77a = Expect<Equal<Divide<10, 3>, 3>>;
type _77b = Expect<Equal<Divide<9, 3>, 3>>;
type _77c = Expect<Equal<Divide<0, 5>, 0>>;

// 78. Return A mod B (the remainder of dividing A by B).
//     e.g. Modulo<10, 3> → 1, Modulo<9, 3> → 0

export type Modulo<A extends number, B extends number> = MySubtract<
  A,
  Multiply<Divide<A, B>, B>
>; // TODO

type _78a = Expect<Equal<Modulo<10, 3>, 1>>;
type _78b = Expect<Equal<Modulo<9, 3>, 0>>;
type _78c = Expect<Equal<Modulo<7, 4>, 3>>;

// 79. Return the smaller of two number literals.
//     e.g. Min<3, 5> → 3, Min<7, 2> → 2, Min<4, 4> → 4

export type Min<A extends number, B extends number> =
  BuildTuple<A> extends [...unknown[], ...BuildTuple<B>] ? B : A; // TODO

type _79a = Expect<Equal<Min<3, 5>, 3>>;
type _79b = Expect<Equal<Min<7, 2>, 2>>;
type _79c = Expect<Equal<Min<4, 4>, 4>>;

// 80. Return the larger of two number literals.
//     e.g. Max<3, 5> → 5, Max<7, 2> → 7, Max<4, 4> → 4

export type Max<A extends number, B extends number> =
  BuildTuple<A> extends [...unknown[], ...BuildTuple<B>] ? A : B; // TODO

type _80a = Expect<Equal<Max<3, 5>, 5>>;
type _80b = Expect<Equal<Max<7, 2>, 7>>;
type _80c = Expect<Equal<Max<4, 4>, 4>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 10 — Tuple accumulators
// ════════════════════════════════════════════════════════════════════════════

// 81. Build a tuple of ascending numeric literals [0, 1, 2, …, N-1].
//     e.g. Range<4> → [0, 1, 2, 3]

export type Range<N extends number, Acc extends number[] = []> = N extends 0
  ? Acc
  : BuildTuple<N> extends [unknown, ...infer Rest]
    ? Range<Rest["length"], [Rest["length"], ...Acc]>
    : never; // TODO

type _81a = Expect<Equal<Range<4>, [0, 1, 2, 3]>>;
type _81b = Expect<Equal<Range<0>, []>>;
type _81c = Expect<Equal<Range<3>, [0, 1, 2]>>;

// 82. Reverse a tuple.
//     e.g. Reverse<[1, 2, 3]> → [3, 2, 1]

export type Reverse<
  T extends unknown[],
  Acc extends unknown[] = [],
> = T extends [infer Head, ...infer Tail] ? Reverse<Tail, [Head, ...Acc]> : Acc; // TODO

type _82a = Expect<Equal<Reverse<[1, 2, 3]>, [3, 2, 1]>>;
type _82b = Expect<Equal<Reverse<[]>, []>>;
type _82c = Expect<
  Equal<Reverse<[string, number, boolean]>, [boolean, number, string]>
>;

// 83. Drop the first N elements from a tuple.
//     e.g. Drop<[1, 2, 3, 4], 2> → [3, 4]

export type Drop<T extends unknown[], N extends number> = N extends 0
  ? T
  : T extends [unknown, ...infer Tail]
    ? BuildTuple<N> extends [unknown, ...infer U]
      ? Drop<Tail, U["length"]>
      : never
    : never; // TODO

type _83a = Expect<Equal<Drop<[1, 2, 3, 4], 2>, [3, 4]>>;
type _83b = Expect<Equal<Drop<[1, 2, 3], 0>, [1, 2, 3]>>;
type _83c = Expect<Equal<Drop<[1, 2], 2>, []>>;

// 84. Take the first N elements from a tuple.
//     e.g. Take<[1, 2, 3, 4], 2> → [1, 2]

export type Take<
  T extends unknown[],
  N extends number,
  Acc extends unknown[] = [],
> = N extends 0
  ? Acc
  : T extends [infer First, ...infer Tail]
    ? BuildTuple<N> extends [unknown, ...infer U]
      ? Take<Tail, U["length"], [...Acc, First]>
      : never
    : never; // TODO

type _84a = Expect<Equal<Take<[1, 2, 3, 4], 2>, [1, 2]>>;
type _84b = Expect<Equal<Take<[1, 2, 3], 0>, []>>;
type _84c = Expect<Equal<Take<[1, 2], 2>, [1, 2]>>;

// 85. Return true if a tuple contains an element exactly equal to Item.
//     e.g. TupleIncludes<[1, 2, 3], 2> → true

export type TupleIncludes<T extends unknown[], Item> = T extends [
  infer Next,
  ...infer Rest,
]
  ? Next extends Item
    ? true
    : TupleIncludes<Rest, Item>
  : false; // TODO

type _85a = Expect<Equal<TupleIncludes<[1, 2, 3], 2>, true>>;
type _85b = Expect<Equal<TupleIncludes<[1, 2, 3], 4>, false>>;
type _85c = Expect<Equal<TupleIncludes<[], number>, false>>;

// 86. Return the zero-based index of the first occurrence of Item in T, or -1.
//     e.g. IndexOf<['a', 'b', 'c'], 'b'> → 1

export type IndexOf<
  T extends unknown[],
  Item,
  Acc extends unknown[] = [],
> = T extends [infer First, ...infer Rest]
  ? First extends Item
    ? Acc["length"]
    : IndexOf<Rest, Item, [unknown, ...Acc]>
  : -1; // TODO

type _86a = Expect<Equal<IndexOf<["a", "b", "c"], "b">, 1>>;
type _86b = Expect<Equal<IndexOf<["a", "b", "c"], "d">, -1>>;
type _86c = Expect<Equal<IndexOf<["a", "b", "c"], "a">, 0>>;

// 87. Split a tuple into consecutive chunks of size N.
//     e.g. Chunk<[1, 2, 3, 4], 2> → [[1, 2], [3, 4]]

export type Chunk<
  T extends unknown[],
  N extends number,
  Current extends unknown[] = [],
  Result extends unknown[][] = [],
> = N extends 0
  ? never
  : T extends [infer Next, ...infer Rest]
    ? Current["length"] extends N
      ? Chunk<T, N, [], [...Result, Current]>
      : Chunk<Rest, N, [...Current, Next], Result>
    : Current extends []
      ? Result
      : [...Result, Current];

type _87a = Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>;
type _87b = Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>;
type _87c = Expect<Equal<Chunk<[], 3>, []>>;

// 88. Filter a tuple, keeping only elements assignable to F.
//     e.g. TupleFilter<[1, 'a', 2, 'b'], string> → ['a', 'b']

export type TupleFilter<
  T extends unknown[],
  F,
  Acc extends unknown[] = [],
> = T extends [infer First, ...infer Rest]
  ? First extends F
    ? TupleFilter<Rest, F, [...Acc, First]>
    : TupleFilter<Rest, F, Acc>
  : Acc; // TODO

type _88a = Expect<Equal<TupleFilter<[1, "a", 2, "b"], string>, ["a", "b"]>>;
type _88b = Expect<Equal<TupleFilter<[1, 2, 3], string>, []>>;
type _88c = Expect<
  Equal<TupleFilter<[1, "a", true], number | boolean>, [1, true]>
>;

// 89. Interleave two same-length tuples element-by-element.
//     e.g. Interleave<[1, 2], ['a', 'b']> → [1, 'a', 2, 'b']

export type Interleave<A extends unknown[], B extends unknown[]> = [
  A,
  B,
] extends [
  readonly [infer AHead, ...infer ARest],
  readonly [infer BHead, ...infer BRest],
]
  ? [AHead, BHead, ...Interleave<ARest, BRest>]
  : A extends readonly [infer AHead, ...infer ARest]
    ? [AHead, Interleave<ARest, []>]
    : B extends [infer BHead, ...infer BRest]
      ? [BHead, ...Interleave<[], BRest>]
      : [];

type _89a = Expect<Equal<Interleave<[1, 2], ["a", "b"]>, [1, "a", 2, "b"]>>;
type _89b = Expect<Equal<Interleave<[], []>, []>>;
type _89c = Expect<
  Equal<Interleave<[true, false], [0, 1, 2]>, [true, 0, false, 1, 2]>
>;

// 90. Shallow-flatten a tuple exactly one level deep.
//     e.g. Flatten1<[[1, 2], [3, [4]]]> → [1, 2, 3, [4]]

export type Flatten1<
  T extends unknown[],
  Acc extends unknown[] = [],
> = T extends [infer First, ...infer Rest]
  ? Flatten1<
      Rest,
      First extends readonly unknown[] ? [...Acc, ...First] : [...Acc, First]
    >
  : Acc; // TODO

type _90a = Expect<Equal<Flatten1<[[1, 2], [3, 4]]>, [1, 2, 3, 4]>>;
type _90b = Expect<Equal<Flatten1<[[1, 2], [3, [4]]]>, [1, 2, 3, [4]]>>;
type _90c = Expect<Equal<Flatten1<[]>, []>>;

// Lesson 02 — Utility Type Internals (Extension)
// Continues from problem 90. These exercises assume the helpers defined in the
// main lesson file are in scope: Expect, Equal, BuildTuple, MyJoin, MyIsNever,
// MySubtract, MyAdd, Multiply, GreaterThan, Take, Drop, etc. If running this
// file standalone, copy those over or paste this content into the original.

// ════════════════════════════════════════════════════════════════════════════
// Group 12 — String manipulation beyond Trim/Replace/Join
// ════════════════════════════════════════════════════════════════════════════

// 91. Split a string literal by a delimiter into a tuple of pieces.
//     The inverse of MyJoin.
//     e.g. Split<'a,b,c', ','> → ['a', 'b', 'c']

export type Split<
  S extends string,
  D extends string,
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]; // TODO

type _91a = Expect<Equal<Split<"a,b,c", ",">, ["a", "b", "c"]>>;
type _91b = Expect<Equal<Split<"hello", ",">, ["hello"]>>; // no delim → 1-tuple
type _91c = Expect<Equal<Split<"a-b-c-d", "-">, ["a", "b", "c", "d"]>>;
type _91d = Expect<Equal<Split<"", ",">, [""]>>; // empty string → [""]

// 92. Get the length of a string literal as a number-literal type.
//     e.g. StringLength<'hello'> → 5

export type StringLength<
  S extends string,
  Acc extends unknown[] = [],
> = S extends `${infer Char}${infer Rest}`
  ? StringLength<Rest, [...Acc, Char]>
  : Acc["length"]; // TODO

type _92a = Expect<Equal<StringLength<"hello">, 5>>;
type _92b = Expect<Equal<StringLength<"">, 0>>;
type _92c = Expect<Equal<StringLength<"a">, 1>>;

// 93. Convert a string literal to a tuple of its characters.
//     e.g. StringToTuple<'abc'> → ['a', 'b', 'c']
//     Hint:

export type StringToTuple<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? [First, ...StringToTuple<Rest>]
    : []; // TODO

type _93a = Expect<Equal<StringToTuple<"abc">, ["a", "b", "c"]>>;
type _93b = Expect<Equal<StringToTuple<"">, []>>;
type _93c = Expect<Equal<StringToTuple<"hi">, ["h", "i"]>>;

// 94. Return true if S starts with the prefix P.
//     e.g. StartsWith<'hello world', 'hello'> → true
//     Hint:
export type StartsWith<
  S extends string,
  P extends string,
> = S extends `${P}${string}` ? true : false; // TODO

type _94a = Expect<Equal<StartsWith<"hello world", "hello">, true>>;
type _94b = Expect<Equal<StartsWith<"hello", "world">, false>>;
type _94c = Expect<Equal<StartsWith<"", "">, true>>;
type _94d = Expect<Equal<StartsWith<"abc", "abc">, true>>; // exact match

// 95. Return true if S ends with the suffix P. Dual of StartsWith.
//     e.g. EndsWith<'hello world', 'world'> → true
export type EndsWith<
  S extends string,
  P extends string,
> = S extends `${string}${P}` ? true : false; // TODO

type _95a = Expect<Equal<EndsWith<"hello world", "world">, true>>;
type _95b = Expect<Equal<EndsWith<"hello", "lo">, true>>;
type _95c = Expect<Equal<EndsWith<"hello", "world">, false>>;

// 96. Convert kebab-case to camelCase.
//     e.g. KebabToCamel<'hello-world-foo'> → 'helloWorldFoo'
//     Hint:

export type KebabToCamel<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<KebabToCamel<Tail>>}`
    : S;

type _96a = Expect<Equal<KebabToCamel<"hello-world-foo">, "helloWorldFoo">>;
type _96b = Expect<Equal<KebabToCamel<"hello">, "hello">>; // no dashes
type _96c = Expect<Equal<KebabToCamel<"a-b">, "aB">>;

// Alternate to init flag type implementation is having a helper process Rest
// eg CamelToDelimitedRest that assumes First gets capitalized
export type CamelToDelimited<
  S extends string,
  D extends string,
  init extends boolean = true, // Feels hacky but it works: tracks whether we're at the start of the string to avoid a leading delimiter.
> = S extends `${infer First}${infer Rest}`
  ? `${First extends Uppercase<First> ? (init extends true ? Lowercase<First> : `${D}${Lowercase<First>}`) : First}${CamelToDelimited<Rest, D, false>}`
  : "";

export type CamelToKebab<S extends string> = CamelToDelimited<S, "-">;

type _96_a = Expect<Equal<CamelToKebab<"helloWorldFoo">, "hello-world-foo">>;
type _96_b = Expect<Equal<CamelToKebab<"hello">, "hello">>; // no dashes
type _96_c = Expect<Equal<CamelToKebab<"aB">, "a-b">>;

// 97. Convert camelCase to snake_case.
//     e.g. CamelToSnake<'helloWorldFoo'> → 'hello_world_foo'
//     Hint:
export type CamelToSnake<S extends string> = CamelToDelimited<S, "_">; // TODO

type _97a = Expect<Equal<CamelToSnake<"helloWorldFoo">, "hello_world_foo">>;
type _97b = Expect<Equal<CamelToSnake<"hello">, "hello">>;
type _97c = Expect<Equal<CamelToSnake<"AB">, "a_b">>; // leading cap → no leading _

// 98. Repeat a string literal exactly N times.
//     e.g. Repeat<'ab', 3> → 'ababab'
//     Hint:

export type Repeat<
  S extends string,
  N extends number,
  Acc extends string = "",
> = N extends 0
  ? Acc
  : BuildTuple<N> extends [unknown, ...infer Rest]
    ? Repeat<S, Rest["length"], `${Acc}${S}`>
    : ""; // TODO

type _98a = Expect<Equal<Repeat<"ab", 3>, "ababab">>;
type _98b = Expect<Equal<Repeat<"x", 0>, "">>;
type _98c = Expect<Equal<Repeat<"-", 5>, "-----">>;

// ════════════════════════════════════════════════════════════════════════════
// Group 13 — Deep object utilities (continued from Group 5)
// ════════════════════════════════════════════════════════════════════════════

// 99. Recursively apply `?` to every nested key — counterpart to MyDeepRequired
//     and MyDeepReadonly.
//     e.g. DeepPartial<{ a: { b: string } }> → { a?: { b?: string } }

export type DeepPartial<T> = {
  [K in keyof T]+?: IsPlainObject<T[K]> extends true ? DeepPartial<T[K]> : T[K];
}; // TODO

type _99a = Expect<
  Equal<
    DeepPartial<{ a: string; nested: { b: number; c: () => void } }>,
    { a?: string; nested?: { b?: number; c?: () => void } }
  >
>;
type _99b = Expect<Equal<DeepPartial<{ x: number }>, { x?: number }>>;

// 100. Recursively remove `readonly` from every nested key. The dual of
//      MyDeepReadonly — uses the `-readonly` modifier.
//      e.g. DeepMutable<{ readonly a: { readonly b: string } }> → { a: { b: string } }
export type DeepMutable<T> = {
  -readonly [K in keyof T]: IsPlainObject<T[K]> extends true
    ? DeepMutable<T[K]>
    : T[K];
}; // TODO

type _100a = Expect<
  Equal<
    DeepMutable<{
      readonly a: string;
      readonly nested: { readonly b: number };
    }>,
    { a: string; nested: { b: number } }
  >
>;
type _100b = Expect<Equal<DeepMutable<{ x: number }>, { x: number }>>;

// 101. Recursively strip null and undefined from every property value at every
//      nesting level. (MyNonNullableValues is shallow; this is the deep one.)
//      e.g. DeepNonNullable<{ a: string | null; b: { c: number | undefined } }>
//           → { a: string; b: { c: number } }
export type DeepNonNullable<T> = {
  [K in keyof T]: IsPlainObject<T[K]> extends true
    ? DeepNonNullable<T[K]>
    : T[K] extends infer U
      ? U extends null | undefined
        ? never
        : U
      : never;
}; // TODO

type _101a = Expect<
  Equal<
    DeepNonNullable<{
      a: string | null;
      b: { c: number | undefined; d: boolean };
    }>,
    { a: string; b: { c: number; d: boolean } }
  >
>;

// 102. Remove `readonly` from every key — but only one level deep (shallow).
//      The non-recursive counterpart of DeepMutable.
//      e.g. Mutable<{ readonly a: string; readonly b: number }> → { a: string; b: number }
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
}; // TODO

type _102a = Expect<
  Equal<
    Mutable<{ readonly a: string; readonly b: number }>,
    { a: string; b: number }
  >
>;
// Nested readonly should remain — confirms shallow behavior.
type _102b = Expect<
  Equal<
    Mutable<{ readonly a: { readonly b: number } }>,
    { a: { readonly b: number } }
  >
>;

// 103. Shallow merge — B's keys overwrite A's at any shared key.
//      Differs from MyDeepMerge: at a shared key, B's value wins entirely
//      rather than recursively merging.
//      e.g. Merge<{ a: string; b: number }, { b: boolean; c: null }> → { a: string; b: boolean; c: null }

export type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never;
}; // TODO

type _103a = Expect<
  Equal<
    Merge<{ a: string; b: number }, { b: boolean; c: null }>,
    { a: string; b: boolean; c: null }
  >
>;
// At shared key 'a', B wins outright — no recursion into the object value.
type _103b = Expect<
  Equal<Merge<{ a: { x: number } }, { a: { y: string } }>, { a: { y: string } }>
>;

// ════════════════════════════════════════════════════════════════════════════
// Group 14 — Discriminated unions & distributive operators
// ════════════════════════════════════════════════════════════════════════════

// Background: built-in Pick<A | B, K> constrains K to keyof (A | B), which is
// the *intersection* of keys — only keys present in BOTH members. That often
// isn't what you want when working with a union of object shapes. The
// distributive variants below preserve the union structure instead.

// 104. Pick that distributes over a union of object types.
//      e.g. given U = { a: string; b: number } | { a: string; c: boolean }
//           DistributivePick<U, 'a' | 'b'> → { a: string; b: number } | { a: string }

export type DistributivePick<T, K extends PropertyKey> = {
  [Key in keyof T as Key extends K ? Key : never]: T[Key];
};

type _104_U = { a: string; b: number } | { a: string; c: boolean };
type _104a = Expect<
  Equal<
    DistributivePick<_104_U, "a" | "b">,
    { a: string; b: number } | { a: string }
  >
>;
type _104b = Expect<
  Equal<DistributivePick<_104_U, "a">, { a: string } | { a: string }>
>;

// 105. Omit that distributes over a union of object types.
//      Built-in Omit collapses unions; this preserves them.
//      e.g. DistributiveOmit<U, 'a'> → { b: number } | { c: boolean }
export type DistributiveOmit<T, K extends PropertyKey> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
}; // TODO

type _105_U = { a: string; b: number } | { a: string; c: boolean };
type _105a = Expect<
  Equal<DistributiveOmit<_105_U, "a">, { b: number } | { c: boolean }>
>;

// 106. Narrow a discriminated union by the value of its discriminator key.
//      e.g. given Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }
//           NarrowByTag<Shape, 'kind', 'circle'> → { kind: 'circle'; r: number }

export type NarrowByTag<T, K extends keyof T, V> =
  T extends Record<K, unknown> ? (T[K] extends V ? T : never) : never; // TODO

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; s: number }
  | { kind: "tri"; a: number; b: number };

type _106a = Expect<
  Equal<NarrowByTag<Shape, "kind", "circle">, { kind: "circle"; r: number }>
>;
type _106b = Expect<
  Equal<NarrowByTag<Shape, "kind", "square">, { kind: "square"; s: number }>
>;
type _106c = Expect<Equal<NarrowByTag<Shape, "kind", "hexagon">, never>>;

// 107. Narrow a union by an inline shape — keep members assignable to the
//      partial shape S.
//      e.g. NarrowByShape<Shape, { r: number }> → { kind: 'circle'; r: number }

export type NarrowByShape<T, S> = T extends S ? T : never; // TODO

type _107a = Expect<
  Equal<NarrowByShape<Shape, { r: number }>, { kind: "circle"; r: number }>
>;
type _107b = Expect<
  Equal<
    NarrowByShape<Shape, { a: number }>,
    { kind: "tri"; a: number; b: number }
  >
>;

// ════════════════════════════════════════════════════════════════════════════
// Group 15 — Branded / nominal types
// ════════════════════════════════════════════════════════════════════════════

// TypeScript is structural by default — two types with the same shape are
// interchangeable. Branding adds a phantom property (often keyed by a unique
// symbol) so that `UserId` and `OrderId`, both backed by `string`, become
// distinct types you can't accidentally swap.

declare const BRAND: unique symbol;

// 108. Define a Brand<T, B> helper such that T is preserved at runtime but the
//      brand tag B prevents accidental widening at the type level.
//      e.g. type UserId = Brand<string, 'UserId'> → assignable TO string, but
//      a plain string is NOT assignable to UserId.

export type Brand<T, B extends string> = T & { readonly [BRAND]: B }; // TODO

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
// A UserId is still a string structurally.
type _108a = Expect<Equal<UserId extends string ? true : false, true>>;
// But a plain string is NOT a UserId — that's the whole point.
type _108b = Expect<Equal<string extends UserId ? true : false, false>>;
// Two different brands of the same base type are not interchangeable.
type _108c = Expect<Equal<UserId extends OrderId ? true : false, false>>;

// 109. Recover the underlying (unbranded) type.
//      e.g. Unbrand<UserId> → string

export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

type _109a = Expect<Equal<Unbrand<Brand<string, "UserId">>, string>>;
type _109b = Expect<Equal<Unbrand<Brand<number, "Cents">>, number>>;
// Unbranded types pass through unchanged.
type _109c = Expect<Equal<Unbrand<string>, string>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 16 — Mutually exclusive / one-of patterns
// ════════════════════════════════════════════════════════════════════════════

// 110. XOR<A, B> — accept exactly one of A or B, never both. The trick: for the
//      "A wins" branch, force every B-only key to type `never` (so providing
//      them is invalid) — and symmetrically for the "B wins" branch.
//      e.g. XOR<{ src: string }, { children: string }> accepts either { src }
//      or { children }, but not both.
export type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
export type XOR<A, B> = (A & Without<B, A>) | (B & Without<A, B>); // TODO

type _110_V = XOR<{ src: string }, { children: string }>;
// Either side alone is OK:
type _110a = Expect<
  Equal<{ src: "x"; children?: never } extends _110_V ? true : false, true>
>;
type _110b = Expect<
  Equal<{ children: "y"; src?: never } extends _110_V ? true : false, true>
>;
// Both at once is rejected:
type _110c = Expect<
  Equal<{ src: "x"; children: "y" } extends _110_V ? true : false, false>
>;

// 111. OneOf<Tuple> — given a tuple of object shapes, exactly one must be
//      present in the value (other shapes' keys must be `never`).

type Simplify<T> = { [K in keyof T]: T[K] };
type UnionOf<T extends readonly unknown[]> = T[number];

// export type OneOf<T extends readonly object[]> = {
//   [I in keyof T]: Simplify<T[I] & Without<UnionOf<T>, T[I]>>;
// }[number]; // TODO

// type _111_V = OneOf<
//   [{ tag: "ok"; value: number }, { tag: "err"; error: string }]
// >;
// type _111a = Expect<
//   Equal<{ tag: "ok"; value: 1 } extends _111_V ? true : false, true>
// >;
// type _111b = Expect<
//   Equal<{ tag: "err"; error: "x" } extends _111_V ? true : false, true>
// >;
// // Mixing keys from both members is rejected.
// type _111c = Expect<
//   Equal<
//     { tag: "ok"; value: 1; error: "x" } extends _111_V ? true : false,
//     false
//   >
// >;

// ════════════════════════════════════════════════════════════════════════════
// Group 17 — Path types: nested object access at the type level
// ════════════════════════════════════════════════════════════════════════════

// These are the type-level engine behind APIs like lodash.get, react-hook-form
// field names, and zod path errors.

// 112. Produce a union of every dot-notation path through a nested object.
//      Both intermediate and leaf paths are included.
//      e.g. Paths<{ a: { b: number; c: string } }> → 'a' | 'a.b' | 'a.c'

export type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: (
    Prefix extends "" ? `${K}` : `${Prefix}.${K}`
  ) extends infer S extends string
    ? S | (T[K] extends object ? Paths<T[K], S> : never)
    : "";
}[keyof T & string]; // TODO

type t = Paths<{ a: { b: number; c: string } }>;
type _112a = Expect<
  Equal<Paths<{ a: { b: number; c: string } }>, "a" | "a.b" | "a.c">
>;
type _112b = Expect<Equal<Paths<{ a: number }>, "a">>;
type _112c = Expect<
  Equal<
    Paths<{ user: { id: number; profile: { name: string } } }>,
    "user" | "user.id" | "user.profile" | "user.profile.name"
  >
>;

// 113. Look up the type at a given dot-notation path.
//      e.g. Get<{ a: { b: number } }, 'a.b'> → number

export type Get<T, P extends string> = never; // TODO

type _113a = Expect<Equal<Get<{ a: { b: number } }, "a.b">, number>>;
type _113b = Expect<Equal<Get<{ a: { b: { c: string } } }, "a.b.c">, string>>;
type _113c = Expect<Equal<Get<{ a: string }, "b">, never>>; // missing path → never
type _113d = Expect<Equal<Get<{ a: number }, "a">, number>>;

// 114. Produce only the leaf paths — paths that point to a non-object value.
//      Intermediate-object paths are excluded.
//      e.g. LeafPaths<{ a: { b: number; c: string } }> → 'a.b' | 'a.c'
export type LeafPaths<T> = never; // TODO

type _114a = Expect<
  Equal<LeafPaths<{ a: { b: number; c: string } }>, "a.b" | "a.c">
>;
type _114b = Expect<Equal<LeafPaths<{ a: number }>, "a">>;
type _114c = Expect<
  Equal<
    LeafPaths<{ user: { id: number; profile: { name: string } } }>,
    "user.id" | "user.profile.name"
  >
>;

// ════════════════════════════════════════════════════════════════════════════
// Group 18 — Function transformations
// ════════════════════════════════════════════════════════════════════════════

// 115. Replace the return type of a function.
//      e.g. ReplaceReturn<(x: number) => string, boolean> → (x: number) => boolean

export type ReplaceReturn<F extends (...args: any[]) => any, R> = never; // TODO

type _115a = Expect<
  Equal<ReplaceReturn<(x: number) => string, boolean>, (x: number) => boolean>
>;
type _115b = Expect<Equal<ReplaceReturn<() => void, number>, () => number>>;

// 116. Wrap a function's return value in a Promise (preserving any existing
//      Promise via Awaited so you don't end up with Promise<Promise<T>>).
//      e.g. Promisify<(x: number) => string> → (x: number) => Promise<string>
//      e.g. Promisify<(x: number) => Promise<string>> → (x: number) => Promise<string>
export type Promisify<F extends (...args: any[]) => any> = never; // TODO

type _116a = Expect<
  Equal<Promisify<(x: number) => string>, (x: number) => Promise<string>>
>;
type _116b = Expect<
  Equal<
    Promisify<(x: number) => Promise<string>>,
    (x: number) => Promise<string>
  >
>;

// 117. Curry a function — convert (a: A, b: B, c: C) => R into the chain
//      (a: A) => (b: B) => (c: C) => R. Must handle any arity.

export type Curry<F> = never; // TODO

type _117a = Expect<
  Equal<
    Curry<(a: number, b: string) => boolean>,
    (a: number) => (b: string) => boolean
  >
>;
type _117b = Expect<
  Equal<
    Curry<(a: number, b: string, c: boolean) => null>,
    (a: number) => (b: string) => (c: boolean) => null
  >
>;
type _117c = Expect<Equal<Curry<(a: number) => string>, (a: number) => string>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 19 — Signed arithmetic
// ════════════════════════════════════════════════════════════════════════════

// Tuple-based arithmetic only handles non-negative numbers. To work with signs
// we leave the tuple world and use template literals to inspect the literal's
// leading character.

// 118. Determine the sign of a number literal: -1 for negatives, 0 for zero,
//      1 for positives.
//      e.g. Sign<5> → 1, Sign<-3> → -1, Sign<0> → 0

export type Sign<N extends number> = never; // TODO

type _118a = Expect<Equal<Sign<5>, 1>>;
type _118b = Expect<Equal<Sign<-3>, -1>>;
type _118c = Expect<Equal<Sign<0>, 0>>;

// 119. Take the absolute value of a number literal.
//      e.g. Abs<-5> → 5, Abs<5> → 5, Abs<0> → 0

export type Abs<N extends number> = never; // TODO

type _119a = Expect<Equal<Abs<-5>, 5>>;
type _119b = Expect<Equal<Abs<5>, 5>>;
type _119c = Expect<Equal<Abs<0>, 0>>;
type _119d = Expect<Equal<Abs<-100>, 100>>;

// 120. Negate a number literal — toggle its sign.
//      e.g. Negate<5> → -5, Negate<-3> → 3, Negate<0> → 0

export type Negate<N extends number> = never; // TODO

type _120a = Expect<Equal<Negate<5>, -5>>;
type _120b = Expect<Equal<Negate<-3>, 3>>;
type _120c = Expect<Equal<Negate<0>, 0>>;

// 121. Compare two number literals: -1 if A < B, 0 if equal, 1 if A > B.
//      e.g. Compare<3, 5> → -1, Compare<5, 5> → 0, Compare<7, 3> → 1

export type Compare<A extends number, B extends number> = never; // TODO

type _121a = Expect<Equal<Compare<3, 5>, -1>>;
type _121b = Expect<Equal<Compare<5, 5>, 0>>;
type _121c = Expect<Equal<Compare<7, 3>, 1>>;

// ════════════════════════════════════════════════════════════════════════════
// Group 20 — Tuple set operations
// ════════════════════════════════════════════════════════════════════════════

// 122. Remove duplicate elements from a tuple, preserving order of first
//      occurrence.
//      e.g. Unique<[1, 2, 1, 3, 2]> → [1, 2, 3]

export type Unique<T extends unknown[], Acc extends unknown[] = []> = never; // TODO

type _122a = Expect<Equal<Unique<[1, 2, 1, 3, 2]>, [1, 2, 3]>>;
type _122b = Expect<Equal<Unique<[]>, []>>;
type _122c = Expect<Equal<Unique<["a", "b", "a"]>, ["a", "b"]>>;
type _122d = Expect<Equal<Unique<[1, 1, 1]>, [1]>>;

// 123. Return a slice of a tuple from Start (inclusive) to End (exclusive).
//      e.g. Slice<[1, 2, 3, 4, 5], 1, 4> → [2, 3, 4]

export type Slice<
  T extends unknown[],
  Start extends number,
  End extends number,
> = never; // TODO

type _123a = Expect<Equal<Slice<[1, 2, 3, 4, 5], 1, 4>, [2, 3, 4]>>;
type _123b = Expect<Equal<Slice<[1, 2, 3], 0, 2>, [1, 2]>>;
type _123c = Expect<Equal<Slice<[1, 2, 3], 0, 0>, []>>;

// 124. Return true if every element in T extends F.
//      e.g. Every<[1, 2, 3], number> → true, Every<[1, 'a'], number> → false

export type Every<T extends unknown[], F> = never; // TODO

type _124a = Expect<Equal<Every<[1, 2, 3], number>, true>>;
type _124b = Expect<Equal<Every<[1, "a", 3], number>, false>>;
type _124c = Expect<Equal<Every<[], number>, true>>; // vacuous truth
type _124d = Expect<Equal<Every<["a", "b"], string>, true>>;

// 125. Return true if any element in T extends F. Dual of Every.
//      e.g. Some<[1, 'a', 3], string> → true, Some<[1, 2, 3], string> → false

export type Some<T extends unknown[], F> = never; // TODO

type _125a = Expect<Equal<Some<[1, "a", 3], string>, true>>;
type _125b = Expect<Equal<Some<[1, 2, 3], string>, false>>;
type _125c = Expect<Equal<Some<[], number>, false>>; // vacuous falsehood

// ════════════════════════════════════════════════════════════════════════════
// Group 21 — Capstone: type-level mini-parsers
// ════════════════════════════════════════════════════════════════════════════

// 126. Parse a dot-and-bracket path string into a tuple of keys.
//      e.g. ParsePath<'a.b[0].c'> → ['a', 'b', '0', 'c']
export type ParsePath<S extends string> = never; // TODO

type _126a = Expect<Equal<ParsePath<"a.b[0].c">, ["a", "b", "0", "c"]>>;
type _126b = Expect<Equal<ParsePath<"a.b.c">, ["a", "b", "c"]>>;
type _126c = Expect<Equal<ParsePath<"arr[0]">, ["arr", "0"]>>;
type _126d = Expect<Equal<ParsePath<"single">, ["single"]>>;

// 127. Parse a URL query-string literal into an object type.
//      e.g. ParseQueryString<'a=1&b=2'> → { a: '1'; b: '2' }
type Pretty<T> = { [K in keyof T]: T[K] } & {};

export type ParseQueryString<S extends string> = never; // TODO

type _127a = Expect<
  Equal<Pretty<ParseQueryString<"a=1&b=2">>, { a: "1"; b: "2" }>
>;
type _127b = Expect<
  Equal<
    Pretty<ParseQueryString<"name=alice&age=30&active=true">>,
    { name: "alice"; age: "30"; active: "true" }
  >
>;
type _127c = Expect<
  Equal<Pretty<ParseQueryString<"single=val">>, { single: "val" }>
>;
