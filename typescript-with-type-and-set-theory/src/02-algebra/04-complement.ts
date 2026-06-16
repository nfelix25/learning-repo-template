import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 4 of 7: Complement — Exclude and Extract
// ═══════════════════════════════════════════════════════════════════════════
//
// In set theory, the DIFFERENCE A \ B (also written A − B) is the set of
// all elements that are in A but NOT in B:
//
//   A \ B = { x | x ∈ A  and  x ∉ B }
//
// TypeScript provides this as `Exclude<T, U>` — remove from T all members
// that are assignable to U.
//
// There's also `Extract<T, U>` — keep only the members of T that ARE
// assignable to U (i.e., the intersection, viewed from the union side).
//
// ───────────────────────────────────────────────────────────────────────────
// BUILDING THEM FROM SCRATCH
// ───────────────────────────────────────────────────────────────────────────
//
// These utilities are just conditional types:
//
//   type Exclude<T, U> = T extends U ? never : T
//   type Extract<T, U> = T extends U ? T : never
//
// When T is a union, the conditional DISTRIBUTES over each member —
// filtering the union to keep or remove matching members.
// (We'll study this distribution in detail in module 03.)
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Build Exclude from scratch.
type MyExclude<T, U> = T extends U ? never : T;
//   Remove from T all members that extend U.
//   Hint: use a conditional type.

type _test1 = Expect<Equal<MyExclude<"a" | "b" | "c", "a">, "b" | "c">>;
type _test2 = Expect<
  Equal<MyExclude<string | number | boolean, string>, number | boolean>
>;
type _test3 = Expect<
  Equal<MyExclude<string | null | undefined, null | undefined>, string>
>;

// 2. Build Extract from scratch.
type MyExtract<T, U> = T extends U ? T : never;
//   Keep from T only members that extend U.

type _test4 = Expect<Equal<MyExtract<"a" | "b" | number, string>, "a" | "b">>;
type _test5 = Expect<Equal<MyExtract<string | number | null, object>, never>>;

// 3. Exclude<T, never> = T   (removing nothing changes nothing)
type ExcludeNever = Exclude<string | number, never>;

type _test6 = Expect<Equal<ExcludeNever, string | number>>;

// 4. Exclude<T, T> = never   (removing everything leaves nothing)
type ExcludeAll = Exclude<string | number, string | number>;

type _test7 = Expect<Equal<ExcludeAll, never>>;

// 5. Exclude and union interact correctly:
//    Exclude<A | B, C> = Exclude<A, C> | Exclude<B, C>
type ExcludeDistributes = Exclude<"a" | "b" | "c" | "d", "a" | "c">;

type _test8 = Expect<Equal<ExcludeDistributes, "b" | "d">>;

// 6. NonNullable using Exclude
//    The built-in NonNullable<T> is just Exclude<T, null | undefined>.
//    Build it:
type MyNonNullable<T> = T extends null | undefined ? never : T;

type _test9 = Expect<Equal<MyNonNullable<string | null | undefined>, string>>;
type _test10 = Expect<Equal<MyNonNullable<number | null>, number>>;
type _test11 = Expect<Equal<MyNonNullable<null>, never>>;

export {};
