## Why

This repo is intended to be a personal, professional-grade learning workbook for building and understanding TypeScript utility types by hand. The current repo has no runnable structure, koan progression, or type-level assertion harness to support test-driven learning.

## What Changes

- Add a TypeScript-only koan workspace that uses compiler-checked type assertions such as `Expect<Equal<...>>`.
- Add a curated progression of koan files covering foundational type-system mechanisms, built-in utility types, and professional edge cases.
- Include explanatory comments beside exercises so the files teach the mental model, not just the final implementation.
- Configure scripts so learning progress is validated with `tsc --noEmit`.
- Keep the project focused on one user: an experienced TypeScript developer deepening professional type-level fluency.

## Capabilities

### New Capabilities

- `type-utility-koans`: Defines the test-driven TypeScript utility-type koan workbook, including structure, assertions, learning material, and validation behavior.

### Modified Capabilities

- None.

## Impact

- Adds TypeScript project configuration and package scripts.
- Adds source files for type assertions and koan exercises.
- Adds documentation-oriented comments inside koan files.
- Does not introduce runtime application behavior, production APIs, or browser/UI concerns.
