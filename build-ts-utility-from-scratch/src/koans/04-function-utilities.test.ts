import type { Equal, Expect } from "../assertions";

/**
 * Koan 04: Function utilities
 *
 * Goal: use `infer` to pull information out of call and construct signatures.
 * Mental model: function utility types are pattern matches over callable shapes.
 * Common trap: overloaded function types expose the last signature to conditional
 * inference, not a union of every overload.
 * Stretch: compare `this` parameters with ordinary first parameters; TypeScript
 * models them separately.
 */

type MyParameters<T extends (...args: any[]) => unknown> = never;

type MyReturnType<T extends (...args: any[]) => unknown> = never;

type MyConstructorParameters<T extends abstract new (...args: any[]) => unknown> = never;

type MyInstanceType<T extends abstract new (...args: any[]) => unknown> = never;

type MyThisParameterType<T> = never;

type MyOmitThisParameter<T> = never;

type Fn = (id: string, count: number) => Promise<boolean>;

class Box {
  constructor(readonly value: string, readonly size: number) {}
}

type WithThis = (this: { traceId: string }, message: string) => number;

type cases = [
  Expect<Equal<MyParameters<Fn>, [id: string, count: number]>>,
  Expect<Equal<MyReturnType<Fn>, Promise<boolean>>>,
  Expect<Equal<MyConstructorParameters<typeof Box>, [value: string, size: number]>>,
  Expect<Equal<MyInstanceType<typeof Box>, Box>>,
  Expect<Equal<MyThisParameterType<WithThis>, { traceId: string }>>,
  Expect<Equal<MyOmitThisParameter<WithThis>, (message: string) => number>>
];
