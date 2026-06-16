import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";

// Lesson: a signal is a current value plus invalidation.
//
// Inspect: src/signals/signal.ts.
// Invariant: reads pull the current value; writes update it and notify
// dependents only when the value meaningfully changes.
describe("05-signals: signal primitive", () => {
  // Predict: reading a signal is synchronous, like reading a store.
  it("reads the current value synchronously", () => {
    const count = signal(1);

    assert.equal(count(), 1);
  });

  // Predict: after a write, later reads should see the new current value.
  it("writes update later reads", () => {
    const count = signal(1);

    count.set(2);

    assert.equal(count(), 2);
  });

  // Predict: direct subscribers are invalidated when the value changes.
  it("notifies subscribers when invalidated", () => {
    const count = signal(1);
    let invalidations = 0;

    count.subscribe(() => {
      invalidations += 1;
    });
    count.set(2);

    assert.equal(invalidations, 1);
  });

  // Predict: equality suppression prevents no-op writes from cascading through
  // a graph.
  it("suppresses equal writes", () => {
    const count = signal(1);
    let invalidations = 0;

    count.subscribe(() => {
      invalidations += 1;
    });
    count.set(1);

    assert.equal(invalidations, 0);
  });
});
