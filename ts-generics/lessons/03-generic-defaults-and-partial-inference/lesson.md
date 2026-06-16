# Lesson 03 — Generic Defaults and Partial Inference

## Motivation

Generic APIs accumulate type arguments. A function signature like `decode<T, Decoder extends Schema<T>, Error extends BaseError>` is expressive, but requiring callers to supply all three type arguments on every call creates friction. Two features reduce that friction — and one surprising rule explains why they're needed.

**Default type parameters** let you define a fallback type for a parameter when one can't be inferred and none is explicitly provided.

**TypeScript's all-or-nothing inference rule** says you cannot partially specify type arguments: you either let TypeScript infer all of them, or you supply all of them manually. There's no middle ground. This rule is why you'll often see curried functions in advanced TypeScript libraries — they're a workaround, not a stylistic choice.

## Mechanic

### Default type parameters

Declare a default with `= Type` after the parameter name:

```typescript
function createStore<T = unknown>(): { state: T | null } {
  return { state: null };
}

createStore()          // T = unknown (no argument → uses default)
createStore<string>()  // T = string  (explicit override)
```

A default only applies when the type argument can't be inferred *and* no explicit argument is supplied. If T can be inferred from a function argument, the default is never used.

A default can reference an earlier type parameter:

```typescript
function createPair<A, B = A>(first: A, second: B): [A, B] {
  return [first, second];
}

createPair('hello', 42)         // [string, number] — B inferred as number
createPair<string>('hello', 'world') // [string, string] — B defaults to A = string
```

Notice: because `B` has a default, you can specify just `A` and have `B` fall back — this is one place where the all-or-nothing rule has a carve-out.

### The all-or-nothing inference rule

When you call a generic function, TypeScript either infers *all* type arguments from the call site, or you must supply *all* of them manually:

```typescript
function cast<T, U extends T>(value: U): T {
  return value;
}

cast<string>('hello') // Error: Expected 2 type arguments, but got 1
cast<string, string>('hello') // ✓ — must supply both
cast('hello') // ✓ — TypeScript infers both
```

This becomes a problem when you want to *pin one type argument* and have the rest inferred. Defaults help only when the un-pinned parameters have inference sites in the arguments. When they don't, you need a different approach.

### Curried functions for partial type application

Split the type arguments across two function calls — the first call pins the types you want to fix, and the second call infers the rest:

```typescript
// Instead of: cast<T, U extends T>(value: U): T
// Use a curried form:
function narrow<T>(): <U extends T>(value: U) => U {
  return (value) => value;
}

const asNumber = narrow<number>(); // Pins T = number, returns typed function
asNumber(42)      // ✓ — U inferred as 42, return type number
asNumber('hello') // ✗ — string is not assignable to number
```

The outer call `narrow<T>()` captures T. The inner function infers U independently at its own call site. This pattern appears throughout production TypeScript: Zod's `.parse()`, tRPC's `.procedure()`, and many builder APIs follow this shape.

## Worked example

```typescript
// Default activates when no value is available for inference
function createStore<T = unknown>(): { state: T | null; setState: (s: T) => void } {
  let state: T | null = null;
  return {
    state,
    setState(s: T) { state = s; },
  };
}

const generic = createStore();          // { state: unknown | null }
const typed   = createStore<number>();  // { state: number | null }

// Default references a sibling parameter
function createPair<A, B = A>(first: A, second: B): [A, B] {
  return [first, second];
}

createPair('a', 'b')               // [string, string]
createPair<number>('a' as never, 1) // illustrative — rarely done in practice

// Curried partial application
function narrow<T>(): <U extends T>(value: U) => U {
  return (value) => value;
}

const toStringSubtype = narrow<string>();
toStringSubtype('hello') // ✓ — type: string
toStringSubtype('hello' as unknown as number) // caught at call site
```

## Pitfalls

**Defaults don't fire when inference succeeds.** If TypeScript can infer `T` from any argument, the default is never consulted. `createStore<T = unknown>(initial: T)` — calling `createStore(42)` gives `T = number`, not `unknown`. The default only matters when T has no inference site.

**Defaults can hide mistakes.** A default of `unknown` or `any` means callers who forget to specify a type get a wide type silently. In library APIs, prefer narrower defaults (or no default) to force intentional annotation.

**Currying has ergonomic cost.** `narrow<string>()('hello')` has two call sites. If the function is called once at every use site, this is fine; if it's called in a hot loop, the extra closure matters. The pattern is a type-level workaround, not a design goal.

## Exercise

Open `defaults.ts`. Three functions are stubbed:

1. **`createStore`** — add a default type parameter `T = unknown`; implement the state container
2. **`createPair`** — add a default so `B` falls back to `A` when not specified
3. **`narrow`** — rewrite as a curried function that pins `T` on the outer call and infers `U extends T` on the inner call

Run `npm run verify` to check your work.
