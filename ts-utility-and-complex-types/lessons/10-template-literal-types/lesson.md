# Lesson 10 — Template Literal Types

## Motivation

Template literal types let you construct, match, and transform string types at the type level. They are the foundation for generating event handler maps (`on${Capitalize<EventName>}`), CSS property keys, path DSLs, and — critically — the `"table.column"` reference strings in the query builder build piece. Mastering template literals unlocks a whole class of string-shaped API design.

## Mechanic

**Basic syntax** — backtick string with type interpolations:

```typescript
type Greeting = `Hello, ${string}!`
// Matches: 'Hello, world!', 'Hello, TypeScript!', etc.

type EventName = 'click' | 'focus'
type Handler = `on${Capitalize<EventName>}`  // 'onClick' | 'onFocus'
```

**Union distribution over interpolation slots**:

When a union is placed in a template literal slot, TypeScript distributes it automatically:

```typescript
type Direction = 'left' | 'right' | 'top' | 'bottom'
type PaddingKey = `padding-${Direction}`
// 'padding-left' | 'padding-right' | 'padding-top' | 'padding-bottom'
```

When *multiple* union slots are used, you get the cross-product:

```typescript
type Axis = 'x' | 'y'
type Size = 'sm' | 'lg'
type Key = `${Axis}-${Size}`  // 'x-sm' | 'x-lg' | 'y-sm' | 'y-lg'
```

**Intrinsic string manipulation types** (built-ins, not user-definable):

```typescript
Uppercase<'hello'>    // 'HELLO'
Lowercase<'WORLD'>    // 'world'
Capitalize<'foo'>     // 'Foo'
Uncapitalize<'Bar'>   // 'bar'
```

These are the only string transformations available at the type level natively.

**Extracting string components with `infer`**:

```typescript
type GetPrefix<S extends string> =
  S extends `${infer Prefix}-${string}` ? Prefix : never

type A = GetPrefix<'padding-left'>   // 'padding'
type B = GetPrefix<'color'>          // never (no dash)
```

The `infer` binding captures the matching portion of the string pattern.

## Worked Example

Generating an event handler map from a union of event names:

```typescript
type Events = 'click' | 'focus' | 'blur'
type HandlerMap = {
  [E in Events as `on${Capitalize<E>}`]: (event: Event) => void
}
// { onClick: ...; onFocus: ...; onBlur: ... }
```

Extracting a table and column from a `"table.column"` reference (directly relevant to the query builder):

```typescript
type TableRef<S extends string> =
  S extends `${infer Table}.${infer Column}` ? { table: Table; column: Column } : never

type R = TableRef<'users.id'>  // { table: 'users'; column: 'id' }
```

## Pitfalls

- **No regex — only prefix/suffix/infix patterns**: TypeScript's pattern matching is structural, not regex-based. You can match `${string}.${string}` but not a regex like `/\d+/`.
- **Explosion with large unions**: the cross-product of several unions can produce hundreds of string literal members. TypeScript will silently widen to `string` when the union gets too large.
- **`infer` in template positions is greedy from the left**: `${infer A}.${infer B}` on `'a.b.c'` gives `A = 'a'` and `B = 'b.c'` — the first `infer` matches the shortest possible prefix.

## Exercise

Implement the types in `template-literals.ts`:

1. `EventHandlerName<T extends string>` — convert an event name to its handler name (e.g., `'click'` → `'onClick'`)
2. `CssVar<T extends string>` — convert a property name to a CSS variable reference (e.g., `'color'` → `'--color'`)
3. `TableColumn<S extends string>` — if S matches `'table.column'`, extract `{ table: ...; column: ... }`; otherwise `never`
4. `SplitFirst<S extends string, Sep extends string>` — split S on the first occurrence of Sep; produce `[before: string, after: string]` or `never` if Sep is not found
5. `HandlerMap<T extends string>` — given a union of event names, produce a record with `on${Capitalize<Event>}` keys mapping to `() => void`
