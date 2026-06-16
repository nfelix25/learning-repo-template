// Lesson 16 — Nominal Types and Declaration Merging
// ─────────────────────────────────────────────────────────────────────────────
// Declaration merging creates nominal types that look clean in IDE tooltips.
// Fill in the TODOs.
//
// Run `npm run verify` and `npm test` to check.
// ─────────────────────────────────────────────────────────────────────────────

// Technique 1: interface-based nominal type via declaration merging
// The interface `OrderId` merges with the type alias.
// Goal: Explore how an interface can carry hidden brand information for a string-like type.
// This results in an OrderId type where the brand shows as interface members in tooling

// For this exercise, use the simpler approach: branded interfaces

// Goal: Define SessionId so plain strings cannot satisfy it by accident.
declare const _sessionSymbol: unique symbol;
export interface SessionId {
  // Goal: Add a hidden marker field tied to the private symbol above.
}
// For now the interface is empty — tests will fail until learner adds the brand

// Goal: Return the input value while telling TypeScript it carries the SessionId brand.
export function asSessionId(_value: string): string & SessionId {
  throw new Error('TODO: implement asSessionId');
}

// A comparison: using a namespace to group nominal types
export namespace Nominal {
  // Goal: Define a string-like customer identifier that is distinct from other identifiers.
  export type CustomerId = string & { readonly _customerBrand: 'CustomerId' };
  export function asCustomerId(_value: string): CustomerId {
    throw new Error('TODO: implement Nominal.asCustomerId');
  }
}
