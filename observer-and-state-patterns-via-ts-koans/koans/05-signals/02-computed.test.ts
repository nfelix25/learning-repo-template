import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";
import { computed } from "../../src/signals/computed.ts";

// Lesson: computed values are lazy cached derivations.
//
// Inspect: src/signals/computed.ts and src/signals/signal.ts.
// Invariant: a computed should run only on demand, cache while clean, and become
// stale when a dependency changes.
describe("05-signals: computed values", () => {
  // Predict: the derived value comes from reading its source signal.
  it("derives a value from signals", () => {
    const count = signal(2);
    const doubled = computed(() => count() * 2);

    assert.equal(doubled(), 4);
  });

  // Predict: creating a computed describes work but should not run it yet.
  it("is lazy until first read", () => {
    let runs = 0;

    computed(() => {
      runs += 1;
      return runs;
    });

    assert.equal(runs, 0);
  });

  // Predict: repeated clean reads should reuse the cached value.
  it("caches while dependencies are clean", () => {
    const count = signal(2);
    const doubled = computed(() => count() * 2);

    assert.equal(doubled(), 4);
    assert.equal(doubled(), 4);
    assert.equal(doubled.computeCount, 1);
  });

  // Predict: once a dependency changes, the next read must recompute.
  it("invalidates when a dependency changes", () => {
    const count = signal(2);
    const doubled = computed(() => count() * 2);

    assert.equal(doubled(), 4);
    count.set(3);

    assert.equal(doubled(), 6);
    assert.equal(doubled.computeCount, 2);
  });
});
