# Lesson 15 — Branded Types

## Motivation

TypeScript uses *structural typing*: two types are compatible if their shapes match. That means `UserId` and `OrderId`, when both defined as plain `string`, are completely interchangeable. TypeScript won't stop you from passing a `UserId` where an `OrderId` is expected — they look identical structurally.

```typescript
type UserId = string;
type OrderId = string;

function getOrder(userId: UserId, orderId: OrderId): void { /* ... */ }

const uid: UserId = 'u-123';
const oid: OrderId = 'o-456';

getOrder(oid, uid); // TypeScript is fine with this — but it's wrong!
```

This is where **branded types** come in. By attaching a phantom tag to a primitive type, you give TypeScript a structural difference to enforce, even though no runtime overhead is added.

## Mechanic

### Intersection branding

The most common pattern uses an intersection with a literal-typed property:

```typescript
type UserId = string & { readonly _brand: 'UserId' };
type ProductId = string & { readonly _brand: 'ProductId' };
```

The `_brand` property only exists at the type level — no runtime object actually has it. Because `'UserId'` and `'ProductId'` are different string literal types, `UserId` and `ProductId` are structurally incompatible.

### Factory functions

You can't assign a plain `string` to `UserId` directly. You need a factory function that performs a type cast:

```typescript
function asUserId(value: string): UserId {
  return value as unknown as UserId;
}
```

The double cast (`as unknown as UserId`) is intentional. TypeScript's type system won't allow `string as UserId` directly because `string` doesn't have `_brand`. Going through `unknown` breaks the check.

### `unique symbol` for stronger branding

Intersection branding has a weakness: you could accidentally satisfy the brand by constructing an object with the right shape. `unique symbol` prevents this because each `unique symbol` is, well, unique — it can only be created at its declaration site:

```typescript
declare const _emailBrand: unique symbol;
type Email = string & { readonly [_emailBrand]: void };
```

The `declare const` makes `_emailBrand` a module-scoped opaque symbol. No code outside this module can name the symbol, so no code can accidentally produce a value that satisfies the brand.

### Generic `Brand<T, B>` utility

When you have many branded types, a utility type reduces repetition:

```typescript
type Brand<T, B extends string> = T & { readonly _brand: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
type Milliseconds = Brand<number, 'Milliseconds'>;
```

## Worked example

```typescript
type UserId = string & { readonly _brand: 'UserId' };
type ProductId = string & { readonly _brand: 'ProductId' };

function asUserId(value: string): UserId {
  return value as unknown as UserId;
}

function asProductId(value: string): ProductId {
  return value as unknown as ProductId;
}

function processOrder(userId: UserId, productId: ProductId): string {
  return `Processing order for user ${userId} and product ${productId}`;
}

const uid = asUserId('u-1');
const pid = asProductId('p-99');

processOrder(uid, pid);  // OK

// @ts-expect-error — swapped: ProductId ≠ UserId
processOrder(pid, uid);
```

TypeScript catches the swap at compile time. At runtime, `uid` and `pid` are just strings — zero overhead.

## Pitfalls

**Brands don't prevent `as` casts.** Any code can escape the brand system with `as unknown as UserId`. The guarantee is ergonomic, not ironclad. Treat brands as documentation + light enforcement, not a security boundary.

**Branding every primitive creates ceremony overhead.** Not every `string` deserves a brand. Reserve branding for cases where confusion between IDs would be a real bug, or where you want to enforce that a value passed through a validation step.

**`unique symbol` brands can't serialize.** A symbol key is omitted from `JSON.stringify`. If you plan to send branded values over the wire or store them, prefer string-literal intersection branding — the `_brand` property is part of the type only and doesn't appear in the serialized form either, but it's easier to reason about.

**A brand is not a validator.** `asUserId` will happily brand an empty string or a UUID in the wrong format. If you need semantic validation (e.g., "this string must match the UUID format"), combine branding with a validation step inside the factory.

## Exercise

Open `branded.ts`. Five stubs need to be filled in:

1. Define `UserId` as `string & { readonly _brand: 'UserId' }`
2. Define `ProductId` as `string & { readonly _brand: 'ProductId' }`
3. Implement `asUserId` — cast the value using `as unknown as UserId`
4. Implement `asProductId` — cast the value using `as unknown as ProductId`
5. Define `Email` using the provided `_emailBrand` unique symbol
6. Implement `asEmail` — cast the value using `as unknown as Email`

Run `npm run verify` and `npm test` to check. All tests should pass once the stubs are replaced.
