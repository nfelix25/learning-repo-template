# Lesson 04 — Intersection Algebra

## Motivation

Intersections are the less-intuitive sibling of unions. Where `A | B` means "A or B," `A & B` means "satisfies A *and* B simultaneously." They appear in mixin patterns, branded types, and utility types like `Omit`. Understanding when intersections produce `never` — and how they differ from interface extension — prevents a category of subtle type bugs.

## Mechanic

**Basic intersection**: a value of type `A & B` must be assignable to both `A` and `B`:

```typescript
type Named = { name: string }
type Aged  = { age: number }
type Person = Named & Aged  // { name: string; age: number }
```

**When intersection produces `never`**: intersecting two incompatible primitive types:

```typescript
type Impossible = string & number  // never
```

**Intersection vs. interface extension** — they differ when properties have duplicate names with incompatible types:

```typescript
interface A { x: string }
interface B extends A { x: string | number }  // error: incompatible

type C = { x: string } & { x: string | number }  // x: string & (string | number) = string
```

Interfaces catch the conflict at definition; intersections resolve it by intersecting the types (which may produce `never` for incompatible primitives).

**Mixin pattern**: compose capabilities by intersecting multiple interfaces:

```typescript
type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date }
type TimestampedUser = WithTimestamps<User>
```

## Worked Example

```typescript
// Merge two object types where B's keys override A's
type Merge<A, B> = Omit<A, keyof B> & B

type Defaults = { color: string; size: number; hidden: boolean }
type Overrides = { color: 'red'; extra: string }

type Result = Merge<Defaults, Overrides>
// { size: number; hidden: boolean; color: 'red'; extra: string }
```

`Merge` uses `Omit` to drop conflicting keys from `A`, then intersects with `B` — so `B`'s types win.

## Pitfalls

- **Function intersections behave as overloads**, not merged signatures. `((x: string) => void) & ((x: number) => void)` is a function that can be called with either a string or a number.
- **`keyof (A & B)` = `keyof A | keyof B`**: an intersection exposes *all* keys from both types.
- **`keyof (A | B)` = `keyof A & keyof B`**: a union only exposes *shared* keys (TypeScript 2.8+).

## Exercise

Implement the types in `intersection-algebra.ts`:

1. `WithTimestamps<T>` — intersect `T` with `{ createdAt: Date; updatedAt: Date }`
2. `Merge<A, B>` — like `Object.assign`: B's keys override A's
3. `IntersectValues<T>` — given a record `T`, produce the intersection of all value types
4. A runtime `merge<A, B>(a: A, b: B): Merge<A, B>` function
