// Lesson 11 — Recursive Types

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// ─── Section 1: Core recursive types ─────────────────────────────────────────

// 1. The recursive JSON value type.
export type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json }; // TODO

// Json accepts null, primitives, arrays, and string-keyed objects — not symbols.
type JsonTest1 = null extends Json ? true : false;
type _JsonTest1 = Expect<Equal<JsonTest1, true>>;

type JsonTest2 = 42 extends Json ? true : false;
type _JsonTest2 = Expect<Equal<JsonTest2, true>>;

type JsonTest3 = symbol extends Json ? true : false;
type _JsonTest3 = Expect<Equal<JsonTest3, false>>;

// 2. Recursively make all properties readonly (including nested objects and arrays).xe
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
}; // TODO

type DeepReadonly1 = DeepReadonly<{ a: string; b: { c: number } }>;
type _DeepReadonly1 = Expect<
  Equal<
    DeepReadonly1,
    { readonly a: string; readonly b: { readonly c: number } }
  >
>;

type DeepReadonly2 = DeepReadonly<string[]>;
type _DeepReadonly2 = Expect<Equal<DeepReadonly2, ReadonlyArray<string>>>;

type DeepReadonly3 = DeepReadonly<string>;
type _DeepReadonly3 = Expect<Equal<DeepReadonly3, string>>;

// 3. Recursively make all properties optional.
export type DeepPartial<T> = {
  [K in keyof T]+?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}; // TODO

type DeepPartial1 = DeepPartial<{ a: string; b: { c: number } }>;
type _DeepPartial1 = Expect<
  Equal<DeepPartial1, { a?: string; b?: { c?: number } }>
>;

type DeepPartial2 = DeepPartial<{ x: boolean }>;
type _DeepPartial2 = Expect<Equal<DeepPartial2, { x?: boolean }>>;

type DeepPartial3 = DeepPartial<string>;
type _DeepPartial3 = Expect<Equal<DeepPartial3, string>>;

// 4. Recursively unwrap nested Promise chains: Promise<Promise<string>> → string
export type PromiseChain<T> = T extends Promise<infer P> ? PromiseChain<P> : T; // TODO

type PromiseChain1 = PromiseChain<Promise<string>>;
type _PromiseChain1 = Expect<Equal<PromiseChain1, string>>;

type PromiseChain2 = PromiseChain<Promise<Promise<number>>>;
type _PromiseChain2 = Expect<Equal<PromiseChain2, number>>;

type PromiseChain3 = PromiseChain<string>;
type _PromiseChain3 = Expect<Equal<PromiseChain3, string>>;

// 5. Recursively make all properties required (remove optionality at every level).
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] & {} extends object ? DeepRequired<T[K]> : T[K];
}; // TODO

type DeepRequired1 = DeepRequired<{ a?: string; b?: { c?: number } }>;
type _DeepRequired1 = Expect<
  Equal<DeepRequired1, { a: string; b: { c: number } }>
>;

type DeepRequired2 = DeepRequired<{ x?: boolean }>;
type _DeepRequired2 = Expect<Equal<DeepRequired2, { x: boolean }>>;

type DeepRequired3 = DeepRequired<{ a: string }>;
type _DeepRequired3 = Expect<Equal<DeepRequired3, { a: string }>>;

// ─── Section 2: Extended recursive exercises ─────────────────────────────────

// 6. Flatten one level of nesting in a tuple.
//    Flatten<[string, [number, boolean], string]> → [string, number, boolean, string]
//    Hint: use `[infer Head, ...infer Rest]` and spread Head if it is an array.
export type Flatten<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head extends readonly unknown[]
    ? [...Head, ...Flatten<Tail>]
    : [Head, ...Flatten<Tail>]
  : [];

type Flatten1 = Flatten<[string, [number, boolean], string]>;
type _Flatten1 = Expect<Equal<Flatten1, [string, number, boolean, string]>>;

type Flatten2 = Flatten<[[string], [number, boolean]]>;
type _Flatten2 = Expect<Equal<Flatten2, [string, number, boolean]>>;

type Flatten3 = Flatten<[string, number]>;
type _Flatten3 = Expect<Equal<Flatten3, [string, number]>>;

// 7. Recursively flatten all levels of nesting in a tuple.
//    DeepFlatten<[string, [number, [boolean]]]> → [string, number, boolean]
export type DeepFlatten<T extends unknown[]> = T extends [
  infer Head,
  ...infer Tail,
]
  ? [Head] extends [unknown[]]
    ? [...DeepFlatten<Head>, ...DeepFlatten<Tail>]
    : [Head, ...DeepFlatten<Tail>]
  : []; // TODO

