> Verified against TypeScript 3.7+ (recursive type aliases in object/array/tuple positions) and TypeScript 4.1+ (recursive conditional types) on 2026-05-24. Sources: [TS 3.7 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/) (recursive aliases, `Json`/`VirtualNode` examples); [TS 4.1 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/) (recursive conditional types, depth-limit warning).

# Lesson 11 — Recursive Types

## Motivation

Recursive types unlock modeling for JSON, deeply nested configurations, file system trees, and deep transformation utilities like `DeepReadonly` and `DeepPartial`. They also hit real compiler limits, and this lesson gives you the techniques to stay within those limits without sacrificing expressiveness.

## Mechanic

**TS 3.7 — Recursive type aliases** (object/array/tuple positions):

```typescript
type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
```

Before TS 3.7, this would error: "Type alias 'Json' circularly references itself." After TS 3.7, recursive references are allowed as long as they appear inside an object, array, or tuple position (not as a bare alias like `type A = A`).

**TS 4.1 — Recursive conditional types**:

TypeScript 4.1 extended recursion to conditional types, enabling a genuine recursive `Awaited`:

```typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T
```

> **Warning from the TS 4.1 release notes**: recursive conditional types "can do a lot of work" and may hit the compiler's internal recursion depth limit, producing "Type instantiation is excessively deep" errors. Keep recursion bounded and prefer the accumulator pattern when depth is a concern.

**Deep transformation pattern**:

```typescript
type DeepReadonly<T> = T extends (infer Item)[]
  ? ReadonlyArray<DeepReadonly<Item>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

This recurses into arrays and objects, leaving primitives as-is.

**Tail recursion / accumulator pattern** — when you need to recurse over a tuple and depth is a concern:

```typescript
type Flatten<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer Head, ...infer Rest]
    ? Head extends unknown[]
      ? Flatten<[...Head, ...Rest], Acc>
      : Flatten<Rest, [...Acc, Head]>
    : Acc
```

The accumulator shifts work from the "return" path to the arguments, which TypeScript can sometimes optimize.

## Worked Example

The canonical `Json` type and a `DeepReadonly` that handles arrays:

```typescript
type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

type Obj = { users: { id: number; roles: string[] }[] }
type ReadonlyObj = DeepReadonly<Obj>
// { readonly users: ReadonlyArray<{ readonly id: number; readonly roles: ReadonlyArray<string> }> }
```

Recursive conditional (`PromiseChain` — unwrap nested Promises):

```typescript
type PromiseChain<T> = T extends Promise<infer U> ? PromiseChain<U> : T
type A = PromiseChain<Promise<Promise<string>>>  // string
```

## Pitfalls

- **"Type instantiation is excessively deep"**: TypeScript imposes a recursion depth limit (~100 instantiations by default). Large structures or unbounded recursion trigger it. Use the accumulator pattern or bound the recursion depth with a depth counter.
- **Circular bare alias**: `type A = A` is still an error. Recursion must be inside a type constructor (object, array, tuple, conditional).
- **Eager evaluation in object positions**: recursive aliases in object positions evaluate eagerly, which can surprise you with very large objects.
- **`any` short-circuits `extends`**: if your recursive type uses `extends object`, passing `any` takes the object branch, which can produce unexpected behavior.

## Exercise

Implement the types in `recursive-types.ts`:

1. `Json` — the recursive JSON value type
2. `DeepReadonly<T>` — recursively make all properties readonly
3. `DeepPartial<T>` — recursively make all properties optional
4. `PromiseChain<T>` — recursively unwrap nested `Promise<Promise<...>>` to the innermost value type
5. `DeepRequired<T>` — recursively make all properties required and non-optional
