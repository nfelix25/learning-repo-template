import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — GENERICS AS TYPE FUNCTIONS
// Koan 1 of 5: Generics are type-level lambda expressions
// ═══════════════════════════════════════════════════════════════════════════
//
// Lambda calculus is the mathematical theory of functions.
// In lambda notation, a function that maps x to x+1 is written:
//
//   λx. x + 1
//
// TypeScript's generic type aliases are EXACTLY this — type-level lambdas:
//
//   type Box<T> = { value: T }
//
// Read as: λT. { value: T }
//
// TYPE APPLICATION: applying the function to an argument:
//
//   Box<string>   ≡   (λT. { value: T })(string)  =  { value: string }
//
// Everything you know about functions applies here:
//   • Generics are functions from types to types
//   • Type application is function application
//   • Constraints (<T extends U>) are domain restrictions
//   • Higher-kinded types are functions from type-functions to types
//
// ───────────────────────────────────────────────────────────────────────────
// FUNCTIONS VS VALUES
// ───────────────────────────────────────────────────────────────────────────
//
//   VALUE LEVEL              TYPE LEVEL
//   ─────────────────────    ────────────────────────────
//   function f(x) { ... }    type F<T> = ...
//   f(42)                    F<number>
//   const g = x => x         type Identity<T> = T
//   compose(f, g)            (hard in TS, but approximable)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Apply Box<T> = { value: T } to string.
type Box<T> = { value: T };
type BoxedString = Box<string>;

type _test1 = Expect<Equal<BoxedString, { value: string }>>;

// 2. The identity function: λT. T
type Identity<T> = T;

type _test2 = Expect<Equal<Identity<string>, string>>;
type _test3 = Expect<Equal<Identity<42>, 42>>;
type _test4 = Expect<Equal<Identity<never>, never>>;

// 3. The constant function: λA. λB. A   (returns first argument, ignores second)
//    In TypeScript, we can approximate this:
type Const<A> = { readonly _A: A };
//   (Full higher-kinded application isn't directly supported, but we can
//   represent the idea. We'll return to this limitation in koan 05.)

// 4. Compose two type functions — apply F then G.
//    The composition: λT. G<F<T>>
type Compose<T, F extends { _: unknown }, G extends { _: unknown }> = never;
//   Note: true higher-kinded types (HKTs) aren't directly supported in TypeScript.
//   The koan below shows what IS possible.

// 4b. In practice, we compose by nesting:
type ArrayOfBoxes<T> = Array<Box<T>>;
type Applied = ArrayOfBoxes<number>;

type _test5 = Expect<Equal<Applied, { value: number }[]>>;
//   What does Array<Box<number>> expand to?

// 5. Type functions can return type functions (currying, sort of).
//    This is limited in TS, but we can approximate it:
type Pair<A, B> = [A, B];
type PairWithString<B> = Pair<string, B>;

type _test6 = Expect<Equal<PairWithString<number>, [string, number]>>;
type _test7 = Expect<Equal<PairWithString<boolean>, [string, boolean]>>;

// 6. CHALLENGE: Build Apply — apply a "type constructor" (1-arg generic) to T.
//    TypeScript doesn't have first-class type functions, but we can encode
//    them as interfaces and use conditional types to "call" them.
//
//    This encoding is the basis of higher-kinded type libraries like fp-ts.
//
// Step 1: Define a "type constructor registry" interface
interface TypeConstructors {
  array: unknown; // will hold the result of Array<T>
  readonly: unknown; // will hold the result of Readonly<T>
}

// Step 2: Define the "call" operation
type Apply<F extends keyof TypeConstructors, T> = F extends "array"
  ? Array<T>
  : F extends "readonly"
    ? Readonly<T>
    : never;

type _test8 = Expect<Equal<Apply<"array", string>, string[]>>;
type _test9 = Expect<
  Equal<Apply<"readonly", { a: number }>, Readonly<{ a: number }>>
>;

export {};
