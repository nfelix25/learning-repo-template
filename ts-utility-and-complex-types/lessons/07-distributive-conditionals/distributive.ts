// Lesson 07 — Distributive Conditional Types

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// ─── Section 1: Core distribution mechanics ──────────────────────────────────
// A "naked" type parameter T in `T extends U ? X : Y` causes TypeScript to
// split a union T = A | B into (A extends U ? X : Y) | (B extends U ? X : Y).

// 1. Keep only union members of T that extend U.
export type MyExtract<T, U> = T extends U ? T : never; // TODO

type Extract1 = MyExtract<"a" | "b" | "c", "a" | "c">;
type _Extract1 = Expect<Equal<Extract1, "a" | "c">>;

type Extract2 = MyExtract<string | number | boolean, string>;
type _Extract2 = Expect<Equal<Extract2, string>>;

type Extract3 = MyExtract<string, number>;
type _Extract3 = Expect<Equal<Extract3, never>>;

// 2. Remove from T all members that extend U.
export type MyExclude<T, U> = T extends U ? never : T; // TODO

type Exclude1 = MyExclude<"a" | "b" | "c", "a">;
type _Exclude1 = Expect<Equal<Exclude1, "b" | "c">>;

type Exclude2 = MyExclude<string | number | boolean, string | number>;
type _Exclude2 = Expect<Equal<Exclude2, boolean>>;

type Exclude3 = MyExclude<string, string>;
type _Exclude3 = Expect<Equal<Exclude3, never>>;

// 3. Distribute T into arrays: string | number → string[] | number[]
export type ToArray<T> = T extends unknown ? T[] : never; // TODO

type ToArray1 = ToArray<string>;
type _ToArray1 = Expect<Equal<ToArray1, string[]>>;

type ToArray2 = ToArray<number>;
type _ToArray2 = Expect<Equal<ToArray2, number[]>>;

type ToArray3 = ToArray<string | number>;
type _ToArray3 = Expect<Equal<ToArray3, string[] | number[]>>;

// 4. Non-distributing IsArray — true if the whole T is an array, false otherwise.
//    Wrap T in [T] to suppress distribution and treat the union atomically.
export type NonDistributiveIsArray<T> = [T] extends [readonly unknown[]]
  ? true
  : false; // TODO

type IsArray1 = NonDistributiveIsArray<string[]>;
type _IsArray1 = Expect<Equal<IsArray1, true>>;

type IsArray2 = NonDistributiveIsArray<string>;
type _IsArray2 = Expect<Equal<IsArray2, false>>;

type IsArray3 = NonDistributiveIsArray<string[] | string>;
type _IsArray3 = Expect<Equal<IsArray3, false>>;

// 5. Remove keys from a record whose value type is never.
//    Combine a mapped type with a distributive conditional to pick keys.
export type FilterNever<T extends Record<string, unknown>> = {
  [K in keyof T as [T[K]] extends [never] ? never : K]: T[K];
}; // TODO

type Raw = { a: string; b: never; c: number; d: never };
type FilterNever1 = FilterNever<Raw>;
type _FilterNever1 = Expect<Equal<FilterNever1, { a: string; c: number }>>;

type FilterNever2 = FilterNever<{ x: string }>;
type _FilterNever2 = Expect<Equal<FilterNever2, { x: string }>>;

type FilterNever3 = FilterNever<{ x: never }>;
type _FilterNever3 = Expect<Equal<FilterNever3, {}>>;

// ─── Section 2: Transforming each union member ───────────────────────────────
// Distribution lets you apply an independent wrapper or infer-based unwrapper
// to every member of a union.

// 6. Wrap each union member in Promise.
//    WrapInPromise<string | number> → Promise<string> | Promise<number>
export type WrapInPromise<T> = T extends unknown ? Promise<T> : never; // TODO

type WrapInPromise1 = WrapInPromise<string>;
type _WrapInPromise1 = Expect<Equal<WrapInPromise1, Promise<string>>>;

type WrapInPromise2 = WrapInPromise<string | number>;
type _WrapInPromise2 = Expect<
  Equal<WrapInPromise2, Promise<string> | Promise<number>>
>;

type WrapInPromise3 = WrapInPromise<never>;
type _WrapInPromise3 = Expect<Equal<WrapInPromise3, never>>;

