import { BasicSubscription, type Subscription } from "../subscription.ts";

export type SignalSubscriber = () => void;

export interface Signal<T> {
  (): T;
  set(value: T): void;
  subscribe(subscriber: SignalSubscriber): Subscription;
}

// Lesson: a signal is a current-value read plus invalidation on write.
//
// The function call pulls the current value. `set` pushes invalidation to direct
// subscribers and, later, tracked dependents.
export function signal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<SignalSubscriber>();

  const read = (() => {
    // TODO: Register reads with the active reactive tracking context.
    //
    // Why it fails: computed values and effects cannot know this signal was read,
    // so dependency invalidation never reaches them.
    return value;
  }) as Signal<T>;

  read.set = (nextValue: T) => {
    value = nextValue;
    // TODO: Add equality checks and batched invalidation.
    //
    // Why it fails: equal writes still notify, and each write flushes
    // immediately. Later graph koans need equality suppression and batching.
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  read.subscribe = (subscriber: SignalSubscriber) => {
    // Lesson: this direct subscription is the low-level invalidation hook. The
    // full graph runtime will use the same idea for computed values and effects.
    subscribers.add(subscriber);

    return new BasicSubscription(() => {
      subscribers.delete(subscriber);
    });
  };

  return read;
}
