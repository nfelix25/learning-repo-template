# Lesson 17 — Overloads vs Generics

## Motivation

Generics encode *relationships* between types. The classic example: `identity<T>(value: T): T` says "the output type is the same as the input type." TypeScript infers `T` at each call site, so callers always get the right type back.

But some functions have fundamentally different behavior depending on what type they receive — not just a variation of the same relationship, but a completely different output type. A generic can't express this without collapsing to a union:

```typescript
// Generic attempt — doesn't work as intended
function process<T extends string | number>(x: T): string[] | number[] {
  // TypeScript sees the return as string[] | number[] regardless of T
  // ...
}

const result = process('hello'); // result: string[] | number[] — not what we want!
```

The output type is a union even when you pass a `string`, because TypeScript evaluates the return type for all possible values of `T` simultaneously. **Overloads** are the escape hatch: you declare multiple distinct call signatures, and TypeScript picks the right one based on the argument type.

## Mechanic

### When generics are right

Generics work when the input and output types are *related by the same type variable*:

- `identity<T>(value: T): T` — output is same type as input
- `first<T>(arr: readonly T[]): T | undefined` — output element type matches input element type
- `pair<A, B>(a: A, b: B): [A, B]` — output tuple preserves both input types

These can't be expressed with overloads without duplicating signatures for every possible type combination.

### When overloads are right

Overloads work when different input types produce different, *unrelated* output types:

- `process(x: string): string[]` / `process(x: number): number[]`
- `coerce(value: string): number` / `coerce(value: number): string`

There's no single type variable that can express "if input is string, output is string[]; if input is number, output is number[]" without a conditional type (which has its own complexity — see Lessons 05-06).

### Overload syntax

An overloaded function has one or more *overload signatures* followed by one *implementation signature*:

```typescript
// Overload signatures (visible to callers)
function process(x: string): string[];
function process(x: number): number[];

// Implementation signature (NOT visible to callers)
function process(x: string | number): string[] | number[] {
  if (typeof x === 'string') return x.split('');
  return [x, x + 1];
}
```

Key rules:
1. The implementation signature must be compatible with all overload signatures
2. Callers can only see the overload signatures — the implementation signature is hidden
3. You need at least 2 overload signatures (1 overload + implementation is not valid overloading)

### Overload resolution order

TypeScript picks the *first overload whose types match* at a call site. Order matters when overloads overlap:

```typescript
function ambiguous(x: string): 'string';
function ambiguous(x: string | number): 'string | number';
function ambiguous(x: string | number): 'string' | 'string | number' {
  return typeof x === 'string' ? 'string' : 'string | number';
}

ambiguous('hello'); // 'string' — first match wins
ambiguous(42);      // 'string | number'
```

Put more specific overloads before more general ones.

## Worked example

### The problem with a generic for `process`

```typescript
// Attempt with generic — gives wrong result
function processGeneric<T extends string | number>(x: T): T extends string ? string[] : number[] {
  // Conditional return type — this requires conditional types (Lesson 05)
  // And it's more complex than overloads for simple cases
  if (typeof x === 'string') return x.split('') as any;
  return [x as number, (x as number) + 1] as any;
}
```

That conditional type approach works but requires casting internally and is hard to read. For this case, overloads are cleaner:

```typescript
function process(x: string): string[];
function process(x: number): number[];
function process(x: string | number): string[] | number[] {
  if (typeof x === 'string') return x.split('');
  return [x, x + 1];
}

process('abc'); // string[]
process(5);     // number[]
```

### The `coerce` example

```typescript
function coerce(value: string): number;
function coerce(value: number): string;
function coerce(value: string | number): string | number {
  return typeof value === 'string' ? parseInt(value, 10) : String(value);
}

coerce('42');  // number
coerce(42);    // string
```

The input and output types are *inverted* — no generic can express this naturally.

## Pitfalls

**Overload resolution order matters — put specific overloads first.** If a broad overload appears before a narrow one, the broad one always wins. Put the most specific cases at the top.

**The implementation signature is not visible to callers.** You cannot call `process` with a `string | number` argument from outside the function — that's the implementation signature's type, not an overload. If you need to accept `string | number` from callers, add a third overload: `function process(x: string | number): string[] | number[]`.

**Too many overloads is a code smell.** If you find yourself writing 5+ overloads, consider whether conditional types (Lesson 05), a discriminated union, or separate functions would be cleaner.

**Implementation must be compatible with all overloads.** TypeScript checks the implementation body against the implementation signature, not the overload signatures. You're responsible for ensuring the runtime behavior matches each overload's promise.

## Exercise

Open `overloads.ts`. Four functions need to be implemented:

1. **`identity`** — return `_value` directly
2. **`process`** — if string, split into chars (`x.split('')`); if number, return `[x, x + 1]`
3. **`coerce`** — if string, `parseInt(value, 10)`; if number, `String(value)`
4. **`first`** — return `_arr[0]`

The overload signatures are already in place — only the implementation bodies need to be filled in.

Run `npm run verify` and `npm test` to check. All type and runtime assertions should pass.
