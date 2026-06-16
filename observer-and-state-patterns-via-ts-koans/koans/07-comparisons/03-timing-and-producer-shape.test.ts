import { describe, it, assert } from "../helpers/koan.ts";
import { record } from "../helpers/recording.ts";
import { Observable } from "../../src/observable/observable.ts";
import { coldFromFactory } from "../../src/observable/multicast.ts";
import { ManualScheduler, scheduledValues } from "../../src/observable/scheduler.ts";

// Lesson: producer sharing and delivery timing are separate axes.
//
// Inspect: src/observable/multicast.ts and src/observable/scheduler.ts.
// Invariant: cold/hot describes producer ownership; sync/async describes when
// delivery reaches the subscriber.
describe("07-comparisons: producer shape and timing", () => {
  // Predict: a cold source reruns for each subscriber.
  it("cold producers run per subscription", () => {
    let runs = 0;
    const source = coldFromFactory(() => {
      runs += 1;
      return [runs];
    });
    const first = record<number>();
    const second = record<number>();

    source.subscribe(first.observer);
    source.subscribe(second.observer);

    assert.deepEqual(first.values, [1]);
    assert.deepEqual(second.values, [2]);
  });

  // Predict: eager work has already happened before anyone asks for the value.
  it("eager work happens before demand", () => {
    let runs = 0;
    const eagerValue = (() => {
      runs += 1;
      return 42;
    })();

    assert.equal(runs, 1);
    assert.equal(eagerValue, 42);
  });

  // Predict: lazy work waits for subscription.
  it("lazy observable work waits for subscription", () => {
    let runs = 0;
    const source = new Observable<number>((observer) => {
      runs += 1;
      observer.next(1);
    });

    assert.equal(runs, 0);
    source.subscribe(() => {});
    assert.equal(runs, 1);
  });

  // Predict: sync delivery occurs before caller code after subscribe continues.
  it("synchronous delivery happens in the current call stack", () => {
    const values: string[] = [];

    new Observable<string>((observer) => {
      observer.next("during");
    }).subscribe((value) => values.push(value));
    values.push("after");

    assert.deepEqual(values, ["during", "after"]);
  });

  // Predict: async delivery waits for the scheduler.
  it("asynchronous delivery happens after scheduling", () => {
    const scheduler = new ManualScheduler();
    const events = record<number>();

    scheduledValues([1], scheduler).subscribe(events.observer);
    assert.deepEqual(events.values, []);

    scheduler.flush();
    assert.deepEqual(events.values, [1]);
  });

  // Predict: cancellation before flush prevents scheduled notification.
  it("cancellation timing suppresses scheduled work", () => {
    const scheduler = new ManualScheduler();
    const events = record<number>();

    const subscription = scheduledValues([1], scheduler).subscribe(events.observer);
    subscription.unsubscribe();
    scheduler.flush();

    assert.deepEqual(events.values, []);
  });
});
