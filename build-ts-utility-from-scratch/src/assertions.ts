/**
 * Shared type-level test helpers for the koans.
 *
 * `Expect<Equal<A, B>>` is the main assertion vocabulary:
 * if `Equal<A, B>` is not exactly `true`, TypeScript reports an error.
 *
 * Caveats worth remembering professionally:
 * - `any` is intentionally weird. It behaves like both top and bottom in many
 *   relations, so use `IsAny` when the distinction matters.
 * - `never` disappears from unions and distributes through naked conditional
 *   types, so use tuple wrapping (`[T] extends [U]`) when you need exact checks.
 * - Object equality here is structural, like TypeScript itself. It does not
 *   encode nominal identity, declaration origin, or runtime behavior.
 */
export type Expect<T extends true> = T;

export type ExpectFalse<T extends false> = T;

export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

export type Not<T extends boolean> = T extends true ? false : true;

export type Extends<A, B> = [A] extends [B] ? true : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type IsUnknown<T> =
  IsAny<T> extends true
    ? false
    : unknown extends T
      ? [keyof T] extends [never]
        ? true
        : false
      : false;
