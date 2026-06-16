## Why

Intersection branding works, but it leaks the brand property into autocomplete and documentation. Declaration merging offers an alternative: augmenting interfaces in module scope to produce nominal types that look clean in tooling and are harder to accidentally satisfy.

## What Teaches

Declaration merging overview; interface merging for nominal type augmentation; module-augmented nominal brands in team codebases; comparison to intersection branding; when declaration merging is the right tool vs overkill.

## Prereqs

- [15-branded-types](../15-branded-types/proposal.md)

## Success criterion

The test suite in `lessons/16-nominal-types-declaration-merging/nominal.test.ts` passes.
