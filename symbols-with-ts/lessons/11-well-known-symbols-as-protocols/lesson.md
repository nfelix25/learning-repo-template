# Lesson 11: Well-Known Symbols as Protocols

## Motivation

Well-known symbols are how ECMAScript names public protocol hooks without claiming ordinary string method names. Syntax such as `for...of` does not look for a method called `"iterator"`; it looks for a method at `Symbol.iterator`.

## Mechanic

A well-known symbol is a shared symbol value exposed on `Symbol`, such as `Symbol.iterator`, `Symbol.toPrimitive`, or `Symbol.toStringTag`. The spec often writes these as names like `@@iterator`. Protocol operations first retrieve the method by symbol key, then check whether the result is callable.

## Worked example

```ts
const iterable = {
  [Symbol.iterator]() {
    return [1, 2][Symbol.iterator]();
  }
};

[...iterable]; // [1, 2]
```

The property key is a symbol, but the behavior is public and intentionally discoverable.

## Pitfalls

- A symbol-keyed protocol slot usually needs a callable value.
- A property with the right string name does not satisfy a well-known symbol protocol.
- Spec names such as `@@iterator` are notation for symbol-keyed properties, not string keys.

## Exercise

Complete the protocol lookup helpers so the tests distinguish symbol-keyed protocol methods from ordinary properties.
