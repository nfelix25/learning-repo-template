# Lesson 07 — Distributive Conditional Types

## Motivation

Distribution is what makes `T extends U ? X : Y` map over union members automatically when `T` is a *naked type parameter*. It is the engine behind `Exclude`, `Extract`, and `NonNullable`. Misunderstanding it causes two recurring bugs: types that unexpectedly explode into unions, and types that stubbornly refuse to distribute when you want them to.

## Mechanic

**The naked type parameter rule**: a conditional type `T extends U ? X : Y` distributes over union members when `T` is a bare (unwrapped) type parameter:

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string | number>  // boolean  (true | false)
// TypeScript evaluates: (string extends string ? true : false) | (number extends string ? true : false)
//                     = true | false = boolean
```

Without distribution this would simply be: `string | number extends string ? true : false` → `false`.

**Distribution as union-to-union transformation**:

```typescript
// Exclude is nothing but distribution
type MyExclude<T, U> = T extends U ? never : T

type B = MyExclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'
// ('a' extends 'a' ? never : 'a') | ('b' extends 'a' ? never : 'b') | ('c' extends 'a' ? never : 'c')
// = never | 'b' | 'c' = 'b' | 'c'
```

**Suppressing distribution** — wrap both sides in a tuple:

```typescript
type IsStringExact<T> = [T] extends [string] ? true : false

type C = IsStringExact<string | number>  // false  (no distribution)
```

This is the `[T] extends [U]` idiom. Use it when you want to test whether the *whole* union is assignable, not each member individually.

**`never` and distribution**: `never` is an empty union, so a distributed conditional over `never` yields `never` without evaluating either branch:

```typescript
type D = IsString<never>  // never  (not true, not false)
```

## Worked Example

Building `Extract` and `Exclude` from scratch:

```typescript
type MyExtract<T, U> = T extends U ? T : never
type MyExclude<T, U> = T extends U ? never : T

type Fruit = 'apple' | 'banana' | 'cherry'
type RedFruit = MyExtract<Fruit, 'apple' | 'cherry'>  // 'apple' | 'cherry'
type NotApple = MyExclude<Fruit, 'apple'>              // 'banana' | 'cherry'
```

A non-distributing `IsExact`:

```typescript
type IsExact<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false

type E = IsExact<string, string>        // true
type F = IsExact<string | number, string> // false
```

## Pitfalls

- **`never` input → `never` output**: if you pass `never` to a distributive conditional, you always get `never` back regardless of what the branches produce. Use `[T] extends [never]` to test for `never` explicitly.
- **`any` distributes to both branches**: `any extends U ? X : Y` produces `X | Y`.
- **Forgetting to suppress**: types like `IsArray<string | number>` will distribute if you don't wrap, giving `false | false` = `false` (fine here) but `IsArray<string[] | number>` gives `true | false` = `boolean` (surprising).

## Exercise

Implement the types in `distributive.ts`:

1. `MyExtract<T, U>` — keep only union members of T that extend U
2. `MyExclude<T, U>` — remove from T all members that extend U
3. `ToArray<T>` — distribute T into an array: `string | number` → `string[] | number[]`
4. `NonDistributiveIsArray<T>` — return `true` if the *whole* type T (as a unit) is an array, `false` otherwise; must NOT distribute
5. `FilterNever<T>` — given a record type, remove keys whose value is `never`
