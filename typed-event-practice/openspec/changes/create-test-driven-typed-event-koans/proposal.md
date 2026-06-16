## Why

This repository is intended to be a focused personal learning lab for advanced TypeScript event patterns, not a beginner TypeScript tutorial or production event library. A test-driven koans structure will make the TypeScript compiler feedback part of the learning loop while still exercising the runtime behavior of event emitters and related communication APIs.

## What Changes

- Add a small TypeScript koans repo structure centered on typed event maps, typed emitters, listener lifecycle semantics, inference, variance, async delivery, and platform interop.
- Use runtime tests for event behavior and compile-time assertions for TypeScript guarantees.
- Add short notes beside the koans to explain the learning objective and design tradeoffs without becoming a long-form tutorial.
- Establish tooling for running the koans and type checks locally.

## Capabilities

### New Capabilities

- `typed-event-koans`: Defines the test-driven learning workflow, curriculum shape, and expected coverage for typed TypeScript event patterns.

### Modified Capabilities

None.

## Impact

- Adds TypeScript project scaffolding, test tooling, koan test files, source exercises, and companion notes.
- Introduces development dependencies for TypeScript execution, runtime tests, and compile-time validation.
- Does not introduce a published package API or framework-specific application code.
