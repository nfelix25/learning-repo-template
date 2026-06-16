## Why

Meta-object code often breaks symbols by assuming every property key is a string.

## What Teaches

This lesson teaches proxy traps receiving symbol keys, Reflect APIs, preserving symbol behavior in meta-objects, common proxy bugs.

## Prereqs

`05-enumeration-reflection-and-visibility`, `11-well-known-symbols-as-protocols`

## Success criterion

The test suite in `lessons/21-symbols-with-proxies-and-reflect/symbols.test.ts` passes.
