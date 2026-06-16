import assert from "node:assert/strict";
import test from "node:test";

import { createTaggedReport } from "./exercise.js";

test("a class decorator can replace the constructor with a subclass", () => {
  const result = createTaggedReport();

  assert.equal(result.tag, "Report");
  assert.equal(result.summary, "Report:Decorators");
  assert.deepEqual(result.events, ["decorate:Report", "construct:Decorators"]);
});
