import assert from "node:assert/strict";
import test from "node:test";

import { collectFactoryOrder } from "./exercise.js";

test("decorator factories evaluate top-down and apply bottom-up", () => {
  assert.deepEqual(collectFactoryOrder(), [
    "evaluate:outer",
    "evaluate:inner",
    "apply:inner:run",
    "apply:outer:run",
    "after-call",
  ]);
});
