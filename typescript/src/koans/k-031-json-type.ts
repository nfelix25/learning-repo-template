// ─── k-031: The JSON Type ─────────────────────────────────────────────────────
//
// JSON has a specific set of valid value types. Any JavaScript value that is
// serializable to JSON must be one of:
//   - string, number, boolean, null
//   - Array of JSON values
//   - Object with string keys and JSON values
//
// This is the canonical recursive type definition:
//
//   type JSONValue =
//     | string | number | boolean | null
//     | JSONValue[]
//     | { [key: string]: JSONValue }
//
// Getting this right matters because it catches invalid data shapes at
// compile time — functions, undefined, symbols, and circular references
// are all non-serializable and should be rejected.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Define JSONValue ──────────────────────────────────────────────────

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// These should all be assignable to JSONValue:
const _s: JSONValue = "hello";
const _n: JSONValue = 42;
const _b: JSONValue = true;
const _null: JSONValue = null;
const _arr: JSONValue = [1, "two", false, null];
const _obj: JSONValue = { a: "string", b: 42, c: { nested: true } };

// ── Part 2: Type-level tests for JSONValue ────────────────────────────────────

type _2a = Expect<Equal<Extract<JSONValue, null>, null>>;
type _2b = Expect<Equal<Extract<JSONValue, string>, string>>;

// ── Part 3: JSONObject and JSONArray aliases ──────────────────────────────────

type JSONObject = { [key: string]: JSONValue }; // { [key: string]: JSONValue }
type JSONArray = JSONValue[];

type _3a = Expect<Equal<JSONObject, { [key: string]: JSONValue }>>;
type _3b = Expect<Equal<JSONArray, JSONValue[]>>;

// ── Part 4: Serialize<T> — narrow T to its serializable subset ────────────────
//
// `Serialize<T>` produces the JSON-representable subset of T.
// Non-serializable types (functions, undefined, symbol) become `never`.

type Serialize<T> = T extends JSONValue ? T : never;

type _4a = Expect<Equal<Serialize<string>, string>>;
type _4b = Expect<Equal<Serialize<number>, number>>;
type _4c = Expect<Equal<Serialize<() => void>, never>>;
type _4d = Expect<Equal<Serialize<undefined>, never>>;
type _4e = Expect<Equal<Serialize<string | (() => void)>, string>>;

// ── Part 5: Runtime — type-safe JSON parse and stringify ─────────────────────

function safeStringify(value: JSONValue): string {
  return JSON.stringify(value);
}

function safeParse(json: string): JSONValue {
  return JSON.parse(json);
}

describe("JSON utilities", () => {
  it("stringifies a valid JSON value", () => {
    expect(safeStringify({ a: 1, b: "hello" })).toBe('{"a":1,"b":"hello"}');
  });
  it("parses a JSON string back to a value", () => {
    const result = safeParse('{"a":1}');
    expect(result).toEqual({ a: 1 });
  });
  it("handles nested structures", () => {
    const original: JSONValue = { a: [1, 2, 3], b: { c: true } };
    expect(safeParse(safeStringify(original))).toEqual(original);
  });
});

// ── Part 6: IsJSON<T> — check if a type is a valid JSON type ──────────────────

type IsJSON<T> = T extends JSONValue ? true : false;

type _6a = Expect<Equal<IsJSON<string>, true>>;
type _6b = Expect<Equal<IsJSON<number>, true>>;
type _6c = Expect<Equal<IsJSON<JSONObject>, true>>;
type _6d = Expect<Equal<IsJSON<() => void>, false>>;
type _6e = Expect<Equal<IsJSON<undefined>, false>>;
type _6f = Expect<Equal<IsJSON<symbol>, false>>;
