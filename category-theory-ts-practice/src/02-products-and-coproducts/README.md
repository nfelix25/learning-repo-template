# Products and Coproducts

Products and coproducts are the categorical way to combine objects. They're defined not by what they *contain* but by how they *relate to everything else* — via universal properties.

## Products (×)

A **product** of A and B is an object A × B equipped with two **projection morphisms**:

```
π₁: A × B → A
π₂: A × B → B
```

satisfying the **universal property**: for any object C with morphisms f: C → A and g: C → B, there exists a unique morphism ⟨f, g⟩: C → A × B such that π₁ ∘ ⟨f, g⟩ = f and π₂ ∘ ⟨f, g⟩ = g.

In TypeScript, **tuples** and **objects** are products:

| CT | TypeScript |
|----|------------|
| A × B | `[A, B]` |
| π₁ | `(pair) => pair[0]` |
| π₂ | `(pair) => pair[1]` |
| ⟨f, g⟩ | `(c) => [f(c), g(c)]` |

Object types like `{ name: string; age: number }` are also products — indexed by string keys instead of positions.

## Coproducts (+)

A **coproduct** (sum) of A and B is an object A + B equipped with two **injection morphisms**:

```
i₁: A → A + B
i₂: B → A + B
```

and an **elimination** operation: given f: A → C and g: B → C, there is a unique morphism [f, g]: A + B → C.

In TypeScript, **union types** are coproducts:

| CT | TypeScript |
|----|------------|
| A + B | `A \| B` |
| i₁ | widening: `(a: A): A \| B => a` |
| i₂ | widening: `(b: B): A \| B => b` |
| [f, g] | narrowing: `if (isA(x)) f(x) else g(x)` |

## Distributivity

Products and coproducts satisfy the distributive law, just like arithmetic:

```
A × (B + C)  ≅  (A × B) + (A × C)
```

In TypeScript: `A & (B | C)` equals `(A & B) | (A & C)`.

## Exercises

| File | Concepts |
|------|----------|
| `01-product-types.ts` | Tuple projections, object lookups, Swap isomorphism |
| `02-sum-types.ts` | Union injection, exhaustive narrowing, union distribution |
| `03-distributivity.ts` | Type-level distributive law proofs |
| `04-isomorphisms.ts` | Type isomorphisms, round-trip proofs |
