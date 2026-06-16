// Lesson 09 — Variance Deep Dive

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type Animal = { name: string };
type Dog = Animal & { breed: string };

// ─── Section 1: Variance-annotated wrappers ───────────────────────────────────

// 1. Covariant (read-only) wrapper — use the `out` annotation.
export interface ReadonlyBox<out T> {
  get: () => T;
}

type ReadonlyBox1 =
  ReadonlyBox<string> extends { get(): string } ? true : false;
type _ReadonlyBox1 = Expect<Equal<ReadonlyBox1, true>>;

type ReadonlyBox2 =
  ReadonlyBox<number> extends { get(): number } ? true : false;
type _ReadonlyBox2 = Expect<Equal<ReadonlyBox2, true>>;

// Covariance: Dog extends Animal → ReadonlyBox<Dog> extends ReadonlyBox<Animal>
type ReadonlyBox3 = ReadonlyBox<Dog> extends ReadonlyBox<Animal> ? true : false;
type _ReadonlyBox3 = Expect<Equal<ReadonlyBox3, true>>;

// 2. Contravariant (write-only) wrapper — use the `in` annotation.
export interface WriteOnlyBox<in T> {
  set: (v: T) => void;
}

type WriteOnlyBox1 =
  WriteOnlyBox<string> extends { set(x: string): void } ? true : false;
type _WriteOnlyBox1 = Expect<Equal<WriteOnlyBox1, true>>;

type WriteOnlyBox2 =
  WriteOnlyBox<number> extends { set(x: number): void } ? true : false;
type _WriteOnlyBox2 = Expect<Equal<WriteOnlyBox2, true>>;

// Contravariance: Animal is wider than Dog → WriteOnlyBox<Animal> extends WriteOnlyBox<Dog>
// (A box that accepts any Animal can certainly accept a Dog.)
type WriteOnlyBox3 =
  WriteOnlyBox<Animal> extends WriteOnlyBox<Dog> ? true : false;
type _WriteOnlyBox3 = Expect<Equal<WriteOnlyBox3, true>>;

// 3. Invariant (read + write) wrapper — use `in out`.
export interface InvariantBox<in out T> {
  get: () => T;
  set: (_: T) => void;
}

type InvariantBox1 =
  InvariantBox<string> extends { get(): string } ? true : false;
type _InvariantBox1 = Expect<Equal<InvariantBox1, true>>;

type InvariantBox2 =
  InvariantBox<string> extends { set(x: string): void } ? true : false;
type _InvariantBox2 = Expect<Equal<InvariantBox2, true>>;

// Invariance: neither direction is assignable when T differs.
type InvariantBox3 =
  InvariantBox<Dog> extends InvariantBox<Animal> ? true : false;
type _InvariantBox3 = Expect<Equal<InvariantBox3, false>>;

// 4. If F<T1> extends F<T2>, resolve to true; otherwise false.
//    (Useful for verifying covariance at the type level.)
export type CheckCovariant<
  F extends <T>(x: T) => unknown,
  T1 extends T2,
  T2,
> = [F, F] extends [(x: T1) => unknown, (x: T2) => unknown] ? true : false; // TODO

// (CheckCovariant's higher-kinded signature is hard to drive with type-level tests;
//  verify behavior at the call site rather than with Expect assertions.)

// 5. Extract the intersection of parameter types via contravariant infer.
//    Given { a: (x: infer U) => void; b: (x: infer U) => void }, extract U.
export type IntersectParams<T> =
  T extends Record<string, (x: infer U) => void> ? U : never; // TODO

type IntersectParams1 = IntersectParams<{
  a: (x: { x: number }) => void;
  b: (x: { y: string }) => void;
}>;
type _IntersectParams1 = Expect<
  Equal<IntersectParams1, { x: number } & { y: string }>
>;

type IntersectParams2 = IntersectParams<{
  a: (x: string) => void;
  b: (x: string) => void;
}>;
type _IntersectParams2 = Expect<Equal<IntersectParams2, string>>;

