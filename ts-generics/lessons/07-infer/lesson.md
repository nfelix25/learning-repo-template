> Verified against TypeScript 2.8+ (infer) and 4.7+ (extends constraints on infer) on 2026-05-23.

# Lesson 07 — The infer Keyword

## Motivation

`type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never`

The `infer R` is a type variable that captures — infers — whatever type fills that position in the matched structure. Without `infer`, extracting the return type of an arbitrary function type required either overloads, indexed access gymnastics, or simply wasn't possible.

## Mechanic

### Basic syntax

`infer X` appears inside the `extends` clause of a conditional type. TypeScript introduces `X` into scope as a type variable bound to whatever structure matched at that position:

```typescript
type Unwrap<T> = T extends Array<infer Item> ? Item : never;

type A = Unwrap<string[]>; // string
type B = Unwrap<number[]>; // number
type C = Unwrap<boolean>;  // never (doesn't match Array<...>)
```

`infer` may only appear in the `extends` clause — not in the result branches.

### Multiple infer in one conditional

You can capture several positions at once:

```typescript
type FunctionParts<T> = T extends (...args: infer Params) => infer Ret
  ? { params: Params; ret: Ret }
  : never;

type P = FunctionParts<(a: string, b: number) => boolean>;
// { params: [string, number]; ret: boolean }
```

### Covariant vs contravariant merging

When the same `infer X` name appears at multiple positions and TypeScript must merge candidates:

- **Covariant positions** (output/return): candidates are *unioned*
- **Contravariant positions** (input/parameter): candidates are *intersected*

```typescript
// Covariant — two output positions, same infer name → union
type CovariantMerge<T> = T extends { a: infer U; b: infer U } ? U : never;
type A = CovariantMerge<{ a: string; b: number }>; // string | number

// Contravariant — two parameter positions, same infer name → intersection
type ContraMerge<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
} ? U : never;
type B = ContraMerge<{ a: (x: string) => void; b: (x: number) => void }>;
// string & number = never
```

### TypeScript 4.7: extends constraints on infer

You can constrain an `infer` variable and avoid a nested conditional:

```typescript
// Before 4.7 — nested conditional required:
type FirstString<T> = T extends [infer S, ...unknown[]]
  ? S extends string ? S : never
  : never;

// With 4.7 — inline constraint:
type FirstString<T> = T extends [infer S extends string, ...unknown[]] ? S : never;
```

### infer inside template literal types

`infer` works inside template literal type patterns:

```typescript
type ExtractEventName<T> = T extends `on${infer E}` ? E : never;

type A = ExtractEventName<'onClick'>;  // 'Click'
type B = ExtractEventName<'onChange'>; // 'Change'
type C = ExtractEventName<'click'>;    // never (no 'on' prefix)
```

## Worked example

```typescript
// Standard library utilities, implemented from scratch:

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// One-level Promise unwrap (lesson 05 preview — now with full infer understanding)
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

// Recursive: handles Promise<Promise<string>>
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;

type A = MyReturnType<(x: string) => number>;          // number
type B = MyParameters<(a: string, b: boolean) => void>; // [string, boolean]
type C = MyAwaited<Promise<Promise<string>>>;           // string
```

## Pitfalls

**`infer` in parameter (contravariant) positions with duplicate names gives intersection.** If you reuse the same `infer X` name in two function parameters, you get `X1 & X2` — often `never`. Use distinct names for each position.

**`infer` only in the `extends` clause.** You cannot use `infer` in the result branches (`? X : Y`). The inferred variable is only available in `X` (the true branch).

**Deeply nested `infer` is valid but hard to read.** Prefer intermediate named type aliases when the `infer` chain spans more than two levels.

## Exercise

Open `infer.ts`. Five type aliases are stubbed:

1. **`MyReturnType<T>`** — extract the return type of a function
2. **`MyParameters<T>`** — extract the parameters tuple of a function
3. **`MyAwaited<T>`** — recursively unwrap `Promise<T>`
4. **`PromiseReturn<T>`** — extract the resolved type from a function that returns a Promise
5. **`ExtractEventName<T>`** — extract the suffix from an `` `on${string}` `` event name

Run `npm run verify` to check your work.
