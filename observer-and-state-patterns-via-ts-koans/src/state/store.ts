import { BasicSubscription, type Subscription } from "../subscription.ts";

export type StoreListener<T> = (state: T) => void;

// Lesson: Store is a current-value primitive.
//
// Unlike an event stream, a store can answer "what is true now?" synchronously.
// Its write path also owns notification policy.
export class Store<T> {
  private state: T;
  private listeners = new Set<StoreListener<T>>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  get(): T {
    // Pressure point: this returns the current value by reference. For objects,
    // that means callers can observe or perform mutation outside the store.
    return this.state;
  }

  set(nextState: T): void {
    this.state = nextState;
    // TODO: Add equality policy support to suppress redundant notifications.
    //
    // Why it fails: every write notifies, even if the new value is equal to the
    // old one. Later koans use this to expose unnecessary downstream work.
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe(listener: StoreListener<T>): Subscription {
    // Lesson: store subscribers observe future writes. They do not receive an
    // automatic initial value in this starter, so reads and subscriptions remain
    // separate operations.
    this.listeners.add(listener);

    return new BasicSubscription(() => {
      this.listeners.delete(listener);
    });
  }
}
