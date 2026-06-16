import assert from "node:assert/strict";
import test from "node:test";

import { observeModernDecorator } from "./exercise.js";

test("a modern method decorator runs before the class is ready", () => {
  assert.deepEqual(observeModernDecorator(), [
    "decorate:method:greet:function",
    "class-ready",
    "instance-ready",
    "method-body",
  ]);
});
