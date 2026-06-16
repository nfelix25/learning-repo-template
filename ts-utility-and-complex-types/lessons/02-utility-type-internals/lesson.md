# Lesson 02 — Utility Type Internals

## Motivation

`Partial<T>`, `Pick<T, K>`, `Exclude<T, U>`, `ReturnType<T>` — these ship with TypeScript, but they aren't magic. Each is a mapped or conditional type you could write yourself. Seeing the source makes the whole utility type system legible and removes the mystery from reading complex type definitions in the wild.

## Mechanic

**Modifier utilities** (mapped types):

```typescript
type Partial<T>  = { [K in keyof T]?: T[K] }
type Required<T> = { [K in keyof T]-?: T[K] }
type Readonly<T> = { readonly [K in keyof T]: T[K] }
```

**Key-filter utilities** (mapped types + conditional filtering):

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// Omit filters the key set first, then maps
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```

**Distribution utilities** (conditional types — more in lesson 07):

```typescript
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never
type NonNullable<T> = T extends null | undefined ? never : T
```

**Extraction utilities** (conditional types + `infer` — more in lesson 08):

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Parameters<T> = T extends (...args: infer P) => any ? P : never
```

## Worked Example

```typescript
// Reconstruct Partial from scratch:
type MyPartial<T> = { [K in keyof T]?: T[K] }

// Reconstruct Omit by composing Pick + Exclude:
type MyOmit<T, K extends keyof T> =
  { [P in Exclude<keyof T, K>]: T[P] }

// Usage
type User = { id: number; name: string; email: string }
type UserPreview = MyOmit<User, 'email'>  // { id: number; name: string }
```

The key insight: `Pick` gives you the keys you want, `Omit` uses `Exclude` to subtract keys you don't want.

## Pitfalls

- **`Omit` is not as strict as you might expect**: `Omit<T, K>` in the standard library uses `keyof any` for `K`, not `keyof T`, so it accepts keys that don't exist on `T`. A stricter `StrictOmit<T, K extends keyof T>` is often better in library code.
- **`Exclude` distributes over unions**: `Exclude<string | number, string>` → `number`. This is conditional type distribution (lesson 07) in action.
- **`ReturnType` only sees the last overload**: for overloaded functions, `ReturnType` infers from the last (most permissive) signature.

## Exercise

Implement each utility from scratch in `utility-types.ts`:

1. `MyPartial<T>` — equivalent to `Partial<T>`
2. `MyPick<T, K extends keyof T>` — equivalent to `Pick<T, K>`
3. `MyOmit<T, K extends keyof T>` — equivalent to `Omit<T, K>` but with stricter key constraint
4. `MyExclude<T, U>` — equivalent to `Exclude<T, U>`
5. `MyReturnType<T>` — equivalent to `ReturnType<T>`
