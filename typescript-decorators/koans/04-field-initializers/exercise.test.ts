import assert from "node:assert/strict";
import test from "node:test";

import { createTrimmedProfile } from "./exercise.js";

test("a field decorator can transform each initial field value", () => {
  const result = createTrimmedProfile("  Ada  ");

  assert.equal(result.name, "Ada");
  assert.deepEqual(result.events, ["decorate:name", "initialize:name:  Ada  "]);
});
