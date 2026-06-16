# Lesson 15: RegExp and String Protocol Symbols

## Motivation

Several string methods delegate to symbol-named hooks. This is why objects can participate in `match`, `replace`, `search`, or `split` behavior without being actual `RegExp` instances.

## Mechanic

`String.prototype.match` checks `argument[Symbol.match]`. `replace`, `search`, and `split` perform similar delegation through their own well-known symbols. Each hook has its own call shape and return expectation.

## Worked example

```ts
const matcher = {
  [Symbol.match](input: string) {
    return input.includes("symbol") ? ["symbol"] : null;
  }
};

"well-known symbol".match(matcher);
```

## Pitfalls

- Implementing one RegExp-like hook does not make the object a full RegExp.
- Each hook has a different expected return shape.
- These hooks are public protocols and should be documented when exposed.

## Exercise

Complete the matcher object so the tests show string methods delegating through symbol-keyed hooks.
