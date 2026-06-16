# Typed Event Practice

Test-driven TypeScript koans for typed event maps, typed emitters, listener lifecycle behavior, inference, variance, scheduling, and platform interop.

This is a personal learning lab, not a production event library. The source files are intentionally small so the interesting work stays visible in the koans.

## Setup

```bash
npm install
```

## Commands

```bash
npm run typecheck
npm test
npm run verify
```

- `npm run typecheck` validates the compile-time koans. The initial state is expected to pass.
- `npm test` runs the runtime koans. The initial state is expected to report 16 tests: 8 passing and 8 failing on `todo<T>()` prompts.
- `npm run verify` runs type checking first, then runtime koans. It exits non-zero until the runtime TODOs are completed.

## How To Work Through The Koans

Start with `koans/01-event-map-shapes.test.ts` and move in order. Replace calls to `todo<T>("...")` with concrete values or expressions that make the test pass.

Keep the `@ts-expect-error` assertions. They are part of the exercise: if a future edit weakens the types, TypeScript will complain that an expected error no longer exists.

## Project Shape

```text
src/
  event-map.ts       Type-level event map helpers
  emitter.ts         Small typed emitter implementation
  scheduling.ts      Sync, microtask, and macrotask delivery helpers
  adapters.ts        DOM EventTarget and Node-style adapter sketches
  koan.ts            Runtime TODO and type assertion helpers

koans/
  01-...08-...       Test-driven exercises

notes/
  01-...08-...       Short companion notes
```

The point is to study the relationship between the type plane and runtime plane:

```text
event name type  ->  payload type
runtime listener ->  storage, cleanup, ordering
platform API     ->  EventTarget, Node-style tuples, scheduling
```
