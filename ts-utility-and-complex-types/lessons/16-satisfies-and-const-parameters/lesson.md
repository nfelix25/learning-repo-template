# Lesson 16 — `satisfies` and `const` Type Parameters

## Motivation

Two recurring frustrations in TypeScript: you want to validate a value against a type without losing the narrow literal type the compiler inferred; and you want a generic function to preserve the exact literal type of its argument instead of widening it. TypeScript 4.9 added `satisfies` and TypeScript 5.0 added `const` type parameters to close both gaps cleanly.

## Mechanic

**`satisfies` (TS 4.9)** — validates a type without widening:

```typescript
type ColorMap = Record<string, string>

// Without satisfies: type is widened to ColorMap, literals lost
const colors1: ColorMap = { red: '#f00', blue: '#00f' }
colors1.red  // string — lost the '#f00' literal

// With satisfies: type is validated AND kept narrow
const colors2 = { red: '#f00', blue: '#00f' } satisfies ColorMap
colors2.red  // '#f00' — literal preserved
```

The right-hand expression is checked against the type after `satisfies`, but the inferred type of the binding is the *narrower* inferred type, not the widened constraint.

**`as const`** — freezes a value's type to its literal form:

```typescript
const config = { env: 'production', port: 3000 } as const
// type: { readonly env: 'production'; readonly port: 3000 }
```

`as const` applies `readonly` to all properties and preserves string/number/boolean literal types. It is heavier than `satisfies` — it makes everything readonly, which you may not want.

**`const` type parameters (TS 5.0)** — preserve literal inference through generic calls:

```typescript
function identity<T>(x: T): T { return x }
identity({ a: 1 })           // T = { a: number } — widened

function identityConst<const T>(x: T): T { return x }
identityConst({ a: 1 })      // T = { a: 1 } — literal preserved
```

The `const` modifier on `T` instructs TypeScript to infer the narrowest possible type (as if `as const` were applied). This is particularly useful for builder APIs, route registries, and configuration functions.

**When to use which**:

| Goal | Tool |
|---|---|
| Validate value against type, keep narrow | `satisfies` |
| Freeze value to all-literal readonly | `as const` |
| Preserve literals through a generic call | `const T` |
| Both validate and readonly | `satisfies` + `as const` |

## Worked Example

A route registry where values stay narrow:

```typescript
type Route = { method: 'GET' | 'POST'; path: string }
type RouteMap = Record<string, Route>

const routes = {
  getUser:  { method: 'GET',  path: '/users/:id' },
  createUser: { method: 'POST', path: '/users' },
} satisfies RouteMap

routes.getUser.method  // 'GET' — not widened to 'GET' | 'POST'
```

Without `satisfies`, annotating `: RouteMap` would widen `method` to `'GET' | 'POST'`.

## Pitfalls

- **`satisfies` does not narrow the constraint**: if a key is missing, you get a type error on the `satisfies` expression — but the error message is sometimes confusing.
- **`const T` can cause inference issues**: if the caller explicitly passes a widened type, `const T` still uses that widened type. It only affects inference, not explicit annotations.
- **`as const` is deep but can't be combined with non-literal types**: `{ fn: () => {} } as const` will error because functions don't have literal types.

## Exercise

Implement the functions and types in `satisfies.ts`:

1. `makeConfig<const T extends Record<string, unknown>>(config: T): T` — returns the config with literal types preserved via `const T`
2. `makeRoutes<const T extends Record<string, { method: string; path: string }>>(routes: T): T` — same pattern for a route registry
3. `PALETTE` — a color map constant using `satisfies Record<string, string>` so each color value is kept as a literal
4. `LiteralPick<T, K extends keyof T>` — pick keys from a `const`-inferred object; same as `Pick` but name it to reinforce the pattern
