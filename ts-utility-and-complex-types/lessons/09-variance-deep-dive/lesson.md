# Lesson 09 — Variance Deep Dive

## Motivation

Variance explains which types are assignable to which, and the answers are sometimes counterintuitive. Why can you pass `(x: Animal) => void` where `(x: Dog) => void` is expected, but not the other way around? Why does a mutable array of `Dog` fail where a mutable array of `Animal` is expected? These questions have precise answers, and understanding them closes the loop on both the `infer` position behavior from lesson 08 and the distribution surprises from lesson 07.

## Mechanic

**Covariance** — a type constructor `F` is covariant in `T` when `T1 extends T2` implies `F<T1> extends F<T2>`. Output/read positions are covariant.

```typescript
type Producer<T> = () => T   // covariant: Producer<Dog> extends Producer<Animal>
```

A `Producer<Dog>` is assignable to `Producer<Animal>` because whenever you call it you get a Dog, and a Dog is an Animal.

**Contravariance** — `F` is contravariant in `T` when `T1 extends T2` implies `F<T2> extends F<T1>` (the direction flips). Input/write positions are contravariant.

```typescript
type Consumer<T> = (x: T) => void  // contravariant: Consumer<Animal> extends Consumer<Dog>
```

A `Consumer<Animal>` (handles any animal) can be used wherever a `Consumer<Dog>` is needed — because it can certainly handle a Dog. But a `Consumer<Dog>` (only handles dogs) cannot be used where a general-animal consumer is expected.

**Invariance** — mutable containers are invariant because they are both producers and consumers.

```typescript
// Array<T> is invariant in practice for mutable arrays:
const dogs: Dog[] = []
// const animals: Animal[] = dogs  // error in strict mode
```

**Liskov substitution principle** — the mental model: you can always substitute a *more specific* type in an output position, and a *more general* type in an input position.

**`in`/`out` annotations (TypeScript 4.7)**:

TypeScript can infer variance, but explicit `in`/`out` annotations improve performance and serve as documentation:

```typescript
interface Producer<out T> { produce(): T }   // out = covariant
interface Consumer<in T> { consume(x: T): void }  // in = contravariant
interface Both<in out T> { transform(x: T): T }   // invariant
```

If the annotation contradicts the actual variance, TypeScript reports an error.

**Connection to `infer`**: because `infer` captures a type variable from the pattern in the `extends` clause:
- Return type (covariant) → union when multiple candidates
- Parameter type (contravariant) → intersection when multiple candidates

This is exactly lesson 08's observation, now fully explained.

## Worked Example

```typescript
type Animal = { name: string }
type Dog = Animal & { breed: string }

// Covariant: return position
type GetAnimal = () => Animal
type GetDog = () => Dog
const getDog: GetDog = () => ({ name: 'Rex', breed: 'Lab' })
const getAnimal: GetAnimal = getDog  // OK — GetDog is a subtype of GetAnimal

// Contravariant: parameter position
type HandleAnimal = (a: Animal) => void
type HandleDog = (d: Dog) => void
const handleAnimal: HandleAnimal = (a) => console.log(a.name)
const handleDog: HandleDog = handleAnimal  // OK — HandleAnimal is a subtype of HandleDog
```

## Pitfalls

- **TypeScript is unsound for methods**: TypeScript allows method parameters to be bivariant (both co- and contravariant) for pragmatic reasons. This can produce runtime errors that the type system doesn't catch. Use function property syntax (`prop: (x: T) => void` vs `method(x: T): void`) to get proper contravariance checks.
- **Readonly arrays are covariant**: `readonly Dog[]` is assignable to `readonly Animal[]`, but mutable `Dog[]` is not assignable to `Animal[]`.
- **`in`/`out` annotations do not change variance** — they document and validate it. TypeScript will error if your annotation is wrong.

## Exercise

Implement the types and verify your understanding in `variance.ts`:

1. `ReadonlyBox<T>` — a covariant wrapper: box that only allows reading T (use `out` annotation)
2. `WriteOnlyBox<T>` — a contravariant wrapper: box that only allows writing T (use `in` annotation)
3. `InvariantBox<T>` — an invariant wrapper: allows both reading and writing T (use `in out`)
4. `Covariant<F, T1 extends T2, T2>` — a type-level assertion: verify `F<T1>` extends `F<T2>` given F is covariant (use a conditional type)
5. `IntersectParams<T>` — if T is `{ a: (x: infer U) => void; b: (x: infer U) => void }`, extract U (demonstrate contravariant intersection via `infer`)
