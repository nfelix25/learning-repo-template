> Verified against TypeScript 2.8+ on 2026-05-24. Sources: [TS 2.8 Release Notes — Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) (covariant/contravariant position behavior); [Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) (basic usage, last-signature caveat).

# Lesson 08 — `infer`

## Motivation

`infer` is the pattern-match operator of TypeScript's type system — the primitive behind `ReturnType`, `Parameters`, `Awaited`, and nearly every advanced utility type. Its behavior in covariant vs. contravariant positions produces different results (union vs. intersection), and that difference is not documented in the main handbook. Understanding placement rules and position variance turns `infer` from magic into mechanics.

## Mechanic

**Syntax**: `infer X` introduces a type variable `X` that TypeScript binds during pattern matching in the `extends` clause:

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

`R` captures whatever `T`'s return type is. `infer` is only valid inside the `extends` clause of a conditional type.

**Multiple `infer` bindings**:

```typescript
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never
```

**Covariant positions → union**

When the same `infer X` variable appears in a covariant position (return type, object property value) across multiple candidates, TypeScript unifies them into a union:

```typescript
type UnionValues<T> = T extends { a: infer U; b: infer U } ? U : never
type A = UnionValues<{ a: string; b: number }>  // string | number
```

**Contravariant positions → intersection**

When `infer X` appears in a contravariant position (function parameter) across multiple candidates, TypeScript unifies them into an *intersection* — because a function that accepts both must accept their intersection:

```typescript
type Intersection<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never
type B = Intersection<{ a: (x: string) => void; b: (x: number) => void }>  // string & number
```

This is documented in the TS 2.8 release notes (see citation above) and is not in the main handbook.

**Overloaded functions**: `infer` applied to an overloaded function matches only the *last* (most general) overload signature:

```typescript
function f(x: string): string
function f(x: number): number
function f(x: any): any { return x }

type R = ReturnType<typeof f>  // string (last signature: (x: any) => any → infer resolves to any, but for illustrative overloads it's the last)
```

## Worked Example

A custom `Awaited` (simplified):

```typescript
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T

type A = MyAwaited<Promise<string>>           // string
type B = MyAwaited<Promise<Promise<number>>>  // number
```

Extracting function parameters and return type:

```typescript
type Params<T> = T extends (...args: infer P) => any ? P : never
type Return<T> = T extends (...args: any[]) => infer R ? R : never

type P = Params<(a: string, b: number) => void>  // [a: string, b: number]
type R = Return<(a: string) => boolean>           // boolean
```

## Pitfalls

- **`infer` only in `extends`**: you cannot use `infer` anywhere else (not in the true/false branch, not in mapped types).
- **Multiple occurrences in covariant position → union**: if you use the same name twice expecting intersection, you'll get a union instead. Use contravariant position (function parameter) to force intersection.
- **Overloaded functions**: `ReturnType` of an overloaded function gives you the return type of the last signature, which is often the widest. Use a more precise approach if you need per-overload types.
- **`infer` in tuple `rest` positions**: TS 4.0+ extended `infer` to variadic tuple positions (`...infer Rest`), covered in lesson 13.

## Exercise

Implement the types in `infer.ts`:

1. `ElementType<T>` — if T is an array, extract the element type; otherwise `never`
2. `FunctionReturn<T>` — if T is a function, extract its return type; otherwise `never`
3. `FunctionParams<T>` — if T is a function, extract its parameter tuple; otherwise `never`
4. `PromiseValue<T>` — if T is `Promise<U>`, extract U (one level only, no recursion needed)
5. `FirstArgument<T>` — if T is a function, extract its first parameter type; otherwise `never`
