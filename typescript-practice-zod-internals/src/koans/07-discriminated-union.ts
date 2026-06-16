/**
 * KOAN 07 — ZodDiscriminatedUnion: Literal-Keyed Schemas
 *
 * ZodUnion (koan 04) accepts any tuple of schemas. ZodDiscriminatedUnion is
 * more constrained: every member must be a ZodObject that has a shared key D
 * pointing to a ZodLiteral. This constraint is what makes runtime narrowing
 * efficient — a single property lookup tells you which member you have.
 *
 *   z.discriminatedUnion('type', [
 *     z.object({ type: z.literal('circle'),  radius: z.number() }),
 *     z.object({ type: z.literal('square'),  side:   z.number() }),
 *   ])
 *
 * At the type level, the output is the same as ZodUnion: T[number]["_output"].
 * The difference is entirely in the CONSTRAINT on T — we enforce at the type
 * level that each member has the discriminant key pointing to a literal.
 *
 * The discriminant constraint: each member T[K] must be a ZodObject whose shape
 * includes key D, and the value at D must be a ZodLiteral (not ZodString, not
 * ZodNumber — it must be a literal).
 *
 *   T extends ZodObject<Record<D, ZodLiteral<ZodLiteralValue>>>[]
 *
 * Record<D, ZodLiteral<ZodLiteralValue>> creates an object type with exactly
 * one key (D) pointing to any ZodLiteral. ZodObject's shape only needs to
 * *contain* this key — the full shape can have more keys. TypeScript handles
 * this via structural subtyping: ZodObject<{ type: ZodLiteral<'circle'>; radius: ZodNumber }>
 * extends ZodObject<Record<'type', ZodLiteral<ZodLiteralValue>>> because its
 * shape contains the required 'type' key.
 *
 * The discriminator property (readonly discriminator: D) makes the key available
 * at the type level for downstream code that needs to know which key to narrow on.
 *
 * Your task: implement ZodLiteralValue, ZodDiscriminatedUnion, and fill in the
 * output type so every assertion compiles.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodLiteral, z } from '../shared/primitives.solution'

// Pre-built: ZodObject
type ZodRawShape = Record<string, ZodType<any, any>>
type ZodObjectOutput<T extends ZodRawShape> = { [K in keyof T]: T[K]["_output"] }
interface ZodObject<T extends ZodRawShape> extends ZodType<ZodObjectOutput<T>> {
  readonly shape: T
}

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: the set of types that can appear as a discriminant literal value
type ZodLiteralValue = TODO

// Pattern: T[number]["_output"] for the output union — same as ZodUnion.
// The constraint on T enforces that each member is a ZodObject with D pointing
// to a ZodLiteral. Record<D, ZodLiteral<ZodLiteralValue>> is the minimum shape.
interface ZodDiscriminatedUnion<
  D extends string,
  T extends ZodObject<Record<D, ZodLiteral<ZodLiteralValue>>>[],
> extends ZodType<TODO> {
  readonly discriminator: D
  readonly options: T
}

// ── Assertions ────────────────────────────────────────────────────────────────

type Circle = { type: ZodLiteral<'circle'>; radius: ZodNumber }
type Square = { type: ZodLiteral<'square'>; side: ZodNumber }
type Triangle = { type: ZodLiteral<'triangle'>; base: ZodNumber; height: ZodNumber }

type Shapes = ZodDiscriminatedUnion<'type', [ZodObject<Circle>, ZodObject<Square>]>

// Output is the union of all member output types
type _01 = Expect<Equal<
  z.infer<Shapes>,
  { type: 'circle'; radius: number } | { type: 'square'; side: number }
>>

// Three members
type ThreeShapes = ZodDiscriminatedUnion<'type', [ZodObject<Circle>, ZodObject<Square>, ZodObject<Triangle>]>
type _02 = Expect<Equal<
  z.infer<ThreeShapes>,
  | { type: 'circle'; radius: number }
  | { type: 'square'; side: number }
  | { type: 'triangle'; base: number; height: number }
>>

// Discriminator key is accessible at the type level
type _03 = Expect<Equal<Shapes["discriminator"], 'type'>>

// options carries the tuple of member schemas
type _04 = Expect<Equal<Shapes["options"], [ZodObject<Circle>, ZodObject<Square>]>>

// ZodLiteralValue must include the common literal-able primitives
type _05 = Expect<Equal<string extends ZodLiteralValue ? true : false, true>>
type _06 = Expect<Equal<number extends ZodLiteralValue ? true : false, true>>
type _07 = Expect<Equal<boolean extends ZodLiteralValue ? true : false, true>>
