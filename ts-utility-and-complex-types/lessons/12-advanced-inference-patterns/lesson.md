> Verified against TypeScript 4.0+ on 2026-05-24. Sources: [TS 4.0 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/) (variadic tuple types, generic spreads, rest in non-trailing positions); [TS 4.2 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/) (leading and middle rest elements, one-rest-per-tuple rule).

# Lesson 12 — Advanced Inference Patterns

## Motivation

Combining `infer` with tuples and mapped types unlocks a class of "unpack and transform" utilities that appear throughout library type definitions. These patterns form the basis for how `Parameters`, `ReturnType`, and variadic utilities are implemented — and they're necessary for the typed pipe/compose patterns in the query builder.

## Mechanic

**Inferring tuple elements**:

```typescript
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never

type H = Head<[string, number, boolean]>  // string
type T = Tail<[string, number, boolean]>  // [number, boolean]
```

**Variadic spread in `extends` (TS 4.0)**:

TypeScript 4.0 introduced generic spreads in tuple positions, enabling inference over spread elements:

```typescript
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B]
type Init<T extends unknown[]> = T extends [...infer I, unknown] ? I : never
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never
```

`Last` uses a *leading rest element* — `[...unknown[], infer L]`. Leading and middle rest elements were formalized in TS 4.2 (one rest per tuple, valid in any position).

**Inferring from mapped type values** — using `infer` over the values of a mapped result:

```typescript
type UnwrapRecord<T> = T extends Record<string, Promise<infer V>> ? V : never
type A = UnwrapRecord<{ a: Promise<string>; b: Promise<number> }>  // string | number (union)
```

Note: when the same `infer V` appears in multiple covariant positions, the results union.

**Chained inference** — using one `infer` result to drive another:

```typescript
type Awaited<T> =
  T extends Promise<infer U>
    ? U extends Promise<unknown>
      ? Awaited<U>
      : U
    : T
```

Each level peels one Promise layer; the chain resolves to the innermost non-Promise type.

## Worked Example

A `ZipTuples` type that pairs corresponding elements:

```typescript
type Zip<A extends unknown[], B extends unknown[]> =
  A extends [infer AHead, ...infer ATail]
    ? B extends [infer BHead, ...infer BTail]
      ? [[AHead, BHead], ...Zip<ATail, BTail>]
      : []
    : []

type R = Zip<[string, number], [boolean, Date]>
// [[string, boolean], [number, Date]]
```

## Pitfalls

- **Covariant infer unifies to union**: two `infer V` bindings in value positions produce `V = T1 | T2`, not a tuple. If you want a tuple, you need separate names (`infer V1`, `infer V2`) and explicit structure.
- **One rest per tuple**: TS 4.2 requires at most one `...infer Rest` per tuple. `[infer A, ...infer B, ...infer C]` is invalid.
- **Recursion depth**: chained inference that recurses can hit depth limits (see lesson 11). For deep transforms, use an accumulator.

## Exercise

Implement the types in `advanced-inference.ts`:

1. `Head<T>` — first element of a tuple; `never` if empty
2. `Tail<T>` — all elements after the first; `[]` if empty or single-element
3. `Last<T>` — last element of a tuple; `never` if empty
4. `Init<T>` — all elements except the last; `[]` if empty or single-element
5. `Zip<A, B>` — pair corresponding elements of two same-length tuples into a tuple of pairs
