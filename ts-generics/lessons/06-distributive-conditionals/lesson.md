> Verified against TypeScript 2.8+ on 2026-05-23.

# Lesson 06 — Distributive Conditional Types

## Motivation

Consider `type ToArray<T> = T extends any ? T[] : never`. Apply it to `string | number`. Your first guess might be `(string | number)[]`. TypeScript gives you `string[] | number[]` instead.

This is *distributivity*, and it's intentional — but it catches almost everyone the first time. This lesson explains why it happens and how to opt out when you don't want it.

## Mechanic

### Distribution over unions

When the *checked type* in a conditional is a **naked type parameter** — `T extends U` where `T` appears bare, not wrapped in another type — TypeScript distributes the conditional over each member of a union:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>;
// Distributed as: ToArray<string> | ToArray<number>
// = string[] | number[]
```

The union is split into its members, each member is evaluated independently, and the results are unioned.

### Suppressing distribution

Wrap `T` in a one-element tuple to prevent distribution:

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type B = ToArrayNonDist<string | number>;
// [string | number] is a single tuple type — no distribution
// = (string | number)[]
```

The `[T]` is not a union, so the conditional evaluates once with `T = string | number`.

### Why `Extract` and `Exclude` work

Both standard utilities rely on distribution:

```typescript
type Extract<T, U> = T extends U ? T : never;
// Extract<'a' | 'b' | 'c', 'a' | 'c'>
// = ('a' extends 'a'|'c' ? 'a' : never) | ('b' extends 'a'|'c' ? 'b' : never) | ('c' extends 'a'|'c' ? 'c' : never)
// = 'a' | never | 'c'
// = 'a' | 'c'
```

Without distribution, `Extract` would just return the whole `T` or `never` — not useful.

### Distribution over `never`

When `T = never`, distributing over `never` yields `never` (there are no union members to evaluate):

```typescript
type ToArray<T> = T extends any ? T[] : never;
type C = ToArray<never>; // never — nothing to distribute over
```

This makes `never` "bottom out" through conditional types.

## Worked example

```typescript
// Distributive: wraps each union member separately
type ToMaybe<T> = T extends unknown ? { value: T } | null : never;

type A = ToMaybe<string | number>;
// { value: string } | null | { value: number } | null
// = { value: string } | { value: number } | null

// Non-distributive: wraps the entire union
type ToMaybeNonDist<T> = [T] extends [unknown] ? { value: T } | null : never;

type B = ToMaybeNonDist<string | number>;
// { value: string | number } | null
```

Use the distributive version when you want each union member handled independently. Use the non-distributive version when you want the whole union treated as one type.

## Pitfalls

**Distribution only triggers on naked type parameters.** `Array<T> extends unknown ? ...` does not distribute, because `Array<T>` is not a naked `T`.

**Distribution produces unexpectedly wide results.** A utility type that wasn't designed to distribute may silently produce a wider union than intended. Check your conditional types against union inputs before publishing them in a library.

**`T extends never` is vacuously `never`.** Any conditional `T extends U ? X : Y` evaluates to `never` when `T = never` — not to `Y`. This surprises developers who expect the false branch for an impossible type.

## Exercise

Open `distributive.ts`. Three type aliases are stubbed:

1. **`ToMaybe<T>`** — distributive: wraps each union member in `{ value: T } | null`
2. **`ToMaybeNonDist<T>`** — non-distributive: wraps the whole type in `{ value: T } | null`
3. **`IsUnion<T>`** — returns `true` for union types, `false` for single types, `never` for `never`

For `IsUnion<T>`, the trick is to compare the distributed result against the full type. Hint: `type IsUnion<T, U = T> = U extends U ? ([T] extends [U] ? false : true) : never`.

Run `npm run verify` to check your work.
