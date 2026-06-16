# Lesson 19: Node.js Custom Symbols

> Verified against Node.js v26.2.0 `util.inspect.custom` and `util.promisify.custom` documentation on 2026-05-24.

## Motivation

Not every important symbol protocol comes from ECMAScript. Node.js defines its own symbol-keyed hooks for runtime behavior such as custom inspection and promisification.

## Mechanic

`util.inspect.custom` is a symbol that Node's `inspect` function checks when formatting an object. `util.promisify.custom` is another Node-specific symbol that customizes `promisify`. These are public platform protocols, not portable language features.

## Worked example

```ts
import { inspect } from "node:util";

const value = {
  [inspect.custom]() {
    return "<debug view>";
  }
};

inspect(value); // "<debug view>"
```

## Pitfalls

- Node-specific symbols should not be presented as ECMAScript well-known symbols.
- Custom inspection affects debugging output, not the object's runtime identity.
- Platform protocols should be isolated when browser portability matters.

## Exercise

Complete the custom inspection helper and compare it with ordinary `Object.prototype.toString` branding.
