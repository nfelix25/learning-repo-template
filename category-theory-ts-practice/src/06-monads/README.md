# Monads

## What is a Monad?

A **monad** is a functor M equipped with two additional operations:

```
of (pure):   A → M<A>            — lift a value into the context
flatMap:     M<A> → (A → M<B>) → M<B>   — sequence computations
```

satisfying three laws. Compare to a functor's `map: M<A> → (A → B) → M<B>` — the key difference is that the function in `flatMap` returns `M<B>` instead of `B`. This lets you *chain* computations that themselves produce effects.

## The Three Monad Laws

Let `pure = of` and `>>=` = `flatMap`:

```
Left identity:   pure(a) >>= f       = f(a)
Right identity:  m >>= pure           = m
Associativity:   (m >>= f) >>= g     = m >>= (a => f(a) >>= g)
```

These say that `pure` is a neutral element for sequencing, and that chaining is associative — the grouping of `>>=` doesn't matter.

## Why Monads?

Monads sequence *effectful* computations while keeping the effects contained:

| Monad | Effect |
|-------|--------|
| `Option<A>` | Computation that may fail |
| `A[]` | Nondeterministic computation (multiple results) |
| `Reader<R, A>` | Computation that reads from environment R |
| `Promise<A>` | Asynchronous computation |

The key insight: `flatMap` lets you write `f: A → M<B>` (a function that produces an effect) and sequence it into an existing `M<A>` without "double wrapping" into `M<M<B>>`.

## Monads vs Functors

| Operation | Type | Purpose |
|-----------|------|---------|
| `map` | `M<A> → (A → B) → M<B>` | Apply a pure function inside the context |
| `flatMap` | `M<A> → (A → M<B>) → M<B>` | Sequence an effectful function |
| `of` | `A → M<A>` | Inject a pure value into the context |

Every monad is a functor: `map(ma, f) = flatMap(ma, a => of(f(a)))`.

## Exercises

| File | Concepts |
|------|----------|
| `01-monad-laws.ts` | Verifying all three laws for Option |
| `02-option-monad.ts` | Implementing `of` and `flatMap` for Option, chaining |
| `03-array-monad.ts` | Implementing `flatMap` for arrays, Cartesian products |
