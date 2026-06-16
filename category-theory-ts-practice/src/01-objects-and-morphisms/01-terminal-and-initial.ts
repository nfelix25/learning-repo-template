/**
 * TERMINAL AND INITIAL OBJECTS
 * ════════════════════════════
 *
 * In TypeScript's type category:
 *
 *   `never`   ≅ initial object  — morphisms escape FROM it to anywhere,
 *                                  but no value of type `never` can be constructed
 *   `unknown` ≅ terminal object — every type has a unique morphism INTO it
 *                                  (the upcast), but it reveals nothing about the value
 *
 * Subtyping encodes morphism existence: `A extends B` means "there is a
 * (coercion) morphism A → B."
 */

import { Expect, Equal, TODO, todo } from "../utils";

// ─── never as the initial object ─────────────────────────────────────────────

// Exercise 1: `never` extends every type — it maps into everything.
// Replace each TODO with `true` or `false`.
type _1 = Expect<Equal<never extends string ? true : false, true>>;
type _2 = Expect<Equal<never extends number ? true : false, true>>;
type _3 = Expect<Equal<never extends unknown ? true : false, true>>;
type _4 = Expect<Equal<never extends never ? true : false, true>>;

// Exercise 2: The `absurd` function is the unique morphism `never → A`.
// It can never actually be called (no value of type `never` exists),
// but it must type-check. Hint: `n` itself is already the right type.
const absurd = <A>(n: never): A => todo();

// Exercise 3: Union with `never` is identity — the initial object contributes nothing.
// (A + ⊥ ≅ A)
type _5 = Expect<Equal<string | never, string>>;
type _6 = Expect<Equal<boolean | never, boolean>>;
type _7 = Expect<Equal<never | never, never>>;

// Exercise 4: A type union that collapses to `never` when all branches are exhausted.
// Fill in what type results when you intersect a union with its complement.
type _8 = Expect<Equal<(string | number) & never, never>>;

// ─── unknown as the terminal object ──────────────────────────────────────────

// Exercise 5: Every type extends `unknown` — everything maps into the terminal.
type _9 = Expect<Equal<string extends unknown ? true : false, true>>;
type _10 = Expect<Equal<never extends unknown ? true : false, true>>;
type _11 = Expect<Equal<unknown extends unknown ? true : false, true>>;

// Exercise 6: But `unknown` does NOT extend other types — it isn't a subtype.
type _12 = Expect<Equal<unknown extends string ? true : false, false>>;
type _13 = Expect<Equal<unknown extends never ? true : false, false>>;

// Exercise 7: Intersection with `unknown` is identity — (A × ⊤ ≅ A).
type _14 = Expect<Equal<string & unknown, string>>;
type _15 = Expect<Equal<boolean & unknown, boolean>>;
type _16 = Expect<Equal<never & unknown, never>>;

// Exercise 8: The terminal morphism — every type A has a unique map into `unknown`.
// Define the type of the terminal morphism for a given A.
type TerminalMorphism<A> = (a: A) => unknown;

type _17 = Expect<Equal<TerminalMorphism<string>, (a: string) => unknown>>;
type _18 = Expect<Equal<TerminalMorphism<boolean>, (a: boolean) => unknown>>;
type _19 = Expect<Equal<TerminalMorphism<never>, (a: never) => unknown>>;
