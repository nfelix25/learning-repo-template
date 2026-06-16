/**
 * KOAN 00 — The Phantom Base
 *
 * In real Zod, every schema is an instance of a class that extends ZodType<O, I>.
 * The two type parameters are Output (what .parse() hands back) and Input (what
 * .parse() accepts). Most of the time they're the same — ZodString parses strings
 * and returns strings — but transforms break that. More on that in koan 06.
 *
 * The foundational trick: ZodType declares two properties, _output and _input,
 * that are NEVER ASSIGNED at runtime. They are "phantom" — they exist purely so
 * TypeScript can extract the schema's type via indexed access (T["_output"]).
 *
 * Why phantom properties instead of other encodings?
 *
 *   Getter method:  getOutput(): Output
 *   → You'd need ReturnType<T["getOutput"]> everywhere — clunky — and the
 *     conditional type form T extends ZodType ? ReturnType<...> : never for
 *     every utility type.
 *
 *   Conditional extraction:  T extends ZodType<infer O> ? O : never
 *   → Works, but conditional type inference is deferred and slower. Phantom
 *     property + T["_output"] is simpler, cached, and composes cleanly.
 *
 *   Just carry the type parameter explicitly:  ZodString<string>
 *   → You'd have to thread that type argument everywhere. ZodObject<T, Output>
 *     would be unmanageable. The phantom property lets you hide the type
 *     inside the schema value and read it back on demand.
 *
 * Note on the `!` in Zod's source: in classes, `readonly _output!: Output` uses
 * a "definite assignment assertion" — the `!` tells TypeScript "trust me, this is
 * initialized" even though it never is. In interfaces (which we use here), you
 * just write `readonly _output: Output` — interface property declarations are
 * purely type annotations, no `!` needed.
 *
 * ── If you get stuck ─────────────────────────────────────────────────────────
 * Open src/shared/primitives.solution.ts and read the answers. Then come back
 * and implement it yourself — the goal is the understanding.
 */

import type { Expect, Equal } from "../shared/test-utils";

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never;

// Pattern: phantom type properties
// Declare _output and _input as typed properties. They are never assigned a
// real value — they exist only so T["_output"] resolves via indexed access.
interface ZodType<Output, Input = Output> {
  readonly _output: TODO;
  readonly _input: TODO;
}

// Pattern: interface extension with a concrete type argument
// Each primitive schema is just ZodType specialized to a TypeScript primitive.
interface ZodString extends ZodType<TODO> {}
interface ZodNumber extends ZodType<TODO> {}
interface ZodBoolean extends ZodType<TODO> {}
interface ZodNull extends ZodType<TODO> {}
interface ZodUndefined extends ZodType<TODO> {}

// Pattern: generic interface preserving the literal type T
// The constraint limits T to literal-able primitives. ZodLiteral<'hello'>
// should infer as 'hello', not string — the type parameter must not be widened.
interface ZodLiteral<
  T extends string | number | boolean,
> extends ZodType<TODO> {}

// Pattern: indexed access on a generic constraint
// T["_output"] reads the phantom property. That's the entire implementation —
// the phantom property does all the work. z.infer is a one-liner.
namespace z {
  export type infer<T extends ZodType<any, any>> = TODO;
}

// ── Assertions ────────────────────────────────────────────────────────────────
// TypeScript errors below this line = koan not complete.
// Zero errors anywhere in this file = koan done. Run: npx tsc --noEmit

type _01 = Expect<Equal<z.infer<ZodString>, string>>;
type _02 = Expect<Equal<z.infer<ZodNumber>, number>>;
type _03 = Expect<Equal<z.infer<ZodBoolean>, boolean>>;
type _04 = Expect<Equal<z.infer<ZodNull>, null>>;
type _05 = Expect<Equal<z.infer<ZodUndefined>, undefined>>;
type _06 = Expect<Equal<z.infer<ZodLiteral<"hello">>, "hello">>;
type _07 = Expect<Equal<z.infer<ZodLiteral<42>>, 42>>;
type _08 = Expect<Equal<z.infer<ZodLiteral<true>>, true>>;
// Literal types must not widen — the type parameter is preserved as-is:
type _09 = Expect<Equal<z.infer<ZodLiteral<"a" | "b">>, "a" | "b">>;
// _output and _input should be the same when Input is not specified:
type _10 = Expect<Equal<ZodString["_output"], ZodString["_input"]>>;
