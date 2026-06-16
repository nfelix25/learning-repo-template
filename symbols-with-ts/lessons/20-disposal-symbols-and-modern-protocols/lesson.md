# Lesson 20: Disposal Symbols and Modern Protocols

> Verified against MDN `Symbol.dispose`, MDN `Symbol.asyncDispose`, TC39 explicit resource management, and ECMA-262 Symbol Objects sources on 2026-05-24.

## Motivation

Explicit resource management applies the same symbol-protocol pattern to cleanup. A resource opts into cleanup by exposing a method at `Symbol.dispose` or `Symbol.asyncDispose`.

## Mechanic

`Symbol.dispose` names the synchronous cleanup method. `Symbol.asyncDispose` names the asynchronous cleanup method. Syntax such as `using` and `await using` is version-sensitive in runtimes and tooling, but the underlying protocol is still a symbol-keyed method lookup.

## Worked example

```ts
const file = {
  [Symbol.dispose]() {
    closeFile();
  }
};
```

This lesson exercises the protocol without requiring parser support for `using` syntax in the koan tests.

## Pitfalls

- Runtime support, parser support, and TypeScript library declarations can differ.
- Async cleanup must be awaited by the caller or by `await using`.
- Disposal hooks should be idempotent when practical.

## Exercise

Complete the sync and async resource helpers so disposal methods log cleanup through symbol-keyed protocol methods.
