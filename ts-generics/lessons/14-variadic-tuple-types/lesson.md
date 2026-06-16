> Verified against TypeScript 4.0+ on 2026-05-23.

# Lesson 14 — Variadic Tuple Types

## Motivation

Before TypeScript 4.0, rest elements in tuple types were only allowed at the end:

```typescript
type Bad = [string, ...number[], boolean]; // Error in TS < 4.0
```

This made it impossible to type functions that manipulate tuple structure — like concatenating two tuples, removing the first element, or partially applying a typed function. You had to overload extensively or fall back to `any[]`.

TypeScript 4.0 introduced *variadic tuple types*: rest elements (`...T`) can appear anywhere in a tuple, and a generic type parameter `T extends unknown[]` can be spread into a tuple position. This unlocks precise typing for tuple operations.

## Mechanic

### Spreading a type parameter into a tuple

When `T extends unknown[]`, you can spread it into a new tuple:

```typescript
type Append<T extends unknown[], V> = [...T, V];
// Append<[string, number], boolean> = [string, number, boolean]
```

The `...T` spread preserves all elements of `T` at that position. TypeScript evaluates this at the type level — it's not a runtime operation.

### Concatenating two tuple types

```typescript
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];
// Concat<[string, number], [boolean]> = [string, number, boolean]
// Concat<[], [string]>               = [string]
```

### Preserving tuple structure in function parameters

The key to making TypeScript infer a tuple (not an array) from a function argument is to use `readonly [...T]` in the parameter type:

```typescript
function concat<A extends unknown[], B extends unknown[]>(
  a: readonly [...A],
  b: readonly [...B]
): [...A, ...B] {
  return [...a, ...b] as [...A, ...B];
}

concat([1, 2], ['a']); // type: [number, number, string]
```

Without `readonly [...A]`, TypeScript infers array types, losing the tuple positions.

### Removing elements from tuples

The rest-in-front pattern enables removing elements from the start of a tuple:

```typescript
function tail<T extends unknown[]>(arr: readonly [unknown, ...T]): T {
  return arr.slice(1) as T;
}

tail([true, 42, 'x']); // type: [number, string]
```

Here `[unknown, ...T]` matches any tuple with at least one element. `T` captures everything after the first element.

### Partial application with variadic tuples

Variadic tuples make it possible to type partial application precisely:

```typescript
function partialFirst<H, T extends unknown[], R>(
  f: (head: H, ...tail: T) => R,
  head: H
): (...tail: T) => R {
  return (...tail: T) => f(head, ...tail);
}

const add = (a: number, b: number, c: number) => a + b + c;
const add5 = partialFirst(add, 5);
// add5: (b: number, c: number) => number
```

TypeScript infers `H = number`, `T = [number, number]`, `R = number` from the first argument, then constructs the partial type from `T`.

### Rest elements can appear at any position (TS 4.0+)

```typescript
type Middle<T extends unknown[]> = [string, ...T, boolean];
// Middle<[number]> = [string, number, boolean]
```

Multiple rest elements or leading rest elements were not possible before 4.0.

## Worked example

```typescript
// Type-level concatenation:
type AB = Concat<[string, number], [boolean, null]>;
// = [string, number, boolean, null]

// Runtime concatenation with preserved types:
const result = concat(['a', 'b'], [1, 2, 3]);
// result: [string, string, number, number, number]

// Removing the first element:
const rest = tail([true, 'hello', 42] as [boolean, string, number]);
// rest: [string, number]

// Partial application:
const greet = (greeting: string, name: string, punctuation: string) =>
  `${greeting}, ${name}${punctuation}`;

const hello = partialFirst(greet, 'Hello');
// hello: (name: string, punctuation: string) => string

hello('Alice', '!'); // 'Hello, Alice!'
```

## Pitfalls

**Inference requires `readonly [...T]` in the parameter type.** If you write `a: T` instead of `a: readonly [...T]`, TypeScript infers `T` as an array type (`string[]`), not a tuple type (`[string, string]`). The spread-in-tuple form signals to the inference engine to treat the argument as a tuple.

**`as` casts are needed for slice and spread.** Operations like `arr.slice(1)` return `unknown[]` at runtime, not `T`. You need `as T` to satisfy TypeScript. This is a safe cast because you know the structure matches by construction — the type checker verified it through the parameter type.

**Two rest elements in one tuple must each be generic.** TypeScript allows at most one rest element that is *not* a type parameter. `[string, ...string[], number]` is valid (one non-generic rest). `[...string[], ...number[]]` is an error. Use generic parameters to combine two unbounded sequences.

**Variadic types don't work with `IArguments`.** Use rest parameters (`...args: T`) instead of `arguments` when working with variadic tuple types.

## Exercise

Open `variadic-tuples.ts`. Four stubs need implementing:

1. `Concat<A, B>` — type-level tuple concatenation using spread syntax
2. `concat(a, b)` — runtime concatenation returning `[...A, ...B]`
3. `tail(arr)` — return all elements after the first, preserving the tuple type
4. `partialFirst(f, head)` — return a function with the first argument pre-filled

Run `npm run verify` and `npm test` to check your work.
