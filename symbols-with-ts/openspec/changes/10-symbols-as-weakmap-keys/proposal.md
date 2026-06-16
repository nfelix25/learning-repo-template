## Why

WeakMap keys used to mean objects. Modern JavaScript also permits non-registered symbols because they can be collected.

## What Teaches

This lesson teaches symbols as WeakMap keys, registered symbol restrictions, garbage-collection relevance, object identity vs symbol identity, metadata table patterns.

## Prereqs

`07-global-symbol-registry-and-realms`, `08-symbols-as-api-tokens`

## Success criterion

The test suite in `lessons/10-symbols-as-weakmap-keys/symbols.test.ts` passes.
