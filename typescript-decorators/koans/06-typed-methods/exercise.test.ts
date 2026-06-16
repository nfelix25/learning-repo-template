import assert from "node:assert/strict";
import test from "node:test";

import { createAccount } from "./exercise.js";

test("a typed decorator preserves the method's number return contract", () => {
  const account = createAccount();

  assert.equal(account.remainingAfterWithdrawal(4), 6);
  assert.throws(
    () => account.remainingAfterWithdrawal(11),
    /remainingAfterWithdrawal returned a negative value/
  );
});