type DeepFlatten1 = DeepFlatten<[string, [number, [boolean]]]>;
type _DeepFlatten1 = Expect<Equal<DeepFlatten1, [string, number, boolean]>>;

type DeepFlatten2 = DeepFlatten<[[[string]]]>;
type _DeepFlatten2 = Expect<Equal<DeepFlatten2, [string]>>;

type DeepFlatten3 = DeepFlatten<[string, number]>;
type _DeepFlatten3 = Expect<Equal<DeepFlatten3, [string, number]>>;

// 8. Recursively strip null and undefined from every value in an object tree.
//    Primitives at the top level are also stripped.
export type DeepNonNullable<T> = T extends object
  ? { [K in keyof T]: DeepNonNullable<T[K]> }
  : T & {}; // TODO

type DeepNonNullable1 = DeepNonNullable<{
  a: string | null;
  b: number | undefined;
} | null>;
type _DeepNonNullable1 = Expect<
  Equal<DeepNonNullable1, { a: string; b: number }>
>;

type DeepNonNullable2 = DeepNonNullable<{ nested: { x: boolean | null } }>;
type _DeepNonNullable2 = Expect<
  Equal<DeepNonNullable2, { nested: { x: boolean } }>
>;

type DeepNonNullable3 = DeepNonNullable<null>;
type _DeepNonNullable3 = Expect<Equal<DeepNonNullable3, never>>;

// 9. Recursively remove all `readonly` modifiers (inverse of DeepReadonly).
export type DeepMutable<T> = T extends object
  ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
  : T; // TODO

type DeepMutable1 = DeepMutable<{
  readonly a: string;
  readonly b: { readonly c: number };
}>;
type _DeepMutable1 = Expect<
  Equal<DeepMutable1, { a: string; b: { c: number } }>
>;

type DeepMutable2 = DeepMutable<Readonly<{ x: number }>>;
type _DeepMutable2 = Expect<Equal<DeepMutable2, { x: number }>>;

type DeepMutable3 = DeepMutable<string>;
type _DeepMutable3 = Expect<Equal<DeepMutable3, string>>;

// 10. A recursive binary tree node.
//     TreeNode<T> has a `value`, a nullable `left`, and a nullable `right` child.
export type TreeNode<T> = never; // TODO

// Structural shape checks (tests depend on TreeNode being implemented)
type TreeNode1 = TreeNode<number> extends { value: number } ? true : false;
type _TreeNode1 = Expect<Equal<TreeNode1, true>>;

// A leaf (both children null) must be assignable to TreeNode<string>
type TreeNode2 =
  { value: string; left: null; right: null } extends TreeNode<string>
    ? true
    : false;
type _TreeNode2 = Expect<Equal<TreeNode2, true>>;

// Wrong value type must not match
type TreeNode3 = TreeNode<number> extends { value: string } ? true : false;
type _TreeNode3 = Expect<Equal<TreeNode3, false>>;

// 11. A recursive singly-linked list node.
//     LinkedList<T> has a `head: T` and a nullable `tail: LinkedList<T> | null`.
export type LinkedList<T> = never; // TODO

type LinkedList1 = LinkedList<string> extends { head: string } ? true : false;
type _LinkedList1 = Expect<Equal<LinkedList1, true>>;

// A terminal node (tail is null) must be assignable to LinkedList<number>
type LinkedList2 =
  { head: number; tail: null } extends LinkedList<number> ? true : false;
type _LinkedList2 = Expect<Equal<LinkedList2, true>>;

// Wrong head type must not match
type LinkedList3 = LinkedList<string> extends { head: number } ? true : false;
type _LinkedList3 = Expect<Equal<LinkedList3, false>>;

// 12. Reverse a tuple.
//     Reverse<[string, number, boolean]> → [boolean, number, string]
//     Hint: use `[infer Head, ...infer Rest]` and recurse with an accumulator.
export type Reverse<T extends unknown[]> = never; // TODO

type Reverse1 = Reverse<[string, number, boolean]>;
type _Reverse1 = Expect<Equal<Reverse1, [boolean, number, string]>>;

type Reverse2 = Reverse<[string]>;
type _Reverse2 = Expect<Equal<Reverse2, [string]>>;

type Reverse3 = Reverse<[]>;
type _Reverse3 = Expect<Equal<Reverse3, []>>;

// 13. Zip two same-length tuples into a tuple of pairs.
//     Zip<[string, number], [boolean, string]> → [[string, boolean], [number, string]]
export type Zip<A extends unknown[], B extends unknown[]> = never; // TODO

type Zip1 = Zip<[string, number], [boolean, string]>;
type _Zip1 = Expect<Equal<Zip1, [[string, boolean], [number, string]]>>;

