# Lesson 10 — Variance

## Motivation

"Type X is not assignable to type Y" — this error, when it involves generic containers or callbacks, is almost always a variance problem. Variance describes the rules for when one parameterized type is assignable to another. Knowing these rules lets you read and fix such errors on sight, design APIs that work correctly at the type level, and understand why `ReadonlyArray<Dog>` is safely assignable to `ReadonlyArray<Animal>` but `Dog[]` is not (even though TypeScript allows it — a deliberate, documented unsoundness).

## Mechanic

### The core question

Given `Dog extends Animal`, when does `Box<Dog>` extend `Box<Animal>`?

It depends on how `T` is used inside `Box<T>`:

- **Covariant** (output position only): `Box<Dog>` extends `Box<Animal>`. Safe — wherever you expect an Animal out, a Dog out is fine.
- **Contravariant** (input position only): `Box<Animal>` extends `Box<Dog>`. Safe — wherever you accept a Dog in, accepting an Animal in is fine (it's more permissive).
- **Invariant** (both positions): neither direction is safe. `Box<Dog>` and `Box<Animal>` are unrelated.

### Functions are contravariant in parameters

```typescript
type Handler<T> = (value: T) => void;

type AnimalHandler = Handler<Animal>; // (value: Animal) => void
type DogHandler    = Handler<Dog>;    // (value: Dog) => void
```

`Handler<Animal>` is assignable to `Handler<Dog>`: an animal handler can accept a Dog (which is an Animal), so it's safe. The parameter type "flips" the subtype relationship.

### Covariant position: return types and `out` modifier

```typescript
interface ReadableBox<out T> {
  get(): T;
}
```

`T` appears only in return position (covariant). `ReadableBox<Dog>` is safely assignable to `ReadableBox<Animal>` — a function that returns a Dog satisfies any caller expecting an Animal.

### Contravariant position: parameters and `in` modifier

```typescript
interface WriteBox<in T> {
  set(value: T): void;
}
```

`T` appears only in parameter position (contravariant). `WriteBox<Animal>` is safely assignable to `WriteBox<Dog>` — a setter that accepts any Animal can certainly accept a Dog.

### TypeScript 4.7: explicit `in`/`out` variance modifiers

Before 4.7, TypeScript inferred variance structurally. From 4.7, you can declare it explicitly:

```typescript
interface Covariant<out T>     { get(): T }
interface Contravariant<in T>  { set(value: T): void }
interface Invariant<in out T>  { get(): T; set(value: T): void }
```

Benefits:
1. **Documentation** — the modifier communicates intent to readers and tools.
2. **Performance** — TypeScript can skip deep structural checks for declared-variance types.
3. **Error catching** — TypeScript errors if you use `out T` in a parameter position, enforcing the contract.

### Method bivariance (the unsoundness)

TypeScript allows `Dog[]` to be assigned to `Animal[]` because `Array` has a method that puts `T` in both input and output positions, but TypeScript treats methods as bivariant for usability. This is a deliberate unsoundness — and why `ReadonlyArray<T>` is safer when you want sound covariance.

## Worked example

```typescript
type Animal = { name: string };
type Dog    = { name: string; breed: string };

interface ReadableBox<out T> { get(): T }
interface WriteBox<in T>     { set(value: T): void }

const dogReadBox: ReadableBox<Dog>    = { get: () => ({ name: 'Rex', breed: 'Lab' }) };
const animalReadBox: ReadableBox<Animal> = dogReadBox;  // ✓ covariant

const animalWriteBox: WriteBox<Animal> = { set: (a) => console.log(a.name) };
const dogWriteBox: WriteBox<Dog>       = animalWriteBox; // ✓ contravariant

// Swapping them the wrong way:
// const animalReadBox2: ReadableBox<Dog> = { get: () => ({ name: 'Cat' }) }; // ✓ still ok structurally
// const dogWriteBox2: WriteBox<Animal>   = { set: (d: Dog) => d.breed };      // ✗ can't use breed on Animal
```

## Pitfalls

**Method bivariance vs property bivariance.** TypeScript distinguishes between method syntax (`get(): T`) and property-function syntax (`get: () => T`). Methods are bivariant; property functions are covariant. Use property-function syntax when soundness matters.

**Explicit `in`/`out` modifiers are checked, not inferred.** If you declare `out T` but use `T` in a parameter position, TypeScript errors. This is the point — explicit modifiers catch future accidental violations.

**Invariance is the default.** Without modifiers, generic type parameters are checked structurally and may be treated as invariant when TypeScript can't prove safety. If you see assignability errors with generic types, variance is often the cause.

## Exercise

Open `variance.ts`. Two interfaces are stubbed without variance modifiers, and two factory functions need implementing:

1. **`ReadableBox<T>`** — add the `out` modifier; `T` should only appear in return position
2. **`WriteBox<T>`** — add the `in` modifier; `T` should only appear in parameter position
3. **`makeReadBox<T>`** — return an object with a `get()` method that returns the wrapped value
4. **`makeWriteBox<T>`** — return an object with a `set()` method that calls the provided setter

Run `npm test` to check the runtime behavior; `npm run verify` to typecheck.
