import assert from "node:assert/strict";
import test from "node:test";

import { inspectLegacyMethodDecorator } from "./exercise.js";

test("a legacy method decorator receives target, property key, and descriptor", () => {
  const result = inspectLegacyMethodDecorator();

  assert.equal(result.result, "hello");
  assert.deepEqual(result.events, [
    "target:LegacyGreeter",
    "property:greet",
    "descriptor-value:function",
    "class-ready",
    "before:greet",
    "body:greet",
    "after:greet",
  ]);
});
