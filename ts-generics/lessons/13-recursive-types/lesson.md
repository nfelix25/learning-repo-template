> Verified against TypeScript 3.7+ on 2026-05-23.

# Lesson 13 — Recursive Types

## Motivation

Many real-world data structures are self-referential: a JSON value can contain other JSON values, a tree node contains child nodes, a deeply-nested object needs every level made partial or readonly at once. Before TypeScript 3.7, type aliases could not reference themselves — you had to use interfaces or creative workarounds. Since 3.7, recursive type aliases are fully supported.

Recursive types let you express these structures precisely in a single definition, and combine naturally with conditional types and mapped types to build utilities that operate at every depth.

## Mechanic

### Basic recursive type alias

A type alias becomes recursive when it references itself:

```typescript
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
```

TypeScript evaluates this lazily — it doesn't expand `Json` infinitely at definition time. The recursion is resolved only when a specific type is checked against it.

### Recursive conditional types

Conditional types can recurse on themselves to traverse structure:

```typescript
type FlattenArray<T> = T extends (infer U)[] ? FlattenArray<U> : T;
```

- If `T` is an array (like `string[][]`), extract the element type `U = string[]` and recurse.
- If `T` is not an array, return `T` directly.

The recursion terminates when `T` is a non-array type.

### Recursive mapped types

Mapped types can recurse to reach every level of an object:

```typescript
type DeepPartial<T> =
  T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
```

The `T extends object` guard ensures primitive types pass through unchanged. For object types, every property is made optional (`?`) and the value type is recursively deepened.

Similarly for `DeepReadonly`:

```typescript
type DeepReadonly<T> =
  T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
```

### When to use `type` vs `interface` for recursion

Both work for recursive object types, but `type` is more flexible:

- Only `type` supports recursive union types (like `Json`).
- `interface` can be recursive via property definitions, but can't express a type that is itself a union member.
- For recursive conditional types, `type` is the only option.

### Depth limits and escape hatches

TypeScript has a recursion depth limit for conditional types (typically around 100 levels). If you hit it, you'll see an error like "Type instantiation is excessively deep and possibly infinite."

For very deep recursion, an intermediate type alias can sometimes help by giving TypeScript a stable reference point:

```typescript
// Instead of directly recursive conditional:
type DeepPartial<T> = T extends object ? DeepPartialObj<T> : T;
type DeepPartialObj<T> = { [K in keyof T]?: DeepPartial<T[K]> };
```

In practice, the depth limit is rarely reached with typical data shapes.

## Worked example

```typescript
// The Json type accepts any valid JSON structure:
const data: Json = {
  name: 'Alice',
  scores: [1, 2, 3],
  meta: { active: true, notes: null },
};

// DeepPartial makes every nested property optional:
type User = { id: number; address: { street: string; city: string } };
type PartialUser = DeepPartial<User>;
// { id?: number; address?: { street?: string; city?: string } }

// This allows a partial update with any subset of fields:
const update: PartialUser = { address: { city: 'Boston' } };

// FlattenArray unwraps nested arrays:
type Grid = number[][];
type Row = FlattenArray<Grid>;   // number
type Cell = FlattenArray<number[][][]>; // number
```

## Pitfalls

**`T extends object` includes arrays and functions.** If you want to exclude arrays from your recursive mapped type, add `T extends unknown[] ? T : T extends object ? ...`. Most utilities like `DeepPartial` intentionally recurse into arrays' element types, but it's worth knowing what `object` includes.

**Recursive types can be slow for the TypeScript compiler.** Wide unions combined with deep recursion multiply the number of types the checker must evaluate. Keep recursive types bounded when possible.

**`Json` doesn't include `undefined`.** JSON has no `undefined` value — `undefined` is not a valid JSON value. `JSON.stringify` silently drops `undefined` properties. Don't add `undefined` to the `Json` union.

**Circular references in instances don't match `Json`.** The type `Json` describes serializable values. An object with a circular reference (`const x = {}; x.self = x`) isn't assignable to `Json` at runtime (and `JSON.stringify` will throw), though TypeScript's structural type system can't always catch this at compile time.

## Exercise

Open `recursive.ts`. Four stubs need implementing:

1. `Json` — a union type for all valid JSON values (recursive via arrays and objects)
2. `DeepPartial<T>` — make every property optional at every depth
3. `DeepReadonly<T>` — make every property readonly at every depth
4. `FlattenArray<T>` — recursively unwrap nested arrays to their element type

Run `npm run verify` to check your work. All type assertions should pass.
