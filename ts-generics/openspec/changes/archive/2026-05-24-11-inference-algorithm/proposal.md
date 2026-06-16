## Why

When TypeScript inference fails, most developers fix it by trial-and-error — adding `as`, removing annotations, trying different call signatures until something compiles. This lesson replaces that with a mental model of how TypeScript's inference algorithm actually works, so you can diagnose failures systematically.

## What Teaches

How TypeScript's unification-based inference works; contextual typing vs argument inference; inference from return position vs parameter position; systematic diagnosis when inference gives up; `as const` and `satisfies` as tools for shaping inference.

## Prereqs

- [07-infer](../07-infer/proposal.md)
- [10-variance](../10-variance/proposal.md)

## Success criterion

The test suite in `lessons/11-inference-algorithm/inference.test.ts` passes.