// 7. Unwrap Promise<T> for each member; leave non-Promise members unchanged.
//    Use `infer` inside the distributive branch.
export type UnwrapPromise<T> = T extends PromiseLike<infer P> ? P : T; // TODO

type UnwrapPromise1 = UnwrapPromise<Promise<string>>;
type _UnwrapPromise1 = Expect<Equal<UnwrapPromise1, string>>;

type UnwrapPromise2 = UnwrapPromise<string>;
type _UnwrapPromise2 = Expect<Equal<UnwrapPromise2, string>>;

type UnwrapPromise3 = UnwrapPromise<Promise<string> | number>;
type _UnwrapPromise3 = Expect<Equal<UnwrapPromise3, string | number>>;

// 8. Wrap each member in a { value: T } container.
//    Box<string | number> → { value: string } | { value: number }
//    Compare to the non-distributed result: { value: string | number }.
export type Box<T> = T extends unknown ? { value: T } : never; // TODO

type Box1 = Box<string>;
type _Box1 = Expect<Equal<Box1, { value: string }>>;

type Box2 = Box<string | number>;
type _Box2 = Expect<Equal<Box2, { value: string } | { value: number }>>;

type Box3 = Box<never>;
type _Box3 = Expect<Equal<Box3, never>>;

// 9. Unwrap a { value: T } box back to T; leave non-box shapes unchanged.
export type Unbox<T> = T extends { value: infer V } ? V : T; // TODO

type Unbox1 = Unbox<{ value: string }>;
type _Unbox1 = Expect<Equal<Unbox1, string>>;

type Unbox2 = Unbox<string>;
type _Unbox2 = Expect<Equal<Unbox2, string>>;

type Unbox3 = Unbox<{ value: string } | { value: number }>;
type _Unbox3 = Expect<Equal<Unbox3, string | number>>;

// 10. Distribute T into readonly arrays.
export type ToReadonlyArray<T> = T extends unknown ? readonly T[] : never; // TODO

type ToReadonlyArray1 = ToReadonlyArray<string>;
type _ToReadonlyArray1 = Expect<Equal<ToReadonlyArray1, readonly string[]>>;

type ToReadonlyArray2 = ToReadonlyArray<string | number>;
type _ToReadonlyArray2 = Expect<
  Equal<ToReadonlyArray2, readonly string[] | readonly number[]>
>;

type ToReadonlyArray3 = ToReadonlyArray<never>;
type _ToReadonlyArray3 = Expect<Equal<ToReadonlyArray3, never>>;

// ─── Section 3: Filtering union members ──────────────────────────────────────
// Use `T extends U ? T : never` to keep matching members, or
// `T extends U ? never : T` to remove them.

// 11. Remove null and undefined from T (re-implement NonNullable).
export type MyNonNullable<T> = T extends {} ? T : never; // TODO

type MyNonNullable1 = MyNonNullable<string | null>;
type _MyNonNullable1 = Expect<Equal<MyNonNullable1, string>>;

type MyNonNullable2 = MyNonNullable<string | number | null | undefined>;
type _MyNonNullable2 = Expect<Equal<MyNonNullable2, string | number>>;

type MyNonNullable3 = MyNonNullable<null | undefined>;
type _MyNonNullable3 = Expect<Equal<MyNonNullable3, never>>;

// 12. Keep only string-assignable members of T.
export type StringsOnly<T> = T extends string ? T : never; // TODO

type StringsOnly1 = StringsOnly<string | number | boolean>;
type _StringsOnly1 = Expect<Equal<StringsOnly1, string>>;

type StringsOnly2 = StringsOnly<"a" | "b" | number>;
type _StringsOnly2 = Expect<Equal<StringsOnly2, "a" | "b">>;

type StringsOnly3 = StringsOnly<number | boolean>;
type _StringsOnly3 = Expect<Equal<StringsOnly3, never>>;

// 13. Remove all function types from T.
export type ExcludeFunctions<T> = T extends Function ? never : T;

type ExcludeFunctions1 = ExcludeFunctions<string | (() => void)>;
type _ExcludeFunctions1 = Expect<Equal<ExcludeFunctions1, string>>;

type ExcludeFunctions2 = ExcludeFunctions<
  (() => void) | ((x: number) => string) | number
>;
type _ExcludeFunctions2 = Expect<Equal<ExcludeFunctions2, number>>;

