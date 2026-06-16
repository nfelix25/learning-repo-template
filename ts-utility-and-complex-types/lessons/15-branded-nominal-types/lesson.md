# Lesson 15 — Branded / Nominal Types

## Motivation

TypeScript's structural type system treats `UserId` and `OrderId` as interchangeable if both are `string`. This lets bugs like passing an order ID where a user ID is expected slip through without a type error. Branded types add nominal-style identity as a type-level marker — zero runtime overhead, compile-time safety.

## Mechanic

**The brand pattern** — intersect a base type with a unique marker:

```typescript
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId  = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>
```

`UserId` and `OrderId` are structurally distinct because `__brand` differs. A raw `string` is not assignable to either (it lacks the `__brand` property). A `UserId` is also not assignable to `OrderId` because the literal brands differ.

**Constructor functions** — the only place you use a cast:

```typescript
function parseUserId(raw: string): UserId {
  return raw as UserId  // the single controlled cast
}
```

Everything downstream works without casts. The type system propagates the brand automatically.

**`unique symbol` brands** — stronger isolation (no accidental structural overlap):

```typescript
declare const _userId: unique symbol
type UserId = string & { readonly [_userId]: void }
```

`unique symbol` brands cannot be accidentally recreated in another file, providing stronger nominal isolation than a string literal brand. The trade-off is slightly more verbose syntax.

**The "parse, don't validate" pattern** — validate at the boundary, return a branded type:

```typescript
function parseEmail(raw: string): Email | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? (raw as Email) : null
}
```

All internal code receives `Email` and never needs to re-validate. The branded type documents that the value has already been checked.

## Worked Example

Preventing ID confusion:

```typescript
type Brand<T, B extends string> = T & { readonly __brand: B }
type UserId  = Brand<number, 'UserId'>
type OrderId = Brand<number, 'OrderId'>

function getUser(id: UserId): User { ... }
const orderId = 42 as OrderId

getUser(orderId)   // Error: Argument of type 'OrderId' is not assignable to 'UserId'
getUser(42)        // Error: Argument of type 'number' is not assignable to 'UserId'
```

## Pitfalls

- **The `__brand` property is fictional**: it only exists at the type level. Accessing `userId.__brand` at runtime returns `undefined` (or errors). Never read brand properties at runtime.
- **Brand collision**: string literal brands can theoretically collide across files. Prefer `unique symbol` brands in libraries or large codebases where collision risk is real.
- **Widening on assignment**: if you assign a branded type to a wider type without an explicit annotation, the brand is erased. Keep branded values in typed slots.
- **JSON serialization erases brands**: a branded type round-tripped through JSON.parse returns a plain value. Re-validate and re-brand at deserialization boundaries.

## Exercise

Implement the types and functions in `branded-types.ts`:

1. `Brand<T, B extends string>` — the generic branding utility
2. `UserId` and `PostId` as `Brand<number, ...>` branded types
3. `parseUserId(raw: number): UserId` — constructor for UserId
4. `parsePostId(raw: number): PostId` — constructor for PostId
5. `getUserPost(userId: UserId, postId: PostId): string` — a function that requires branded IDs and returns a placeholder string (demonstrates the type safety at call sites)
