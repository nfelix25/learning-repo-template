// Lesson 05 — Conditional Type Mechanics

// 1. Resolves to true if T is an array type, false otherwise.
export type IsArray<T> = T extends readonly unknown[] ? true : false; // TODO

// 2. Resolves to true if T extends Promise<any>, false otherwise.
export type IsPromise<T> = T extends PromiseLike<unknown> ? true : false; // TODO

// 3. If T is Promise<U>, resolve to U. Otherwise resolve to T (pass-through).
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T; // TODO

// 4. Remove null and undefined from T (reimplementation of NonNullable).
export type NonNullish<T> = T extends null | undefined ? never : T; // TODO

// 5. Generic conditional: if T extends U, produce Yes; otherwise No.
export type IfExtends<T, U, Yes, No> = T extends U ? Yes : No; // TODO

// 6. Basic syntax: resolves to "string" if T is assignable to string.
export type IsStringLabel<T> = `${T extends string ? "" : "not-"}string`; // TODO

// 7. Worked example: remove one array layer, otherwise pass T through.
export type Flatten<T> = T extends readonly (infer E)[] ? E : T; // TODO

// 8. Combining conditional types with keyof: keep only function-valued props.
export type FunctionProps<T> = {
  [K in keyof T as T[K] extends (..._: never) => unknown ? K : never]: T[K];
}; // TODO

// 9. The `{}` gotcha: `{}` accepts almost everything except null/undefined.
export type ExtendsEmptyObject<T> = [T] extends [{}] ? true : false; // TODO

// 10. Contrast with object, which excludes primitives.
export type ExtendsObject<T> = [T] extends [object] ? true : false; // TODO

// 11. Direct check from the lesson: `{}` itself extends object.
export type EmptyObjectExtendsObject = [{}] extends [object] ? true : false; // TODO

// 12. The `any` gotcha: `any` takes both conditional branches.
export type AnyBranch<T> = [T] extends [string]
  ? "string-branch"
  : "other-branch"; // TO

// 13. The direct `never` check: never is assignable to everything.
export type NeverExtendsString = true; // TODO

// 14. Tuple wrapping lets you detect never without distributive behavior.
export type IsNever<T> = [T] extends [never] ? true : false; // TODO

// 15. Conditional return mapping: useful as a reusable named type.
export type ParseValueReturn<T> = never; // TODO

// 16. Deferred conditional shape: concrete callers resolve this later.
export type WrapReturn<T> = never; // TODO

// --- Type test helpers -----------------------------------------------------
type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// --- Inline type tests -----------------------------------------------------

type _1a = Expect<Equal<IsArray<string[]>, true>>;
type _1b = Expect<Equal<IsArray<readonly number[]>, true>>;
type _1c = Expect<Equal<IsArray<readonly [1, 2]>, true>>;
type _1d = Expect<Equal<IsArray<string>, false>>;
type _1e = Expect<Equal<IsArray<{ length: number }>, false>>;
type _1f = Expect<Equal<IsArray<string[] | string>, boolean>>;

type _2a = Expect<Equal<IsPromise<Promise<string>>, true>>;
type _2b = Expect<Equal<IsPromise<Promise<void>>, true>>;
type _2c = Expect<Equal<IsPromise<string>, false>>;
type _2d = Expect<Equal<IsPromise<{ then: () => void }>, false>>;

type _3a = Expect<Equal<UnwrapPromise<Promise<string>>, string>>;
type _3b = Expect<Equal<UnwrapPromise<Promise<number[]>>, number[]>>;
type _3c = Expect<
  Equal<UnwrapPromise<Promise<Promise<string>>>, Promise<string>>
>;
type _3d = Expect<Equal<UnwrapPromise<string>, string>>;

type _4a = Expect<Equal<NonNullish<string | null>, string>>;
type _4b = Expect<Equal<NonNullish<string | undefined>, string>>;
type _4c = Expect<Equal<NonNullish<string | null | undefined>, string>>;
type _4d = Expect<Equal<NonNullish<null | undefined>, never>>;
type _4e = Expect<Equal<NonNullish<false | 0 | "">, false | 0 | "">>;

type _5a = Expect<Equal<IfExtends<string, string, "yes", "no">, "yes">>;
type _5b = Expect<Equal<IfExtends<number, string, "yes", "no">, "no">>;
type _5c = Expect<Equal<IfExtends<"hello", string, true, false>, true>>;
type _5d = Expect<
  Equal<IfExtends<{ id: 1 }, { id: number }, "yes", "no">, "yes">
>;
type _5e = Expect<
  Equal<IfExtends<string | number, string, "yes", "no">, "yes" | "no">
>;

type _6a = Expect<Equal<IsStringLabel<string>, "string">>;
type _6b = Expect<Equal<IsStringLabel<number>, "not-string">>;
type _6c = Expect<Equal<IsStringLabel<"literal">, "string">>;
type _6d = Expect<
  Equal<IsStringLabel<string | number>, "string" | "not-string">
>;

type _7a = Expect<Equal<Flatten<string[]>, string>>;
type _7b = Expect<Equal<Flatten<number>, number>>;
type _7c = Expect<Equal<Flatten<Array<Array<string>>>, Array<string>>>;
type _7d = Expect<Equal<Flatten<[1, 2, 3]>, 1 | 2 | 3>>;

type _FunctionPropsInput = {
  id: string;
  save: () => void;
  reset(): boolean;
  nested: { run: () => void };
};
type _8a = Expect<
  Equal<
    FunctionProps<_FunctionPropsInput>,
    { save: () => void; reset: () => boolean }
  >
>;
type _8b = Expect<Equal<FunctionProps<{ id: string; count: number }>, {}>>;

type _9a = Expect<Equal<ExtendsEmptyObject<string>, true>>;
type _9b = Expect<Equal<ExtendsEmptyObject<0>, true>>;
type _9c = Expect<Equal<ExtendsEmptyObject<null>, false>>;
type _9d = Expect<Equal<ExtendsEmptyObject<undefined>, false>>;
type _9e = Expect<Equal<ExtendsEmptyObject<string | null>, false>>;

type _10a = Expect<Equal<ExtendsObject<{ id: string }>, true>>;
type _10b = Expect<Equal<ExtendsObject<string>, false>>;
type _10c = Expect<Equal<ExtendsObject<string[]>, true>>;
type _10d = Expect<Equal<ExtendsObject<() => void>, true>>;

type _11a = Expect<Equal<EmptyObjectExtendsObject, true>>;

type _12a = Expect<Equal<AnyBranch<string>, "string-branch">>;
type _12b = Expect<Equal<AnyBranch<number>, "other-branch">>;
// type _12c = Expect<Equal<AnyBranch<any>, "string-branch" | "other-branch">>;
type _12d = Expect<Equal<AnyBranch<unknown>, "other-branch">>;

type _13a = Expect<Equal<NeverExtendsString, true>>;

type _14a = Expect<Equal<IsNever<never>, true>>;
type _14b = Expect<Equal<IsNever<string>, false>>;
type _14c = Expect<Equal<IsNever<string | never>, false>>;

type _15a = Expect<Equal<ParseValueReturn<string>, number>>;
type _15b = Expect<Equal<ParseValueReturn<number>, string>>;
type _15c = Expect<Equal<ParseValueReturn<boolean>, never>>;

type _16a = Expect<Equal<WrapReturn<string>, string[]>>;
type _16b = Expect<Equal<WrapReturn<number>, number[]>>;
type _16c = Expect<Equal<WrapReturn<string | number>, string[] | number[]>>;
