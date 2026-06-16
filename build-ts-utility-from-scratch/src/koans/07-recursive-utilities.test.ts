import type { Equal, Expect } from "../assertions";

/**
 * Koan 07: Recursive utilities
 *
 * Goal: build recursive utilities while noticing where recursion becomes costly.
 * Mental model: recursive conditional types repeatedly peel one structural layer.
 * Common trap: functions and primitives should usually be terminal cases, while
 * arrays and tuples need special handling if you care about readonly or position.
 * Stretch: add a depth counter to stop runaway recursion.
 */

type MyAwaited<T> = never;

type MyDeepReadonly<T> = never;

type MyDeepPartial<T> = never;

type MyFlatten<T> = never;

type Config = {
  service: {
    url: string;
    retries: number;
  };
  flags: {
    fast: boolean;
    safe: boolean;
  };
  onError: (message: string) => void;
};

type cases = [
  Expect<Equal<MyAwaited<Promise<Promise<string>>>, string>>,
  Expect<Equal<MyAwaited<string>, string>>,
  Expect<Equal<MyDeepReadonly<{ a: { b: string } }>, { readonly a: { readonly b: string } }>>,
  Expect<Equal<MyDeepPartial<Config>, {
    service?: {
      url?: string;
      retries?: number;
    };
    flags?: {
      fast?: boolean;
      safe?: boolean;
    };
    onError?: (message: string) => void;
  }>>,
  Expect<Equal<MyFlatten<readonly [1, readonly [2, readonly [3]], 4]>, readonly [1, 2, 3, 4]>>
];
