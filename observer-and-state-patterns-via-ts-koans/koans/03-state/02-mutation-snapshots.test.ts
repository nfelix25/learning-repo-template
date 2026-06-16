import { describe, it, assert } from "../helpers/koan.ts";
import { Store } from "../../src/state/store.ts";

// Lesson: current-value state needs a policy for identity and change.
//
// Inspect: src/state/store.ts.
// Invariant: mutation can bypass notification, immutable snapshots preserve
// history, and equality policy controls whether downstream work runs.
describe("03-state: mutation and snapshots", () => {
  // Predict: because the store holds the same object reference, outside mutation
  // changes the current value without notifying subscribers.
  it("shows how a mutable reference can bypass notification", () => {
    const state = { todos: ["learn observers"] };
    const store = new Store(state);
    let notifications = 0;

    store.subscribe(() => {
      notifications += 1;
    });
    state.todos.push("learn signals");

    assert.deepEqual(store.get().todos, ["learn observers", "learn signals"]);
    assert.equal(notifications, 0);
  });

  // Predict: immutable updates create a new snapshot and leave the old one alone.
  it("keeps previous immutable snapshots unchanged", () => {
    const first = { count: 0 };
    const second = { ...first, count: 1 };

    assert.deepEqual(first, { count: 0 });
    assert.deepEqual(second, { count: 1 });
  });

  // Predict: setting the same value should be suppressible, otherwise derived
  // work and subscribers run without meaningful change.
  it("can suppress equal updates", () => {
    const store = new Store(1);
    let notifications = 0;

    store.subscribe(() => {
      notifications += 1;
    });
    store.set(1);

    assert.equal(notifications, 0);
  });
});
