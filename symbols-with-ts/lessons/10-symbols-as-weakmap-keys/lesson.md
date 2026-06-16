# Lesson 10: Symbols as WeakMap Keys

> Verified against MDN WeakMap, TC39 Symbols as WeakMap keys, and ECMA-262 CanBeHeldWeakly sources on 2026-05-24.

## Motivation

WeakMap keys are weakly held, so they must be values the runtime can collect. Modern JavaScript permits objects and non-registered symbols as weak keys. Registered symbols are excluded because the global registry keeps them reachable.

## Mechanic

The relevant spec predicate is `CanBeHeldWeakly`. Objects satisfy it. Non-registered symbols satisfy it. Registered symbols from `Symbol.for` do not. That distinction lets a local symbol act as a metadata token without forcing the metadata table to keep the key alive forever.

## Worked example

```ts
const key = Symbol("metadata");
const metadata = new WeakMap();

metadata.set(key, "local symbol metadata");
metadata.get(key); // "local symbol metadata"
```

Using `Symbol.for("metadata")` as the key should be rejected in runtimes that implement this feature because registered symbols are globally retained.

## Pitfalls

- TypeScript library declarations can lag or depend on the selected `lib`, so you may need a local interface while targeting older libs.
- A registered symbol is not weakly held.
- Do not use WeakMap when you need to enumerate keys.

## Exercise

Complete the feature check, key classifier, and metadata table helpers. Keep the registered-symbol case separate from local symbol identity.
