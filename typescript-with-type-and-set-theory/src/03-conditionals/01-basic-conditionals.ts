import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — CONDITIONAL TYPES
// Koan 1 of 5: Basic conditional types
// ═══════════════════════════════════════════════════════════════════════════
//
// A CONDITIONAL TYPE is a type-level ternary expression:
//
//   A extends B ? X : Y
//
// Read it as: "If A is a subtype of B (A ⊆ B), yield X; otherwise yield Y."
//
// This is the type system equivalent of an if/else — but evaluated at
// COMPILE TIME, on types rather than values.
//
//   type IsString<T> = T extends string ? true : false
//   type R1 = IsString<"hello">  // → true   ("hello" ⊆ string)
//   type R2 = IsString<number>   // → false  (number ⊄ string)
//
// ───────────────────────────────────────────────────────────────────────────
// EARLY EVALUATION vs DEFERRED EVALUATION
// ───────────────────────────────────────────────────────────────────────────
//
// When A is a CONCRETE type (not a generic parameter), TypeScript evaluates
// the conditional immediately:
//
//   "cat" extends string ? "yes" : "no"   → "yes"  (evaluated now)
//
// When A is an UNRESOLVED generic parameter T, evaluation is DEFERRED
// until T is applied. This distinction matters for distributivity (next koan).
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Evaluate these concrete conditionals.
type C1 = "cat" extends string ? "yes" : "no";
type C2 = number extends string ? "yes" : "no";
type C3 = never extends string ? "yes" : "no";
type C4 = string extends unknown ? "yes" : "no";

type _test1 = Expect<Equal<C1, "yes">>;
type _test2 = Expect<Equal<C2, "no">>;
type _test3 = Expect<Equal<C3, "yes">>;
//   Recall: never extends anything — but `never extends X ? A : B` distributes
//   to an empty union, giving `never` (not the true branch).
type _test4 = Expect<Equal<C4, "yes">>;

// 2. Build IsString — a type-level predicate.
type IsString<T> = T extends string ? true : false;
//   → true if T extends string, false otherwise

type _test5 = Expect<Equal<IsString<"hello">, true>>;
type _test6 = Expect<Equal<IsString<number>, false>>;
type _test7 = Expect<Equal<IsString<string>, true>>;

// 3. Build IsNever — detecting the bottom type.
//    Careful: the naive `T extends never ? true : false` doesn't work —
//    it distributes over never, giving never instead of true.
//    Wrap T to prevent distribution:
type IsNever<T> = (T extends unknown ? 1 : 1) extends never ? true : false;
//   Hint: [T] extends [never] ? true : false

type _test8 = Expect<Equal<IsNever<never>, true>>;
type _test9 = Expect<Equal<IsNever<string>, false>>;
type _test10 = Expect<Equal<IsNever<0>, false>>;

// 4. Build IsUnknown — detecting the top type.
type IsUnknown<T> = unknown extends T
  ? Equal<any, T> extends true
    ? false
    : true
  : false;
//   Hint: unknown extends T (the universal set ⊆ T) is only true when T = unknown.

type _test11 = Expect<Equal<IsUnknown<unknown>, true>>;
type _test12 = Expect<Equal<IsUnknown<string>, false>>;
type _test13 = Expect<Equal<IsUnknown<any>, false>>;

// 5. Conditional types can be chained (like else-if).
type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends null
        ? "null"
        : T extends undefined
          ? "undefined"
          : "other";

type _test14 = Expect<Equal<TypeName<"hello">, "string">>;
type _test15 = Expect<Equal<TypeName<42>, "number">>;
type _test16 = Expect<Equal<TypeName<symbol>, "other">>;

export {};