type IntersectParams3 = IntersectParams<string>;
type _IntersectParams3 = Expect<Equal<IntersectParams3, never>>;

// ─── Section 2: Extended variance exercises ───────────────────────────────────

// 6. Produce `true` if A extends B, `false` otherwise.
export type IsSubtype<A, B> = A extends B ? true : false; // TODO

type IsSubtype1 = IsSubtype<Dog, Animal>;
type _IsSubtype1 = Expect<Equal<IsSubtype1, true>>;

type IsSubtype2 = IsSubtype<string, string>;
type _IsSubtype2 = Expect<Equal<IsSubtype2, true>>;

type IsSubtype3 = IsSubtype<Animal, Dog>;
type _IsSubtype3 = Expect<Equal<IsSubtype3, false>>;

// 7. Produce the covariant (return-position) wrapper for T: `() => T`.
export type WrapReturn<T> = () => T; // TODO

type WrapReturn1 = WrapReturn<string>;
type _WrapReturn1 = Expect<Equal<WrapReturn1, () => string>>;

type WrapReturn2 = WrapReturn<number[]>;
type _WrapReturn2 = Expect<Equal<WrapReturn2, () => number[]>>;

// Covariance in return position: WrapReturn<Dog> extends WrapReturn<Animal>
type WrapReturn3 = WrapReturn<Dog> extends WrapReturn<Animal> ? true : false;
type _WrapReturn3 = Expect<Equal<WrapReturn3, true>>;

// 8. Produce the contravariant (parameter-position) wrapper for T: `(x: T) => void`.
export type WrapParam<T> = (_: T) => void; // TODO

type WrapParam1 = WrapParam<string>;
type _WrapParam1 = Expect<Equal<WrapParam1, (x: string) => void>>;

type WrapParam2 = WrapParam<number>;
type _WrapParam2 = Expect<Equal<WrapParam2, (x: number) => void>>;

// Contravariance in parameter position: WrapParam<Animal> extends WrapParam<Dog>
type WrapParam3 = WrapParam<Animal> extends WrapParam<Dog> ? true : false;
type _WrapParam3 = Expect<Equal<WrapParam3, true>>;

// 9. If F is `(x: A) => B`, produce `(x: B) => A` (swap param ↔ return); otherwise never.
export type FlipFn<F> = F extends (x: infer T) => infer R ? (x: R) => T : never; // TODO

type FlipFn1 = FlipFn<(x: string) => number>;
type _FlipFn1 = Expect<Equal<FlipFn1, (x: number) => string>>;

type FlipFn2 = FlipFn<(x: boolean) => void>;
type _FlipFn2 = Expect<Equal<FlipFn2, (x: void) => boolean>>;

type FlipFn3 = FlipFn<string>;
type _FlipFn3 = Expect<Equal<FlipFn3, never>>;

// 10. If T matches `{ f: () => infer U; g: () => infer U }`, extract U.
//     Both positions are covariant (return), so TypeScript unifies to U | U → union.
export type InferFromReturns<T> = T extends { [K: string]: () => infer U }
  ? U
  : never;

type InferFromReturns1 = InferFromReturns<{ f: () => string; g: () => number }>;
type _InferFromReturns1 = Expect<Equal<InferFromReturns1, string | number>>;

type InferFromReturns2 = InferFromReturns<{
  f: () => boolean;
  g: () => boolean;
}>;
type _InferFromReturns2 = Expect<Equal<InferFromReturns2, boolean>>;

type InferFromReturns3 = InferFromReturns<string>;
type _InferFromReturns3 = Expect<Equal<InferFromReturns3, never>>;

// 11. If T matches `{ f: (x: infer U) => void; g: (x: infer U) => void }`, extract U.
//     Both positions are contravariant (param), so TypeScript unifies to U & U → intersection.
export type InferFromParams<T> = T extends {
  [K: string]: (_: infer Arg) => unknown;
}
  ? Arg
  : never; // TODO

