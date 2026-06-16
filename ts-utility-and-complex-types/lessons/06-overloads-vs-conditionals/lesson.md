# Lesson 06 — Overloads vs Conditional Return Types

## Motivation

Two tools exist for "input type A → output type X, input type B → output type Y": function overloads and conditional generic return types. Choosing the wrong one produces confusing error messages at call sites, unsound implementations, or both. The practical heuristic is simple once you understand what each tool is actually doing.

## Mechanic

**Function overloads** declare multiple call signatures above the implementation:

```typescript
function wrap(x: string): string[]
function wrap(x: number): number[]
function wrap(x: string | number): string[] | number[] {
  return [x as any]
}

wrap('hi')  // string[]
wrap(42)    // number[]
```

Overloads resolve left-to-right at call sites. The implementation signature is not externally visible. TypeScript checks arguments against each overload signature in order and uses the first match.

**Conditional return types** use generics:

```typescript
function wrap<T extends string | number>(x: T): T extends string ? string[] : number[] {
  return [x] as any  // cast required — TS can't narrow inside conditional return types
}
```

This compiles but forces an `as any` cast inside the implementation because TypeScript cannot narrow a deferred conditional type within the function body.

**The heuristic**:

| Scenario | Use |
|---|---|
| Finite, distinct input/output pairs | Overloads |
| Continuous generic transformation | Conditional return type |
| Best call-site error messages | Overloads |
| Type needs to be referenced elsewhere | Conditional type (it's a named type) |
| Implementation must be type-safe | Overloads |

## Worked Example

An overloaded `parse` function:

```typescript
function parse(input: string): number
function parse(input: number): string
function parse(input: string | number): number | string {
  if (typeof input === 'string') return parseFloat(input)
  return String(input)
}
```

The same with a conditional return type — valid, but requires a cast inside:

```typescript
type ParseReturn<T> = T extends string ? number : string

function parse<T extends string | number>(input: T): ParseReturn<T> {
  if (typeof input === 'string') return parseFloat(input) as ParseReturn<T>
  return String(input) as ParseReturn<T>
}
```

When you need `ParseReturn<T>` in other types (say, to describe an event emitter), the conditional type approach wins because you have a name for it. When you don't, overloads are cleaner.

## Pitfalls

- **Overload catch-all**: the implementation signature must be compatible with all overload signatures, but it is only used for the implementation — never matched at call sites.
- **Conditional return type casts**: you almost always need `as ReturnType` or `as any` inside the body because TypeScript cannot narrow deferred conditionals during narrowing.
- **Order matters**: overloads are checked in declaration order. Put more-specific signatures before more-general ones.
- **Overload count ceiling**: too many overloads signal that a discriminated union or a different data model would be cleaner.

## Exercise

Implement the functions in `overloads.ts`:

1. `format(value: string): string` / `format(value: number): string` — overloaded; converts either type to a display string
2. `parseValue(input: string): number` / `parseValue(input: number): string` — overloaded; swaps string↔number
3. `wrapInArray<T extends string | number>(x: T): T extends string ? string[] : number[]` — conditional return type version
4. `createElement(tag: 'a'): HTMLAnchorElement` / `createElement(tag: 'div'): HTMLDivElement` / `createElement(tag: string): HTMLElement` — three-overload example
