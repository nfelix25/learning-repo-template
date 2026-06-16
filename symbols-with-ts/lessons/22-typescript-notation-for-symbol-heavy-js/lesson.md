# Lesson 22: TypeScript Notation for Symbol-Heavy JavaScript

> Verified against the current TypeScript Handbook, TypeScript 2.7 release notes, and TypeScript library declarations on 2026-05-24.

## Motivation

TypeScript can describe symbol-heavy JavaScript precisely, but the runtime behavior remains JavaScript. This lesson uses TypeScript only as notation for symbol tokens, symbol-keyed interfaces, and `PropertyKey`.

## Mechanic

`symbol` describes symbol values broadly. `unique symbol` describes a specific const symbol token. Interfaces can require symbol-keyed methods with computed property names. `PropertyKey` is the built-in type for string, number, or symbol keys.

## Worked example

```ts
export const token: unique symbol = Symbol("token");

interface Protocol {
  [token](): string;
}
```

The type says that consumers need that exact exported token, not any symbol with the same description.

## Pitfalls

- `unique symbol` depends on a `const` symbol declaration.
- TypeScript declarations vary by configured library version.
- Type annotations should clarify runtime symbol behavior, not replace understanding it.

## Exercise

Complete the typed protocol helpers so the tests combine runtime behavior with TypeScript notation.
