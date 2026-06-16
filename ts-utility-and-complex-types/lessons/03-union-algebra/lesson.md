# Lesson 03 — Union Algebra

## Motivation

Unions are TypeScript's primary tool for modeling "one of these shapes." Every time you model async state, action types, or API responses, you reach for a union. Discriminated unions in particular — with exhaustive narrowing — are the foundation of safe, maintainable TypeScript code. Understanding how unions behave also sets up the distribution behavior in lesson 07.

## Mechanic

**Basic union**: `A | B` means "a value of type `A` OR type `B`."

**Discriminated union**: a union whose members each carry a unique literal-typed discriminant property:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }
```

TypeScript narrows the union inside branches:

```typescript
function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2   // s: { kind: 'circle'; radius: number }
    case 'rect':   return s.width * s.height         // s: { kind: 'rect'; ... }
  }
}
```

**`never` as the union identity**: `T | never` = `T`. You can use this for exhaustiveness checking:

```typescript
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`)
}

// If you forget a case in the switch, TS reports an error at the default:
function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2
    // If 'rect' is missing, s has type { kind: 'rect'; ... } at default,
    // which is not assignable to never → compile error.
    default: return assertNever(s)
  }
}
```

## Worked Example

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function getMessage<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':    return 'Not started'
    case 'loading': return 'Loading...'
    case 'success': return `Got ${JSON.stringify(state.data)}`
    case 'error':   return `Error: ${state.error.message}`
    default:        return assertNever(state)
  }
}
```

## Pitfalls

- **Excess property checking is not narrowing**: TypeScript checks extra properties at assignment, but doesn't narrow on non-discriminant properties.
- **Union members with overlapping structures don't auto-narrow** without a discriminant property. If both members have `{ name: string }`, TypeScript can't tell them apart.
- **`never` in a union is silently dropped**: `string | never` simplifies to `string`. This is by design — `never` is the empty type.

## Exercise

Implement the types and functions in `union-algebra.ts`:

1. `AsyncState<T>` — discriminated union with `idle | loading | success | error` variants
2. `transition<T>` — given the current state and an event, return the next state
3. `assertNever` — exhaustiveness guard
4. `describeState<T>` — returns a human-readable string for each state variant, using `assertNever` in the default case
