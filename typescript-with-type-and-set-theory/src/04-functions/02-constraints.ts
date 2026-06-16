import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — GENERICS AS TYPE FUNCTIONS
// Koan 2 of 5: Generic constraints as domain restriction
// ═══════════════════════════════════════════════════════════════════════════
//
// In mathematics, a function f: A → B is defined on a DOMAIN A.
// You can only call f with values from A.
//
// In lambda calculus: λx:A. body   (the `:A` is the type annotation / restriction)
//
// In TypeScript generics: <T extends A>
//
//   type Stringify<T extends number> = `${T}`
//
//   Stringify<42>      // ✓ — 42 ∈ domain (number)
//   Stringify<'cat'>   // ✗ — 'cat' ∉ domain (string ⊄ number)
//
// The constraint `T extends A` means "T must be a subtype of A."
// It RESTRICTS the domain of the type function.
//
// ───────────────────────────────────────────────────────────────────────────
// keyof — THE DOMAIN OF PROPERTY ACCESS
// ───────────────────────────────────────────────────────────────────────────
//
// `keyof T` is the union of all key names of T:
//
//   type Obj = { a: string; b: number; c: boolean }
//   type Keys = keyof Obj   // → "a" | "b" | "c"
//
// The constraint `<K extends keyof T>` restricts K to valid keys of T.
// TypeScript can then safely index T[K].
//
//   type GetProp<T, K extends keyof T> = T[K]
//   GetProp<Obj, 'a'>  // → string
//   GetProp<Obj, 'x'>  // ✗ — 'x' is not a key of Obj
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. GetProp — safe property access using keyof constraint.
type GetProp<T, K extends keyof T> = T[K];

type _test1 = Expect<Equal<GetProp<{ a: string; b: number }, "a">, string>>;
type _test2 = Expect<Equal<GetProp<{ a: string; b: number }, "b">, number>>;

// 2. keyof on various types.
type ObjectKeys = keyof { x: number; y: number; z: number };

type _test3 = Expect<Equal<ObjectKeys, "x" | "y" | "z">>;

// 3. Indexed access T[K] retrieves the type of a property.
type PropType = { name: string; age: number; active: boolean }["name"];

type _test4 = Expect<Equal<PropType, string>>;

// 4. Union of indexed accesses = union of all value types.
type AllValues = { name: string; age: number; active: boolean } extends infer T
  ? T[keyof T]
  : never;

type _test5 = Expect<Equal<AllValues, string | number | boolean>>;

// 5. Constrained Uppercase — only works on string subtypes.
//    (Using the built-in Uppercase intrinsic for the implementation.)
type UppercaseLiteral<T extends string> = Uppercase<T>;

type _test6 = Expect<Equal<UppercaseLiteral<"hello">, "HELLO">>;
type _test7 = Expect<Equal<UppercaseLiteral<"world">, "WORLD">>;

// 6. ValuesOf — extract all value types from an object type.
type ValuesOf<T extends object> = T[keyof T];

type _test8 = Expect<
  Equal<ValuesOf<{ a: string; b: number }>, string | number>
>;
type _test9 = Expect<Equal<ValuesOf<{ x: true; y: false }>, boolean>>;
type _test10 = Expect<Equal<ValuesOf<{ only: 42 }>, 42>>;

// 7. PickByValue — keep only keys whose value type extends V.
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type _test11 = Expect<
  Equal<
    PickByValue<{ a: string; b: number; c: string | null }, string>,
    { a: string }
  >
>;
//   This uses key remapping (the `as` clause in mapped types).
//   We'll study this more in the mapped types koan.

// ───────────────────────────────────────────────────────────────────────────
// MORE KOANS
// ───────────────────────────────────────────────────────────────────────────

// 8. GetProps — read several valid properties at once.
//    K is restricted to the domain of property access: keyof T.
type GetProps<T, K extends keyof T> = T[K];

type _test12 = Expect<
  Equal<
    GetProps<{ id: string; count: number; done: boolean }, "id" | "done">,
    string | boolean
  >
>;
type _test13 = Expect<Equal<GetProps<{ x: 1; y: 2; z: 3 }, "x" | "z">, 1 | 3>>;

// 9. PickProps — keep only a constrained set of keys.
type PickProps<T, K extends keyof T> = { [Key in K]: T[Key] };

type _test14 = Expect<
  Equal<
    PickProps<{ id: string; name: string; age: number }, "id" | "age">,
    { id: string; age: number }
  >
>;

// 10. OmitProps — remove a constrained set of keys.
type OmitProps<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
};

type _test15 = Expect<
  Equal<
    OmitProps<{ id: string; name: string; age: number }, "age">,
    { id: string; name: string }
  >
>;

// 11. KeyValue — pair a key with the type of its corresponding value.
type KeyValue<T, K extends keyof T> = { key: K; value: T[K] };

type _test16 = Expect<
  Equal<
    KeyValue<{ name: string; age: number }, "name">,
    { key: "name"; value: string }
  >
>;
type _test17 = Expect<
  Equal<
    KeyValue<{ name: string; age: number }, "age">,
    { key: "age"; value: number }
  >
>;

// 12. HasKey — ask whether a property key belongs to an object domain.
//     PropertyKey is the union of all legal object key types:
//     string | number | symbol.
type HasKey<T extends object, K extends PropertyKey> = K extends keyof T
  ? true
  : false;

type _test18 = Expect<Equal<HasKey<{ a: string; b: number }, "a">, true>>;
type _test19 = Expect<
  Equal<HasKey<{ a: string; b: number }, "missing">, false>
>;
type _test20 = Expect<Equal<HasKey<{ 0: string; 1: string }, 1>, true>>;

declare const secretKey: unique symbol;

