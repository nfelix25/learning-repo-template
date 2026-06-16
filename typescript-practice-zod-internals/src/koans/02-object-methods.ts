/**
 * KOAN 02 — ZodObject Methods: Type-Level Transformations
 *
 * ZodObject exposes a family of methods that produce NEW schemas rather than
 * mutating the existing one. Schemas in Zod are immutable values — .partial()
 * doesn't change your schema, it returns a different one representing the
 * partial variant. This makes schemas safe to share and compose.
 *
 * Every method is a type-level transformation on the shape T:
 *
 *   .partial()    { name: ZodString }          →  { name: ZodOptional<ZodString> }
 *   .pick({…})    { name, age, email }          →  { name }
 *   .omit({…})    { name, age, email }          →  { age, email }
 *   .extend({…})  { name } + { age }            →  { name, age }
 *   .merge(…)     ZodObject<{a}> + ZodObject<{b}>  →  ZodObject<{a, b}>
 *
 * .extend() vs .merge():
 *   .extend() accepts a ZodRawShape (a plain inline object of schema values)
 *   .merge()  accepts a ZodObject<U> (a fully-constructed schema)
 * Both combine shapes, but .extend() is for "add some fields to this schema"
 * and .merge() is for "combine these two pre-existing schemas." When keys
 * overlap, the incoming shape wins — last-write semantics.
 *
 * TypeScript's built-in utility types do the heavy lifting on the shape T:
 *   Pick<T, K>   →  { [P in K]: T[P] }
 *   Omit<T, K>   →  { [P in keyof T as P extends K ? never : P]: T[P] }
 * Both operate directly on the ZodRawShape, giving you back a ZodRawShape subset.
 *
 * ZodOptional is explored fully in koan 05. It is pre-built here as a black box:
 * it wraps a schema and adds | undefined to the output type. Your task in this
 * koan is to fill in the RETURN TYPES of the five methods on ZodObject.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, z } from '../shared/primitives.solution'

// ── Pre-built: foundation from koan 01 ───────────────────────────────────────

type ZodRawShape = Record<string, ZodType<any, any>>
type ZodObjectOutput<T extends ZodRawShape> = { [K in keyof T]: T[K]["_output"] }

// Pre-built: ZodOptional is the subject of koan 05.
// Treat it as a black box that wraps a schema and adds | undefined to its output.
interface ZodOptional<T extends ZodType<any, any>>
  extends ZodType<T["_output"] | undefined, T["_input"] | undefined> {}

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

interface ZodObject<T extends ZodRawShape> extends ZodType<ZodObjectOutput<T>> {
  readonly shape: T

  // Pattern: map over keyof T, wrapping each value in ZodOptional
  partial(): TODO

  // Pattern: Pick<T, K> on the raw shape
  // The mask parameter mirrors Zod's API: { name: true, age: true }
  pick<K extends keyof T>(mask: { [P in K]: true }): TODO

  // Pattern: Omit<T, K> on the raw shape
  omit<K extends keyof T>(mask: { [P in K]: true }): TODO

  // Pattern: merge two shapes — U's keys win on overlap
  // How do you express "T without U's keys, merged with U"?
  extend<U extends ZodRawShape>(shape: U): TODO

  // Pattern: same semantics as extend, but the parameter is a ZodObject<U>
  // Constrain U to extract the shape from the incoming schema
  merge<U extends ZodRawShape>(other: ZodObject<U>): TODO
}

// ── Assertions ────────────────────────────────────────────────────────────────

type Base = { name: ZodString; age: ZodNumber; active: ZodBoolean }

// .partial() — all fields become | undefined in the output
// (Note: our simple ZodObjectOutput produces required fields with | undefined,
// not optional fields with ?. Real Zod's output type is more sophisticated.)
type _01 = Expect<Equal<
  z.infer<ReturnType<ZodObject<Base>["partial"]>>,
  { name: string | undefined; age: number | undefined; active: boolean | undefined }
>>

// .pick() — only the selected field survives
type PickResult = ZodObject<Base> extends { pick(m: { name: true }): infer R } ? R : never
type _02 = Expect<Equal<z.infer<PickResult>, { name: string }>>

// .omit() — the selected field is removed
type OmitResult = ZodObject<Base> extends { omit(m: { age: true }): infer R } ? R : never
type _03 = Expect<Equal<z.infer<OmitResult>, { name: string; active: boolean }>>

// .extend() — new field added
type ExtendResult = ZodObject<Base> extends { extend(s: { email: ZodString }): infer R } ? R : never
type _04 = Expect<Equal<
  z.infer<ExtendResult>,
  { name: string; age: number; active: boolean; email: string }
>>

// .extend() — overlapping key: incoming type wins
type OverrideResult = ZodObject<Base> extends { extend(s: { name: ZodNumber }): infer R } ? R : never
type _05 = Expect<Equal<z.infer<OverrideResult>, { name: number; age: number; active: boolean }>>

// .merge() — same as extend but accepts a ZodObject
type MergeResult = ZodObject<Base> extends { merge(other: ZodObject<{ email: ZodString }>): infer R } ? R : never
type _06 = Expect<Equal<
  z.infer<MergeResult>,
  { name: string; age: number; active: boolean; email: string }
>>
