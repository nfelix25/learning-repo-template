## Why

Template literal types bring string manipulation to the type level. They're how you build typed event systems where `"firstNameChanged"` is valid but `"firstnamechanged"` is not, how you generate typed CSS property names, and how you write utilities that operate on string-shaped types without losing the string literal information.

## What Teaches

Template literal type syntax; combining with union types for string enumeration (cross-product behavior); `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` intrinsic string manipulation types; combining template literals with mapped types for event key patterns; inference from template literal patterns using `infer`.

## Prereqs

- [08-mapped-types](../08-mapped-types/proposal.md)

## Success criterion

The test suite in `lessons/09-template-literal-types/template-literals.test.ts` passes.
