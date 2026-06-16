// ─── k-028: Recursive Type Aliases ───────────────────────────────────────────
//
// Type aliases can reference themselves, enabling types that model unbounded
// nesting — trees, linked lists, JSON, etc.:
//
//   type LinkedList<T> = { value: T; next: LinkedList<T> | null }
//
// TypeScript evaluates recursive types lazily (deferred evaluation). The type
// checker doesn't expand them eagerly, so infinitely recursive types are allowed
// as long as they have a base case in their usage.
//
// Constraint: recursive types cannot directly be used as base types for classes,
// and you cannot directly extend them without a wrapper. But they work fine as
// value types, function parameters, and mapped type targets.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: LinkedList ────────────────────────────────────────────────────────

type LinkedList<T> = { value: T; next: LinkedList<T> | null };

const _numList: LinkedList<number> = {
  value: 1,
  next: { value: 2, next: { value: 3, next: null } },
};
const _strList: LinkedList<string> = { value: "a", next: null };

type _1a = Expect<
  Equal<LinkedList<number>, { value: number; next: LinkedList<number> | null }>
>;

function listToArray<T>(list: LinkedList<T>): T[] {
  const result: T[] = [];
  let current: LinkedList<T> | null = list;
  while (current) {
    result.push(current.value);
    current = current.next;
  }
  return result;
}

describe("linkedList", () => {
  it("converts to array", () => {
    expect(listToArray(_numList)).toEqual([1, 2, 3]);
  });
});

// ── Part 2: TreeNode ──────────────────────────────────────────────────────────

type TreeNode<T> = { value: T; children: TreeNode<T>[] };

const _tree: TreeNode<number> = {
  value: 1,
  children: [
    { value: 2, children: [] },
    { value: 3, children: [{ value: 4, children: [] }] },
  ],
};

type _2a = Expect<
  Equal<TreeNode<string>, { value: string; children: TreeNode<string>[] }>
>;

function treeDepth<T>(node: TreeNode<T>): number {
  if (node.children.length === 0) return 0;
  return 1 + Math.max(...node.children.map(treeDepth));
}

describe("treeDepth", () => {
  it("returns 0 for leaf node", () => {
    expect(treeDepth({ value: 1, children: [] })).toBe(0);
  });
  it("returns depth of nested tree", () => {
    expect(treeDepth(_tree)).toBe(2);
  });
});

// ── Part 3: NestedObject ──────────────────────────────────────────────────────
//
// `NestedObject<V>` is an object where values are either V or another NestedObject<V>.

type NestedObject<V> = { [key: string]: V | NestedObject<V> };

const _nested: NestedObject<string> = {
  a: "hello",
  b: {
    c: "world",
    d: {
      e: "deep",
    },
  },
};

// ── Part 4: Runtime utility for recursive types ───────────────────────────────

function flattenObject(
  obj: NestedObject<string>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[fullKey] = value;
    } else {
      Object.assign(
        result,
        flattenObject(value as NestedObject<string>, fullKey),
      );
    }
  }
  return result;
}

describe("flattenObject", () => {
  it("flattens a nested object to dot-notation keys", () => {
    expect(flattenObject({ a: "x", b: { c: "y" } })).toEqual({
      a: "x",
      "b.c": "y",
    });
  });
});

// ── Part 5: Cyclic-safe deep clone type ──────────────────────────────────────
//
// TypeScript can represent a "deep clone" type — same structure but without
// methods, only data properties. Primitives pass through.

type DeepClone<T> = T extends object ? { [K in keyof T]: DeepClone<T[K]> } : T;

type _5a = Expect<Equal<DeepClone<string>, string>>;
type _5b = Expect<Equal<DeepClone<number>, number>>;
type _5c = Expect<
  Equal<
    DeepClone<{ a: string; b: { c: number } }>,
    { a: string; b: { c: number } }
  >
>;
