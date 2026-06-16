// ─── k-020: Template Literal Types — Basics ──────────────────────────────────
//
// Template literal types construct string literal types from parts:
//
//   type Greeting = `Hello, ${string}!`   // matches "Hello, Alice!", "Hello, World!", etc.
//   type EventName = `on${string}`        // matches "onClick", "onFocus", etc.
//
// When the interpolated type is a string literal *union*, the template literal
// distributes over it, producing all combinations:
//
//   type Dir = "North" | "South" | "East" | "West"
//   type Move = `move${Dir}`   // "moveNorth" | "moveSouth" | "moveEast" | "moveWest"
//
// Two unions in one template produce the Cartesian product:
//
//   type A = "a" | "b"
//   type B = "1" | "2"
//   type AB = `${A}${B}`  // "a1" | "a2" | "b1" | "b2"
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Single union distribution ────────────────────────────────────────

type EventName<T extends string> = `on${Capitalize<T>}`;

type _1a = Expect<Equal<EventName<"click" | "focus">, "onClick" | "onFocus">>;
type _1b = Expect<Equal<EventName<"mousedown">, "onMousedown">>;

// ── Part 2: Cartesian product of two unions ───────────────────────────────────

type Axis = "x" | "y" | "z";
type Sign = "Positive" | "Negative";
type SignedAxis = `${Axis}${Sign}`; // e.g. "xPositive" | "xNegative" | "yPositive" | ...

type _2a = Expect<
  Equal<
    SignedAxis,
    | "xPositive"
    | "xNegative"
    | "yPositive"
    | "yNegative"
    | "zPositive"
    | "zNegative"
  >
>;

// ── Part 3: CSSProperty — multi-part property names ──────────────────────────
//
// Build a type for margin/padding shorthand properties.

type Spacing = "margin" | "padding";
type Side = "Top" | "Right" | "Bottom" | "Left";
type SpacingProperty = `${Spacing}${Side}`; // marginTop | marginRight | ... | paddingBottom | paddingLeft

type _3a = Expect<
  Equal<
    SpacingProperty,
    | "marginTop"
    | "marginRight"
    | "marginBottom"
    | "marginLeft"
    | "paddingTop"
    | "paddingRight"
    | "paddingBottom"
    | "paddingLeft"
  >
>;

// ── Part 4: Template literal matches broader patterns ─────────────────────────
//
// Template literal types can match patterns, not just exact strings.
// A function `parseRoute` takes a string and returns a route object.
// The return type should narrow based on the pattern.

type Route<Path extends string> = { method: "GET" | "POST"; path: Path };

// `buildRoute` infers Path from a template literal pattern.
// No implementation needed — just make the type-level assertions pass.
function buildRoute<P extends string>(path: `${P}`): Route<P> {
  return { method: "GET", path } as Route<P>;
}

const _r1 = buildRoute("/users");
const _r2 = buildRoute("/posts/123");
type _4a = Expect<Equal<typeof _r1, Route<"/users">>>;
type _4b = Expect<Equal<typeof _r2, Route<"/posts/123">>>;

// ── Part 5: Access path type ─────────────────────────────────────────────────
//
// `PropPath<T>` builds all single-level "obj.key" access paths from T.
// (Deeper recursion happens in k-030.)

type PropPath<T> = `${keyof T & string}`;

type _5a = Expect<
  Equal<PropPath<{ user: { name: string }; count: number }>, "user" | "count">
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