type Zip2 = Zip<[string], [number]>;
type _Zip2 = Expect<Equal<Zip2, [[string, number]]>>;

type Zip3 = Zip<[], []>;
type _Zip3 = Expect<Equal<Zip3, []>>;

// 14. Produce a tuple of exactly N copies of T.
//     Repeat<string, 3> → [string, string, string]
//     Hint: use an accumulator defaulting to [] and check Acc['length'] against N.
export type Repeat<T, N extends number> = never; // TODO

type Repeat1 = Repeat<string, 3>;
type _Repeat1 = Expect<Equal<Repeat1, [string, string, string]>>;

type Repeat2 = Repeat<number, 0>;
type _Repeat2 = Expect<Equal<Repeat2, []>>;

type Repeat3 = Repeat<boolean, 2>;
type _Repeat3 = Expect<Equal<Repeat3, [boolean, boolean]>>;

// 15. All elements of a tuple except the last.
//     Init<[string, number, boolean]> → [string, number]
export type Init<T extends unknown[]> = never; // TODO

type Init1 = Init<[string, number, boolean]>;
type _Init1 = Expect<Equal<Init1, [string, number]>>;

type Init2 = Init<[string]>;
type _Init2 = Expect<Equal<Init2, []>>;

type Init3 = Init<[]>;
type _Init3 = Expect<Equal<Init3, never>>;

// 16. The last element of a tuple, or never if the tuple is empty.
export type Last<T extends unknown[]> = never; // TODO

type Last1 = Last<[string, number, boolean]>;
type _Last1 = Expect<Equal<Last1, boolean>>;

type Last2 = Last<[string]>;
type _Last2 = Expect<Equal<Last2, string>>;

type Last3 = Last<[]>;
type _Last3 = Expect<Equal<Last3, never>>;

// 17. Produce a union of every dot-path into an object type.
//     Paths<{ a: string; b: { c: number } }> → 'a' | 'b' | 'b.c'
//     Hint: recurse only into object-valued properties; use template literals for nested keys.
export type Paths<T> = never; // TODO

type Paths1 = Paths<{ a: string; b: { c: number } }>;
type _Paths1 = Expect<Equal<Paths1, "a" | "b" | "b.c">>;

type Paths2 = Paths<{ x: string }>;
type _Paths2 = Expect<Equal<Paths2, "x">>;

type Paths3 = Paths<{}>;
type _Paths3 = Expect<Equal<Paths3, never>>;

// 18. Omit the key K from T at every nesting level.
//     DeepOmit<{ a: string; b: { a: number; c: boolean } }, 'a'> → { b: { c: boolean } }
export type DeepOmit<T, K extends string> = never; // TODO

type DeepOmit1 = DeepOmit<{ a: string; b: { a: number; c: boolean } }, "a">;
type _DeepOmit1 = Expect<Equal<DeepOmit1, { b: { c: boolean } }>>;

type DeepOmit2 = DeepOmit<{ x: string; y: number }, "z">;
type _DeepOmit2 = Expect<Equal<DeepOmit2, { x: string; y: number }>>;

type DeepOmit3 = DeepOmit<{ a: string }, "a">;
type _DeepOmit3 = Expect<Equal<DeepOmit3, {}>>;

// 19. Collect all leaf (non-object) value types from a nested object as a union.
//     Leaves<{ a: string; b: { c: number; d: boolean } }> → string | number | boolean
export type Leaves<T> = never; // TODO

type Leaves1 = Leaves<{ a: string; b: { c: number; d: boolean } }>;
type _Leaves1 = Expect<Equal<Leaves1, string | number | boolean>>;

type Leaves2 = Leaves<{ x: string }>;
type _Leaves2 = Expect<Equal<Leaves2, string>>;

type Leaves3 = Leaves<string>;
type _Leaves3 = Expect<Equal<Leaves3, string>>;

// 20. An arbitrarily-nested array of T.
//     A NestedArray<T> is either a T or an array of NestedArray<T>.
//     Note: this is a recursive type alias (not a conditional type).
export type NestedArray<T> = never; // TODO

// A bare T is a valid NestedArray<T>
type NestedArray1 = number extends NestedArray<number> ? true : false;
type _NestedArray1 = Expect<Equal<NestedArray1, true>>;

// A flat array is also valid
type NestedArray2 = number[] extends NestedArray<number> ? true : false;
type _NestedArray2 = Expect<Equal<NestedArray2, true>>;

// A different primitive is not valid
type NestedArray3 = string extends NestedArray<number> ? true : false;
type _NestedArray3 = Expect<Equal<NestedArray3, false>>;
