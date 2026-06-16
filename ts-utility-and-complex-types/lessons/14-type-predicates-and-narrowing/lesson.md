# Lesson 14 — Type Predicates and Narrowing

## Motivation

TypeScript's control-flow analysis handles the common narrowing cases automatically (typeof, instanceof, truthiness checks). But it can't always narrow through arbitrary logic. User-defined type predicates (`is`) and assertion functions (`asserts`) let you encode custom narrowing and tell the compiler exactly what a check guarantees — making them a common source of subtle unsoundness when implemented carelessly.

## Mechanic

**`is` predicates — user-defined type guards**:

```typescript
function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function process(x: string | number) {
  if (isString(x)) {
    x.toUpperCase()  // x is string here
  }
}
```

The return type `x is string` is the *predicate signature*. When the function returns `true`, TypeScript narrows `x` to `string` in the truthy branch.

**`asserts` predicates — assertion functions**:

```typescript
function assertDefined<T>(value: T | undefined, msg?: string): asserts value is T {
  if (value === undefined) throw new Error(msg ?? 'Expected value to be defined')
}

function run(value: string | undefined) {
  assertDefined(value)
  value.toUpperCase()  // value is string after the call
}
```

After calling an `asserts` function that doesn't throw, TypeScript narrows the asserted value for all subsequent code in the scope — no conditional needed.

**Discriminated union narrowing** (prefer this over `is` guards when possible):

```typescript
type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2
    case 'rect': return shape.width * shape.height
  }
}
```

Discriminant narrowing is safer because the compiler validates exhaustiveness via `never`. Use `is` guards only when structural narrowing isn't possible (external data, `unknown` inputs).

**Exhaustiveness checking**:

```typescript
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`)
}
```

Place this in the `default` (or last) branch of an exhaustive switch. If a new variant is added to the union, the switch branch becomes reachable with a non-`never` type and TypeScript reports a type error.

## Worked Example

A `hasProperty` guard that narrows `object` to `Record<K, unknown>`:

```typescript
function hasProperty<K extends string>(obj: object, key: K): obj is Record<K, unknown> {
  return key in obj
}

function getProperty(obj: object, key: string) {
  if (hasProperty(obj, key)) {
    return obj[key]  // obj is Record<typeof key, unknown>
  }
}
```

## Pitfalls

- **Unsound predicates**: TypeScript trusts your `is` return type — if you lie, it will narrow unsoundly and produce runtime errors. Always ensure the predicate body actually validates what the return type claims.
- **`asserts` doesn't narrow before the call**: the narrowing only applies *after* the assertion call completes without throwing. Code before the call is unaffected.
- **`is` in callbacks**: narrowing via type guards doesn't propagate into closure bodies. The guard must be called directly in the narrowing scope.
- **Prefer discriminants over `is` guards**: discriminated unions give you exhaustiveness checking for free. Reserve `is` guards for external/unstructured data.

## Exercise

Implement the functions in `type-predicates.ts`:

1. `isString(x: unknown): x is string` — guard for string
2. `isNonNullish<T>(x: T | null | undefined): x is T` — guard that removes null and undefined
3. `assertDefined<T>(x: T | undefined, msg?: string): asserts x is T` — assertion that throws on undefined
4. `hasProperty<K extends string>(obj: object, key: K): obj is Record<K, unknown>` — checks if an object has a key
5. `assertNever(x: never): never` — exhaustiveness helper that throws at runtime
