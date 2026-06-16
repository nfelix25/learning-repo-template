import type { Expect, Equal, Extends, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 5 of 7: Object subtyping — the counterintuitive reversal
// ═══════════════════════════════════════════════════════════════════════════
//
// Recap from module 01: MORE FIELDS = SUBTYPE.
//
// This feels backwards. Let's build a firm intuition for why it's right.
//
// ───────────────────────────────────────────────────────────────────────────
// THE VALUE-SET PERSPECTIVE
// ───────────────────────────────────────────────────────────────────────────
//
//   type NameOnly  = { name: string }
//   type NameAndAge = { name: string; age: number }
//
//   Values in NameOnly:    every object that has name (could also have age, etc.)
//   Values in NameAndAge:  only objects that have BOTH name AND age
//
//   NameAndAge ⊆ NameOnly — every NameAndAge value is also a NameOnly value.
//   (It satisfies the weaker requirement.)
//
// More required properties = stricter constraint = fewer matching values = smaller set.
//
// ───────────────────────────────────────────────────────────────────────────
// STRUCTURAL TYPING vs EXCESS PROPERTY CHECKING
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript uses STRUCTURAL typing: compatibility is based on shape, not name.
// But there's a SEPARATE rule that can trip you up:
//
//   EXCESS PROPERTY CHECKING fires only on FRESH object literals.
//   It's a lint-like check for typos, NOT a type-system rule.
//
//   type Point = { x: number; y: number }
//
//   const p: Point = { x: 1, y: 2, z: 3 }    // ✗ — excess property 'z' (literal)
//   const q = { x: 1, y: 2, z: 3 }
//   const r: Point = q                         // ✓ — no excess property check (variable)
//
// The second assignment is valid because q satisfies the structural requirement.
// The excess property check is NOT a subtype check — it's a special restriction
// on object literals to catch likely bugs.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. More fields = subtype.
type Animal = { species: string };
type Dog = { species: string; breed: string };

type _test1 = Expect<Equal<Extends<Dog, Animal>, true>>;
type _test2 = Expect<Equal<Extends<Animal, Dog>, false>>;

// 2. Structural typing: two DIFFERENT names, same shape.
type Point2D = { x: number; y: number };
type Vector2D = { x: number; y: number };

type _test3 = Expect<Equal<Extends<Point2D, Vector2D>, true>>;
type _test4 = Expect<Equal<Extends<Vector2D, Point2D>, true>>;
//   They're structurally identical → mutually assignable → equal as types.

// 3. Variable assignment bypasses excess property checking.
type Config = { host: string; port: number };

const fullConfig = { host: "localhost", port: 3000, debug: true };
const configOk: Config = fullConfig; // ✓ — variable, structural check only
// const configBad: Config = { host: 'localhost', port: 3000, debug: true } // ✗ — literal

// The above is already correct — no blank. Verify it compiles and understand why.

// 4. ReadonlyArray<T> extends Array<T>? Or the reverse?
//    Think about value sets: a ReadonlyArray can do LESS than Array.
//    More constraints on what you can do → smaller set of values → subtype.
type ReadonlyExtendsArray = Extends<ReadonlyArray<string>, Array<string>>;
type ArrayExtendsReadonly = Extends<Array<string>, ReadonlyArray<string>>;

type _test5 = Expect<Equal<ReadonlyExtendsArray, false>>;
type _test6 = Expect<Equal<ArrayExtendsReadonly, true>>;
//   Hint: ReadonlyArray is MORE restrictive (can't mutate) → it's the subtype.

// 5. Optional properties create a supertype.
//    { name: string } vs { name?: string }
//    Which has MORE matching values? (undefined is now allowed for name)
type Required_ = { name: string };
type Optional_ = { name?: string };

type _test7 = Expect<Equal<Extends<Required_, Optional_>, true>>;
type _test8 = Expect<Equal<Extends<Optional_, Required_>, false>>;
//   Adding `?` makes the constraint WEAKER → more values match → it's a supertype.

export {};
