// Lesson 15 — Branded Types
// ─────────────────────────────────────────────────────────────────────────────
// Replace each stub and TODO with the correct branded type definition.
//
// Run `npm run verify` and `npm test` to check.
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Create a string-like type that is distinct from other branded identifiers.
export type UserId = never;

// Goal: Create a second string-like identifier that cannot be mixed up with UserId.
export type ProductId = never;

// Goal: Return the input value while telling TypeScript it carries the UserId brand.
export function asUserId(_value: string): UserId {
  throw new Error('TODO: implement asUserId');
}

// Goal: Return the input value while telling TypeScript it carries the ProductId brand.
export function asProductId(_value: string): ProductId {
  throw new Error('TODO: implement asProductId');
}

// Goal: Use a private symbol brand so Email remains a string at runtime but distinct in types.
declare const _emailBrand: unique symbol;
export type Email = never;

// Goal: Return the input value while telling TypeScript it carries the Email brand.
export function asEmail(_value: string): Email {
  throw new Error('TODO: implement asEmail');
}
