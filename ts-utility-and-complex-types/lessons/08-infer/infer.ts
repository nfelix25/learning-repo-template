// Lesson 08 — infer

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// 1. If T is an array, extract the element type; otherwise never.
export type ElementType<T> = T extends readonly (infer E)[] ? E : T; // TODO

type ElementType1 = ElementType<string[]>;
type _ElementType1 = Expect<Equal<ElementType1, string>>;

type ElementType2 = ElementType<number[]>;
type _ElementType2 = Expect<Equal<ElementType2, number>>;

type ElementType3 = ElementType<boolean>;
type _ElementType3 = Expect<Equal<ElementType3, boolean>>;

// 2. If T is a function, extract its return type; otherwise never.
export type FunctionReturn<T> = T extends (...args: never) => infer R
  ? R
  : never; // TODO

type FunctionReturn1 = FunctionReturn<() => string>;
type _FunctionReturn1 = Expect<Equal<FunctionReturn1, string>>;

type FunctionReturn2 = FunctionReturn<(x: number) => boolean>;
type _FunctionReturn2 = Expect<Equal<FunctionReturn2, boolean>>;

type FunctionReturn3 = FunctionReturn<string>;
type _FunctionReturn3 = Expect<Equal<FunctionReturn3, never>>;

// 3. If T is a function, extract its parameter tuple; otherwise never.
export type FunctionParams<T> = T extends (...args: infer Args) => unknown
  ? Args
  : never; // TODO

type FunctionParams1 = FunctionParams<(a: string, b: number) => void>;
type _FunctionParams1 = Expect<Equal<FunctionParams1, [string, number]>>;

type FunctionParams2 = FunctionParams<() => void>;
type _FunctionParams2 = Expect<Equal<FunctionParams2, []>>;

type FunctionParams3 = FunctionParams<number>;
type _FunctionParams3 = Expect<Equal<FunctionParams3, never>>;

// 4. If T is Promise<U>, extract U (one level only); otherwise never.
export type PromiseValue<T> = T extends PromiseLike<infer P> ? P : never; // TODO

type PromiseValue1 = PromiseValue<Promise<string>>;
type _PromiseValue1 = Expect<Equal<PromiseValue1, string>>;

type PromiseValue2 = PromiseValue<Promise<number[]>>;
type _PromiseValue2 = Expect<Equal<PromiseValue2, number[]>>;

type PromiseValue3 = PromiseValue<string>;
type _PromiseValue3 = Expect<Equal<PromiseValue3, never>>;

// 5. If T is a function, extract its first parameter type; otherwise never.
export type FirstArgument<T> = T extends (...args: infer Args) => unknown
  ? Args extends [infer First, ...unknown[]]
    ? First
    : never
  : never; // TODO

type FirstArgument1 = FirstArgument<(a: string, b: number) => void>;
type _FirstArgument1 = Expect<Equal<FirstArgument1, string>>;

type FirstArgument2 = FirstArgument<(x: boolean) => void>;
type _FirstArgument2 = Expect<Equal<FirstArgument2, boolean>>;

type FirstArgument3 = FirstArgument<() => void>;
type _FirstArgument3 = Expect<Equal<FirstArgument3, never>>;

// 6. If T is a function, extract its last parameter type; otherwise never.
export type LastArgument<T> = T extends (...args: infer Args) => void
  ? Args extends [...unknown[], infer Last]
    ? Last
    : never
  : never; // TODO

type LastArgument1 = LastArgument<(a: string, b: number) => void>;
type _LastArgument1 = Expect<Equal<LastArgument1, number>>;

type LastArgument2 = LastArgument<(x: boolean) => void>;
type _LastArgument2 = Expect<Equal<LastArgument2, boolean>>;

type LastArgument3 = LastArgument<() => void>;
type _LastArgument3 = Expect<Equal<LastArgument3, never>>;

// 7. If T is a constructor (new(...args: any[]) => any), extract its instance type; otherwise never.
export type InstanceOf<T> = T extends abstract new (...args: any[]) => infer U
  ? U
  : never; // TODO

class Foo {
  x: number = 0;
}
class Bar {
  name: string = "";
}

type InstanceOf1 = InstanceOf<typeof Foo>;
type _InstanceOf1 = Expect<Equal<InstanceOf1, Foo>>;

type InstanceOf2 = InstanceOf<typeof Bar>;
type _InstanceOf2 = Expect<Equal<InstanceOf2, Bar>>;

