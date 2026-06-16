import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";
import { effect } from "../../src/signals/effect.ts";

// Lesson: effects are terminal reactive work.
//
// Inspect: src/signals/effect.ts and src/signals/signal.ts.
// Invariant: effects track the signals they read, rerun when those dependencies
// change, and clean up before rerun or disposal.
describe("05-signals: effects", () => {
  // Predict: effect creation runs the effect once so dependencies can be found.
  it("runs initially and tracks reads", () => {
    const count = signal(1);
    const observed: number[] = [];

    effect(() => {
      observed.push(count());
    });

    assert.deepEqual(observed, [1]);
  });

  // Predict: changing a tracked signal reruns the effect with the new value.
  it("reruns when a dependency changes", () => {
    const count = signal(1);
    const observed: number[] = [];

    effect(() => {
      observed.push(count());
    });
    count.set(2);

    assert.deepEqual(observed, [1, 2]);
  });

  // Predict: changing an untracked signal should not rerun this effect.
  it("ignores unrelated signal changes", () => {
    const count = signal(1);
    const name = signal("Ada");
    let runs = 0;

    effect(() => {
      runs += 1;
      count();
    });
    name.set("Grace");

    assert.equal(runs, 1);
  });

  // Predict: cleanup from the previous run happens before the next run starts.
  it("runs cleanup before rerun", () => {
    const count = signal(1);
    const events: string[] = [];

    effect(() => {
      events.push(`run:${count()}`);
      return () => events.push(`cleanup:${count()}`);
    });
    count.set(2);

    assert.deepEqual(events, ["run:1", "cleanup:2", "run:2"]);
  });

  // Predict: disposal performs final cleanup and removes future dependency work.
  it("dispose runs cleanup and stops future work", () => {
    const count = signal(1);
    const events: string[] = [];

    const subscription = effect(() => {
      events.push(`run:${count()}`);
      return () => events.push("cleanup");
    });

    subscription.unsubscribe();
    count.set(2);

    assert.deepEqual(events, ["run:1", "cleanup"]);
  });
});
