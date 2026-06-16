# Adjunctions

## What is an Adjunction?

An **adjunction** F ⊣ G between categories C and D is a pair of functors:

```
F: C → D    (left adjoint)
G: D → C    (right adjoint)
```

equipped with a natural isomorphism:

```
Hom_D(F(A), B)  ≅  Hom_C(A, G(B))
```

This says: morphisms from F(A) to B in D correspond naturally to morphisms from A to G(B) in C. The correspondence is a bijection, and it's natural in both A and B.

## Curry/Uncurry: The Canonical Example

The most accessible adjunction in programming is **currying**:

```
Hom(A × B, C)  ≅  Hom(A, B → C)
```

In words: a function from the product A × B to C corresponds naturally to a curried function from A to a function B → C.

The two sides of the isomorphism are:

```typescript
curry:   (f: (a: A, b: B) => C) => (a: A) => (b: B) => C
uncurry: (f: (a: A) => (b: B) => C) => (a: A, b: B) => C
```

They are mutual inverses:
```
curry(uncurry(f))   = f    (for all curried f)
uncurry(curry(g))   = g    (for all uncurried g)
```

## The Structure

In CT terms, this adjunction involves:
- **Left functor** F: `A ↦ A × B` (product with B — the "product functor")
- **Right functor** G: `C ↦ (B → C)` (function space from B — the "exponential functor")
- The adjunction: `F ⊣ G`, i.e., product is left adjoint to the internal Hom

The **naturality** of the isomorphism means curry/uncurry commutes with pre- and post-composition — the bijection respects the morphism structure, not just the sets.

## Why Adjunctions Matter

Adjunctions generalize many fundamental concepts:
- Products and exponentials (curry)
- Free/forgetful functors
- Limits and colimits
- Monads arise from composing adjoint pairs (F ∘ G is a monad when F ⊣ G)

Curry is the clearest example because it appears constantly in functional programming.

## Exercises

| File | Concepts |
|------|----------|
| `01-currying.ts` | Implementing curry/uncurry, round-trip verification, naturality |
| `02-products-and-exponentials.ts` | Type-level Curry/Uncurry, universal property at the type level |
