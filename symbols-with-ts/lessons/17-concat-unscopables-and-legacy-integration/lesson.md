# Lesson 17: Concat, Unscopables, and Legacy Integration

## Motivation

Some well-known symbols exist because JavaScript must evolve around older behavior. `Symbol.isConcatSpreadable` customizes `Array.prototype.concat`, and `Symbol.unscopables` protects newer property names from `with` statement lookup.

## Mechanic

An array-like object can opt into concat spreading by setting `[Symbol.isConcatSpreadable] = true`. `Symbol.unscopables` is an object whose truthy properties are excluded from `with` environments. You rarely write `with`, but the hook explains how the platform preserved web compatibility.

## Worked example

```ts
const pair = { 0: "a", 1: "b", length: 2, [Symbol.isConcatSpreadable]: true };

["start"].concat(pair); // ["start", "a", "b"]
```

## Pitfalls

- These hooks are niche but real protocol slots.
- `isConcatSpreadable` depends on array-like shape as well as the symbol.
- `unscopables` matters mostly for legacy compatibility, not new code style.

## Exercise

Complete the array-like object and unscopables helper so the tests expose both legacy integration hooks.
