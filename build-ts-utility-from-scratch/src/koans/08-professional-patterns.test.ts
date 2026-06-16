import type { Equal, Expect, ExpectFalse, IsAny, IsNever, IsUnknown } from "../assertions";

/**
 * Koan 08: Professional patterns
 *
 * Goal: practice the edges that show up in production library and API typing.
 * Mental model: utility types are contracts with the compiler; sharp edges are
 * usually about distribution, modifiers, `any`, overloads, or structural excess.
 * Common trap: the most elegant alias is not always the most honest one. Prefer
 * predictable behavior around `any`, `never`, and overloaded call signatures.
 * Stretch: annotate each solved utility with a note about its failure mode.
 */

type MyIsAny<T> = never;

type MyIsNever<T> = never;

type MyIsUnknown<T> = never;

type MyNoDistribute<T> = never;

type MyOptionalKeys<T> = never;

type MyMutable<T> = never;

type MyUnionToIntersection<T> = never;

type MyOverloadReturn<T> = never;

type Model = {
  readonly id: string;
  name?: string;
  email: string | undefined;
};

type Overloaded = {
  (input: string): "string";
  (input: number): "number";
};

type cases = [
  Expect<Equal<MyIsAny<any>, true>>,
  Expect<Equal<MyIsAny<unknown>, false>>,
  Expect<Equal<MyIsNever<never>, true>>,
  Expect<Equal<MyIsUnknown<unknown>, true>>,
  Expect<Equal<MyNoDistribute<string | number>, false>>,
  Expect<Equal<MyOptionalKeys<Model>, "name">>,
  Expect<Equal<MyMutable<Model>, { id: string; name?: string; email: string | undefined }>>,
  Expect<Equal<MyUnionToIntersection<{ a: string } | { b: number }>, { a: string } & { b: number }>>,
  Expect<Equal<MyOverloadReturn<Overloaded>, "number">>,
  ExpectFalse<IsAny<unknown>>,
  Expect<IsNever<never>>,
  Expect<IsUnknown<unknown>>
];