type InstanceOf3 = InstanceOf<string>;
type _InstanceOf3 = Expect<Equal<InstanceOf3, never>>;

// 8. If T is a Promise<U>, unwrap recursively until U is no longer a Promise; otherwise T.
export type DeepPromiseValue<T> =
  T extends PromiseLike<infer U> ? DeepPromiseValue<U> : T; // TODO

type DeepPromiseValue1 = DeepPromiseValue<Promise<string>>;
type _DeepPromiseValue1 = Expect<Equal<DeepPromiseValue1, string>>;

type DeepPromiseValue2 = DeepPromiseValue<Promise<Promise<number>>>;
type _DeepPromiseValue2 = Expect<Equal<DeepPromiseValue2, number>>;

type DeepPromiseValue3 = DeepPromiseValue<string>;
type _DeepPromiseValue3 = Expect<Equal<DeepPromiseValue3, string>>;

// 9. If T is a readonly array, extract the element type; otherwise never.
export type ReadonlyElementType<T> = T extends readonly (infer E)[]
  ? T extends E[]
    ? never
    : E
  : never; // TODO

type ReadonlyElementType1 = ReadonlyElementType<readonly string[]>;
type _ReadonlyElementType1 = Expect<Equal<ReadonlyElementType1, string>>;

type ReadonlyElementType2 = ReadonlyElementType<readonly [1, 2, 3]>;
type _ReadonlyElementType2 = Expect<Equal<ReadonlyElementType2, 1 | 2 | 3>>;

type ReadonlyElementType3 = ReadonlyElementType<string[]>;
type _ReadonlyElementType3 = Expect<Equal<ReadonlyElementType3, never>>;

// 10. If T is a function, extract its second parameter type; otherwise never.
export type SecondArgument<T> = T extends (...args: infer Args) => unknown
  ? Args extends [unknown, infer Arg, ...unknown[]]
    ? Arg
    : never
  : never; // TODO

type SecondArgument1 = SecondArgument<(a: string, b: number) => void>;
type _SecondArgument1 = Expect<Equal<SecondArgument1, number>>;

type SecondArgument2 = SecondArgument<
  (a: boolean, b: string, c: number) => void
>;
type _SecondArgument2 = Expect<Equal<SecondArgument2, string>>;

type SecondArgument3 = SecondArgument<(a: string) => void>;
type _SecondArgument3 = Expect<Equal<SecondArgument3, never>>;

// 11. If T is a Map<K, V>, extract K; otherwise never.
export type MapKey<T> = T extends Map<infer K, unknown> ? K : never; // TODO

type MapKey1 = MapKey<Map<string, number>>;
type _MapKey1 = Expect<Equal<MapKey1, string>>;

type MapKey2 = MapKey<Map<symbol, boolean>>;
type _MapKey2 = Expect<Equal<MapKey2, symbol>>;

type MapKey3 = MapKey<Set<string>>;
type _MapKey3 = Expect<Equal<MapKey3, never>>;

// 12. If T is a Map<K, V>, extract V; otherwise never.
export type MapValue<T> = T extends Map<unknown, infer V> ? V : never; // TODO

type MapValue1 = MapValue<Map<string, number>>;
type _MapValue1 = Expect<Equal<MapValue1, number>>;

type MapValue2 = MapValue<Map<symbol, boolean[]>>;
type _MapValue2 = Expect<Equal<MapValue2, boolean[]>>;

type MapValue3 = MapValue<WeakMap<object, string>>;
type _MapValue3 = Expect<Equal<MapValue3, never>>;

// 13. If T is an object with a property 'then' that is a function (i.e. a thenable), extract
//     the type of the first argument passed to that 'then' callback; otherwise never.
//     (Hint: a thenable has shape { then: (onfulfilled: (value: infer U) => any) => any })
export type ThenableValue<T> = T extends {
  then: (cb: (a: infer Arg) => unknown) => unknown;
}
  ? Arg
  : never; // TODO

type ThenableValue1 = ThenableValue<{
  then: (cb: (v: string) => void) => void;
}>;
type _ThenableValue1 = Expect<Equal<ThenableValue1, string>>;

type ThenableValue2 = ThenableValue<{
  then: (cb: (v: number[]) => void) => void;
}>;
type _ThenableValue2 = Expect<Equal<ThenableValue2, number[]>>;

type ThenableValue3 = ThenableValue<string>;
type _ThenableValue3 = Expect<Equal<ThenableValue3, never>>;

// 14. If T is a function that returns a Promise, extract the resolved value type; otherwise never.
export type AsyncReturnType<T> = T extends (
  ...args: never[]
) => Promise<infer U>
  ? U
  : never; // TODO

