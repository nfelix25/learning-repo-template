> Verified against TypeScript 4.2+ on 2026-05-24. Sources: [TS 4.0 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/) (core variadic syntax: generic spreads, labeled tuple elements, `concat`/`tail`); [TS 4.2 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/) (leading and middle rest elements, one-rest-per-tuple rule, `[...string[], number]` pattern).

# Lesson 13 — Variadic Tuple Types

## Motivation

Before TS 4.0, typing `pipe`, `curry`, or `concat` with exact argument shapes required dozens of overloads. Variadic tuple types replace that wall of overloads with a single generic that captures the exact shape of each argument position. This lesson builds the foundational tuple manipulation types and shows how they compose into a typed `pipe`.

## Mechanic

**Spread in tuple positions (TS 4.0)**:

```typescript
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B]
type R = Concat<[string, number], [boolean]>  // [string, number, boolean]
```

`...A` and `...B` are generic spreads — they expand type parameters in tuple context. This is different from a rest parameter; the compiler knows the exact tuple shape.

**Rest elements in any position (TS 4.2)**:

```typescript
// Leading rest
type WithLeading = [...string[], number]   // any number of strings, then a number

// Middle rest
type WithMiddle = [string, ...number[], boolean]  // string, any numbers, boolean
```

Constraint: **at most one rest element per tuple**. `[...A, ...B, ...C]` is invalid when all three are unconstrained rest variables.

**Labeled tuple elements** (TS 4.0) — documentation only, no runtime effect:

```typescript
type Range = [start: number, end: number]
type Callback<T extends unknown[]> = (...args: T) => void
```

**Prepend and Append**:

```typescript
type Prepend<T, Arr extends unknown[]> = [T, ...Arr]
type Append<Arr extends unknown[], T> = [...Arr, T]
```

**Building a typed `pipe`** — the payoff:

```typescript
type Pipe2<A, B, C> = (ab: (a: A) => B, bc: (b: B) => C) => (a: A) => C

function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C {
  return (a) => bc(ab(a))
}
```

For arbitrary arity, variadic tuples make this exact without overloads (though the full type-safe pipe for N functions requires recursive types from lesson 11/12).

## Worked Example

A typed `concat` and a two-step `pipe`:

```typescript
function concat<A extends unknown[], B extends unknown[]>(a: [...A], b: [...B]): [...A, ...B] {
  return [...a, ...b]
}

const r = concat([1, 'two'], [true, new Date()])
// r: [number, string, boolean, Date]  — exact shape inferred
```

## Pitfalls

- **One rest per tuple**: you can write `[...A, ...B]` when A and B are concrete tuples (TypeScript can spread them), but you cannot have two generic rest parameters in a single tuple literal.
- **`readonly` tuple vs. mutable**: rest spreads produce mutable tuples. If you need `readonly`, wrap with `Readonly<...>` or use the `readonly` modifier explicitly.
- **Generic spreads require the type to extend `unknown[]`**: `T extends unknown[]` is the usual constraint for a variadic tuple parameter.

## Exercise

Implement the types and functions in `variadic-tuples.ts`:

1. `Prepend<T, Arr extends unknown[]>` — produce a new tuple with T at the front
2. `Append<Arr extends unknown[], T>` — produce a new tuple with T at the end
3. `Concat<A extends unknown[], B extends unknown[]>` — concatenate two tuples
4. `concat<A, B>(a: A, b: B): Concat<A, B>` — runtime version of Concat
5. `Drop1<T extends unknown[]>` — remove the first element (same as Tail from lesson 12, but implemented with spread syntax)
