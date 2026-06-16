# Lesson 06: Copying, Spread, JSON, and Serialization

## Motivation

Symbol visibility becomes practical when objects are copied or serialized. Some operations preserve enumerable own symbol properties, while JSON ignores symbol-keyed properties and symbol values.

## Mechanic

`Object.assign` and object spread copy own enumerable properties, including symbol keys. They do not copy non-enumerable properties. `JSON.stringify` only serializes string-keyed JSON-compatible values, so symbol keys and symbol values disappear.

## Worked example

```ts
const id = Symbol("id");
const source = { name: "source", [id]: "copied" };

Object.assign({}, source)[id]; // "copied"
({ ...source })[id]; // "copied"
JSON.stringify(source); // {"name":"source"}
```

## Pitfalls

- Copying depends on enumerability, not only key type.
- JSON output can silently omit symbol data.
- Debug output may show properties that JSON does not preserve.

## Exercise

Complete the fixture and copy helpers so the tests show which symbol properties survive assign, spread, and JSON serialization.