type AsyncReturnType1 = AsyncReturnType<() => Promise<string>>;
type _AsyncReturnType1 = Expect<Equal<AsyncReturnType1, string>>;

type AsyncReturnType2 = AsyncReturnType<(id: number) => Promise<boolean[]>>;
type _AsyncReturnType2 = Expect<Equal<AsyncReturnType2, boolean[]>>;

type AsyncReturnType3 = AsyncReturnType<() => string>;
type _AsyncReturnType3 = Expect<Equal<AsyncReturnType3, never>>;

// 15. If T is a tuple of length ≥ 1, extract the type of its first element; otherwise never.
export type Head<T> = T extends [infer First, ...unknown[]] ? First : never; // TODO

type Head1 = Head<[string, number, boolean]>;
type _Head1 = Expect<Equal<Head1, string>>;

type Head2 = Head<[42]>;
type _Head2 = Expect<Equal<Head2, 42>>;

type Head3 = Head<[]>;
type _Head3 = Expect<Equal<Head3, never>>;

// 16. If T is a tuple of length ≥ 1, extract a tuple of all elements except the first; otherwise never.
export type Tail<T> = T extends [unknown, ...infer Tail] ? Tail : never; // TODO

type Tail1 = Tail<[string, number, boolean]>;
type _Tail1 = Expect<Equal<Tail1, [number, boolean]>>;

type Tail2 = Tail<[string]>;
type _Tail2 = Expect<Equal<Tail2, []>>;

type Tail3 = Tail<[]>;
type _Tail3 = Expect<Equal<Tail3, never>>;

// 17. If T is a string literal matching `${infer Prefix}_${infer Suffix}`, extract Prefix; otherwise never.
export type BeforeUnderscore<T> = T extends `${infer Prefix}_${string}`
  ? Prefix
  : never; // TODO

type BeforeUnderscore1 = BeforeUnderscore<"hello_world">;
type _BeforeUnderscore1 = Expect<Equal<BeforeUnderscore1, "hello">>;

type BeforeUnderscore2 = BeforeUnderscore<"foo_bar_baz">;
type _BeforeUnderscore2 = Expect<Equal<BeforeUnderscore2, "foo">>;

type BeforeUnderscore3 = BeforeUnderscore<"nounderscore">;
type _BeforeUnderscore3 = Expect<Equal<BeforeUnderscore3, never>>;

// 18. If T is a string literal matching `${infer Prefix}_${infer Suffix}`, extract Suffix; otherwise never.
export type AfterUnderscore<T> = T extends `${string}_${infer Suffix}`
  ? Suffix
  : never; // TODO

type AfterUnderscore1 = AfterUnderscore<"hello_world">;
type _AfterUnderscore1 = Expect<Equal<AfterUnderscore1, "world">>;

type AfterUnderscore2 = AfterUnderscore<"foo_bar_baz">;
type _AfterUnderscore2 = Expect<Equal<AfterUnderscore2, "bar_baz">>;

type AfterUnderscore3 = AfterUnderscore<"nounderscore">;
type _AfterUnderscore3 = Expect<Equal<AfterUnderscore3, never>>;

// 19. If T is a Set<U>, extract U; otherwise never.
export type SetElement<T> = T extends Set<infer U> ? U : never; // TODO

type SetElement1 = SetElement<Set<string>>;
type _SetElement1 = Expect<Equal<SetElement1, string>>;

type SetElement2 = SetElement<Set<number | boolean>>;
type _SetElement2 = Expect<Equal<SetElement2, number | boolean>>;

type SetElement3 = SetElement<Map<string, number>>;
type _SetElement3 = Expect<Equal<SetElement3, never>>;

// 20. Given a function type T, produce a new function type with the same parameters but whose
//     return type is wrapped in Promise. If T is not a function, produce never.
//     (Hint: use infer on both the params and the return, then reconstruct)
export type Promisify<T> = T extends (...args: infer Args) => infer R
  ? (...args: Args) => Promise<R>
  : never; // TODO

type Promisify1 = Promisify<(a: string) => number>;
type _Promisify1 = Expect<Equal<Promisify1, (a: string) => Promise<number>>>;

type Promisify2 = Promisify<() => void>;
type _Promisify2 = Expect<Equal<Promisify2, () => Promise<void>>>;

type Promisify3 = Promisify<string>;
type _Promisify3 = Expect<Equal<Promisify3, never>>;
