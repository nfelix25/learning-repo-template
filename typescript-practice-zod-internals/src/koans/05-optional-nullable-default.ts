/**
 * KOAN 05 — Optional, Nullable, Default: Where Input ≠ Output Begins
 *
 * Until now, every schema has had the same Input and Output type. This koan
 * introduces the first real split — and the split is instructive about what
 * Input and Output actually mean.
 *
 * ZodOptional<T> and ZodNullable<T> are symmetric: both Input and Output
 * gain the modifier (| undefined or | null). If a field is optional, you
 * can omit it coming in AND you might not get it coming out.
 *
 * ZodDefault<T> is the interesting one. It is ASYMMETRIC:
 *
 *   Input  = T["_input"] | undefined   — callers may omit the value
 *   Output = T["_output"]              — after parsing, the value is always present
 *
 * The default fills the gap: if Input is undefined, the schema substitutes a
 * default value and hands you back a definite T["_output"]. From the caller's
 * perspective, the field is optional. From the output's perspective, it's required.
 *
 * This asymmetry is why ZodType has TWO type parameters. Most schemas don't need
 * them to differ — ZodString<string, string> is the common case. But ZodDefault
 * is the canonical example of a schema where Input ≠ Output, and it's the pattern
 * that .transform() (koan 06) takes to its logical extreme.
 *
 * Note: ZodOptional and ZodNullable are separate types rather than one
 * parameterized type (e.g., ZodModifier<T, 'optional' | 'nullable'>) because
 * they compose differently. ZodNullable<ZodOptional<T>> and
 * ZodOptional<ZodNullable<T>> both work, and the two-class design makes the
 * composition type-safe and predictable.
 *
 * Your task: implement ZodOptional, ZodNullable, and ZodDefault. Pay close
 * attention to which type parameter is Output and which is Input, especially
 * for ZodDefault.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, ZodBoolean, z } from '../shared/primitives.solution'

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: symmetric wrapper — add | undefined to both Output and Input
interface ZodOptional<T extends ZodType<any, any>> extends ZodType<TODO, TODO> {}

// Pattern: symmetric wrapper — add | null to both Output and Input
interface ZodNullable<T extends ZodType<any, any>> extends ZodType<TODO, TODO> {}

// Pattern: asymmetric wrapper — Output is T["_output"], Input is T["_input"] | undefined
// This is the first schema where ZodType's two type parameters carry different types.
interface ZodDefault<T extends ZodType<any, any>> extends ZodType<TODO, TODO> {}

// ── Assertions ────────────────────────────────────────────────────────────────

// ZodOptional: output and input both gain | undefined
type _01 = Expect<Equal<z.infer<ZodOptional<ZodString>>, string | undefined>>
type _02 = Expect<Equal<ZodOptional<ZodString>["_input"], string | undefined>>
type _03 = Expect<Equal<z.infer<ZodOptional<ZodNumber>>, number | undefined>>

// ZodNullable: output and input both gain | null (not | undefined)
type _04 = Expect<Equal<z.infer<ZodNullable<ZodString>>, string | null>>
type _05 = Expect<Equal<ZodNullable<ZodString>["_input"], string | null>>
type _06 = Expect<Equal<z.infer<ZodNullable<ZodBoolean>>, boolean | null>>

// ZodDefault: output is definite (the default fills the gap)
type _07 = Expect<Equal<z.infer<ZodDefault<ZodString>>, string>>
type _08 = Expect<Equal<z.infer<ZodDefault<ZodNumber>>, number>>

// ZodDefault: input allows undefined (caller may omit the value)
type _09 = Expect<Equal<ZodDefault<ZodString>["_input"], string | undefined>>
type _10 = Expect<Equal<ZodDefault<ZodNumber>["_input"], number | undefined>>

// Composition: nullable optional — both | null and | undefined in output
type _11 = Expect<Equal<
  z.infer<ZodNullable<ZodOptional<ZodString>>>,
  string | null | undefined
>>

// Default of optional — output is still T | undefined (the default only fills
// undefined, not the optional's undefined... actually, read the types carefully)
type _12 = Expect<Equal<ZodDefault<ZodOptional<ZodString>>["_input"], string | undefined | undefined>>
