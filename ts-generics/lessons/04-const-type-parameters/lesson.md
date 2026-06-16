> Verified against TypeScript 5.0 on 2026-05-23.

# Lesson 04 — const Type Parameters

## Motivation

Generic functions widen inline literals to their base types. Always. Before TypeScript 5.0, if you wanted to preserve the exact tuple or literal type at the call site, you had to document "`as const` required" and hope callers remembered:

```typescript
function makeRoutes<T extends readonly string[]>(routes: T): T { return routes; }

makeRoutes(['/', '/about', '/contact'])
// T = string[]  ← widened; the literal tuple is gone
// To fix this at the call site: makeRoutes(['/', '/about', '/contact'] as const)
```

TypeScript 5.0 added the `const` modifier to type parameters. It moves the "treat this as `as const`" intent into the function declaration, where it belongs:

```typescript
function makeRoutes<const T extends readonly string[]>(routes: T): T { return routes; }

makeRoutes(['/', '/about', '/contact'])
// T = readonly ['/', '/about', '/contact']  ← preserved, no as const needed
```

## Mechanic

### Syntax

Place `const` before the type parameter name:

```typescript
function f<const T>(value: T): T { return value; }
```

### What it does

`const T` tells TypeScript to infer `T` as narrowly as possible, as if `as const` were applied to the argument expression. This affects tuples, object literals, and nested structures:

```typescript
function capture<const T>(value: T): T { return value; }

capture(['a', 'b'])          // T = readonly ['a', 'b']
capture({ x: 1, y: 2 })     // T = { readonly x: 1; readonly y: 2 }
capture(42)                  // T = 42  (already a literal)
```

### Variables vs inline expressions

`const` type parameters only affect *inline expressions* at the call site. If you pass a variable, its type is already resolved:

```typescript
const arr = ['a', 'b'];      // type: string[] (widened at declaration)
capture(arr)                  // T = string[]  (const modifier has no effect on variables)
capture(['a', 'b'])           // T = readonly ['a', 'b']  (inline: const modifier fires)
```

This is not a bug — the variable's type was already widened when it was declared. To preserve literals through a variable, use `const arr = ['a', 'b'] as const` at declaration.

### The readonly constraint requirement

The `const` modifier infers tuples as `readonly`. If your constraint uses a *mutable* array type, the inferred `readonly` tuple won't be assignable to it, and TypeScript silently falls back to widened inference:

```typescript
// ✗ Mutable constraint: const modifier silently does nothing
function broken<const T extends string[]>(items: T): T { return items; }
broken(['a', 'b']) // T = string[] — readonly ['a', 'b'] not assignable to string[]

// ✓ Readonly constraint: const modifier works as intended
function fixed<const T extends readonly string[]>(items: T): T { return items; }
fixed(['a', 'b'])  // T = readonly ['a', 'b']
```

**Rule**: whenever you use a `const` type parameter with an array constraint, make the constraint `readonly`.

## Worked example

A configuration builder that needs to know which keys exist at the type level:

```typescript
// Without const: keys widen to string, losing specific names
function makeConfigWide<T extends readonly string[]>(
  keys: T
): Record<T[number], unknown> {
  return Object.fromEntries(keys.map(k => [k, undefined])) as Record<T[number], unknown>;
}

makeConfigWide(['host', 'port', 'debug'])
// return type: Record<string, unknown>  ← key names lost

// With const: keys preserved as a literal tuple, T[number] is the union
function makeConfig<const T extends readonly string[]>(
  keys: T
): Record<T[number], unknown> {
  return Object.fromEntries(keys.map(k => [k, undefined])) as Record<T[number], unknown>;
}

makeConfig(['host', 'port', 'debug'])
// return type: Record<'host' | 'port' | 'debug', unknown>  ← key names preserved
```

The return type `Record<T[number], unknown>` uses an indexed access type: `T[number]` is the union of all element types of the tuple.

## Pitfalls

**Mutable constraint silently negates `const`.** No error is raised — TypeScript just falls back to widened inference. If your `const T` function seems to widen, check whether the constraint is `readonly`.

**Variables already widened at declaration.** A `const` type parameter cannot recover literal types that were already widened when a variable was assigned. This is expected behavior, not a bug.

**`const` on the type parameter is not runtime immutability.** The modifier affects type inference only. At runtime, the value can still be mutated if it's a mutable structure. The `readonly` in the inferred type is a compile-time-only constraint.

## Exercise

Open `const-params.ts`. Two functions are stubbed with standard (non-`const`) type parameters:

1. **`tupleOf`** — add the `const` modifier so that inline tuple arguments are preserved as literal tuple types
2. **`makeConfig`** — add the `const` modifier *and* implement the function; the return type should map each key in the tuple to `unknown`

Run `npm run verify` to check your work.