type ExcludeFunctions3 = ExcludeFunctions<() => void>;
type _ExcludeFunctions3 = Expect<Equal<ExcludeFunctions3, never>>;

// 14. Keep only string literal types — exclude the `string` primitive type itself.
//     Hint: a literal "x" satisfies `T extends string` but NOT `string extends T`.
//     The widened `string` satisfies both.
export type StringLiteralsOnly<T> = T extends string
  ? string extends T
    ? never
    : T
  : never; // TODO

type StringLiteralsOnly1 = StringLiteralsOnly<"a" | "b">;
type _StringLiteralsOnly1 = Expect<Equal<StringLiteralsOnly1, "a" | "b">>;

type StringLiteralsOnly2 = StringLiteralsOnly<string | number>;
type _StringLiteralsOnly2 = Expect<Equal<StringLiteralsOnly2, never>>;

type StringLiteralsOnly3 = StringLiteralsOnly<"x" | "y" | 42>;
type _StringLiteralsOnly3 = Expect<Equal<StringLiteralsOnly3, "x" | "y">>;

// 15. Remove all primitive types from T; keep only object/non-primitive types.
export type ObjectsOnly<T> = T extends object ? T : never; // TODO

type ObjectsOnly1 = ObjectsOnly<string | { a: string }>;
type _ObjectsOnly1 = Expect<Equal<ObjectsOnly1, { a: string }>>;

type ObjectsOnly2 = ObjectsOnly<string | number | boolean | { x: number }>;
type _ObjectsOnly2 = Expect<Equal<ObjectsOnly2, { x: number }>>;

type ObjectsOnly3 = ObjectsOnly<string | number>;
type _ObjectsOnly3 = Expect<Equal<ObjectsOnly3, never>>;

// ─── Section 4: Non-distributive introspection ───────────────────────────────
// Wrap T in [T] so the conditional tests the whole type atomically rather
// than distributing over its members.

// 16. IsNever<T> — true iff T is never.
//     A naked `T extends never` distributes and produces never for never input.
//     Use [T] extends [never] to prevent that.
export type IsNever<T> = [T] extends [never] ? true : false; // TODO

type IsNever1 = IsNever<never>;
type _IsNever1 = Expect<Equal<IsNever1, true>>;

type IsNever2 = IsNever<string>;
type _IsNever2 = Expect<Equal<IsNever2, false>>;

type IsNever3 = IsNever<string | number>;
type _IsNever3 = Expect<Equal<IsNever3, false>>;

// 17. IsAny<T> — true iff T is any.
//     Hint: `any` satisfies every constraint; check if 0 extends (1 & T).
//     For any other T, 1 & T is either never or a narrower type, so 0 does not extend it.
export type IsAny<T> = 0 extends 1 & T ? true : false; // TODO

type IsAny1 = IsAny<any>;
type _IsAny1 = Expect<Equal<IsAny1, true>>;

type IsAny2 = IsAny<string>;
type _IsAny2 = Expect<Equal<IsAny2, false>>;

type IsAny3 = IsAny<unknown>;
type _IsAny3 = Expect<Equal<IsAny3, false>>;

// 18. IsUnion<T> — true iff T has more than one union member.
//     Hint: distribute with `T extends T` (capturing the original as U = T),
export type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends U
    ? [U] extends [T]
      ? false
      : true
    : false;

type IsUnion1 = IsUnion<string | number>;
type _IsUnion1 = Expect<Equal<IsUnion1, true>>;

type IsUnion2 = IsUnion<string>;
type _IsUnion2 = Expect<Equal<IsUnion2, false>>;

type IsUnion3 = IsUnion<never>;
type _IsUnion3 = Expect<Equal<IsUnion3, false>>;

// ─── Section 5: infer inside distributive conditionals ───────────────────────
// Combine distribution with `infer` to extract a type from each matching member.

// 19. Unwrap one array layer per member; leave non-arrays unchanged.
//     FlattenArray<string[] | number[] | boolean> → string | number | boolean
export type FlattenArray<T> = T extends readonly (infer E)[] ? E : T;

type FlattenArray1 = FlattenArray<string[]>;
type _FlattenArray1 = Expect<Equal<FlattenArray1, string>>;

type FlattenArray2 = FlattenArray<string>;
type _FlattenArray2 = Expect<Equal<FlattenArray2, string>>;

