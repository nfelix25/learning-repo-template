# Lesson 16: Instanceof, Species, and Constructor Hooks

## Motivation

Some well-known symbols change familiar object-model operations. `Symbol.hasInstance` customizes `instanceof`, and `Symbol.species` influences which constructor derived operations use.

## Mechanic

When you write `value instanceof Constructor`, JavaScript checks `Constructor[Symbol.hasInstance]` before the ordinary prototype-chain behavior. Collection methods such as `map` can consult `constructor[Symbol.species]` to decide what constructor should produce the result.

## Worked example

```ts
class Branded {
  static [Symbol.hasInstance](value: unknown) {
    return Boolean(value && typeof value === "object" && "brand" in value);
  }
}

({ brand: "ok" }) instanceof Branded; // true
```

## Pitfalls

- Custom `instanceof` can surprise readers who expect prototype checks.
- `Symbol.species` can make subclassed collection methods return a different type than expected.
- These hooks are powerful enough that API designs should use them sparingly.

## Exercise

Complete the branded instance checker and array subclass so the tests show both custom `instanceof` and constructor species behavior.
