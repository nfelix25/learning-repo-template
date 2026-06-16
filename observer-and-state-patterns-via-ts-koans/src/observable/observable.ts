import { BasicSubscription, type Subscription, type Teardown } from "../subscription.ts";

export interface ObservableObserver<T> {
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
}

export type PartialObserver<T> =
  | ((value: T) => void)
  | Partial<ObservableObserver<T>>;

export type Producer<T> = (observer: ObservableObserver<T>) => Teardown;

function normalizeObserver<T>(observer: PartialObserver<T>): ObservableObserver<T> {
  // Lesson: accepting a function is ergonomic, but internally the runtime wants
  // the complete observer shape so lifecycle guards can be applied uniformly.
  if (typeof observer === "function") {
    return {
      next: observer,
      error(error: unknown) {
        throw error;
      },
      complete() {}
    };
  }

  return {
    next: observer.next ?? (() => {}),
    error: observer.error ?? ((error: unknown) => {
      throw error;
    }),
    complete: observer.complete ?? (() => {})
  };
}

export class Observable<T> {
  private producer: Producer<T>;

  constructor(producer: Producer<T>) {
    this.producer = producer;
  }

  subscribe(observer: PartialObserver<T>): Subscription {
    const normalized = normalizeObserver(observer);

    // Lesson: this call starts the producer. Everything before this line merely
    // described work. The producer is untrusted: it may send values after
    // complete, complete twice, error after complete, or keep work alive after
    // unsubscribe.
    const teardown = this.producer(normalized);

    // TODO: Close the observer after error/complete and make teardown idempotent per lifecycle.
    //
    // Why it fails: normalized forwards every producer call forever. The
    // lifecycle koans expect a guarded observer that records terminal state,
    // suppresses later notifications, and coordinates teardown ownership.
    return new BasicSubscription(teardown);
  }

  pipe<A>(op1: Operator<T, A>): Observable<A>;
  pipe<A, B>(op1: Operator<T, A>, op2: Operator<A, B>): Observable<B>;
  pipe<A, B, C>(op1: Operator<T, A>, op2: Operator<A, B>, op3: Operator<B, C>): Observable<C>;
  pipe(...operators: Array<Operator<unknown, unknown>>): Observable<unknown> {
    return operators.reduce<Observable<unknown>>(
      (source, operator) => operator(source),
      this as Observable<unknown>
    );
  }

  static of<T>(...values: T[]): Observable<T> {
    // Lesson: `of` is a tiny finite producer. It makes terminal behavior easy to
    // see because it sends a known sequence and then completes.
    return new Observable<T>((observer) => {
      for (const value of values) {
        observer.next(value);
      }
      observer.complete();
    });
  }
}

export type Operator<T, U> = (source: Observable<T>) => Observable<U>;
