// Lesson 13 — Recursive Types
// ─────────────────────────────────────────────────────────────────────────────
// Replace each stub with the correct recursive type.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Describe all values that can safely appear in JSON, including nested arrays and objects.
export type Json = never;

// Goal: Recursively make object properties optional while leaving primitive values unchanged.
export type DeepPartial<_T> = never;

// Goal: Recursively prevent reassignment of object properties while leaving primitive values unchanged.
export type DeepReadonly<_T> = never;

// Goal: Keep unwrapping array element types until a non-array type remains.
export type FlattenArray<_T> = never;
