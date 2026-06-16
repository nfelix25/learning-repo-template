## Why

This repository is intended to become a focused personal learning space for deeply understanding TypeScript decorators through koans: small, executable exercises that reveal behavior by failing first. Starting with an OpenSpec change keeps the curriculum, runnable structure, and implementation tasks coherent before adding code.

## What Changes

- Define a modern-first TypeScript decorators koan curriculum that teaches the current standard decorator model before contrasting legacy experimental decorators.
- Add a repeatable koan structure with exercises, tests, reference solutions, and reflection notes.
- Add a runnable TypeScript test harness so each koan can be explored, fixed, and verified locally.
- Include explicit coverage for runtime behavior, decorator evaluation and application order, class/member decorator kinds, decorator factories, typing patterns, metadata, and legacy ecosystem patterns.
- Establish repository-level documentation that explains how to work through the koans.

## Capabilities

### New Capabilities

- `decorator-koan-curriculum`: Covers the learning path, topic coverage, exercise format, and progression for modern and legacy TypeScript decorator concepts.
- `koan-exercise-runner`: Covers the runnable project structure, commands, tests, and feedback loop used to complete koans.

### Modified Capabilities

- None.

## Impact

- Adds TypeScript project files, package scripts, koan directories, tests, and documentation.
- Introduces development dependencies for compiling and testing TypeScript.
- Does not expose a public API or affect external systems.