type FlattenArray3 = FlattenArray<string[] | number[] | boolean>;
type _FlattenArray3 = Expect<Equal<FlattenArray3, string | number | boolean>>;

// 20. For each member of T: if it is a function, extract its return type; else never.
//     FunctionReturnType<(() => string) | (() => number) | boolean> → string | number
export type FunctionReturnType<T> = T extends (...args: never) => infer R
  ? R
  : never; // TODO

type FunctionReturnType1 = FunctionReturnType<() => string>;
type _FunctionReturnType1 = Expect<Equal<FunctionReturnType1, string>>;

type FunctionReturnType2 = FunctionReturnType<string>;
type _FunctionReturnType2 = Expect<Equal<FunctionReturnType2, never>>;

type FunctionReturnType3 = FunctionReturnType<
  (() => string) | (() => number) | boolean
>;
type _FunctionReturnType3 = Expect<Equal<FunctionReturnType3, string | number>>;

// ─── Section 6: Distributing over unions of objects ──────────────────────────
// Apply structural transformations to each object member of a union independently.
// This preserves the union shape rather than collapsing it.

// 21. Apply Pick<T, K> to each member of a union of objects.
//     Without distribution, Pick<A | B, K> collapses to a single object with
//     only the shared keys. With distribution each member is picked separately.
export type DistributivePick<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? Key : never]: T[K];
} extends infer U
  ? { [K in keyof U]: U[K] } & {}
  : never;

type DPick_A = { a: string; b: number };
type DPick_B = { a: boolean; c: string };

type DistributivePick1 = DistributivePick<DPick_A, "a">;
type _DistributivePick1 = Expect<Equal<DistributivePick1, { a: string }>>;

type DistributivePick2 = DistributivePick<DPick_A | DPick_B, "a">;
type _DistributivePick2 = Expect<
  Equal<DistributivePick2, { a: string } | { a: boolean }>
>;

type DistributivePick3 = DistributivePick<
  { id: number; name: string } | { id: number; role: "admin" },
  "id"
>;
type _DistributivePick3 = Expect<
  Equal<DistributivePick3, { id: number } | { id: number }>
>;

// 22. Apply Omit<T, K> to each member of a union of objects.
export type DistributiveOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
}; // TODO

type DOmit_A = { id: number; name: string; age: number };
type DOmit_B = { id: number; role: "admin"; level: number };

type DistributiveOmit1 = DistributiveOmit<DOmit_A, "id">;
type _DistributiveOmit1 = Expect<
  Equal<DistributiveOmit1, { name: string; age: number }>
>;

type DistributiveOmit2 = DistributiveOmit<DOmit_A | DOmit_B, "id">;
type _DistributiveOmit2 = Expect<
  Equal<
    DistributiveOmit2,
    { name: string; age: number } | { role: "admin"; level: number }
  >
>;

type DistributiveOmit3 = DistributiveOmit<
  { kind: "a"; x: number } | { kind: "b"; y: string },
  "kind"
>;
type _DistributiveOmit3 = Expect<
  Equal<DistributiveOmit3, { x: number } | { y: string }>
>;

// 23. Narrow a discriminated union to members whose tag field D equals V.
export type NarrowByTag<
  T,
  D extends keyof T,
  V extends T[D],
> = T extends unknown ? (T[D] extends V ? T : never) : never; // TODO

type NBT_Circle = { kind: "circle"; radius: number };
type NBT_Square = { kind: "square"; side: number };
type NBT_Triangle = { kind: "triangle"; base: number; height: number };
type NBT_Shape = NBT_Circle | NBT_Square | NBT_Triangle;

type NarrowByTag1 = NarrowByTag<NBT_Shape, "kind", "circle">;
type _NarrowByTag1 = Expect<Equal<NarrowByTag1, NBT_Circle>>;

type NarrowByTag2 = NarrowByTag<NBT_Shape, "kind", "circle" | "square">;
type _NarrowByTag2 = Expect<Equal<NarrowByTag2, NBT_Circle | NBT_Square>>;

type NarrowByTag3 = NarrowByTag<NBT_Shape, "kind", "triangle">;
type _NarrowByTag3 = Expect<Equal<NarrowByTag3, NBT_Triangle>>;