type InferFromParams1 = InferFromParams<{
  f: (x: { a: string }) => void;
  g: (x: { b: number }) => void;
}>;
type _InferFromParams1 = Expect<
  Equal<InferFromParams1, { a: string } & { b: number }>
>;

type InferFromParams2 = InferFromParams<{
  f: (x: string) => void;
  g: (x: string) => void;
}>;
type _InferFromParams2 = Expect<Equal<InferFromParams2, string>>;

type InferFromParams3 = InferFromParams<string>;
type _InferFromParams3 = Expect<Equal<InferFromParams3, never>>;

// 12. Map each property of T from type V to `() => V` (producer / covariant mapping).
export type MapToProducers<T> = { [K in keyof T]: () => T[K] }; // TODO

type MapToProducers1 = MapToProducers<{ x: string; y: number }>;
type _MapToProducers1 = Expect<
  Equal<MapToProducers1, { x: () => string; y: () => number }>
>;

type MapToProducers2 = MapToProducers<{ flag: boolean }>;
type _MapToProducers2 = Expect<Equal<MapToProducers2, { flag: () => boolean }>>;

type MapToProducers3 = MapToProducers<{}>;
type _MapToProducers3 = Expect<Equal<MapToProducers3, {}>>;

// 13. Map each property of T from type V to `(x: V) => void` (consumer / contravariant mapping).
export type MapToConsumers<T> = { [K in keyof T]: (_: T[K]) => void }; // TODO

type MapToConsumers1 = MapToConsumers<{ x: string; y: number }>;
type _MapToConsumers1 = Expect<
  Equal<MapToConsumers1, { x: (x: string) => void; y: (x: number) => void }>
>;

type MapToConsumers2 = MapToConsumers<{ flag: boolean }>;
type _MapToConsumers2 = Expect<
  Equal<MapToConsumers2, { flag: (x: boolean) => void }>
>;

type MapToConsumers3 = MapToConsumers<{}>;
type _MapToConsumers3 = Expect<Equal<MapToConsumers3, {}>>;

// 14. true if `() => A` extends `() => B`; false otherwise.
//     Tests covariance in return position without depending on ReadonlyBox being implemented.
export type IsReturnCovariant<A, B> = (() => A) extends () => B ? true : false; // TODO

type IsReturnCovariant1 = IsReturnCovariant<Dog, Animal>;
type _IsReturnCovariant1 = Expect<Equal<IsReturnCovariant1, true>>;

type IsReturnCovariant2 = IsReturnCovariant<Animal, Dog>;
type _IsReturnCovariant2 = Expect<Equal<IsReturnCovariant2, false>>;

type IsReturnCovariant3 = IsReturnCovariant<string, string>;
type _IsReturnCovariant3 = Expect<Equal<IsReturnCovariant3, true>>;

// 15. true if `(x: A) => void` extends `(x: B) => void`; false otherwise.
//     Tests contravariance in parameter position: a wider-param function is a subtype.
export type IsParamContravariant<A, B> = ((_: A) => void) extends (_: B) => void
  ? true
  : false; // TODO

type IsParamContravariant1 = IsParamContravariant<Animal, Dog>;
type _IsParamContravariant1 = Expect<Equal<IsParamContravariant1, true>>;

type IsParamContravariant2 = IsParamContravariant<Dog, Animal>;
type _IsParamContravariant2 = Expect<Equal<IsParamContravariant2, false>>;

type IsParamContravariant3 = IsParamContravariant<string, string>;
type _IsParamContravariant3 = Expect<Equal<IsParamContravariant3, true>>;

// 16. If F is `(x: A) => B` and G is `(x: B) => C`, compose them into `(x: A) => C`; otherwise never.
export type ComposeFn<F, G> = F extends (a: infer A) => unknown
  ? G extends (_: never) => infer R
    ? (a: A) => R
    : never
  : never; // TODO

