import { describe, it, assert } from "../helpers/koan.ts";
import { record } from "../helpers/recording.ts";
import { Subject } from "../../src/observer/subject.ts";
import { Observable } from "../../src/observable/observable.ts";
import { coldFromFactory, ReplaySubject, share } from "../../src/observable/multicast.ts";

// Lesson: producer shape and history storage are separate concerns.
//
// Inspect: src/observable/multicast.ts and src/observer/subject.ts.
// Invariant: cold means per-subscriber producer, hot means shared producer, and
// replay means explicit buffering for late subscribers.
describe("02-observable: hot, cold, multicast, and replay", () => {
  // Predict: each cold subscription gets a fresh producer run.
  it("cold observables run their producer once per subscriber", () => {
    let factoryRuns = 0;
    const source = coldFromFactory(() => {
      factoryRuns += 1;
      return [factoryRuns];
    });
    const first = record<number>();
    const second = record<number>();

    source.subscribe(first.observer);
    source.subscribe(second.observer);

    assert.deepEqual(first.values, [1]);
    assert.deepEqual(second.values, [2]);
  });

  // Predict: a hot subject does not create new work per subscriber; active
  // subscribers observe the same emission.
  it("hot subjects share emissions from one producer", () => {
    const subject = new Subject<number>();
    const first: number[] = [];
    const second: number[] = [];

    subject.subscribe((value) => first.push(value));
    subject.subscribe((value) => second.push(value));
    subject.next(1);

    assert.deepEqual(first, [1]);
    assert.deepEqual(second, [1]);
  });

  // Predict: without replay storage, history is gone for late subscribers.
  it("late subscribers miss non-replayed hot values", () => {
    const subject = new Subject<number>();
    const values: number[] = [];

    subject.next(1);
    subject.subscribe((value) => values.push(value));
    subject.next(2);

    assert.deepEqual(values, [2]);
  });

  // Predict: share must connect once and multicast to active subscribers. This
  // koan exposes the difference between subscribing late and sharing live work.
  it("share multicasts one cold producer to active subscribers", () => {
    let producerRuns = 0;
    const first = record<number>();
    const second = record<number>();

    const source = new Observable<number>((observer) => {
      producerRuns += 1;
      observer.next(1);
      observer.next(2);
    }).pipe(share());

    source.subscribe(first.observer);
    source.subscribe(second.observer);

    assert.equal(producerRuns, 1);
    assert.deepEqual(first.values, [1, 2]);
    assert.deepEqual(second.values, [1, 2]);
  });

  // Predict: replay is a storage policy. Late subscribers should first receive
  // the configured buffer, then live values.
  it("replay sends buffered values to late subscribers", () => {
    const subject = new ReplaySubject<number>(2);
    const values: number[] = [];

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.subscribe((value) => values.push(value));
    subject.next(4);

    assert.deepEqual(values, [2, 3, 4]);
  });
});
