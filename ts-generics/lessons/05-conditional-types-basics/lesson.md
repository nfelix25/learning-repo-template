> Verified against TypeScript 2.8+ on 2026-05-23.

# Lesson 05 — Conditional Types Basics

## Motivation

Before TypeScript 2.8, the type system had no branching. A function's return type was fixed — you couldn't say "if the argument is a string, return `string`; if it's a `Promise<string>`, return `string` too." Generic constraints let you *narrow* inside a function body, but the output type still couldn't depend on the shape of the input in this way.

Conditional types introduced type-level `if` expressions. They're the foundation for half of TypeScript's standard utility types and a prerequisite for `infer`, distributivity, and recursive types.

## Mechanic

### Syntax

```typescript
T extends U ? X : Y
```

Read it as: "if type `T` is assignable to type `U`, resolve to `X`; otherwise resolve to `Y`."

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>;      // false
type C = IsString<string>;  // true
```

### `never` — the bottom type

`never` represents a type with no inhabitants. No value has type `never`. It's the result of an impossible condition, an unreachable code path, or a filtered-out union member:

```typescript
type IsNever<T> = [T] extends [never] ? true : false;
// (The [T] wrapper avoids distributivity — covered in Lesson 06)
```

A conditional branch that resolves to `never` effectively removes that branch:

```typescript
type OnlyStrings<T> = T extends string ? T : never;
type A = OnlyStrings<string | number | boolean>; // string
```

### `unknown` — the top type

`unknown` is the opposite of `never`. Every type is assignable to `unknown`. It's the safe counterpart to `any`:

```typescript
// T extends unknown is always true — this is always X:
type AlwaysX<T> = T extends unknown ? 'x' : 'y'; // 'x' for any T
```

### Standard library utilities, decoded

These built-ins are literally just conditional types:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
//   NonNullable<string | null>  → string
//   NonNullable<null>           → never

type Extract<T, U> = T extends U ? T : never;
//   Extract<'a' | 'b' | 'c', 'a' | 'c'> → 'a' | 'c'

type Exclude<T, U> = T extends U ? never : T;
//   Exclude<'a' | 'b' | 'c', 'a'>       → 'b' | 'c'
```

(Distribution over unions is what makes `Extract` and `Exclude` work — that's Lesson 06.)

### Deferred evaluation

When `T` is an unresolved generic type parameter (not a concrete type), TypeScript defers the conditional. It doesn't resolve to `X` or `Y` until `T` is known:

```typescript
type Wrap<T> = T extends string ? string[] : number[];

function f<T>(x: T): Wrap<T> {
  // Inside here, TypeScript can't resolve Wrap<T> — T is still generic
  // You can't just return [] — you'd need a cast
  return [] as Wrap<T>; // assertion required
}
```

This deferral is intentional and correct: `T` might be `string`, `number`, a union, or anything else. Resolution happens at each concrete call site.

## Worked example

```typescript
// Is T an array type?
type IsArray<T> = T extends readonly unknown[] ? true : false;

type A = IsArray<number[]>;         // true
type B = IsArray<readonly string[]>; // true
type C = IsArray<string>;           // false

// Simplified Awaited — unwraps one layer of Promise
// (Lesson 07 covers infer in depth; here we use it minimally)
type SimpleAwaited<T> = T extends Promise<infer R> ? R : T;

type D = SimpleAwaited<Promise<string>>;  // string
type E = SimpleAwaited<number>;           // number (not a Promise, unchanged)

// NonNullable reimplemented:
type MyNonNullable<T> = T extends null | undefined ? never : T;

type F = MyNonNullable<string | null | undefined>; // string
```

## Pitfalls

**Deferral surprises inside generic functions.** If you write `if (typeof x === 'string') return x` inside a generic function, TypeScript narrows the *runtime* type. But the *return type* annotation `T extends string ? string : never` remains deferred until the call site. You'll need a cast (`as`) to satisfy the type checker inside the function body.

**`T extends never` is not `true` for any inhabited T.** The expression `T extends never ? X : Y` evaluates to `Y` for any `T` that actually has values. `never` has no members, so nothing can be "assignable to `never`" at the value level. The only type where `T extends never` is true is when `T` itself is `never` (covered in Lesson 06 via distributivity).

**Conditional types are not narrowed inside `if` bodies.** Unlike `typeof` or `instanceof` guards, a conditional type alias doesn't give you narrowed access inside a generic function body. It's a type-level expression, not a runtime guard.

## Exercise

Open `conditional-types.ts`. Four type aliases are stubbed with wrong return types.

For each:
1. Replace the stub with the correct conditional type expression
2. `MyAwaited<T>` uses `infer` to extract the Promise's type argument — look at the hint in the stub

These are pure type-level definitions — there's no function body to implement. Run `npm run verify` to check. (Since these are type aliases, `npm test` will pass either way; the typecheck step is what catches errors.)
