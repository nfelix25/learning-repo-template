## Why

You can't edit third-party type declarations, but you can extend them. Module augmentation and declaration merging are how you add a typed `user` property to `Express.Request`, extend `Window` with custom globals, or augment a shared config module — standard practice in real Node/TS projects.

## What Teaches

Interface declaration merging mechanics; module augmentation (`declare module 'express' {}`); global augmentation (`declare global {}`); namespace merging; why intersection types can't be used for module augmentation.

## Prereqs

- `01-mapped-type-anatomy`
- `03-union-algebra`

## Success criterion

The test suite in `lessons/17-declaration-merging-module-augmentation/module-augmentation.test.ts` passes.
