# Lesson 14: Coercion and Symbol.toPrimitive

## Motivation

Coercion is also a protocol. When JavaScript needs a primitive value from an object, it can ask the object through `Symbol.toPrimitive`.

## Mechanic

`[Symbol.toPrimitive](hint)` receives one of three hints: `"number"`, `"string"`, or `"default"`. If the hook exists, it runs before the ordinary `valueOf` and `toString` fallback path. The hook must return a primitive.

## Worked example

```ts
const value = {
  [Symbol.toPrimitive](hint: string) {
    return hint === "string" ? "box:7" : 7;
  }
};

String(value); // "box:7"
Number(value); // 7
```

## Pitfalls

- Different operators use different hints.
- Returning an object from `Symbol.toPrimitive` throws.
- The `"default"` hint does not always mean string or number.

## Exercise

Complete the coercible object so the tests reveal the hints used by `String`, `Number`, addition, and template interpolation.
