import { describe, it, assert } from "../helpers/koan.ts";
import { record } from "../helpers/recording.ts";
import { Observable } from "../../src/observable/observable.ts";
import { Store } from "../../src/state/store.ts";
import { signal } from "../../src/signals/signal.ts";
import { StateMachine } from "../../src/state-machine/machine.ts";
import {
  machineToStore,
  observableToSignal,
  signalToObservable
} from "../../src/comparisons/adapters.ts";

// Lesson: adapters make hidden policy explicit.
//
// Inspect: src/comparisons/adapters.ts and the primitive source files it wraps.
// Invariant: adapting between models requires choices about initial value,
// teardown ownership, emitted changes, and committed state.
describe("07-comparisons: state policy and local interop", () => {
  // Predict: mutation through a shared reference changes current state without a
  // store notification.
  it("mutable references can bypass notification", () => {
    const state = { items: ["one"] };
    const store = new Store(state);
    let notifications = 0;

    store.subscribe(() => {
      notifications += 1;
    });
    state.items.push("two");

    assert.deepEqual(store.get().items, ["one", "two"]);
    assert.equal(notifications, 0);
  });

  // Predict: creating a new object preserves the old snapshot.
  it("immutable snapshots preserve history", () => {
    const before = { items: ["one"] };
    const after = { items: [...before.items, "two"] };

    assert.deepEqual(before.items, ["one"]);
    assert.deepEqual(after.items, ["one", "two"]);
  });

  // Predict: equality policy decides whether downstream work runs.
  it("equality policy controls downstream propagation", () => {
    const count = signal(1);
    let invalidations = 0;

    count.subscribe(() => {
      invalidations += 1;
    });
    count.set(1);

    assert.equal(invalidations, 0);
  });

  // Predict: observable-to-signal needs an initial current value and a policy for
  // storing later events.
  it("adapts an observable into a signal-like current value", () => {
    const current = observableToSignal(Observable.of(1, 2), 0);

    assert.equal(current(), 2);
  });

  // Predict: signal-to-observable can emit the current value, then emit changes.
  it("adapts a signal into an observable-like event source", () => {
    const count = signal(1);
    const events = record<number>();

    signalToObservable(count).subscribe(events.observer);
    count.set(2);

    assert.deepEqual(events.values, [1, 2]);
  });

  // Predict: machine-to-store exposes committed states, not raw events.
  it("adapts a state machine into a store-like current value", () => {
    const machine = new StateMachine<"idle" | "running", "start">("idle", {
      idle: { start: { target: "running" } }
    });
    const store = machineToStore(machine);

    machine.send("start");

    assert.equal(store.get(), "running");
  });
});
