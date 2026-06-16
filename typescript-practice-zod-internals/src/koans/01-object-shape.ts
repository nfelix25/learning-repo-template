/**
 * KOAN 01 — ZodObject: Unwrapping a Shape
 *
 * ZodObject<T> takes a "raw shape" — an object where every value is a ZodType —
 * and produces a single schema whose output type mirrors that shape with every
 * ZodType unwrapped to its _output.
 *
 *   { name: ZodString; age: ZodNumber }  →  { name: string; age: number }
 *
 * The unwrapping mechanism is a mapped type:
 *
 *   type ZodObjectOutput<T extends ZodRawShape> = { [K in keyof T]: T[K]["_output"] }
 *
 * Two things make this work:
 *
 * 1. ZodRawShape constrains T so every T[K] is guaranteed to be a ZodType.
 *    Without the constraint, TypeScript won't allow T[K]["_output"] — it doesn't
 *    know that T[K] has an _output property. The constraint is load-bearing.
 *
 * 2. This is a *homomorphic* mapped type — it maps over exactly `keyof T`, not
 *    some derived set. Homomorphic mapped types are special: they preserve
 *    optional (?) and readonly modifiers from the source type. This matters in
 *    koan 02: .partial() works by changing what T contains (ZodOptional wrappers),
 *    not by adding ? modifiers directly to the output type.
 *
 * Why not use conditional type inference?
 *   T[K] extends ZodType<infer O> ? O : never
 * This would also work, but when the constraint already guarantees T[K] extends
 * ZodType, indexed access (T[K]["_output"]) is more direct and faster to evaluate.
 * Reserve conditional inference for cases where you don't control the constraint.
 *
 * Your task: define ZodRawShape, ZodObjectOutput, and ZodObject such that every
 * assertion below compiles.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, ZodLiteral, z } from '../shared/primitives.solution'
// Once koan 00 is complete, you can switch to your own solution:
// import type { ZodType, ZodString, ZodNumber, ZodBoolean, ZodLiteral, z } from './00-primitives'

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: Record constraint — every value in the shape must be a ZodType.
// This is the type parameter constraint for ZodObject.
type ZodRawShape = TODO

// Pattern: homomorphic mapped type with indexed access
// Iterates over keyof T, producing T[K]["_output"] for each key.
type ZodObjectOutput<T extends ZodRawShape> = TODO

// ZodObject wraps a shape into a single schema.
// Its _output is the unwrapped plain object type via ZodObjectOutput.
interface ZodObject<T extends ZodRawShape> extends ZodType<TODO> {
  readonly shape: T
}

// ── Assertions ────────────────────────────────────────────────────────────────

type _01 = Expect<Equal<z.infer<ZodObject<{ name: ZodString }>>, { name: string }>>
type _02 = Expect<Equal<
  z.infer<ZodObject<{ name: ZodString; age: ZodNumber; active: ZodBoolean }>>,
  { name: string; age: number; active: boolean }
>>
type _03 = Expect<Equal<
  z.infer<ZodObject<{ status: ZodLiteral<'active'> }>>,
  { status: 'active' }
>>
type _04 = Expect<Equal<z.infer<ZodObject<Record<never, never>>>, {}>>

// The shape property must carry the raw schema shape (not the unwrapped type):
type _05 = Expect<Equal<
  ZodObject<{ name: ZodString; age: ZodNumber }>["shape"],
  { name: ZodString; age: ZodNumber }
>>

// Nested objects:
type _06 = Expect<Equal<
  z.infer<ZodObject<{ inner: ZodObject<{ id: ZodNumber }> }>>,
  { inner: { id: number } }
>>
