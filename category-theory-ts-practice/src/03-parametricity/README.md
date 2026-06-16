# Parametricity

## Parametric Polymorphism

A **parametrically polymorphic** function works *uniformly* across all types — it cannot inspect or branch on the specific type it's given. In TypeScript, a generic function `<A>(a: A) => ...` is parametric when it doesn't use `any`, type assertions, or `typeof` to detect the concrete type of `A`.

Parametricity is a *constraint*, and constraints give you information:

- `<A>(a: A) => A` — can only return `a`. There's nowhere else to get an A.
- `<A>(as: A[]) => A` — can only return an existing element (or `undefined`/throw).
- `<A, B>(f: (a: A) => B, a: A) => B` — can only return `f(a)`.

## Free Theorems

Parametricity gives us **free theorems**: facts about a function that follow from its type alone, without inspecting its implementation.

For a function `h: <A>(as: A[]) => A[]`, the free theorem says:

```
for any f: A → B and any as: A[]:
  h(as).map(f)  =  h(as.map(f))
```

This means `h` must be a "structure-preserving" operation on lists — it can reorder, duplicate, or drop elements, but it cannot create new values of type A. The theorem holds for *all* implementations of `h` that are truly parametric.

## Natural Transformations

A **natural transformation** η: F ⟹ G is a family of morphisms `η_A: F(A) → G(A)` for each object A, satisfying the **naturality condition**:

```
η_B ∘ F(f)  =  G(f) ∘ η_A    for every morphism f: A → B
```

In TypeScript, a polymorphic function `<A>(fa: F<A>) => G<A>` is a natural transformation precisely when it satisfies the naturality square. By parametricity, *every* polymorphic function between functors is automatically natural.

```
     F(A) ──── η_A ────▶ G(A)
      │                   │
    F(f)               G(f)
      │                   │
      ▼                   ▼
     F(B) ──── η_B ────▶ G(B)
```

## Exercises

| File | Concepts |
|------|----------|
| `01-polymorphic-functions.ts` | What parametric types can implement, free theorems intuition |
| `02-natural-transformations.ts` | Naturality condition, `headOption` as a nat transform |
