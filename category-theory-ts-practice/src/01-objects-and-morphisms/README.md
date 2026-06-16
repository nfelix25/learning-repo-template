# Objects and Morphisms

A **category** consists of:

1. A collection of **objects**
2. For each pair of objects A and B, a collection of **morphisms** (arrows) A → B
3. A **composition** operation: if f: A → B and g: B → C, then g ∘ f: A → C
4. For each object A, an **identity morphism** id\_A: A → A

Two laws must hold:

```
Associativity:  h ∘ (g ∘ f)  =  (h ∘ g) ∘ f
Identity:       id_B ∘ f  =  f  =  f ∘ id_A
```

## TypeScript as a Category

The category **TS** has:

| CT concept       | TypeScript equivalent                        |
|------------------|----------------------------------------------|
| Object           | A type (`string`, `number`, `Option<A>`, …)  |
| Morphism A → B   | A (total) function `(a: A) => B`             |
| Composition      | `(f, g) => x => g(f(x))`                    |
| Identity id\_A   | `<A>(a: A) => a`                             |

## Special Objects

Every well-behaved category has two distinguished objects:

**Initial object (⊥)**  
Has exactly one morphism *into* every other object. You can always escape from it, but you can never construct it. In **TS**: `never`. The unique morphism `never → A` is called `absurd`.

**Terminal object (⊤)**  
Has exactly one morphism *from* every other object. Every type maps into it (via the coercion/upcast), and you learn nothing from the result. In **TS**: `unknown`.

## Subtyping = Morphism Existence

The TypeScript subtype relation `A extends B` is how we observe morphism existence in the type system. If `A extends B`, there is a (unique) inclusion morphism A → B. This is why:

- `never extends A` for all A — the initial object maps into everything
- `A extends unknown` for all A — everything maps into the terminal object

## Exercises

| File | Concepts |
|------|----------|
| `01-terminal-and-initial.ts` | `never`, `unknown`, absurd, union/intersection laws |
| `02-identity.ts` | identity morphism, parametricity, uniqueness |
| `03-composition.ts` | `compose`, associativity, identity laws |
