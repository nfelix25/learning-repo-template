// ─── k-036: Phantom Types ────────────────────────────────────────────────────
//
// A phantom type is a type parameter that appears in the type signature but
// NOT in the runtime representation. It carries no data — it only encodes
// state or capability information at the type level:
//
//   type Connection<State> = { socket: WebSocket }   // State is phantom
//
// The value of type `Connection<Open>` and `Connection<Closed>` are identical
// at runtime — both are `{ socket: WebSocket }`. But TypeScript tracks which
// state they're in, preventing you from calling `send()` on a closed connection.
//
// Phantom types are the type-safe way to model state machines, lifecycle stages,
// builder stages, and access control — with zero runtime overhead.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Connection state machine ─────────────────────────────────────────
//
// Define `Open` and `Closed` as phantom types (empty interfaces, type literals, etc.)
// `Connection<State>` holds a `url` string. The State phantom type encodes lifecycle.
// `connect` returns `Connection<Open>`, `disconnect` returns `Connection<Closed>`.
// `send` is only callable on `Connection<Open>`.

declare const _phantom: unique symbol;
type PhantomTag<T> = { readonly [_phantom]: T };

type Open = PhantomTag<"Open">;
type Closed = PhantomTag<"Closed">;

type Connection<State> = { url: string } & State;

function connect(url: string): Connection<Open> {
  return { url } as Connection<Open>;
}

function disconnect(conn: Connection<Open>): Connection<Closed> {
  return conn as unknown as Connection<Closed>;
}

function send(conn: Connection<Open>, data: string): void {
  // runtime: just log
  // console.log(`Sending "${data}" to ${conn.url}`);
}

// Type assertions — the state is tracked:
const _open = connect("ws://localhost");
type _1a = Expect<Equal<typeof _open, Connection<Open>>>;

const _closed = disconnect(_open);
type _1b = Expect<Equal<typeof _closed, Connection<Closed>>>;

// This should NOT compile — uncomment to verify:
// send(_closed, "hello")  // error: Connection<Closed> is not Connection<Open>

describe("connection state machine", () => {
  it("connect returns an Open connection", () => {
    const conn = connect("ws://example.com");
    expect(conn.url).toBe("ws://example.com");
  });
  it("disconnect returns a Closed connection", () => {
    const open = connect("ws://example.com");
    const closed = disconnect(open);
    expect(closed.url).toBe("ws://example.com");
  });
});

// ── Part 2: Form field validation state ──────────────────────────────────────
//
// `Field<State>` represents a form field in `Unvalidated` or `Validated` state.
// A form can only be submitted when ALL fields are `Validated`.

type Unvalidated = PhantomTag<"Unvalidated">;
type Validated = PhantomTag<"Validated">;

type Field<State> = { value: string } & State;

function field(value: string): Field<Unvalidated> {
  return { value } as Field<Unvalidated>;
}

function validate(
  f: Field<Unvalidated>,
  predicate: (v: string) => boolean,
): Field<Validated> | null {
  return predicate(f.value) ? (f as unknown as Field<Validated>) : null;
}

function submitForm(fields: Field<Validated>[]): string {
  return fields.map((f) => f.value).join(", ");
}

describe("field validation", () => {
  it("validate returns Validated field for passing predicate", () => {
    const f = field("hello");
    const result = validate(f, (v) => v.length > 0);
    expect(result).not.toBeNull();
    expect(result?.value).toBe("hello");
  });
  it("validate returns null for failing predicate", () => {
    const f = field("");
    expect(validate(f, (v) => v.length > 0)).toBeNull();
  });
  it("submitForm joins validated fields", () => {
    const f1 = validate(field("Alice"), (v) => v.length > 0)!;
    const f2 = validate(field("alice@example.com"), (v) => v.includes("@"))!;
    expect(submitForm([f1, f2])).toBe("Alice, alice@example.com");
  });
});
