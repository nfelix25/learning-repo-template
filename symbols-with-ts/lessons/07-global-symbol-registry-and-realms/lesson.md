# Lesson 07: Global Symbol Registry and Realms

## Motivation

Local uniqueness is useful until two separated pieces of code need to agree on the same symbol. The global symbol registry provides shared identity by string key.

## Mechanic

`Symbol.for(key)` searches the global registry. If the key exists, it returns the existing symbol. If not, it creates and stores one. `Symbol.keyFor(symbol)` returns the registry key for registered symbols and `undefined` for local symbols.

## Worked example

```ts
Symbol.for("shared") === Symbol.for("shared"); // true
Symbol("shared") === Symbol("shared"); // false
Symbol.keyFor(Symbol.for("shared")); // "shared"
```

The registry is useful for cross-module integration, but it also means the key is intentionally shared.

## Pitfalls

- `Symbol.for` is not a private namespace.
- A local symbol with the same description as a registered symbol is still different.
- `Symbol.keyFor` only works for registered symbols.

## Exercise

Complete the registry helpers so the tests distinguish local symbols from shared registry symbols.
