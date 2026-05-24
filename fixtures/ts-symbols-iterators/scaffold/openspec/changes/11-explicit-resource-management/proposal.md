## Why

Introduces `using` / `await using` and `Symbol.dispose` / `Symbol.asyncDispose` — the language-level resource cleanup primitive required for the async pipeline build piece's cancellation mechanism.

## What Teaches

`Symbol.dispose`, `Symbol.asyncDispose`, `using`, `await using`, `DisposableStack`, LIFO disposal ordering, error suppression.

## Prereqs

02-well-known-symbols

## Success criterion

The test suite in `lessons/11-explicit-resource-management/disposal.test.ts` passes.

> Verified against TC39 proposal (stage 4), TypeScript 5.2, Node.js 20.4 on 2026-05-23.
>
> **Version compatibility**: Requires TypeScript 5.2+ (`--target ES2022` or newer) and Node.js 20.4+. Earlier versions do not support `using` / `await using`.
