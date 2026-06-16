# Lesson 21: Symbols with Proxies and Reflect

## Motivation

Meta-object code often breaks symbol-heavy objects by assuming every property key is a string. Proxies receive symbol keys in the same traps that receive string keys.

## Mechanic

Proxy traps such as `get`, `set`, `has`, `ownKeys`, and `getOwnPropertyDescriptor` receive property keys. Those keys can be strings or symbols. `Reflect` APIs forward the same operation without losing the original key.

## Worked example

```ts
const key = Symbol("hook");
const target = { [key]: () => "ok" };
const proxy = new Proxy(target, {
  get(target, property, receiver) {
    return Reflect.get(target, property, receiver);
  }
});

proxy[key](); // "ok"
```

## Pitfalls

- `String(property)` inside a proxy trap can corrupt symbol behavior.
- `ownKeys` must preserve required keys and invariants.
- Transparent wrappers should usually delegate with `Reflect`.

## Exercise

Complete the transparent proxy helpers so symbol-keyed methods survive through proxy forwarding.
