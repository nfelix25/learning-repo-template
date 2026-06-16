import { describe, it, assert } from "../helpers/koan.ts";
import { record, cleanupCounter } from "../helpers/recording.ts";
import { Observable } from "../../src/observable/observable.ts";
import { filter, map, switchMap, take } from "../../src/observable/operators.ts";

// Lesson: operators are observable factories that must preserve lifecycle.
//
// Inspect: src/observable/operators.ts.
// Invariant: transforming values is the easy part. Operators also own source
// subscriptions, terminal notifications, and cancellation of inner work.
describe("02-observable: operators", () => {
  // Predict: map changes each value but should not swallow completion.
  it("maps values while preserving completion", () => {
    const events = record<string>();

    Observable.of(1, 2)
      .pipe(map((value) => `#${value}`))
      .subscribe(events.observer);

    assert.deepEqual(events.values, ["#1", "#2"]);
    assert.equal(events.completed, 1);
  });

  // Predict: filter suppresses rejected values without changing the accepted
  // value identity or the source lifecycle.
  it("filters values by predicate", () => {
    const events = record<number>();

    Observable.of(1, 2, 3, 4)
      .pipe(filter((value) => value % 2 === 0))
      .subscribe(events.observer);

    assert.deepEqual(events.values, [2, 4]);
  });

  // Predict: take has to stop upstream work after it has enough values. This is
  // where synchronous sources expose subscription timing pressure.
  it("take completes and tears down the source after the requested count", () => {
    const events = record<number>();
    const cleanup = cleanupCounter();

    new Observable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      return cleanup.cleanup;
    })
      .pipe(take(2))
      .subscribe(events.observer);

    assert.deepEqual(events.values, [1, 2]);
    assert.equal(events.completed, 1);
    assert.equal(cleanup.count, 1);
  });

  // Predict: switchMap is about ownership of the active inner subscription.
  // The previous inner teardown should run when a newer source value arrives.
  it("switchMap cancels stale inner work", () => {
    const events = record<string>();
    const innerA = cleanupCounter();

    Observable.of("a", "b")
      .pipe(
        switchMap((value) =>
          new Observable<string>((observer) => {
            observer.next(`${value}:start`);
            return value === "a" ? innerA.cleanup : undefined;
          })
        )
      )
      .subscribe(events.observer);

    assert.deepEqual(events.values, ["a:start", "b:start"]);
    assert.equal(innerA.count, 1);
  });
});
