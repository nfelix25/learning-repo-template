# Lesson 04: Symbol-Keyed Properties

## Motivation

The practical reason to create a symbol is usually to use it as a property key. A symbol-keyed property gives an object a public extension point that ordinary string-named properties will not collide with.

## Mechanic

Use computed property syntax to define a symbol-keyed property:

```ts
const hook = Symbol("hook");
const object = {
  [hook]() {
    return "called";
  }
};
```

Descriptors work the same way for symbol keys as they do for string keys. You can use `Object.defineProperty`, `Object.getOwnPropertyDescriptor`, and bracket access with the symbol value.

## Worked example

A library can export a symbol token. Consumers that know the token can implement the symbol-keyed method. Consumers that do not know it avoid accidental collision.

## Pitfalls

- Symbol-keyed properties are still public to reflection.
- The symbol value is the key; the description is only a label.
- If you lose the symbol value, you cannot recreate a local symbol by spelling its description.

## Exercise

Complete the plugin host so it exposes a symbol-keyed extension method with a descriptor you can inspect.
