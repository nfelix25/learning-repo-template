## Why

TypeScript's type system is a distinct functional language layered on top of JavaScript — one that 5-year practitioners routinely underuse because its advanced features (conditional types, infer, phantom types, covariance) are rarely encountered organically. This project builds an exhaustive, test-driven koan curriculum that teaches intermediate-through-advanced TypeScript from first principles, including all TypeScript 5.x and 6.x features, running on the TypeScript 7 compiler.

## What Changes

- Introduces a new standalone TypeScript koans project with ~55 numbered koan files
- Each koan teaches one concept via embedded narrative comments + failing tests (type-level and runtime)
- Koans progress linearly through 12 phases, each phase building on the last
- Project runs on TypeScript 7 with Vitest as the test runner
- A `TODO` sentinel type enables progressive solving: everything compiles from day one

## Capabilities

### New Capabilities

- `project-setup`: Package config, tsconfig, Vitest config, test utility types (`Expect`, `Equal`, `TODO`)
- `phase-01-advanced-generics`: Generic constraints, defaults, `const` type params (TS 5.0), `NoInfer<T>` (TS 5.4)
- `phase-02-type-narrowing`: `typeof`/`instanceof`/`in`, discriminated unions, type predicates, assertion functions, inferred type predicates (TS 5.5)
- `phase-03-mapped-types`: Basic mapping, `+`/`-` modifiers, key remapping with `as`, template literal keys, filtering with `never`
- `phase-04-conditional-types`: Basic conditionals, distributive behavior, `infer`, `infer` + `extends` constraints (TS 5.4), recursive conditionals
- `phase-05-template-literal-types`: Basic template literals, intrinsic string manipulation, combined with mapped types, pattern matching
- `phase-06-variadic-tuples`: Tuple basics and labels, spreads, variadic patterns, tuple↔union conversions
- `phase-07-recursive-types`: Recursive aliases, `DeepPartial`/`DeepReadonly`, path types, JSON type
- `phase-08-type-level-programming`: Rebuilding stdlib utilities, function type manipulation, string manipulation at type level
- `phase-09-advanced-patterns`: Branded/nominal types, phantom types, covariance & contravariance, builder pattern, type-safe event emitters
- `phase-10-ts5-features`: New decorators, decorator metadata, `using`/`Symbol.dispose`, async disposal, getter/setter flexibility, `switch(true)` narrowing, `groupBy` types, Set methods, never-initialized variable errors
- `phase-11-ts6-features`: `strict` unpacked, Temporal API, `RegExp.escape`, Map upsert methods, control flow improvements, `noUncheckedSideEffectImports`
- `phase-12-ts7-epilogue`: Go compiler rewrite context, `--builders` flag, migration notes

### Modified Capabilities

## Impact

- New project in `/Users/noelfelix/Code/koans/typescript/`
- Dependencies: TypeScript 7, Vitest, `tsx`, `pnpm`
- No existing code modified — greenfield
