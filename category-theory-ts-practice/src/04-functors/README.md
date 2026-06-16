# Functors

## What is a Functor?

A **functor** F: C → D is a mapping between categories that preserves structure:

- It maps each **object** A in C to an object F(A) in D
- It maps each **morphism** f: A → B in C to a morphism F(f): F(A) → F(B) in D
- It preserves **identity**: F(id_A) = id_{F(A)}
- It preserves **composition**: F(g ∘ f) = F(g) ∘ F(f)

## Endofunctors in TS

We focus on **endofunctors** — functors from **TS** back to **TS** (same source and target). An endofunctor is a generic type `F<A>` equipped with a `map` operation:

```typescript
map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
```

The two **functor laws** (in TypeScript terms):

```typescript
// Identity law:
map(fa, x => x)  ===  fa

// Composition law:
map(map(fa, f), g)  ===  map(fa, x => g(f(x)))
```

## Examples in TypeScript

| Functor | `F<A>` | `map` |
|---------|--------|-------|
| Array | `A[]` | `Array.prototype.map` |
| Option | `Option<A>` | applies f to Some, passes None through |
| Reader | `(r: R) => A` | post-composition: `ra => x => f(ra(x))` |
| Promise | `Promise<A>` | `.then` |

## Why Functors?

Functors are the "shape-preserving" maps between types. They let you apply a function inside a context (`A → B` becomes `F<A> → F<B>`) without escaping the context. This is the foundation for `map` everywhere in functional programming.

## Exercises

| File | Concepts |
|------|----------|
| `01-functor-laws.ts` | Verifying identity and composition laws for Array |
| `02-option-functor.ts` | Implementing `map` for `Option<A>` |
| `03-array-functor.ts` | Implementing `map` for arrays without built-ins |
| `04-function-functor.ts` | The Reader functor — `(r: R) => A` |
