# Lesson 16 — Nominal Types and Declaration Merging

## Motivation

Lesson 15 introduced intersection branding. It works, but the brand property (`_brand: 'UserId'`) shows up in IDE tooltips, which can look noisy. Declaration merging offers an alternative: you can give a branded type the appearance of a named interface in tooling while retaining the incompatibility guarantee.

Beyond aesthetics, TypeScript's declaration merging is a general mechanism worth understanding — it's how `lib.dom.d.ts` extends existing interfaces, how modules add properties to `Express.Request`, and how enums get runtime and type components in one declaration.

## Mechanic

### Declaration merging basics

When TypeScript sees two interface declarations with the same name in the same scope, it merges them into a single type:

```typescript
interface Foo { a: number }
interface Foo { b: string }
// Merged: Foo = { a: number; b: string }
```

This is *declaration merging*. It does not apply to type aliases (only the last would win — actually TypeScript errors on duplicate type aliases).

### Interface-based branding

You can use an interface to hold the brand field, then intersect it with the base type:

```typescript
declare const _sessionSymbol: unique symbol;

interface SessionId {
  readonly _sessionBrand: typeof _sessionSymbol;
}

type SessionIdValue = string & SessionId;
```

Because `_sessionSymbol` is a `unique symbol` declared with `declare const`, it's module-scoped and can't be named outside the module. The interface member is unapproachable — plain strings can't satisfy it.

In IDE tooltips, the type might show as `string & SessionId`, which many developers find cleaner than `string & { readonly _brand: 'SessionId' }`.

### Self-referential type alias trick

A more advanced pattern merges a type alias with a same-named interface to create a self-referential nominal type:

```typescript
interface OrderId {
  readonly _orderId: void;
}
type OrderId = string & OrderId; // type alias merges with the interface above
```

TypeScript allows a type alias and an interface with the same name to coexist (the alias references the interface, which is allowed). The result is that `OrderId` refers to `string & { readonly _orderId: void }` while looking like just `OrderId` in tooltips.

### Namespace-grouped nominal types

For libraries or modules that expose many nominal types, a namespace groups them cleanly:

```typescript
export namespace Nominal {
  export type CustomerId = string & { readonly _customerBrand: 'CustomerId' };
  export function asCustomerId(value: string): CustomerId {
    return value as unknown as CustomerId;
  }
}

// Usage:
const cid: Nominal.CustomerId = Nominal.asCustomerId('c-42');
```

Namespaces are one of TypeScript's "legacy" features but remain useful for grouping related type utilities.

## Worked example

```typescript
declare const _sessionSymbol: unique symbol;

export interface SessionId {
  readonly _sessionBrand: typeof _sessionSymbol;
}

export function asSessionId(value: string): string & SessionId {
  return value as unknown as string & SessionId;
}

export namespace Nominal {
  export type CustomerId = string & { readonly _customerBrand: 'CustomerId' };
  export function asCustomerId(value: string): CustomerId {
    return value as unknown as CustomerId;
  }
}

// At a call site:
const session = asSessionId('sess-abc');
const customer = Nominal.asCustomerId('cust-xyz');

// @ts-expect-error — session is not a CustomerId
const _bad: Nominal.CustomerId = session;
```

## Pitfalls

**Declaration merging can cause accidental merges if names collide.** If two modules both declare an interface named `User`, TypeScript merges them when both are imported. This is intentional for augmentation (adding properties to an existing type) but can be a surprising bug if it happens unintentionally.

**`unique symbol` brands can't serialize.** Like Lesson 15, symbol-keyed properties are stripped by `JSON.stringify`. Don't rely on them surviving a round trip.

**This is more boilerplate than intersection branding.** The interface approach adds a `declare const` + an interface declaration. For a single branded type, the intersection pattern from Lesson 15 is simpler. Prefer interface-based branding when IDE tooltip clarity matters or you're building a public API.

**The self-referential type alias trick is obscure.** Most teams won't recognize `type OrderId = string & OrderId` immediately. Add a comment explaining the pattern or prefer the explicit intersection form.

## Exercise

Open `nominal.ts`. Two areas need to be completed:

1. **`SessionId` interface** — add a readonly brand field using the provided `_sessionSymbol` unique symbol:
   ```typescript
   readonly _sessionBrand: typeof _sessionSymbol;
   ```

2. **`asSessionId` factory** — implement it by casting: `return value as unknown as string & SessionId`

3. **`Nominal.asCustomerId` factory** — implement it: `return value as unknown as CustomerId`

Run `npm run verify` and `npm test` to check. All tests should pass once the stubs are filled in.
