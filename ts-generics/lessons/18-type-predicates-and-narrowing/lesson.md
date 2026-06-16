# Lesson 18 — Type Predicates and Narrowing

## Motivation

TypeScript's control flow analysis narrows types automatically in many situations: `typeof`, `instanceof`, discriminant checks on union members, equality checks, and more. For example:

```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    value; // narrowed to string here
  }
}
```

But TypeScript can't narrow through function calls by default. If you extract the check:

```typescript
function isString(value: unknown) {
  return typeof value === 'string';
}

function process(value: string | number) {
  if (isString(value)) {
    value; // still string | number — TypeScript doesn't know what isString does
  }
}
```

For domain-specific checks — "is this a ValidatedUser?", "does this object have a `name` property?", "is this a circle shape?" — you need to *teach* TypeScript what narrowing should occur. That's what type predicates and assertion functions do.

## Mechanic

### `value is T` — type predicate functions

A function can declare a type predicate return type using the `is` keyword:

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

The `value is string` return type tells TypeScript: "if this function returns `true`, treat `value` as `string` in the narrowed branch."

The function must return `boolean`. TypeScript *trusts* the predicate — it does not verify that the implementation actually checks what the predicate claims.

### `asserts condition` — assertion functions

An assertion function narrows *unconditionally*: if the function returns (rather than throwing), TypeScript assumes the condition holds afterward:

```typescript
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function process(value: string | null) {
  assert(value !== null, 'value must not be null');
  value; // narrowed to string here
}
```

The `asserts condition` syntax works with boolean parameters. You can also assert a specific type:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('Expected string');
}
```

### Generic predicates

Type predicates work with generics. The constraint is expressed in the return type:

```typescript
function hasProperty<K extends string>(
  value: unknown,
  key: K
): value is Record<K, unknown> {
  return typeof value === 'object' && value !== null && key in value;
}
```

After a successful `hasProperty(x, 'name')` check, TypeScript knows `x` has at least `{ name: unknown }`.

## Worked example

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function isCircle(value: Shape): value is { kind: 'circle'; radius: number } {
  return value.kind === 'circle';
}

function area(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2; // shape is narrowed to circle here
  }
  return shape.side ** 2; // shape is narrowed to square here
}

// Assertion function in test setup:
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const value: string | null = maybeGetValue();
assert(value !== null, 'expected a value');
console.log(value.toUpperCase()); // safe — TypeScript knows value is string
```

## Pitfalls

**Predicates that lie are type-safe but logically unsound.** TypeScript trusts your predicate. Nothing stops you from writing:

```typescript
function isString(value: unknown): value is string {
  return true; // lies — TypeScript believes it
}
```

This compiles without errors but causes runtime crashes when a non-string is treated as a string. The type system cannot verify predicate correctness.

**`asserts x is T` is even riskier than `x is T`.** An assertion function that doesn't actually throw will silently allow incorrect types to pass. Prefer predicates where possible; use assertions sparingly and only where the control flow truly cannot continue without the check passing.

**Predicates narrow only the named parameter.** The `value is string` annotation narrows exactly `value`. If you return `true`, only `value` is narrowed in the branch — not other variables that happen to be the same value.

**Beware of predicates on mutable variables.** TypeScript narrows based on control flow, but if the variable can be reassigned between the predicate check and the use, the narrowing may not hold. Prefer `const` for values you're narrowing.

## Exercise

Open `predicates.ts`. Five stubs need to be filled in:

1. **`isString`** — return `typeof _value === 'string'` (and rename `_value` to `value`)
2. **`isNumber`** — return `typeof _value === 'number'`
3. **`isCircle`** — return `_value.kind === 'circle'`
4. **`assert`** — `if (!_condition) throw new Error(_message)`
5. **`hasProperty`** — check that `_value` is a non-null object and `_key in (_value as object)`

Run `npm run verify` and `npm test` to check. All type and runtime assertions should pass once the stubs are implemented.
