## Why

This repo exists as a personal TypeScript practice environment structured around category theory and type theory as a learning framework. The CT framing provides conceptual coherence and motivation — rather than drilling TS features in isolation, each exercise connects to a mathematical idea that gives it meaning.

## What Changes

- Add `tsconfig.json`, `package.json`, and `src/utils.ts` (project scaffolding)
- Add 7 topic directories under `src/`, each with a `README.md` and 4–8 koan files
- Koan files use `Expect<Equal<...>>` for type-level exercises and inline `assert()` for value-level exercises
- All exercises use a `TODO` named placeholder type; value exercises use a `todo()` function
- No test runner — type checking via `tsc --noEmit`, value exercises via `npx tsx <file>`

## Capabilities

### New Capabilities

- `project-scaffold`: `tsconfig.json`, `package.json`, `src/utils.ts` with `Expect`, `Equal`, `TODO`, `todo`
- `objects-and-morphisms`: Terminal/initial objects (`never`, `unknown`), identity morphism, function composition
- `products-and-coproducts`: Tuple/object products, union coproducts, distributivity, type isomorphisms
- `parametricity`: Parametric polymorphism, free theorems intuition, natural transformations as polymorphic functions
- `functors`: Functor laws, `Option<T>`, `Array<T>`, and `Reader<R, A>` functors
- `higher-kinded-types`: The interface-based HKT encoding pattern in TypeScript, abstract functor interface
- `monads`: Monad laws, `Option` and `Array` monads, `flatMap`/`chain`
- `adjunctions`: Curry/uncurry as the canonical adjunction example, product/exponential relationship

### Modified Capabilities

## Impact

- New repo with no existing code — purely additive
- Runtime dependency: none; dev dependencies: `typescript`, `tsx`
- Exercises require TypeScript 5.x (uses `satisfies`, conditional types, template literals)
