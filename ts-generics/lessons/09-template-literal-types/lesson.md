> Verified against TypeScript 4.1 on 2026-05-23.

# Lesson 09 — Template Literal Types

## Motivation

Event systems often need string types like `"firstNameChanged"` that can be statically validated — `"firstnamechanged"` should be a compile error. CSS utility libraries need to map `"background-color"` to `"backgroundColor"` at the type level. Route parsers need to extract parameter names from path patterns. Template literal types give you these capabilities using the same backtick syntax as JavaScript template literals, but operating entirely at the type level.

## Mechanic

### Basic syntax

```typescript
type World = 'world';
type Greeting = `hello ${World}`; // "hello world"
```

### Union cross-product

When a union appears in an interpolated position, TypeScript generates every combination:

```typescript
type Quantity = 'one' | 'two';
type Color    = 'red' | 'blue';
type Fish = `${Quantity} ${Color} fish`;
// "one red fish" | "one blue fish" | "two red fish" | "two blue fish"
```

### Intrinsic string manipulation types

All introduced in TypeScript 4.1 (non-locale-aware, via JavaScript's `toUpperCase` / `toLowerCase`):

- `Uppercase<S>` — all characters uppercase
- `Lowercase<S>` — all characters lowercase
- `Capitalize<S>` — first character uppercase, rest unchanged
- `Uncapitalize<S>` — first character lowercase, rest unchanged

```typescript
type A = Capitalize<'hello world'>; // 'Hello world'
type B = Uppercase<'foo'>;          // 'FOO'
```

### Template literals with mapped types

Combine with `keyof` to build typed event name unions:

```typescript
type EventNames<T> = `${keyof T & string}Changed`;

type PersonEvents = EventNames<{ name: string; age: number }>;
// "nameChanged" | "ageChanged"
```

Add `Capitalize` for handler method names:

```typescript
type Getters<T> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];
};
// { getName: () => string; getAge: () => number }  (for { name: string; age: number })
```

### Inference from template literal patterns

Use `infer` inside a template literal pattern in the `extends` clause:

```typescript
type ExtractRouteParam<T extends string> =
  T extends `${string}:${infer Param}` ? Param : never;

type A = ExtractRouteParam<'/users/:id'>;  // 'id'
type B = ExtractRouteParam<'/users'>;      // never
```

## Worked example

```typescript
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    event: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({ firstName: 'Homer', age: 42 });

person.on('firstNameChanged', (newName) => {
  console.log(`New name: ${newName.toUpperCase()}`); // newName: string ✓
});

// person.on('firstname', () => {});  // ✗ 'firstname' is not assignable to 'firstNameChanged' | 'ageChanged'
```

## Pitfalls

**Combinatorial explosion.** Large unions in template positions multiply fast — 10 strings × 10 strings = 100 literal types. TypeScript imposes a limit (~100k members) and will error if you exceed it.

**Template literal inference requires `infer` in `extends`.** You cannot destructure a template literal type without a conditional type. `` type TailOf<T extends `a${string}`> = ??? `` — there is no direct way to extract the tail without writing `` T extends `a${infer Tail}` ? Tail : never ``.

**Intrinsic types are not locale-aware.** `Capitalize<"ı">` (Turkish dotless i) will not produce the locale-correct result. This matters for internationalized codebases.

## Exercise

Open `template-literals.ts`. Three type aliases are stubbed:

1. **`Getters<T>`** — map each key of `T` to a getter method; `name` → `getName: () => string`
2. **`EventNames<T>`** — produce a union of `"${key}Changed"` strings for all keys in `T`
3. **`ExtractRouteParam<T>`** — extract the `:paramName` from a route string like `'/users/:id'`

Run `npm run verify` to check your work.
