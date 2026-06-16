# Lesson 18: ToStringTag, Branding, and Introspection

## Motivation

`Object.prototype.toString` produces brand strings that are useful for diagnostics. `Symbol.toStringTag` lets objects customize that brand, which is powerful but spoofable.

## Mechanic

`Object.prototype.toString.call(value)` checks `value[Symbol.toStringTag]` when producing strings like `"[object Map]"`. A custom object can set that symbol-keyed property to change the displayed tag.

## Worked example

```ts
const value = { [Symbol.toStringTag]: "Queue" };

Object.prototype.toString.call(value); // "[object Queue]"
```

## Pitfalls

- A custom toStringTag is not proof of type.
- Brand strings are good for debugging and diagnostics, not security.
- Built-in objects and user objects can both expose tags.

## Exercise

Complete the tagging helpers so the tests show ordinary brands, custom brands, and spoofed brands.
