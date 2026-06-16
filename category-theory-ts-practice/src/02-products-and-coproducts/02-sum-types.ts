/**
 * SUM TYPES (COPRODUCTS)
 * ══════════════════════
 *
 * A coproduct A + B has injection morphisms i₁: A → A+B and i₂: B → A+B,
 * and an elimination rule: given f: A → C and g: B → C, there is a unique
 * morphism [f, g]: A + B → C (pattern matching / case analysis).
 *
 * In TypeScript, union types A | B are coproducts:
 *   - Injection: any expression of type A or B widens automatically to A | B
 *   - Elimination: narrowing (typeof, instanceof, discriminant checks)
 *
 * Discriminated unions are coproducts with a tag — the tag is the "label"
 * that tells you which injection was used.
 */

import { Expect, Equal, TODO, todo } from '../utils'

// ─── Union basics ─────────────────────────────────────────────────────────────

// Exercise 1: What is string | never?
// (A + ⊥ ≅ A — union with the initial object is identity)
type _1 = Expect<Equal<string  | never,  TODO>>
type _2 = Expect<Equal<boolean | never,  TODO>>

// Exercise 2: What is string | unknown?
// (A + ⊤ ≅ ⊤ — union with the terminal absorbs everything)
type _3 = Expect<Equal<string  | unknown, TODO>>
type _4 = Expect<Equal<never   | unknown, TODO>>

// Exercise 3: Union is commutative and idempotent.
type _5 = Expect<Equal<string | number, TODO>>            // fill in the simplified form
type _6 = Expect<Equal<string | string, TODO>>            // idempotent: A | A = A
type _7 = Expect<Equal<string | number | string, TODO>>   // de-duplication

// ─── Discriminated unions ─────────────────────────────────────────────────────

// A tagged coproduct — the _tag field tells us which injection was used.
type Shape =
  | { _tag: 'Circle';    radius: number }
  | { _tag: 'Rectangle'; width: number; height: number }
  | { _tag: 'Triangle';  base: number;  height: number }

// Exercise 4: Implement `area` — the eliminator for Shape.
// Each branch must be handled; TypeScript will enforce exhaustiveness.
const area = (shape: Shape): number => {
  switch (shape._tag) {
    case 'Circle':    return todo()
    case 'Rectangle': return todo()
    case 'Triangle':  return todo()
  }
}

// Exercise 5: What type does a default branch have after all cases are covered?
// This is the exhaustiveness check — it should be `never`.
const assertNever = (x: never): never => { throw new Error(`Unexpected: ${JSON.stringify(x)}`) }

const areaExhaustive = (shape: Shape): number => {
  switch (shape._tag) {
    case 'Circle':    return Math.PI * shape.radius ** 2
    case 'Rectangle': return shape.width * shape.height
    case 'Triangle':  return 0.5 * shape.base * shape.height
    default:          return assertNever(shape)  // shape: never here — why?
  }
}

// Exercise 6: Distribution of union over mapped types.
// When a union appears in a conditional type, TypeScript distributes it.
type ToArray<T> = T extends unknown ? T[] : never

type _8 = Expect<Equal<ToArray<string>,          TODO>>
type _9 = Expect<Equal<ToArray<string | number>, TODO>>

// Exercise 7: Extract members of a union that extend a given type.
// This is the type-level analog of filtering.
type Filter<T, U> = TODO  // keep only union members that extend U

type _10 = Expect<Equal<Filter<string | number | boolean, string>,  string>>
type _11 = Expect<Equal<Filter<string | number | boolean, number>,  number>>
type _12 = Expect<Equal<Filter<string | number | boolean, object>,  never>>
