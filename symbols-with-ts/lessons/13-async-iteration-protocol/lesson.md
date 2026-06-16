# Lesson 13: Async Iteration Protocol

## Motivation

Async iteration carries the same protocol idea into values that arrive over time. Instead of a `next()` result, the iterator returns a promise for a result.

## Mechanic

An async iterable has a `[Symbol.asyncIterator]()` method. It returns an async iterator whose `next()` method resolves to `{ value, done }`. `for await...of` consumes that protocol.

## Worked example

```ts
const asyncValues = {
  async *[Symbol.asyncIterator]() {
    yield 1;
    yield 2;
  }
};
```

The method name is still a symbol key. The difference is the asynchronous result boundary.

## Pitfalls

- The async iterator object is not itself a promise.
- Each `next()` result is awaited.
- Sync iterables and async iterables are related ideas but distinct protocols.

## Exercise

Complete the async range and collector helpers so `for await...of` consumes delayed values in order.
