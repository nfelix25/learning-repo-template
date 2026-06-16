# Lesson 01 — Mapped Type Anatomy

## Motivation

Nearly every utility type in TypeScript's standard library — `Partial`, `Pick`, `Readonly`, `Record` — is a mapped type under the hood. If you can write a mapped type from scratch, you can reconstruct any of them, extend them, and compose them. This lesson covers the syntax and mechanics before the later lesson on utility type internals puts them to use.

## Mechanic

A mapped type iterates over a set of keys and produces a new object type:

```typescript
type Copy<T> = { [K in keyof T]: T[K] }
```

`keyof T` produces the union of `T`'s keys. `K in keyof T` iterates over them. `T[K]` accesses the value type at each key.

**Property modifiers** alter optionality and mutability:

```typescript
type AllOptional<T>  = { [K in keyof T]?: T[K] }         // +? (adds ?)
type AllRequired<T>  = { [K in keyof T]-?: T[K] }         // -? (removes ?)
type AllReadonly<T>  = { readonly [K in keyof T]: T[K] }  // +readonly
type AllMutable<T>   = { -readonly [K in keyof T]: T[K] } // -readonly
```

**Key remapping with `as`** transforms or filters keys:

```typescript
// rename keys
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }

// filter keys by mapping unwanted ones to never
type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] }
```

Mapping a key to `never` removes it from the output type.

## Worked Example

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

type User = { readonly id: number; readonly name: string }
type MutableUser = Mutable<User>
// { id: number; name: string }  — readonly removed

type FunctionKeys<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}

type Service = { id: number; start(): void; stop(): void }
type ServiceMethods = FunctionKeys<Service>
// { start: () => void; stop: () => void }
```

## Pitfalls

- **Modifier syntax vs. assertion syntax**: `-readonly` in a mapped type is a modifier; `as` in the key position is key remapping — don't mix them up.
- **Key remapping filters via `never`**: mapping a key `as never` removes it. Mapping values to `never` does not remove the key — only key remapping does.
- **`string & K`**: because `keyof T` can include `symbol` keys, `Capitalize<K>` requires `string & K` to constrain it.

## Exercise

Implement the types in `mapped-types.ts`:

1. `Mutable<T>` — remove `readonly` from all properties
2. `Optional<T, K extends keyof T>` — make only the listed keys optional, leaving others required
3. `ReadonlyRequired<T>` — make all properties both `readonly` AND required (remove `?`)
4. `FilterByValue<T, V>` — keep only keys whose value type extends `V`
5. `Getters<T>` — produce `{ getFoo(): T['foo'], getBar(): T['bar'], ... }` for each key

Run `vitest lessons/01-mapped-type-anatomy` to check your work.
