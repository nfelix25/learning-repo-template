# Lesson 05 — Conditional Type Mechanics

## Motivation

Conditional types are the if-expressions of TypeScript's type system. They're the engine behind `ReturnType`, `NonNullable`, `Extract`, and most advanced utility types. Understanding their evaluation rules — especially the deferred vs. eager distinction — prevents a class of bugs where a type "should" evaluate but doesn't.

## Mechanic

**Basic syntax**:

```typescript
type IsString<T> = T extends string ? true : false
type A = IsString<string>   // true
type B = IsString<number>   // false
```

`T extends U ? X : Y` reads: "if `T` is assignable to `U`, resolve to `X`; otherwise resolve to `Y`."

**Deferred vs. eager evaluation**: in a non-generic context, conditional types evaluate immediately. In a generic context (when `T` is unresolved), they are *deferred*:

```typescript
type IsString<T> = T extends string ? true : false

type C = IsString<string | number>  // evaluated eagerly → boolean (distributes — see lesson 07)
function test<T>(x: T): IsString<T> { ... }  // deferred until T is known
```

**The `{}` and `any` gotchas**:

```typescript
// {} matches almost everything (everything except null/undefined)
type D = {} extends object ? true : false   // true (but {} is not the same as object)

// any is special: it matches both branches
type E = any extends string ? true : false  // boolean (both branches taken)
```

**When to use conditional types vs. overloads**:
- Conditional types: type transformations, utility types, generics that map one type to another
- Overloads: functions with distinct call signatures where each signature needs its own implementation

## Worked Example

```typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T

type A = Flatten<string[]>  // string
type B = Flatten<number>    // number (passes through)
type C = Flatten<Array<Array<string>>>  // Array<string> (one level only)
```

Combining with `keyof` to build a utility:

```typescript
type FunctionProps<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}
```

## Pitfalls

- **`never extends U` is always true**: `never` is assignable to everything, so conditional types with `never` as the checked type always take the true branch.
- **`any extends U`**: produces a union of both branches — TypeScript essentially evaluates *both* `X` and `Y` and unions them.
- **Deferred conditionals block narrowing**: if a function returns `T extends string ? A : B`, TypeScript may not be able to narrow the return type inside the implementation even when `T` is proven to be `string`.

## Exercise

Implement the types and functions in `conditional-types.ts`:

1. `IsArray<T>` — `true` if T is an array type, `false` otherwise
2. `IsPromise<T>` — `true` if T extends `Promise<any>`, `false` otherwise
3. `UnwrapPromise<T>` — if T is `Promise<U>`, resolve to `U`; otherwise resolve to `T`
4. `NonNullish<T>` — remove `null` and `undefined` from T (reimplementing `NonNullable`)
5. `IfExtends<T, U, Yes, No>` — if `T extends U`, produce `Yes`; otherwise `No`
6. `IsStringLabel<T>` — practice basic conditional syntax and eager evaluation
7. `Flatten<T>` — implement the one-level array flattening worked example
8. `FunctionProps<T>` — combine conditional types with `keyof` and key remapping
9. `ExtendsEmptyObject<T>` — explore the `{}` non-nullish gotcha
10. `ExtendsObject<T>` — contrast `{}` with `object`
11. `EmptyObjectExtendsObject` — check the direct `{}` / `object` relationship
12. `AnyBranch<T>` — observe how `any` produces both conditional branches
13. `NeverExtendsString` — observe the direct `never extends U` rule
14. `IsNever<T>` — detect `never` by avoiding distributive conditional behavior
15. `ParseValueReturn<T>` — model a named conditional return type that overloads could also express
16. `WrapReturn<T>` — practice a deferred conditional return shape that resolves for concrete callers
