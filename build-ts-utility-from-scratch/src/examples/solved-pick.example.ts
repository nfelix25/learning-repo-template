import type { Equal, Expect } from "../assertions";

/**
 * A solved success-path example.
 *
 * The koans intentionally fail until solved. This file proves the assertion
 * harness and compiler command work when an implementation is complete.
 */

type SolvedPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};

type User = {
  readonly id: string;
  name: string;
  admin: boolean;
};

type cases = [
  Expect<Equal<SolvedPick<User, "id">, { readonly id: string }>>,
  Expect<Equal<SolvedPick<User, "name" | "admin">, { name: string; admin: boolean }>>
];
