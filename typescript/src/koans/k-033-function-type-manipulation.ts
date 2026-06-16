// ─── k-033: Function Type Manipulation ───────────────────────────────────────
//
// TypeScript's function-related utility types use `infer` inside `extends`:
//
//   type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
//   type Parameters<T> = T extends (...args: infer P) => any ? P : never
//
// Functions are first-class types, and their shape can be extracted, modified,
// and recombined. This is the basis for typed middleware, decorators, and any
// higher-order function pattern.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: ConstructorParameters and InstanceType ───────────────────────────

type MyConstructorParameters<T extends new (...args: any[]) => any> =
  T extends new (...args: infer Args) => any ? Args : never;
type MyInstanceType<T extends new (...args: any[]) => any> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : never;

class Animal {
  constructor(
    public name: string,
    public legs: number,
  ) {}
  speak(): string {
    return `${this.name} speaks`;
  }
}

type _1a = Expect<
  Equal<MyConstructorParameters<typeof Animal>, [name: string, legs: number]>
>;
type _1b = Expect<Equal<MyInstanceType<typeof Animal>, Animal>>;

// ── Part 2: Promisify — wrap a sync function's return type in Promise ─────────

type Promisify<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => infer R
  ? (...agrs: A) => Promise<R>
  : never;

type _2a = Expect<
  Equal<
    Promisify<(a: string, b: number) => boolean>,
    (a: string, b: number) => Promise<boolean>
  >
>;

type _2b = Expect<Equal<Promisify<() => void>, () => Promise<void>>>;

// ── Part 3: PromisifyAll — wrap all methods of an object in Promise ────────────

type PromisifyAll<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: Promisify<T[K]>;
};

type SyncService = {
  getUser: (id: string) => { name: string };
  saveUser: (user: { name: string }) => void;
  deleteUser: (id: string) => boolean;
};

type _3a = Expect<
  Equal<
    PromisifyAll<SyncService>,
    {
      getUser: (id: string) => Promise<{ name: string }>;
      saveUser: (user: { name: string }) => Promise<void>;
      deleteUser: (id: string) => Promise<boolean>;
    }
  >
>;

// ── Part 4: Memoize type — same signature, caches by args ────────────────────
//
// `MemoizeType<F>` preserves the function signature exactly.
// A memoized function must be callable identically to the original.

type MemoizeType<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R
  : never;

type _4a = Expect<
  Equal<MemoizeType<(x: number) => string>, (x: number) => string>
>;

// ── Part 5: OverloadToUnion — extract each overload as a union of function types
//
// TypeScript only gives you the last overload via Parameters/ReturnType.
// The standard pattern to enumerate all overloads uses a chain of infer:

type OverloadUnion<T> = T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
  (...args: infer A3): infer R3;
}
  ? ((...args: A1) => R1) | ((...args: A2) => R2) | ((...args: A3) => R3)
  : T extends {
        (...args: infer A1): infer R1;
        (...args: infer A2): infer R2;
      }
    ? ((...args: A1) => R1) | ((...args: A2) => R2)
    : T;

interface Overloaded {
  (x: string): string;
  (x: number): number;
}

// Verify your understanding — does OverloadUnion extract both overloads?
type _5a = Expect<
  Equal<
    OverloadUnion<Overloaded>,
    ((x: string) => string) | ((x: number) => number)
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