// 24. Inject a new field { [K]: V } into every member of a union of objects.
//     AddField<{ a: string } | { b: number }, "id", number>
//     → { a: string; id: number } | { b: number; id: number }
export type AddField<T, K extends string, V> = T extends unknown
  ? T & Record<K, V> extends infer U
    ? { [K in keyof U]: U[K] }
    : never
  : never; // TODO

type AddField1 = AddField<{ name: string }, "id", number>;
type _AddField1 = Expect<Equal<AddField1, { name: string; id: number }>>;

type AddField2 = AddField<{ a: string } | { b: number }, "id", number>;
type _AddField2 = Expect<
  Equal<AddField2, { a: string; id: number } | { b: number; id: number }>
>;

type AddField3 = AddField<{ x: string } | { y: number }, "meta", boolean>;
type _AddField3 = Expect<
  Equal<AddField3, { x: string; meta: boolean } | { y: number; meta: boolean }>
>;

// ─── Section 7: Advanced patterns ────────────────────────────────────────────

// 25. Map each primitive union member to its typeof name as a string literal.
//     Use nested conditional branches (multi-way conditional).
//     string → "string", number → "number", boolean → "boolean",
//     null → "null", undefined → "undefined", anything else → "object"

export type TypeName<T extends string | number | boolean | null | undefined> =
  T extends string
    ? "string"
    : T extends number
      ? "number"
      : T extends boolean
        ? "boolean"
        : T extends null
          ? "null"
          : T extends undefined
            ? "undefined"
            : "object";

type TypeName1 = TypeName<string>;
type _TypeName1 = Expect<Equal<TypeName1, "string">>;

type TypeName2 = TypeName<number | boolean>;
type _TypeName2 = Expect<Equal<TypeName2, "number" | "boolean">>;

type TypeName3 = TypeName<null | undefined | string>;
type _TypeName3 = Expect<Equal<TypeName3, "null" | "undefined" | "string">>;

// 26. Convert a union to an intersection using a contravariant position.
//     Placing T in a function parameter forces intersection at inference time.
//     Hint: `(T extends any ? (arg: T) => void : never)`, then infer the arg.
export type UnionToIntersection<T> = (
  T extends unknown ? (arg: T) => void : never
) extends (arg: infer U) => void
  ? U
  : never; // TODO

type UTI1 = UnionToIntersection<{ a: string } | { b: number }>;
type _UTI1 = Expect<Equal<UTI1, { a: string } & { b: number }>>;

type UTI2 = UnionToIntersection<{ x: number } | { y: string } | { z: boolean }>;
type _UTI2 = Expect<
  Equal<UTI2, { x: number } & { y: string } & { z: boolean }>
>;

type UTI3 = UnionToIntersection<
  { id: number; name: string } | { id: number; age: number }
>;
type _UTI3 = Expect<
  Equal<UTI3, { id: number; name: string } & { id: number; age: number }>
>;

// 27. Ensure T is an array: if already an array return it, otherwise wrap it.
//     Distributes independently so each union member is handled on its own.
export type EnsureArray<T> = T extends readonly unknown[] ? T : T[]; // TODO

type EnsureArray1 = EnsureArray<string>;
type _EnsureArray1 = Expect<Equal<EnsureArray1, string[]>>;

type EnsureArray2 = EnsureArray<string[]>;
type _EnsureArray2 = Expect<Equal<EnsureArray2, string[]>>;

type EnsureArray3 = EnsureArray<string | number[]>;
type _EnsureArray3 = Expect<Equal<EnsureArray3, string[] | number[]>>;

// 28. Partition T into [matching, non-matching] without using Extract or Exclude.
//     Each tuple element is independently evaluated: T distributes inside each position,
//     so both slots receive all union members and filter them separately.
export type SplitUnion<T, U> = [
  T extends U ? T : never,
  T extends U ? never : T,
]; // TODO

type SplitUnion1 = SplitUnion<"a" | "b" | "c", "a" | "c">;
type _SplitUnion1 = Expect<Equal<SplitUnion1, ["a" | "c", "b"]>>;

type SplitUnion2 = SplitUnion<string | number | boolean, string>;
type _SplitUnion2 = Expect<Equal<SplitUnion2, [string, number | boolean]>>;

type SplitUnion3 = SplitUnion<string | number, never>;
type _SplitUnion3 = Expect<Equal<SplitUnion3, [never, string | number]>>;
