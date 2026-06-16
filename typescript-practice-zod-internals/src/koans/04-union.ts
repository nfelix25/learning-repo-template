/**
 * KOAN 04 — ZodUnion: Distributing Over a Tuple of Schemas
 *
 * ZodUnion<T> takes a tuple of schemas and produces a schema whose output
 * is the union of each member's output type. The type-level mechanism is
 * surprisingly simple once you know the trick.
 *
 * The trick: T[number] on a tuple type produces a union of all element types.
 *
 *   [ZodString, ZodNumber, ZodBoolean][number]
 *   = ZodString | ZodNumber | ZodBoolean
 *
 * Then indexed access distributes over that union:
 *
 *   (ZodString | ZodNumber | ZodBoolean)["_output"]
 *   = ZodString["_output"] | ZodNumber["_output"] | ZodBoolean["_output"]
 *   = string | number | boolean
 *
 * So the full output type is: T[number]["_output"]
 *
 * Why does T[number] give a union?
 * In TypeScript, indexing a tuple type with `number` (not a specific numeric
 * literal like 0 or 1) produces the union of all positional element types.
 * This is different from mapping over the tuple — T[number] collapses the
 * positional structure into a flat union, which is exactly what a union type needs.
 *
 * Why use a tuple constraint [ZodType, ...ZodType[]] instead of ZodType[]?
 * The rest element ...ZodType[] requires at least one element before it.
 * Writing ZodType[] would allow an empty array, and a union of zero types is
 * semantically meaningless (it would be never). The tuple constraint enforces
 * at least one member at the type level.
 *
 * Contrast with koan 03 (ZodTuple): there, we mapped over the tuple to PRESERVE
 * positional structure. Here, we collapse the tuple into a union with T[number]
 * because we want to DISCARD positional structure.
 *
 * Your task: implement ZodUnion such that every assertion below compiles.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, ZodNull, ZodLiteral, z } from '../shared/primitives.solution'

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: T[number]["_output"] — index with number to get union, then access _output
// Readonly<...> allows passing readonly tuple literals (as const) as T
interface ZodUnion<T extends Readonly<[ZodType<any, any>, ...ZodType<any, any>[]]>>
  extends ZodType<TODO> {
  readonly options: T
}

// ── Assertions ────────────────────────────────────────────────────────────────

type _01 = Expect<Equal<z.infer<ZodUnion<[ZodString, ZodNumber]>>, string | number>>
type _02 = Expect<Equal<
  z.infer<ZodUnion<[ZodString, ZodNumber, ZodBoolean]>>,
  string | number | boolean
>>
// Single-member union — degenerate but valid
type _03 = Expect<Equal<z.infer<ZodUnion<[ZodString]>>, string>>
// Literal union
type _04 = Expect<Equal<
  z.infer<ZodUnion<[ZodLiteral<'a'>, ZodLiteral<'b'>, ZodLiteral<'c'>]>>,
  'a' | 'b' | 'c'
>>
// Mixed: literals and broad types
type _05 = Expect<Equal<
  z.infer<ZodUnion<[ZodLiteral<42>, ZodString, ZodNull]>>,
  42 | string | null
>>
// options must carry the tuple of schemas (not the union):
type _06 = Expect<Equal<
  ZodUnion<[ZodString, ZodNumber]>["options"],
  [ZodString, ZodNumber]
>>
