/**
 * KOAN 09 — ZodLazy: Recursive Types and Interface Laziness
 *
 * All schemas explored so far are finite — their types fully resolve at
 * compile time with no self-reference. But real-world data is often recursive:
 * a category has subcategories, a comment has replies, a node has children.
 *
 * The problem with recursive type aliases:
 *
 *   type CategorySchema = ZodObject<{
 *     name: ZodString
 *     subcategories: ZodArray<CategorySchema>  // Error! Circular reference
 *   }>
 *
 * TypeScript expands type aliases eagerly. When it tries to resolve
 * `CategorySchema`, it sees `ZodArray<CategorySchema>`, which requires
 * resolving `CategorySchema` again — infinite recursion.
 *
 * The interface trick:
 * TypeScript evaluates interface members LAZILY — the body of an interface
 * is not resolved until a member is actually accessed. This allows:
 *
 *   interface CategorySchema extends ZodObject<{
 *     name: ZodString
 *     subcategories: ZodArray<ZodLazy<CategorySchema>>
 *   }> {}
 *
 * This compiles because `CategorySchema` inside the `extends` clause is
 * a reference to the interface (which is lazily evaluated), not an immediate
 * expansion.
 *
 * ZodLazy<T> is the runtime indirection that makes this work at runtime:
 * instead of holding the schema value directly, it holds a getter function
 * () => T. The getter is called at parse time, by which point the schema is
 * fully initialized. At the TYPE level, ZodLazy<T> simply forwards T's
 * Output and Input — it's transparent to the type system.
 *
 * Why a getter (schema) rather than a property (schema: T)?
 * A property would require the schema to exist when ZodLazy is constructed.
 * A getter allows deferred access — the schema is retrieved on demand.
 * TypeScript models this correctly: the return type of a getter is evaluated
 * when the getter is accessed, not when the containing interface is defined.
 *
 * Your task: implement ZodLazy and the recursive CategorySchema example.
 */

import type { Expect, Equal } from '../shared/test-utils'
import type { ZodType, ZodString, ZodNumber, z } from '../shared/primitives.solution'

// Pre-built: ZodObject and ZodArray for the recursive example
type ZodRawShape = Record<string, ZodType<any, any>>
type ZodObjectOutput<T extends ZodRawShape> = { [K in keyof T]: T[K]["_output"] }
interface ZodObject<T extends ZodRawShape> extends ZodType<ZodObjectOutput<T>> {
  readonly shape: T
}
interface ZodArray<T extends ZodType<any, any>> extends ZodType<T["_output"][]> {}

// ── Types to implement ────────────────────────────────────────────────────────

type TODO = never

// Pattern: transparent wrapper — forwards T's Output and Input unchanged
// The `schema` getter (not a property) enables lazy evaluation in recursive contexts
interface ZodLazy<T extends ZodType<any, any>> extends ZodType<TODO, TODO> {
  get schema(): T
}

// ── The recursive type example ─────────────────────────────────────────────
//
// STEP 1: Try this (uncomment to see the error):
//   type BadCategory = ZodObject<{ name: ZodString; subcategories: ZodArray<BadCategory> }>
//   Error: Type alias 'BadCategory' circularly references itself.
//
// STEP 2: Use an interface instead (interfaces are lazily evaluated):
//
// Pattern: interface declaration with ZodLazy to defer schema resolution
// The interface extends ZodObject — filling in the shape with the recursive reference.
// ZodLazy wraps the self-reference to allow the circular type.
interface CategorySchema extends ZodObject<{
  name: ZodString
  subcategories: ZodArray<ZodLazy<CategorySchema>>
}> {}

// ── Assertions ────────────────────────────────────────────────────────────────

// ZodLazy forwards the inner schema's output unchanged
type _01 = Expect<Equal<z.infer<ZodLazy<ZodString>>, string>>
type _02 = Expect<Equal<z.infer<ZodLazy<ZodLazy<ZodNumber>>>, number>>

// ZodLazy's schema getter returns the wrapped schema
type _03 = Expect<Equal<ZodLazy<ZodString>["schema"], ZodString>>

// ZodLazy forwards _input as well as _output
type _04 = Expect<Equal<ZodLazy<ZodString>["_input"], string>>

// The recursive CategorySchema resolves at the first level
type CategoryOutput = z.infer<CategorySchema>
type _05 = Expect<Equal<CategoryOutput["name"], string>>

// subcategories is an array of objects with the same shape
type _06 = Expect<Equal<CategoryOutput["subcategories"][0]["name"], string>>

// The type is infinitely recursive — TypeScript handles it with lazy evaluation
// Accessing multiple levels works at compile time:
type _07 = Expect<Equal<CategoryOutput["subcategories"][0]["subcategories"][0]["name"], string>>