type MixedKeyed = {
  name: string;
  0: boolean;
  [secretKey]: Date;
};

// 13. StringKeys — restrict keyof T to string keys.
type StringKeys<T extends object> = {
  [K in keyof T as K extends string ? K : never]: K;
} extends infer U
  ? U[keyof U]
  : never;

type _test21 = Expect<Equal<StringKeys<MixedKeyed>, "name">>;

type TypedKeys<T extends object, U extends unknown> = {
  [K in keyof T as K extends U ? K : never]: K;
} extends infer V
  ? V[keyof V]
  : never;

// 14. NumberKeys — restrict keyof T to number keys.
type NumberKeys<T extends object> = TypedKeys<T, number>;

type _test22 = Expect<Equal<NumberKeys<MixedKeyed>, 0>>;

// 15. SymbolKeys — restrict keyof T to symbol keys.
type SymbolKeys<T extends object> = TypedKeys<T, symbol>;

type _test23 = Expect<Equal<SymbolKeys<MixedKeyed>, typeof secretKey>>;

// 16. RecordFromKeys — build an object from a constrained key domain.
type RecordFromKeys<K extends PropertyKey, V> = { [Key in K]: V };

type _test24 = Expect<
  Equal<
    RecordFromKeys<"read" | "write", boolean>,
    { read: boolean; write: boolean }
  >
>;
type _test25 = Expect<
  Equal<RecordFromKeys<0 | 1, string>, { 0: string; 1: string }>
>;

// 17. PartialRecordFromKeys — the same domain, but each key is optional.
type PartialRecordFromKeys<K extends PropertyKey, V> = { [Key in K]+?: V };

type _test26 = Expect<
  Equal<PartialRecordFromKeys<"x" | "y", number>, { x?: number; y?: number }>
>;

// 18. NonNullableProp — safely index, then remove null and undefined.
type NonNullableProp<T, K extends keyof T> = T[K] extends infer U
  ? U extends null | undefined
    ? never
    : U
  : never; // T[K] & {}

type _test27 = Expect<
  Equal<NonNullableProp<{ name: string | null; age?: number }, "name">, string>
>;
type _test28 = Expect<
  Equal<NonNullableProp<{ name: string | null; age?: number }, "age">, number>
>;

// 19. ArrayItem — arrays and tuples have a numeric indexing domain.
type ArrayItem<T extends readonly unknown[]> = T extends readonly (infer U)[]
  ? U
  : never; // T[number]

type _test29 = Expect<Equal<ArrayItem<string[]>, string>>;
type _test30 = Expect<
  Equal<ArrayItem<readonly ["red", "green", "blue"]>, "red" | "green" | "blue">
>;

// 20. TupleFirst — restrict the domain to non-empty tuples.
type TupleFirst<T extends readonly [unknown, ...unknown[]]> =
  T extends readonly [infer First, ...rest: unknown[]] ? First : never;

type _test31 = Expect<Equal<TupleFirst<[string, number, boolean]>, string>>;
type _test32 = Expect<Equal<TupleFirst<readonly ["north", "south"]>, "north">>;

// 21. TupleRest — the same non-empty constraint makes the rest safe to ask for.
type TupleRest<T extends readonly [unknown, ...unknown[]]> =
  T extends readonly [any, ...infer Rest] ? Rest : never;

type _test33 = Expect<
  Equal<TupleRest<[string, number, boolean]>, [number, boolean]>
>;
type _test34 = Expect<Equal<TupleRest<readonly ["north", "south"]>, ["south"]>>;

// 22. TupleLength — length is always available on readonly arrays and tuples.
type TupleLength<T extends readonly unknown[]> = T["length"];

type _test35 = Expect<Equal<TupleLength<[string, number, boolean]>, 3>>;
type _test36 = Expect<Equal<TupleLength<string[]>, number>>;

// 23. ReturnOf — restrict the domain to callable types.
type ReturnOf<T extends (...args: never[]) => unknown> = T extends (
  ...args: never
) => infer R
  ? R
  : never;

type _test37 = Expect<Equal<ReturnOf<() => string>, string>>;
type _test38 = Expect<Equal<ReturnOf<(id: string) => 42>, 42>>;

// 24. ArgsOf — safely retrieve the parameter tuple from a callable type.
type ArgsOf<T extends (...args: never[]) => unknown> = T extends (
  ...args: infer A
) => unknown
  ? A
  : never;

type _test39 = Expect<Equal<ArgsOf<() => string>, []>>;
type _test40 = Expect<
  Equal<
    ArgsOf<(name: string, age: number) => boolean>,
    [name: string, age: number]
  >
>;

// 25. InstanceOf — restrict the domain to constructor types.
type InstanceOf<T extends abstract new (...args: never[]) => object> =
  T extends abstract new (...args: never) => infer R ? R : never;

declare class UserModel {
  id: string;
}

type _test41 = Expect<Equal<InstanceOf<typeof UserModel>, UserModel>>;

// 26. PromiseValue — restrict the domain to Promise-like types.
type PromiseValue<T extends PromiseLike<unknown>> =
  T extends PromiseLike<infer P> ? P : never;

type _test42 = Expect<Equal<PromiseValue<Promise<string>>, string>>;
type _test43 = Expect<Equal<PromiseValue<PromiseLike<42>>, 42>>;

// 27. JsonPrimitive — restrict a generic to values JSON can directly hold.
type JsonPrimitive<T extends string | number | boolean | null> = T extends
  | string
  | number
  | boolean
  | null
  ? T
  : never;

type _test44 = Expect<Equal<JsonPrimitive<"ok">, "ok">>;
type _test45 = Expect<Equal<JsonPrimitive<123>, 123>>;
type _test46 = Expect<Equal<JsonPrimitive<null>, null>>;

export {};
