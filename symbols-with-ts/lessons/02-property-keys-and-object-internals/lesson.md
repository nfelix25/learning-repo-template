# Lesson 02: Property Keys and Object Internals

## Motivation

Symbols matter because they are a real branch of JavaScript's property-key model. Object keys are not just strings; a property key can be a string or a symbol. Number-looking keys are coerced to strings, while symbols keep their own identity.

## Mechanic

A bracket access such as `object[key]` first determines the property key. Numbers become strings, but symbols do not stringify. That means `object[1]` and `object["1"]` address the same property, while `object[Symbol("1")]` addresses a separate symbol-keyed property.

## Worked example

```ts
const id = Symbol("id");
const record = {
  1: "number became string",
  [id]: "symbol stayed symbol"
};

record["1"]; // "number became string"
record[id]; // "symbol stayed symbol"
```

## Pitfalls

- Number-like property access does not create number keys.
- `String(symbol)` is explicit display conversion, not property-key coercion.
- A symbol description that looks like a string key does not make the symbol equal to that string.

## Exercise

Complete the classifier and mixed-key object helper so the tests expose string coercion and symbol identity.
