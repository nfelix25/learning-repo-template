# Lesson 08 — Mapped Types

## Motivation

TypeScript's standard library is built on mapped types. `Partial`, `Required`, `Readonly`, `Pick`, `Record` — all of them transform entire object shapes without knowing the exact keys in advance. Once you understand `[K in keyof T]`, you can write your own variants, compose them with conditional types, and stop copying type definitions by hand.

## Mechanic

### Base syntax

```typescript
type Copy<T> = { [K in keyof T]: T[K] };
```

`K in keyof T` iterates over every key of `T`. `T[K]` looks up the value type at that key. The result is structurally identical to `T`.

### Modifiers

Add `?` to make properties optional; add `readonly` to make them readonly:

```typescript
type MyPartial<T>  = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

Remove modifiers with `-`:

```typescript
type Mutable<T>   = { -readonly [K in keyof T]: T[K] };
type Required<T>  = { [K in keyof T]-?: T[K] };
```

### Picking a subset of keys

Constrain the iteration with `K extends SomeUnion` to pick specific keys:

```typescript
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
```

### Key remapping with `as` (TypeScript 4.1+)

Remap keys with an `as` clause after the iteration variable:

```typescript
type Getters<T> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];
};
```

Filter keys by mapping to `never` — TypeScript drops those entries automatically:

```typescript
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

### Homomorphic vs non-homomorphic

A mapped type is **homomorphic** when it iterates directly over `keyof T`. TypeScript copies optional and readonly modifiers from the source type into the result (before your own `+?`/`-readonly` modifiers apply).

```typescript
// Homomorphic — modifiers from T are preserved, then further modified
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Non-homomorphic — iterates a separate union, no modifier inheritance
type Stringify<K extends string> = { [P in K]: string };
```

## Worked example

```typescript
type Person = { name: string; age: number; readonly id: string };

type MyPartial<T>                = { [K in keyof T]?: T[K] };
type MyReadonly<T>               = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type Mutable<T>                  = { -readonly [K in keyof T]: T[K] };

type PartialPerson  = MyPartial<Person>;              // { name?: string; age?: number; readonly id?: string }
type ReadonlyPerson = MyReadonly<Person>;             // { readonly name: string; readonly age: number; readonly id: string }
type NameAndAge     = MyPick<Person, 'name' | 'age'>; // { name: string; age: number }
type MutablePerson  = Mutable<Person>;                // { name: string; age: number; id: string }
```

## Pitfalls

**Non-homomorphic mapped types don't copy modifiers.** If you iterate over a union instead of `keyof T` directly, `readonly` and `?` from the source are not preserved. Always use `[K in keyof T]` when you want modifier inheritance.

**`as` remapping applies after the iteration.** The original key `K` is still available for the value type (`T[K]`), even after the key is remapped to something else.

**Filtering with `as never` removes the key entirely.** There is no way to keep an entry with an empty key. If you remap a key to `never`, that property disappears from the result type.

## Exercise

Open `mapped-types.ts`. Four type aliases are stubbed:

1. **`MyPartial<T>`** — make all properties optional
2. **`MyReadonly<T>`** — make all properties readonly
3. **`MyPick<T, K>`** — keep only the properties whose keys are in `K`
4. **`Mutable<T>`** — remove all `readonly` modifiers

Run `npm run verify` to check your work.
