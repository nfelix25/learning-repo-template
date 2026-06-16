import { describe, it, expect, expectTypeOf } from "vitest";
import { AppSchema } from "../19-query-builder-schema-encoding/schema";
import {
  from,
  type ExecuteResult,
  type InitialState,
  type QueryState,
} from "./builder";

type S = typeof AppSchema;

// ---------------------------------------------------------------------------
// Requirement: select narrows builder state
// ---------------------------------------------------------------------------

const base = from(AppSchema, "users");

// Scenario: select encodes selected columns in the builder's type
const selected = base.select("users.name", "users.email");
type SelectedState = typeof selected extends {
  execute(): Promise<Array<infer R>>;
}
  ? R
  : never;
expectTypeOf<SelectedState>().toEqualTypeOf<{
  "users.name": string;
  "users.email": string;
}>();

// Scenario: select rejects invalid column references
// @ts-expect-error "users.nonexistent" is not a valid column ref
base.select("users.nonexistent");

// Chaining: select after where/limit should still work
const chained = from(AppSchema, "users")
  .where({ column: "users.id", operator: ">", value: 0 })
  .select("users.name");

type ChainedResult = Awaited<ReturnType<typeof chained.execute>>;
expectTypeOf<ChainedResult>().toEqualTypeOf<{ "users.name": string }[]>();

// ---------------------------------------------------------------------------
// Requirement: execute is rejected without select
// ---------------------------------------------------------------------------

// Scenario: calling execute on a fresh builder (no select) is a type error
// @ts-expect-error execute requires prior .select()
from(AppSchema, "users").execute();

// After select it is fine
from(AppSchema, "users").select("users.id").execute(); // no error

// ---------------------------------------------------------------------------
// Runtime: execute returns a promise
// ---------------------------------------------------------------------------

describe("Lesson 23 — Chained Builder", () => {
  it("execute returns a promise", async () => {
    const result = await from(AppSchema, "users")
      .select("users.name")
      .execute();
    expect(Array.isArray(result)).toBe(true);
  });

  it("where, limit, orderBy do not throw", () => {
    const b = from(AppSchema, "users")
      .where({ column: "users.id", operator: ">", value: 0 })
      .limit(10)
      .orderBy("users.name", "ASC");
    expect(b).toBeDefined();
  });
});
