## Why

Distribution is what makes `T extends U ? X : Y` map over union members automatically when `T` is a naked type parameter. Misunderstanding it causes some of the most common advanced TypeScript bugs. This lesson explains the design intent and gives you the diagnostic tools to reason through any distribution behavior.

## What Teaches

The naked type parameter rule and why it triggers distribution; distribution as union-to-union transformation; how `Exclude` and `Extract` are nothing but distribution; suppressing distribution with `[T] extends [U]`; common distribution surprises.

## Prereqs

- `05-conditional-type-mechanics`
- `03-union-algebra`

## Success criterion

The test suite in `lessons/07-distributive-conditionals/distributive.test.ts` passes.
