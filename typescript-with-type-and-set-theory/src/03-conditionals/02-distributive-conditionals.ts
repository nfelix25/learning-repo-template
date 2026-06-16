import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — CONDITIONAL TYPES
// Koan 2 of 5: Distributive conditional types
// ═══════════════════════════════════════════════════════════════════════════
//
// When the type being tested (the left side of `extends`) is a BARE generic
// parameter, TypeScript DISTRIBUTES the conditional over each union member:
//
//   type F<T> = T extends U ? X : Y
//   F<A | B>  =  (A extends U ? X : Y) | (B extends U ? X : Y)
//
// This is like SET-BUILDER NOTATION:   { f(x) | x ∈ T }
// Or like Array.prototype.map, but for types.
//
// ───────────────────────────────────────────────────────────────────────────
// THE KEY CONDITION: "NAKED" TYPE PARAMETER
// ───────────────────────────────────────────────────────────────────────────
//
// Distribution happens ONLY when T appears DIRECTLY (naked) on the left:
//
//   type Distributes<T>    = T extends string ? 'S' : 'N'    // ← distributes
//   type NoDistribute<T>   = [T] extends [string] ? 'S' : 'N' // ← does NOT distribute
//
// Wrapping T in a tuple [T] prevents distribution — useful when you want
// to test the union type as a whole, not member-by-member.
//
// ───────────────────────────────────────────────────────────────────────────
// WORKED EXAMPLE
// ───────────────────────────────────────────────────────────────────────────
//
//   type IsString<T> = T extends string ? T : never
//   type R = IsString<'cat' | 42 | 'dog' | true>
//
//   Distribution step by step:
//     IsString<'cat'>  → 'cat'   ('cat' extends string ✓)
//     IsString<42>     → never   (42 extends string ✗)
//     IsString<'dog'>  → 'dog'   ('dog' extends string ✓)
//     IsString<true>   → never   (true extends string ✗)
//
//   Result: 'cat' | never | 'dog' | never  = 'cat' | 'dog'
//
//   This is a FILTER over the union.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Distribution over a union.
type Dist<T> = T extends string ? "S" : "N";

type _test1 = Expect<Equal<Dist<string | number>, "S" | "N">>;
//   Apply the conditional to each member, then union the results.

// 2. Filter — keep only members matching a constraint.
type OnlyStrings<T> = T extends string ? T : never;

type _test2 = Expect<
  Equal<OnlyStrings<"a" | 1 | "b" | true | null>, "a" | "b">
>;

// 3. Reject — keep only members NOT matching a constraint.
//    (This is what Exclude<T, U> does!)
type NoStrings<T> = T extends string ? never : T;

type _test3 = Expect<Equal<NoStrings<"a" | 1 | "b" | true>, 1 | true>>;

// 4. Preventing distribution with tuple wrapping.
type WholeTuple<T> = [T] extends [string] ? "S" : "N";

type _test4 = Expect<Equal<WholeTuple<string | number>, "N">>;
//   [string | number] extends [string]? No — the whole union is tested at once.

// 5. The never special case.
//    With a bare parameter, `never` distributes to... nothing (empty union).
type TestNever<T> = T extends string ? "yes" : "no";

type _test5 = Expect<Equal<TestNever<never>, never>>;
//   There are zero union members to distribute over → result is never.

// 6. Build ToArray: wrap each member of a union in an array.
type ToArray<T> = T extends unknown ? T[] : never;

type _test6 = Expect<Equal<ToArray<string | number>, string[] | number[]>>;
type _test7 = Expect<Equal<ToArray<"a" | "b">, "a"[] | "b"[]>>;

// 7. CHALLENGE: Build Flatten (one level of array unwrapping).
//    If T is an array, return its element type; otherwise return T itself.
type Flatten<T> = T extends readonly (infer U)[] ? U : T;

type _test8 = Expect<Equal<Flatten<string[]>, string>>;
type _test9 = Expect<Equal<Flatten<number>, number>>;
type _test10 = Expect<Equal<Flatten<string[] | number[]>, string | number>>;

export {};
