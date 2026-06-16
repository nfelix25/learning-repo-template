## Why

Learning TypeScript's type system in isolation misses the deeper framework it's built on. Set theory, type theory, and lambda calculus *explain* why TypeScript works the way it does — but there's no progressive, self-contained koan-style curriculum that teaches them together through TypeScript's own type-level language.

## What Changes

- Introduces a complete koan curriculum as a TypeScript project
- Each koan is a `.ts` file: theory commentary + fill-in-the-blank type alias + compile-time tests
- Running `tsc --noEmit` is the entire feedback loop — red = unsolved, clean = done
- Five progressive modules, each building on the last

## Capabilities

### New Capabilities

- `project-setup`: TypeScript project scaffold — `tsconfig.json`, `package.json`, test utility types (`Expect`, `Equal`, `Extends`, `NotEqual`)
- `module-01-sets`: Types as sets — `never`, `unknown`, literal types, union, intersection, assignability as subset relation
- `module-02-algebra`: Algebraic laws — identity, annihilation, distributivity, complement (`Exclude`/`Extract`), object subtyping, variance, the `any` anomaly
- `module-03-conditionals`: Conditional types — basic, distributive, `infer`, recursive types
- `module-04-functions`: Generics as type-level lambda, mapped types, template literals, Church encoding
- `module-05-curry-howard`: Curry-Howard correspondence — types as propositions, programs as proofs, constructive vs classical logic

### Modified Capabilities

## Impact

- Net-new project (no existing code)
- No runtime dependencies; only `typescript` as a dev dependency
- Tooling: `tsc --noEmit` only
