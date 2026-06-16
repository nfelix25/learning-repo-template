# Lesson 01: Symbol Primitive Identity

## Motivation

Symbols exist because JavaScript objects are open. Any code can add a string-named property to an object, so string conventions such as `_internal` or `__extension__` can collide. A symbol gives you a property key whose identity is not based on spelling.

## Mechanic

`Symbol(description)` creates a new primitive value every time. The description is only a debugging label. Two symbols with the same description are still different identities. `Symbol` is not a constructor, so `new Symbol()` throws.

The global registry is a separate path: `Symbol.for(key)` returns the same registered symbol for the same key, and `Symbol.keyFor(symbol)` can recover the key for registered symbols.

## Worked example

```ts
const left = Symbol("token");
const right = Symbol("token");

left === right; // false

const sharedA = Symbol.for("token");
const sharedB = Symbol.for("token");

sharedA === sharedB; // true
```

The description helps when you inspect the value, but it is not the value's name.

## Pitfalls

- Do not compare descriptions when you mean identity.
- Do not use `new Symbol()`.
- Do not assume a symbol is private just because ordinary string-key enumeration skips it.
- Do not use `Symbol.for` unless you actually want shared registry identity.

## Exercise

Complete the workspace so the tests distinguish local symbols, registered symbols, descriptions, and constructor behavior.
