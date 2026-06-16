## Why

String methods delegate to symbol-named protocol hooks, which is why RegExp-like objects can participate without being RegExp instances.

## What Teaches

This lesson teaches Symbol.match, Symbol.matchAll, Symbol.replace, Symbol.search, Symbol.split, String and RegExp protocol delegation.

## Prereqs

`11-well-known-symbols-as-protocols`

## Success criterion

The test suite in `lessons/15-regexp-string-protocol-symbols/symbols.test.ts` passes.
