# Lesson 01 — Generic Fundamentals

## Motivation

TypeScript's type system can only help you if types flow through your code. Two anti-patterns break that flow:

**Using `any`** — `function identity(value: any): any` compiles, but you've told TypeScript to stop checking. The return type is `any`, so the caller gets no information about what came out.

**Duplicating per type** — `identityString`, `identityNumber`, `identityBoolean`... impractical and brittle. Every new type you want to support requires another copy.

Generics solve this with a *type parameter*: a placeholder that TypeScript fills in at each call site. The function is written once; the type system tracks the actual type through every use.

## Mechanic

### Declaring a type parameter

Angle brackets after the function name declare one or more type parameters:

```typescript
function identity<T>(value: T): T {
  return value;
}
```

`T` is just a name — by convention single uppercase letters are used (`T`, `U`, `V`), but any valid identifier works. At each call site, TypeScript *infers* `T` from the argument:

```typescript
const n = identity(42);      // T = number; n: number
const s = identity('hello'); // T = string; s: string
```

You can also supply the type argument explicitly:

```typescript
const s = identity<string>('hello'); // T is pinned to string
```

Explicit annotation is rarely needed — TypeScript's inference handles most cases — but it's useful when inference would produce the wrong type.

### Literal widening

TypeScript widens literal types by default:

```typescript
const x = identity(42);       // T = number (not 42)
const y = identity<42>(42);   // T = 42
```

`42` is a valid `number`, so inference picks `number`. If you need the literal type, annotate explicitly or use `as const` at the call site.

### Multiple type parameters

A function can have more than one type parameter:

```typescript
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair('hello', 42); // p: [string, number]
```

Each parameter is inferred independently.

### Reading array element types

The element type of `T[]` is `T`. Use a `readonly` constraint to accept both mutable and immutable arrays:

```typescript
function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}
```

With `noUncheckedIndexedAccess` enabled (this project uses it), `arr[0]` has type `T | undefined` — TypeScript reminds you that the array might be empty.

## Worked example

```typescript
function identity<T>(value: T): T {
  return value;
}

function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// All three calls are inferred correctly:
identity(42)              // number
first(['a', 'b', 'c'])   // string | undefined
pair(true, [1, 2, 3])    // [boolean, number[]]
```

## Pitfalls

**Don't reach for generics when a union type is simpler.** If a function accepts `string | number` and always returns `string | number`, that's not a generic — it's a union. Generics are for *relating* the input type to the output type.

**A type parameter without a constraint is just `unknown`.** `<T>(value: T): T` means "any type at all." If you need to access properties on the value, add a constraint: `<T extends { name: string }>`. Constraints are Lesson 02.

**TypeScript infers from arguments, not return position.** If inference has nothing to work with (e.g., a function with no arguments), TypeScript falls back to `unknown`. Provide enough call-site information for inference to succeed.

## Exercise

Open `generics.ts`. Three functions are stubbed with `unknown` in place of type parameters.

For each function:
1. Add the appropriate type parameter(s) in angle brackets after the function name
2. Update the parameter and return types to use the type parameter
3. Implement the function body

Run `npm run verify` to check your work. All type and runtime assertions should pass.
