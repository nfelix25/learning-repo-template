/**
 * KOAN 08 — Branded Types: Nominal Typing in a Structural System
 *
 * TypeScript uses structural typing: two types are compatible if their shapes
 * match. A `UserId` (string) and a `PostId` (string) are structurally identical,
 * so TypeScript happily accepts one where the other is expected. This is often
 * fine — but sometimes you want to prevent it.
 *
 * Branded types solve this by intersecting a base type with a unique "brand"
 * property that nothing can accidentally produce. The result is a type that
 * is still assignable TO the base type (because intersection is a subtype) but
 * cannot be produced FROM the base type (because the brand property blocks it).
 *
 *   type UserId = string & { readonly [BRAND]: { readonly UserId: 'UserId' } }
 *
 *   const id: UserId = "abc"        // Error: string is not assignable to UserId
 *   const s: string = id            // Fine: UserId extends string
 *   const pid: PostId = id          // Error: UserId is not assignable to PostId
 *
 * The BRAND symbol is declared with `unique symbol` so it has a type-unique
 * identity — `typeof BRAND` is a nominal symbol type that cannot be replicated
 * elsewhere. Using a `unique symbol` as the key (instead of a string like
 * '__brand') means userland code cannot accidentally construct a matching object.
 *
 * The nested mapped type `{ [K in B]: K }` stores the brand name as BOTH the
 * key and the value. This pattern (from type-fest and Zod) ensures that two
 * brands with different names produce incompatible intersection types even
 * though they use the same BRAND symbol.
 *
 * ZodBranded<T, B>:
 *   Output = Brand<T["_output"], B>   — the branded type
 *   Input  = T["_input"]             — callers still pass unbranded values
 * The brand is a type-system artifact produced by .parse(), invisible at runtime.
 *
 * Your task: define BRAND, Brand<T, B>, and ZodBranded<T, B>.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, z } from '../shared/primitives.solution'

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: unique symbol as an un-forgeable property key
// `declare const` gives it a type without a runtime value — we only need the type.
declare const BRAND: unique symbol

// Pattern: intersection with a nested mapped type to encode the brand name
// T is the base type. B is the brand name string literal.
type Brand<T, B extends string> = TODO

// Pattern: Output is branded, Input is not — branding is what .parse() produces
interface ZodBranded<T extends ZodType<any, any>, B extends string>
  extends ZodType<TODO, TODO> {}

// ── Assertions ────────────────────────────────────────────────────────────────

type UserId = z.infer<ZodBranded<ZodString, 'UserId'>>
type PostId = z.infer<ZodBranded<ZodString, 'PostId'>>
type OrderId = z.infer<ZodBranded<ZodNumber, 'OrderId'>>

// Branded values ARE assignable to their base types (intersection ⊆ base)
type _01 = Expect<Equal<UserId extends string ? true : false, true>>
type _02 = Expect<Equal<OrderId extends number ? true : false, true>>

// Plain base types are NOT assignable to branded types (brand is missing)
type _03 = Expect<Equal<string extends UserId ? true : false, false>>
type _04 = Expect<Equal<number extends OrderId ? true : false, false>>

// Different brands are not mutually assignable (even same base type)
type _05 = Expect<Equal<UserId extends PostId ? true : false, false>>
type _06 = Expect<Equal<PostId extends UserId ? true : false, false>>

// Input is unbranded — callers pass plain values
type _07 = Expect<Equal<ZodBranded<ZodString, 'UserId'>["_input"], string>>
type _08 = Expect<Equal<ZodBranded<ZodNumber, 'OrderId'>["_input"], number>>

// Output carries the brand
type _09 = Expect<Equal<z.infer<ZodBranded<ZodString, 'UserId'>> extends string ? true : false, true>>
type _10 = Expect<Equal<string extends z.infer<ZodBranded<ZodString, 'UserId'>> ? true : false, false>>
