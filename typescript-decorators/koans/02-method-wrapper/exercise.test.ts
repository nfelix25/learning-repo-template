import assert from "node:assert/strict";
import test from "node:test";

import { createTracedCalculator } from "./exercise.js";

test("a method decorator can replace a method with a wrapper", () => {
  const { calculator, events } = createTracedCalculator();

  assert.equal(calculator.double(21), 42);
  assert.deepEqual(events, ["enter:double", "body:21", "exit:double"]);
});
