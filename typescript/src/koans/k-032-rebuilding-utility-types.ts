// ─── k-032: Rebuilding Standard Utility Types ────────────────────────────────
//
// TypeScript's standard library utility types (Partial, Pick, Omit, etc.)
// are implemented using exactly the primitives you've learned in Phases 1–7.
// Building them from scratch cements your understanding of mapped types,
// conditional types, and keyof — and reveals any gaps.
//
// Rules for this koan:
//   - Do NOT use the built-in version of the type you're implementing.
//   - You MAY use other built-in utility types as building blocks
//     (e.g., you can use `Partial` inside `MyOmit` — just don't use `Omit`).
//   - Type assertions compare your implementation to the built-in
//     to verify correctness.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

type Base = { id: string; name: string; age: number; active: boolean };

// ── Pick ──────────────────────────────────────────────────────────────────────

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type _pick_a = Expect<
  Equal<MyPick<Base, "id" | "name">, Pick<Base, "id" | "name">>
>;
type _pick_b = Expect<Equal<MyPick<Base, "age">, Pick<Base, "age">>>;

// ── Omit ──────────────────────────────────────────────────────────────────────

type MyOmit<T, K extends PropertyKey> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

type _omit_a = Expect<
  Equal<MyOmit<Base, "id" | "name">, Omit<Base, "id" | "name">>
>;
type _omit_b = Expect<Equal<MyOmit<Base, "age">, Omit<Base, "age">>>;

// ── Exclude ───────────────────────────────────────────────────────────────────

type MyExclude<T, U> = T extends U ? never : T;

type _excl_a = Expect<
  Equal<MyExclude<"a" | "b" | "c", "a">, Exclude<"a" | "b" | "c", "a">>
>;
type _excl_b = Expect<
  Equal<MyExclude<string | number, string>, Exclude<string | number, string>>
>;

// ── Extract ───────────────────────────────────────────────────────────────────

type MyExtract<T, U> = T extends U ? T : never;

type _extr_a = Expect<
  Equal<
    MyExtract<"a" | "b" | "c", "a" | "c">,
    Extract<"a" | "b" | "c", "a" | "c">
  >
>;
type _extr_b = Expect<
  Equal<MyExtract<string | number, string>, Extract<string | number, string>>
>;

// ── NonNullable ───────────────────────────────────────────────────────────────

type MyNonNullable<T> = T extends null | undefined ? never : T;

type _nn_a = Expect<
  Equal<
    MyNonNullable<string | null | undefined>,
    NonNullable<string | null | undefined>
  >
>;
type _nn_b = Expect<Equal<MyNonNullable<boolean>, NonNullable<boolean>>>;

// ── Required ──────────────────────────────────────────────────────────────────

type MyRequired<T> = { [K in keyof T]-?: T[K] };

type _req_a = Expect<
  Equal<
    MyRequired<{ a?: string; b?: number }>,
    Required<{ a?: string; b?: number }>
  >
>;

// ── Readonly ──────────────────────────────────────────────────────────────────

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

type _ro_a = Expect<
  Equal<
    MyReadonly<{ a: string; b: number }>,
    Readonly<{ a: string; b: number }>
  >
>;

// ── ReturnType ────────────────────────────────────────────────────────────────

type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

type _rt_a = Expect<
  Equal<MyReturnType<() => string>, ReturnType<() => string>>
>;
type _rt_b = Expect<
  Equal<
    MyReturnType<(x: number) => boolean>,
    ReturnType<(x: number) => boolean>
  >
>;

// ── Parameters ────────────────────────────────────────────────────────────────

type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer Args
) => any
  ? Args
  : never;

type _pa_a = Expect<
  Equal<
    MyParameters<(a: string, b: number) => void>,
    Parameters<(a: string, b: number) => void>
  >
>;

// ── Record ────────────────────────────────────────────────────────────────────

type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };

type _rec_a = Expect<
  Equal<MyRecord<"a" | "b", number>, Record<"a" | "b", number>>
>;

// ── Awaited ───────────────────────────────────────────────────────────────────
// (Simplified: one level of unwrapping, not the full recursive built-in)

type MyAwaited<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type _aw_a = Expect<Equal<MyAwaited<Promise<string>>, string>>;
type _aw_b = Expect<Equal<MyAwaited<Promise<number[]>>, number[]>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
