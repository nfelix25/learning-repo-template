## Why

Building a Zod-like schema library from scratch as a TypeScript learning exercise, focusing entirely on the type-level internals — phantom types, mapped types, conditional types, variadic tuples, and the Input/Output duality — rather than runtime validation logic. The goal is to understand how Zod's authors used the TypeScript type system to solve real problems, by solving those same problems yourself.

## What Changes

- Introduce a `src/shared/test-utils.ts` with the `Expect<Equal<>>` type-assertion utilities used throughout the koans and in Zod's own test suite
- Introduce a `src/shared/primitives.solution.ts` with a complete reference implementation of the foundational types (fallback for koan 00)
- Introduce 10 koan files (`src/koans/00-primitives.ts` through `src/koans/09-lazy-recursive.ts`), each targeting a distinct Zod internal type pattern
- Add `tsconfig.json` and `package.json` configured for strict, pure type-checking (`tsc --noEmit`)

## Capabilities

### New Capabilities

- `test-utils`: `Expect<Equal<X, Y>>` type-assertion harness — the variance-trick utility used for type-level testing
- `koan-00-primitives`: `ZodType<Output, Input>` phantom base, primitive schemas, `z.infer` utility
- `koan-01-object-shape`: `ZodObject<T>` mapped type — unwrapping a raw shape to its output type
- `koan-02-object-methods`: Type-level object transformations: `.partial()`, `.pick()`, `.omit()`, `.extend()`, `.merge()`
- `koan-03-array-tuple`: `ZodArray<T>` and `ZodTuple<T>` — variadic tuple type inference
- `koan-04-union`: `ZodUnion<T>` — distributive conditional types over a tuple of schemas
- `koan-05-optional-nullable-default`: `ZodOptional`, `ZodNullable`, `ZodDefault` — where Input ≠ Output begins
- `koan-06-effects-transform`: `ZodEffects<T, Output, Input>` — the full Input/Output split via `.transform()`
- `koan-07-discriminated-union`: `ZodDiscriminatedUnion` — literal type extraction and discriminant constraints
- `koan-08-branded`: `ZodBranded<T, B>` — nominal typing via intersection brands
- `koan-09-lazy-recursive`: `ZodLazy<T>` — recursive type references and the interface trick

### Modified Capabilities

## Impact

- New directory: `src/` with `shared/` and `koans/` subdirectories
- New config files: `tsconfig.json`, `package.json`
- No runtime code — purely type-level TypeScript; `tsc --noEmit` is the only execution needed
- No external dependencies beyond `typescript` as a devDependency
