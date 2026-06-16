# Lesson 11 — TypeScript's Inference Algorithm

## Motivation

When a generic call produces the wrong type, most developers fix it by trial-and-error: add an annotation here, try `as` there, move on when the red squiggle disappears. That works until it doesn't — and when inference fails in a complex type, you're stuck.

TypeScript's inference algorithm is not magic. It follows a small set of rules that, once understood, make failures predictable. This lesson gives you that mental model so you can diagnose inference problems instead of guessing at solutions.

## Mechanic

### Argument inference (the common case)

TypeScript solves for type parameters by *unifying* parameter types against argument types. For:

```typescript
function pick<T, K extends keyof T>(obj: T, key: K): T[K]
```

Given `pick({ a: 1, b: 'x' }, 'b')`, TypeScript:

1. Sees `obj` has type `T` and the argument is `{ a: number; b: string }` — so `T = { a: number; b: string }`.
2. Sees `key` has type `K extends keyof T` and the argument is `'b'` — so `K = 'b'`.
3. Computes the return type `T[K]` = `{ a: number; b: string }['b']` = `string`.

TypeScript works left-to-right across parameters, filling in what it knows before moving to the next one.

### Contextual typing

*Contextual typing* runs in the opposite direction. When a function literal is passed as an argument, TypeScript can infer its parameter types from the expected type at that position:

```typescript
const result = mapFn([1, 2, 3], (n) => n * 2);
//                               ^ TypeScript knows n: number from T[] context
```

The callback doesn't need an annotation because `T = number` is already solved from the first argument.

### Return position vs. parameter position

Inference from parameter position is *covariant*: TypeScript collects a type from an argument and assigns it to the parameter type variable. Inference from return position is possible but rarer — it happens when TypeScript knows what type a function must return from the call site context.

For `pipe2<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C`:

1. First argument `(n: number) => n * 2` gives `A = number`, `B = number`.
2. Second argument `(n: number) => String(n)` — `B` is already `number`, confirming the intermediate type. `C = string`.
3. Return type `(a: A) => C` = `(a: number) => string`.

The `B` type flows from the output of `f` into the input of `g`. TypeScript unifies both occurrences.

### Tuple inference: preserve structure with `[...T]`

When a type parameter `T extends unknown[]` is inferred from an array literal, TypeScript widens to an array type. To preserve the tuple structure, spread into a tuple in the parameter type:

```typescript
// Widens: T = (number | string)[]
function bad<T extends unknown[]>(arr: T): T { return arr; }

// Preserves: T = [number, string]
function good<T extends unknown[]>(arr: readonly [...T]): T { return arr as T; }
```

### When inference fails

Inference collapses to the constraint (or `unknown`) when TypeScript can't unify. Common causes:

- **No argument to infer from**: a type parameter that only appears in the return position with no argument providing a hint.
- **Conflicting inferences**: the same `T` inferred as `string` from one argument and `number` from another — TypeScript resolves to `string | number`.
- **Depth limit**: deeply recursive conditional types may bail out and produce `unknown` or `never`.

Tools for rescue:

- `as const` at the call site to provide literal types instead of widened types.
- `satisfies` to validate shape while keeping the narrower inferred type (Lesson 12).
- An explicit type argument to override inference entirely.

## Worked example

### `pick` — step by step

```typescript
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const x = pick({ a: 1, b: 'hello' }, 'b');
```

Step 1 — solve `T`: argument `{ a: 1, b: 'hello' }` is typed as `{ a: number; b: string }`, so `T = { a: number; b: string }`.

Step 2 — solve `K`: argument `'b'` must extend `keyof T = 'a' | 'b'`. TypeScript infers `K = 'b'` (the literal type).

Step 3 — compute return: `T[K] = { a: number; b: string }['b'] = string`.

Result: `x: string`.

### `pipe2` — propagating types

```typescript
function pipe2<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a));
}

const composed = pipe2(
  (s: string) => s.length,  // A = string, B = number
  (n: number) => n > 0,     // B confirmed = number, C = boolean
);
// composed: (a: string) => boolean
```

The intermediate type `B = number` is constrained by both the output of `f` and the input of `g`. TypeScript unifies these and reports an error if they don't match.

## Pitfalls

**`unknown[]` doesn't preserve tuple structure.** Use `readonly [...T]` in the parameter type when you need to preserve tuple positions. This is why the `Tail` type uses `[unknown, ...infer R]` rather than just `infer R extends unknown[]`.

**When `T` appears in both in and out positions, TypeScript uses the most specific unification.** If you have `f<T>(a: T, b: T)` and pass `(1, 'x')`, TypeScript infers `T = number | string` — it doesn't error, it widens. Add a constraint or separate type parameters if you need strict matching.

**Inference doesn't backtrack.** TypeScript solves left-to-right across parameters. If an early parameter pins `T` to the wrong type, later parameters inherit that decision. Reordering parameters can sometimes fix inference.

**Explicit type arguments disable inference for that parameter.** `pick<{ a: number }>({a: 1}, 'a')` works, but `pick<{ a: number }, 'b'>({a: 1}, 'b')` would fail — you've now pinned both parameters, and TypeScript checks instead of infers.

## Exercise

Open `inference.ts`. Six stubs need implementing:

**Type aliases** (bodies only — don't change the signatures):
1. `Head<T>` — extract the first element type from a tuple
2. `Tail<T>` — extract all elements after the first from a tuple
3. `Awaited1<T>` — unwrap one level of `Promise`

**Functions** (implement the bodies — signatures are correct):
4. `pick` — return `obj[key]`
5. `pipe2` — return a function that applies `f` then `g`
6. `mapFn` — return `arr` mapped through `fn`

Run `npm run verify` to check your work. All type and runtime assertions should pass.
