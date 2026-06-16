/**
 * KOAN 06 — ZodEffects: The Full Input/Output Split
 *
 * ZodDefault (koan 05) showed a mild asymmetry: Input gains | undefined while
 * Output stays definite. ZodEffects is where the split becomes total — Output
 * can be a completely different type than Input.
 *
 * ZodEffects<T, Output, Input = T["_input"]> represents the result of calling
 * .transform() on a schema. It wraps an existing schema T and declares that
 * after T's output is produced, a transform function converts it to a new Output.
 *
 *   z.string().transform(s => parseInt(s))
 *   → ZodEffects<ZodString, number>
 *   → Input: string (callers still pass strings)
 *   → Output: number (after transformation)
 *
 * Three type parameters:
 *   T      — the underlying schema (its output feeds the transform function)
 *   Output — what the transform produces (can be anything)
 *   Input  — defaults to T["_input"] (the transform doesn't change what callers pass)
 *
 * Why a separate class, not a method that modifies ZodString?
 * Because TypeScript's interface augmentation cannot change the type parameters
 * of an existing interface. If .transform() were a method on ZodString, it would
 * have to return `this` with modified type parameters — which TypeScript doesn't
 * support. The only way to produce a schema with different Input and Output types
 * is to construct a NEW interface/class that carries those different parameters.
 * ZodEffects is that new type.
 *
 * This design also makes chaining clean:
 *   .transform(s => parseInt(s)).transform(n => new Date(n))
 *   → ZodEffects<ZodEffects<ZodString, number>, Date>
 * The outer ZodEffects wraps the inner one. Input is ZodEffects<ZodString, number>["_input"]
 * = ZodString["_input"] = string. Output is Date. The chain is fully type-safe.
 *
 * Your task: implement ZodEffects with the correct three-parameter signature.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, z } from '../shared/primitives.solution'

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: three-parameter schema wrapper where Output ≠ Input
// T is the base schema. Output is the transform result. Input defaults to T's input
// so the transform is invisible to callers — they still pass the original type.
interface ZodEffects<T extends ZodType<any, any>, Output, Input = T["_input"]>
  extends ZodType<TODO, TODO> {}

// ── Assertions ────────────────────────────────────────────────────────────────

// Basic transform: string → number
type _01 = Expect<Equal<z.infer<ZodEffects<ZodString, number>>, number>>
// Input is still string (callers pass string, transform handles the conversion)
type _02 = Expect<Equal<ZodEffects<ZodString, number>["_input"], string>>

// Identity transform: string → string
type _03 = Expect<Equal<z.infer<ZodEffects<ZodString, string>>, string>>
type _04 = Expect<Equal<ZodEffects<ZodString, string>["_input"], string>>

// Transform to a completely different shape
type _05 = Expect<Equal<z.infer<ZodEffects<ZodNumber, { value: number }>>, { value: number }>>
type _06 = Expect<Equal<ZodEffects<ZodNumber, { value: number }>["_input"], number>>

// Chained transforms: ZodEffects wrapping ZodEffects
// string → number → Date
type Chained = ZodEffects<ZodEffects<ZodString, number>, Date>
type _07 = Expect<Equal<z.infer<Chained>, Date>>
// Input travels through both layers: still string from the original schema
type _08 = Expect<Equal<Chained["_input"], string>>

// Custom Input override (the third parameter)
// Sometimes you want to declare that callers pass something other than T's input:
type _09 = Expect<Equal<ZodEffects<ZodString, number, unknown>["_input"], unknown>>
