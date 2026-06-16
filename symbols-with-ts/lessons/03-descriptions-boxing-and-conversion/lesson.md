# Lesson 03: Descriptions, Boxing, and Conversion

## Motivation

Descriptions make symbols readable in debugging output, but they are not names. This lesson isolates the display behavior so you do not accidentally treat descriptions as identity or lookup data.

## Mechanic

`symbol.description` returns the optional description. `String(symbol)` and `symbol.toString()` are explicit conversions. Implicit string coercion, such as concatenation with `""`, throws because JavaScript avoids silently turning a symbol key into a string.

`Object(symbol)` creates a wrapper object around the primitive. The wrapper is rarely useful, but it helps show that the primitive and object forms are different.

## Worked example

```ts
const token = Symbol("debug");

token.description; // "debug"
String(token); // "Symbol(debug)"
Object(token).valueOf() === token; // true
```

## Pitfalls

- Do not use descriptions as registry keys unless you explicitly call `Symbol.for`.
- Do not rely on implicit coercion.
- Do not mistake wrapper objects for the symbol primitive.

## Exercise

Complete the conversion helpers so the tests distinguish explicit conversion, implicit conversion, and wrapper behavior.
