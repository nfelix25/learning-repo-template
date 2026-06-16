# Lesson 12: Iteration Protocol

## Motivation

Iteration is the most common well-known symbol protocol. It is the rule that lets one object work with `for...of`, spread, destructuring, and other consumers.

## Mechanic

An iterable has a `[Symbol.iterator]()` method. That method returns an iterator. An iterator has a `next()` method that returns `{ value, done }`. Some objects are iterator-iterables, meaning their iterator returns itself from `[Symbol.iterator]()`.

## Worked example

```ts
const range = {
  [Symbol.iterator]() {
    let current = 1;
    return {
      next() {
        return current <= 3 ? { value: current++, done: false } : { value: undefined, done: true };
      }
    };
  }
};
```

## Pitfalls

- Iterable and iterator are related but not identical.
- Reusing the same iterator object can make an iterable one-shot.
- `done` should remain done once iteration is complete.

## Exercise

Complete a reusable range iterable and a collector helper so the tests cover spread, `for...of`, and destructuring.
