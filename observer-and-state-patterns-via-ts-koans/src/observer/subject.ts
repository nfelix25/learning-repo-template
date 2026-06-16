import { BasicSubscription, type Subscription } from "../subscription.ts";

export type Observer<T> = (value: T) => void;

// Lesson: Subject is the smallest useful notification primitive in the repo.
//
// It owns a set of observers and returns subscriptions that remove observers.
// The early koans pass with this shape. The mutation koans expose the missing
// delivery policy: this implementation iterates live mutable state.
export class Subject<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): Subscription {
    this.observers.add(observer);

    // Pressure point: the subscription closes this observer's future lifetime.
    // It does not say what happens if unsubscribe is called during an emission.
    return new BasicSubscription(() => {
      this.observers.delete(observer);
    });
  }

  next(value: T): void {
    // TODO: Refine this naive iteration so mutation during delivery is deterministic.
    //
    // Why it fails: Set iteration observes additions made during the loop, so a
    // subscriber added mid-emission can receive the current value. The intended
    // invariant is an explicit delivery policy, usually snapshot current
    // observers before notifying them.
    for (const observer of this.observers) {
      observer(value);
    }
  }
}
