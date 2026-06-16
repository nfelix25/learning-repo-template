# Lesson 02 — Constraints and keyof

## Motivation

An unconstrained `<T>` accepts any type at all — which means inside the function body, TypeScript treats the value as essentially `unknown`. You can't access properties, you can't call methods, you can't do anything useful without a runtime check.

Constraints are the fix: they tell TypeScript what you *guarantee* about `T`, narrowing what's accessible inside the function while preserving the specific type for callers.

```typescript
// Without a constraint, TypeScript won't let you access .length
function longest<T>(a: T, b: T): T {
  return a.length >= b.length ? a : b; // Error: Property 'length' does not exist on type 'T'
}

// With a constraint, .length is accessible
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b; // ✓
}
```

## Mechanic

### `extends` for constraints

Place `extends <Type>` after the type parameter name:

```typescript
function clamp<T extends number>(value: T, min: T, max: T): T {
  // TypeScript knows value, min, max are all at least number
}
```

`T extends SomeType` means "T must be assignable to SomeType." T can be a subtype — a string literal, a specific object shape, or a more specific number type — but never something unrelated.

### `keyof` — extracting an object's key union

`keyof T` is the union of all known keys of `T` as literal types:

```typescript
type K = keyof { name: string; age: number }; // "name" | "age"
```

Combine `keyof` with a second type parameter to write safe property accessors:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

getProperty({ name: 'Alice', age: 30 }, 'name'); // returns 'Alice', type: string
getProperty({ name: 'Alice', age: 30 }, 'score'); // Error: Argument of type '"score"' is not assignable to parameter of type '"name" | "age"'
```

The return type `T[K]` is an *indexed access type* — it looks up the type of property `K` in object type `T`.

### Constraints narrow the body, not the type

Inside a constrained generic, you get access to whatever the constraint provides. But `T` is still `T` — not the constraint:

```typescript
function longest<T extends { length: number }>(a: T, b: T): T {
  a.length // ✓ — guaranteed by constraint
  a.toUpperCase() // ✗ — TypeScript doesn't know T is a string
  return a.length >= b.length ? a : b; // ✓ — T, not { length: number }
}

longest('hello', 'hi')   // returns 'hello', type: string (not { length: number })
longest([1, 2, 3], [1])  // returns [1, 2, 3], type: number[]
```

### Multiple constraints via intersection

A single type parameter can only have one `extends` clause, but you can intersect multiple constraint types:

```typescript
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}
```

## Worked example

```typescript
// Safe property access — K is guaranteed to be a key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Longer of two things with a .length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// Extract one property from each object in an array
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob',   age: 25 },
];

pluck(users, 'name'); // ['Alice', 'Bob']  — type: string[]
pluck(users, 'age');  // [30, 25]           — type: number[]
pluck(users, 'id');   // Error: 'id' is not a key of the user type
```

## Pitfalls

**Constrained T is not the same as its constraint.** The most common mistake is assuming you can return a value of the constraint type from a function that returns `T`:

```typescript
function double<T extends string>(s: T): T {
  return s + s; // Error! Type 'string' is not assignable to type 'T'
}
```

`s + s` produces a `string`, but `T` might be the literal type `"hello"` — and `string` is not assignable to `"hello"`. TypeScript correctly rejects this. If you need to return the constraint type, change the return type annotation.

**`keyof` on a union is an intersection.** `keyof (A | B)` gives only keys present in *both* `A` and `B` — the intersection of the key sets. If you expect all keys, use an intersection type instead: `keyof (A & B)`.

**Constraints don't prevent `T` from being a union.** `T extends { length: number }` accepts `string | number[]` as a valid `T`. Whether that's what you want depends on the semantics of your function.

## Exercise

Open `constraints.ts`. Three functions are stubbed with `unknown` types.

For each function:
1. Add type parameters with the appropriate `extends` constraints
2. Replace `unknown` parameter and return types with the constrained type variables
3. Implement the function body

Run `npm run verify` to check your work.