type ComposeFn1 = ComposeFn<(x: string) => number, (x: number) => boolean>;
type _ComposeFn1 = Expect<Equal<ComposeFn1, (x: string) => boolean>>;

type ComposeFn2 = ComposeFn<(x: boolean) => void, (x: void) => string>;
type _ComposeFn2 = Expect<Equal<ComposeFn2, (x: boolean) => string>>;

type ComposeFn3 = ComposeFn<string, number>;
type _ComposeFn3 = Expect<Equal<ComposeFn3, never>>;

// 17. If T extends ReadonlyBox<infer U>, extract U; otherwise never.
//     (Depends on exercise 1 being implemented first.)
export type UnboxReadonly<T> = T extends ReadonlyBox<infer U> ? U : never; // TODO

type UnboxReadonly1 = UnboxReadonly<ReadonlyBox<string>>;
type _UnboxReadonly1 = Expect<Equal<UnboxReadonly1, string>>;

type UnboxReadonly2 = UnboxReadonly<ReadonlyBox<Dog>>;
type _UnboxReadonly2 = Expect<Equal<UnboxReadonly2, Dog>>;

type UnboxReadonly3 = UnboxReadonly<string>;
type _UnboxReadonly3 = Expect<Equal<UnboxReadonly3, never>>;

// 18. Given T, produce the tuple `[() => T, (x: T) => void]` (producer + consumer pair).
export type ProducerConsumerPair<T> = [() => T, (v: T) => void];

type ProducerConsumerPair1 = ProducerConsumerPair<string>;
type _ProducerConsumerPair1 = Expect<
  Equal<ProducerConsumerPair1, [() => string, (x: string) => void]>
>;

type ProducerConsumerPair2 = ProducerConsumerPair<number>;
type _ProducerConsumerPair2 = Expect<
  Equal<ProducerConsumerPair2, [() => number, (x: number) => void]>
>;

type ProducerConsumerPair3 = ProducerConsumerPair<Animal>;
type _ProducerConsumerPair3 = Expect<
  Equal<ProducerConsumerPair3, [() => Animal, (x: Animal) => void]>
>;

// 19. true if function type F extends function type G; false otherwise.
export type FunctionExtends<F, G> = F extends Function
  ? F extends G
    ? true
    : false
  : false; // TODO

// Contravariant params: HandleAnimal extends HandleDog (wider param = subtype function)
type FunctionExtends1 = FunctionExtends<(x: Animal) => void, (x: Dog) => void>;
type _FunctionExtends1 = Expect<Equal<FunctionExtends1, true>>;

// Covariant return: GetDog extends GetAnimal
type FunctionExtends2 = FunctionExtends<() => Dog, () => Animal>;
type _FunctionExtends2 = Expect<Equal<FunctionExtends2, true>>;

// Narrower param does NOT extend wider-param function
type FunctionExtends3 = FunctionExtends<(x: Dog) => void, (x: Animal) => void>;
type _FunctionExtends3 = Expect<Equal<FunctionExtends3, false>>;

// 20. Given two function types F and G (each `(x: _) => void`),
//     extract the intersection of their first parameter types.
//     Hint: unify them into a single object and apply IntersectParams.
export type IntersectParamTypes<F, G> = IntersectParams<{ f: F; g: G }>; // TODO

type IntersectParamTypes1 = IntersectParamTypes<
  (x: { a: string }) => void,
  (x: { b: number }) => void
>;
type _IntersectParamTypes1 = Expect<
  Equal<IntersectParamTypes1, { a: string } & { b: number }>
>;

type IntersectParamTypes2 = IntersectParamTypes<
  (x: string) => void,
  (x: string) => void
>;
type _IntersectParamTypes2 = Expect<Equal<IntersectParamTypes2, string>>;

type IntersectParamTypes3 = IntersectParamTypes<string, number>;
type _IntersectParamTypes3 = Expect<Equal<IntersectParamTypes3, never>>;
