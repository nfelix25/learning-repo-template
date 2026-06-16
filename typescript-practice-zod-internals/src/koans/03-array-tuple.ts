/**
 * KOAN 03 — ZodArray and ZodTuple: Two Kinds of Collection
 *
 * ZodArray and ZodTuple both produce collection schemas, but their type-level
 * implementations are very different — and the difference reveals something
 * important about TypeScript's type system.
 *
 * ZodArray<T> is trivial:
 *   output = T["_output"][]
 * One schema, array of its output. Single indexed access, wrap in [].
 *
 * ZodTuple<T> is more interesting:
 *   T is a tuple of schemas: [ZodString, ZodNumber, ZodBoolean]
 *   output must be a tuple of their outputs: [string, number, boolean]
 *
 * The mechanism: map over the tuple type T.
 *
 *   { [K in keyof T]: T[K] extends ZodType<any, any> ? T[K]["_output"] : never }
 *
 * This works because of a TypeScript 4.0+ feature: when you write
 * { [K in keyof T]: ... } and T is a tuple type, the result is also a tuple
 * type (not a plain object). TypeScript preserves the positional structure —
 * element 0 maps to element 0, element 1 to element 1, etc.
 *
 * This is called a "homomorphic mapped type over a tuple." The key insight
 * is that keyof <tuple> enumerates the positional indices (0, 1, 2...) and
 * the array prototype methods — but the mapped result preserves the tuple
 * shape, not the prototype. The T[K] extends ZodType conditional is a guard
 * that maps non-positional keys (like 'length', 'push') to never, making
 * the conditional safe.
 *
 * Why not extend ZodArray for tuples?
 * Because ZodArray<T>[] loses positional type information. `[string, number]`
 * and `string[]` are fundamentally different types — tuples have fixed length
 * and per-position types. Zod correctly models them as separate schema types.
 *
 * Your task: implement ZodArray and ZodTuple such that every assertion below
 * compiles.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, ZodLiteral, z } from '../shared/primitives.solution'

// Pre-built: ZodObject for the nested array assertion
type ZodRawShape = Record<string, ZodType<any, any>>
type ZodObjectOutput<T extends ZodRawShape> = { [K in keyof T]: T[K]["_output"] }
interface ZodObject<T extends ZodRawShape> extends ZodType<ZodObjectOutput<T>> {}

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: single indexed access wrapped in an array type
interface ZodArray<T extends ZodType<any, any>> extends ZodType<TODO> {}

// Pattern: homomorphic mapped type over a tuple type
// The constraint [ZodType, ...ZodType[]] requires at least one element.
// T[K] extends ZodType ... handles both positional and non-positional keys.
interface ZodTuple<T extends [ZodType<any, any>, ...ZodType<any, any>[]]>
  extends ZodType<TODO> {}

// ── Assertions ────────────────────────────────────────────────────────────────

// ZodArray — straightforward
type _01 = Expect<Equal<z.infer<ZodArray<ZodString>>, string[]>>
type _02 = Expect<Equal<z.infer<ZodArray<ZodNumber>>, number[]>>
type _03 = Expect<Equal<
  z.infer<ZodArray<ZodObject<{ id: ZodNumber }>>>,
  { id: number }[]
>>

// ZodTuple — positional inference
type _04 = Expect<Equal<z.infer<ZodTuple<[ZodString, ZodNumber]>>, [string, number]>>
type _05 = Expect<Equal<
  z.infer<ZodTuple<[ZodBoolean, ZodString, ZodNumber]>>,
  [boolean, string, number]
>>
// Single-element tuple must be [string], not string[]
type _06 = Expect<Equal<z.infer<ZodTuple<[ZodString]>>, [string]>>
// Literal types are preserved positionally
type _07 = Expect<Equal<
  z.infer<ZodTuple<[ZodLiteral<'start'>, ZodNumber, ZodLiteral<'end'>]>>,
  ['start', number, 'end']
>>
// Tuple of objects
type _08 = Expect<Equal<
  z.infer<ZodTuple<[ZodObject<{ id: ZodNumber }>, ZodObject<{ name: ZodString }>]>>,
  [{ id: number }, { name: string }]
>>
