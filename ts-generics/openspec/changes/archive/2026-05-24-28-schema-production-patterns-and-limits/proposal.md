## Why

A real-world schema library needs more than parsing — it needs refinements (custom validation), transforms (type-changing post-processing), and the ability to handle the places where TypeScript's inference gives up. This capstone lesson adds these features and then uses `--diagnostics` to understand where type-checking time is going, completing the "what you'll hit on the job" arc of the schema build piece.

## What Teaches

Refinements and transforms with type narrowing; when TypeScript's inference gives up and why; workarounds — intermediate aliases, explicit annotations, `satisfies`; real-world lessons from Zod v4 source and changelog; profiling type-checking performance with `--diagnostics`.

## Prereqs

- [27-schema-union-and-intersection](../27-schema-union-and-intersection/proposal.md)
- [17-overloads-vs-generics](../17-overloads-vs-generics/proposal.md)
- [12-satisfies-operator](../12-satisfies-operator/proposal.md)

## Success criterion

The test suite in `lessons/28-schema-production-patterns-and-limits/schema.test.ts` passes (new tests added, all prior schema tests remain live).
